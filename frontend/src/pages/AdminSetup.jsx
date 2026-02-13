import { useState } from "react";
import { addAdminUser } from "../lib/addAdminUser";

export default function AdminSetup() {
  const [email, setEmail] = useState("admin@maguruauto.com");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleCreateAdmin = async () => {
    setLoading(true);
    try {
      await addAdminUser(email);
      setMessage(` Admin created! Email: ${email}, Password: Admin@123`);
      setEmail("");
    } catch (error) {
      setMessage(` Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "500px", margin: "0 auto" }}>
      <h1>Create Admin User</h1>
      <div style={{ marginBottom: "1rem" }}>
        <input
          type="email"
          placeholder="Admin email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: "100%",
            padding: "0.5rem",
            fontSize: "1rem",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        />
      </div>
      <button
        onClick={handleCreateAdmin}
        disabled={loading || !email}
        style={{
          width: "100%",
          padding: "0.75rem",
          fontSize: "1rem",
          backgroundColor: loading ? "#ccc" : "#007bff",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "Creating..." : "Create Admin"}
      </button>
      {message && (
        <p
          style={{
            marginTop: "1rem",
            padding: "0.5rem",
            backgroundColor: message.includes("") ? "#d4edda" : "#f8d7da",
            borderRadius: "4px",
            whiteSpace: "pre-wrap",
          }}
        >
          {message}
        </p>
      )}
    </div>
  );
}
