const API_BASE = import.meta.env.VITE_API_BASE_URL || "/api";

async function request(path, options = {}) {
  const token = localStorage.getItem("authToken");
  const headers = new Headers(options.headers || {});
  if (options.body && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }
  if (token && token !== "cookie-session") {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
    credentials: "include",
  });
  const data = response.status === 204 ? null : await response.json();
  if (!response.ok) throw new Error(data?.error || "Request failed");
  return data;
}

const json = (method, body) => ({ method, body: JSON.stringify(body) });

export const login = (email, password) => request("/auth/login", json("POST", { email, password }));
export const logout = () => request("/auth/logout", { method: "POST" });
export const getCurrentUser = () => request("/auth/me");

export const fetchCars = () => request("/cars");
export const fetchCarById = (carId) => request(`/cars/${encodeURIComponent(carId)}`);
export const createCar = (carData) => request("/cars", json("POST", carData));
export const updateCar = (carId, carData) => request(`/cars/${encodeURIComponent(carId)}`, json("PUT", carData));
export const deleteCar = (carId) => request(`/cars/${encodeURIComponent(carId)}`, { method: "DELETE" });
export const fetchCarsByCondition = async (condition) => {
  const cars = await fetchCars();
  return cars.filter((car) => car.condition === condition);
};

export const fetchInquiries = () => request("/inquiries");
export const createInquiry = (inquiryData) => request("/inquiries", json("POST", inquiryData));
export const updateInquiryStatus = (inquiryId, status) => request(`/inquiries/${encodeURIComponent(inquiryId)}`, json("PATCH", { status }));
export const deleteInquiry = (inquiryId) => request(`/inquiries/${encodeURIComponent(inquiryId)}`, { method: "DELETE" });

export const fetchUsers = () => request("/users");
export const createUser = (userData) => request("/users", json("POST", userData));
export const updateUser = (userId, userData) => request(`/users/${encodeURIComponent(userId)}`, json("PUT", userData));
export const deleteUser = (userId) => request(`/users/${encodeURIComponent(userId)}`, { method: "DELETE" });
export const fetchUserFromFirebase = async (userId) => {
  const { user } = await getCurrentUser();
  return user?.id === userId ? user : null;
};

export const fetchDashboardStats = async () => {
  const [cars, inquiries] = await Promise.all([fetchCars(), fetchInquiries()]);
  return {
    totalCars: cars.length,
    availableCars: cars.filter((car) => car.status === "Available").length,
    soldCars: cars.filter((car) => car.status === "Sold").length,
    totalInquiries: inquiries.length,
    pendingInquiries: inquiries.filter((inquiry) => inquiry.status === "new").length,
  };
};

export const uploadToR2 = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  const data = await request("/uploads", { method: "POST", body: formData });
  return data.url;
};

export const uploadMultipleToR2 = (files) => Promise.all(files.map(uploadToR2));
