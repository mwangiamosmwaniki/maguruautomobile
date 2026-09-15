import { Hono } from "hono";
import { cors } from "hono/cors";
import { getCookie, setCookie, deleteCookie } from "hono/cookie";
import { sign, verify } from "hono/jwt";

const app = new Hono();
const SESSION_COOKIE = "maguru_session";
const SESSION_TTL = 60 * 60 * 8;

app.use("/api/*", async (c, next) => {
  const origin = c.env.APP_ORIGIN || "http://localhost:5173";
  return cors({ origin, credentials: true })(c, next);
});

const now = () => new Date().toISOString();
const id = () => crypto.randomUUID();

function jsonError(c, message, status = 400) {
  return c.json({ error: message }, status);
}

function mapCar(row) {
  return {
    id: row.id,
    title: row.title,
    make: row.make,
    model: row.model,
    year: row.year,
    mileage: row.mileage,
    price: row.price,
    transmission: row.transmission,
    fuel_type: row.fuel_type,
    body_type: row.body_type,
    color: row.color,
    engine_cc: row.engine_cc,
    condition: row.condition,
    status: row.status,
    description: row.description,
    images: JSON.parse(row.images_json || "[]"),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapUser(row) {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

async function hashPassword(password, salt = crypto.randomUUID()) {
  const data = new TextEncoder().encode(`${salt}:${password}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  const hash = [...new Uint8Array(digest)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
  return `${salt}:${hash}`;
}

async function verifyPassword(password, stored) {
  const [salt, expected] = (stored || "").split(":");
  if (!salt || !expected) return false;
  const actual = (await hashPassword(password, salt)).split(":")[1];
  return actual === expected;
}

async function createSession(c, user) {
  const secret = c.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not configured");
  const token = await sign(
    { sub: user.id, email: user.email, role: user.role, exp: Math.floor(Date.now() / 1000) + SESSION_TTL },
    secret,
  );
  setCookie(c, SESSION_COOKIE, token, {
    httpOnly: true,
    secure: c.req.url.startsWith("https://"),
    sameSite: "Lax",
    maxAge: SESSION_TTL,
    path: "/",
  });
  return token;
}

async function requireAuth(c, next) {
  const token = getCookie(c, SESSION_COOKIE) || c.req.header("Authorization")?.replace(/^Bearer\s+/i, "");
  if (!token || !c.env.JWT_SECRET) return jsonError(c, "Authentication required", 401);
  try {
    c.set("session", await verify(token, c.env.JWT_SECRET));
    await next();
  } catch {
    return jsonError(c, "Invalid or expired session", 401);
  }
}

app.get("/api/health", (c) => c.json({ ok: true, service: "maguru-auto-api" }));

app.post("/api/auth/login", async (c) => {
  const { email, password } = await c.req.json();
  if (!email || !password) return jsonError(c, "Email and password are required");
  const user = await c.env.DB.prepare("SELECT * FROM users WHERE lower(email) = lower(?) LIMIT 1").bind(email.trim()).first();
  if (!user || !(await verifyPassword(password, user.password_hash))) {
    return jsonError(c, "Invalid email or password", 401);
  }
  await createSession(c, user);
  return c.json({ token: "cookie-session", user: mapUser(user) });
});

app.post("/api/auth/logout", (c) => {
  deleteCookie(c, SESSION_COOKIE, { path: "/" });
  return c.json({ ok: true });
});

app.get("/api/auth/me", requireAuth, async (c) => {
  const session = c.get("session");
  const user = await c.env.DB.prepare("SELECT * FROM users WHERE id = ? LIMIT 1").bind(session.sub).first();
  return user ? c.json({ user: mapUser(user) }) : jsonError(c, "User not found", 404);
});

app.get("/api/cars", async (c) => {
  const result = await c.env.DB.prepare("SELECT * FROM cars ORDER BY datetime(created_at) DESC").all();
  return c.json(result.results.map(mapCar));
});

app.get("/api/cars/:id", async (c) => {
  const row = await c.env.DB.prepare("SELECT * FROM cars WHERE id = ? LIMIT 1").bind(c.req.param("id")).first();
  return row ? c.json(mapCar(row)) : jsonError(c, "Car not found", 404);
});

app.post("/api/cars", requireAuth, async (c) => {
  const car = await c.req.json();
  const timestamp = now();
  const carId = id();
  await c.env.DB.prepare(`INSERT INTO cars
    (id, title, make, model, year, mileage, price, transmission, fuel_type, body_type, color, engine_cc, condition, status, description, images_json, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
    .bind(carId, car.title, car.make, car.model, car.year ?? null, car.mileage ?? null, car.price, car.transmission ?? null, car.fuel_type ?? null, car.body_type ?? null, car.color ?? null, car.engine_cc ?? null, car.condition ?? null, car.status || "Available", car.description ?? null, JSON.stringify(car.images || []), timestamp, timestamp)
    .run();
  return c.json({ id: carId });
});

app.put("/api/cars/:id", requireAuth, async (c) => {
  const car = await c.req.json();
  const timestamp = now();
  const result = await c.env.DB.prepare(`UPDATE cars SET title=?, make=?, model=?, year=?, mileage=?, price=?, transmission=?, fuel_type=?, body_type=?, color=?, engine_cc=?, condition=?, status=?, description=?, images_json=?, updated_at=? WHERE id=?`)
    .bind(car.title, car.make, car.model, car.year ?? null, car.mileage ?? null, car.price, car.transmission ?? null, car.fuel_type ?? null, car.body_type ?? null, car.color ?? null, car.engine_cc ?? null, car.condition ?? null, car.status || "Available", car.description ?? null, JSON.stringify(car.images || []), timestamp, c.req.param("id"))
    .run();
  return result.meta.changes ? c.json({ ok: true }) : jsonError(c, "Car not found", 404);
});

app.delete("/api/cars/:id", requireAuth, async (c) => {
  const result = await c.env.DB.prepare("DELETE FROM cars WHERE id = ?").bind(c.req.param("id")).run();
  return result.meta.changes ? c.json({ ok: true }) : jsonError(c, "Car not found", 404);
});

app.post("/api/inquiries", async (c) => {
  const inquiry = await c.req.json();
  if (!inquiry.name || !inquiry.email || !inquiry.phone || !inquiry.message) return jsonError(c, "All inquiry fields are required");
  const timestamp = now();
  const inquiryId = id();
  await c.env.DB.prepare(`INSERT INTO inquiries (id, name, email, phone, message, car_id, car_title, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, 'new', ?, ?)`)
    .bind(inquiryId, inquiry.name, inquiry.email, inquiry.phone, inquiry.message, inquiry.carId || null, inquiry.carTitle || null, timestamp, timestamp)
    .run();
  return c.json({ id: inquiryId }, 201);
});

app.get("/api/inquiries", requireAuth, async (c) => {
  const result = await c.env.DB.prepare("SELECT * FROM inquiries ORDER BY datetime(created_at) DESC").all();
  return c.json(result.results.map((row) => ({ ...row, carId: row.car_id, carTitle: row.car_title, createdAt: row.created_at, updatedAt: row.updated_at, date: row.created_at })));
});

app.patch("/api/inquiries/:id", requireAuth, async (c) => {
  const { status } = await c.req.json();
  const result = await c.env.DB.prepare("UPDATE inquiries SET status=?, updated_at=? WHERE id=?").bind(status, now(), c.req.param("id")).run();
  return result.meta.changes ? c.json({ ok: true }) : jsonError(c, "Inquiry not found", 404);
});

app.delete("/api/inquiries/:id", requireAuth, async (c) => {
  const result = await c.env.DB.prepare("DELETE FROM inquiries WHERE id=?").bind(c.req.param("id")).run();
  return result.meta.changes ? c.json({ ok: true }) : jsonError(c, "Inquiry not found", 404);
});

app.get("/api/users", requireAuth, async (c) => {
  const result = await c.env.DB.prepare("SELECT * FROM users ORDER BY datetime(created_at) DESC").all();
  return c.json(result.results.map(mapUser));
});

app.post("/api/users", requireAuth, async (c) => {
  const user = await c.req.json();
  if (!user.name || !user.email || !user.password) return jsonError(c, "Name, email, and password are required");
  const timestamp = now();
  const userId = id();
  await c.env.DB.prepare("INSERT INTO users (id, name, email, password_hash, role, created_at, updated_at) VALUES (?, ?, ?, ?, 'admin', ?, ?)")
    .bind(userId, user.name, user.email.toLowerCase(), await hashPassword(user.password), timestamp, timestamp)
    .run();
  return c.json({ id: userId }, 201);
});

app.put("/api/users/:id", requireAuth, async (c) => {
  const user = await c.req.json();
  const timestamp = now();
  const passwordPart = user.password ? ", password_hash = ?" : "";
  const values = user.password
    ? [user.name, user.email.toLowerCase(), await hashPassword(user.password), timestamp, c.req.param("id")]
    : [user.name, user.email.toLowerCase(), timestamp, c.req.param("id")];
  const result = await c.env.DB.prepare(`UPDATE users SET name=?, email=?, updated_at=?${passwordPart} WHERE id=?`).bind(...(user.password ? [user.name, user.email.toLowerCase(), timestamp, await hashPassword(user.password), c.req.param("id")] : values)).run();
  return result.meta.changes ? c.json({ ok: true }) : jsonError(c, "User not found", 404);
});

app.delete("/api/users/:id", requireAuth, async (c) => {
  if (c.req.param("id") === c.get("session").sub) return jsonError(c, "You cannot delete your own account");
  const result = await c.env.DB.prepare("DELETE FROM users WHERE id=?").bind(c.req.param("id")).run();
  return result.meta.changes ? c.json({ ok: true }) : jsonError(c, "User not found", 404);
});

app.post("/api/uploads", requireAuth, async (c) => {
  if (!c.env.BUCKET) return jsonError(c, "R2 bucket is not configured", 503);
  const body = await c.req.parseBody();
  const file = body.file;
  if (!(file instanceof File)) return jsonError(c, "Image file is required");
  const key = `cars/${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "-")}`;
  await c.env.BUCKET.put(key, file.stream(), { httpMetadata: { contentType: file.type } });
  return c.json({ url: `/api/media/${encodeURIComponent(key)}` });
});

app.get("/api/media/*", async (c) => {
  if (!c.env.BUCKET) return jsonError(c, "R2 bucket is not configured", 503);
  const key = c.req.path.replace(/^\/api\/media\//, "");
  const object = await c.env.BUCKET.get(decodeURIComponent(key));
  if (!object) return jsonError(c, "Media not found", 404);
  return new Response(object.body, { headers: { "Content-Type": object.httpMetadata?.contentType || "application/octet-stream", "Cache-Control": "public, max-age=31536000, immutable" } });
});

export default app;
