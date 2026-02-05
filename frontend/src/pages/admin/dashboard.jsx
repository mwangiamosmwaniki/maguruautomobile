import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../lib/AuthContext";
import UsersPage from "./Users";
import Logo from "../../assets/images/maguruLogo.png";

// Update this to match your Laravel API URL
const API_BASE = "http://localhost:8000/api";

const MAKES = [
  "Toyota",
  "Honda",
  "Ford",
  "BMW",
  "Mercedes-Benz",
  "Audi",
  "Volkswagen",
  "Hyundai",
  "Kia",
  "Nissan",
  "Mazda",
  "Subaru",
  "Chevrolet",
  "Dodge",
  "Jeep",
  "Land Rover",
  "Porsche",
  "Lexus",
  "Volvo",
  "Mitsubishi",
];
const TRANSMISSIONS = ["Automatic", "Manual", "Semi-Automatic", "CVT"];
const FUEL_TYPES = ["Petrol", "Diesel", "Hybrid", "Electric", "Plug-in Hybrid"];
const BODY_TYPES = [
  "Sedan",
  "SUV",
  "Hatchback",
  "Coupe",
  "Convertible",
  "Wagon",
  "Pickup",
  "Van",
  "Minivan",
];
const CONDITIONS = ["New", "Like New", "Good", "Fair", "Needs Work"];
const STATUSES = ["Available", "Sold", "Reserved", "On Hold"];
const COLORS = [
  "Black",
  "White",
  "Silver",
  "Grey",
  "Blue",
  "Red",
  "Green",
  "Brown",
  "Orange",
  "Yellow",
  "Purple",
  "Pink",
  "Maroon",
  "Gold",
];

// ─── Icons ────────────────────────────────────────────────
const Icon = ({ name, size = 18 }) => {
  const paths = {
    cars: "M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h10v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z",
    plus: "M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z",
    search:
      "M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z",
    close:
      "M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z",
    edit: "M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z",
    trash:
      "M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z",
    img: "M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z",
    chevron: "M7 10l5 5 5-5z",
    status:
      "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z",
    alert: "M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z",
    arrow: "M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z",
    dollar:
      "M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z",
  };
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      style={{ flexShrink: 0 }}
    >
      <path d={paths[name]} />
    </svg>
  );
};

// ─── Styles ───────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&display=swap');
  
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .mgr-root {
    font-family: 'DM Sans', sans-serif;
    background: #0c0e11;
    color: #e2e4e8;
    min-height: 100vh;
    display: flex;
    font-size: 14px;
    line-height: 1.5;
  }

  /* ── Sidebar ── */
  .mgr-sidebar {
    width: 230px;
    min-height: 100vh;
    background: #111318;
    border-right: 1px solid #1e2128;
    display: flex;
    flex-direction: column;
    position: fixed;
    top: 0; left: 0; bottom: 0;
    z-index: 100;
  }
  .mgr-logo {
    padding: 28px 24px 24px;
    border-bottom: 1px solid #1e2128;
  }
  .mgr-logo-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 24px;
    letter-spacing: 3px;
    color: #fff;
    text-transform: uppercase;
  }
  .mgr-logo-sub {
    font-size: 10px;
    color: #555;
    letter-spacing: 2px;
    text-transform: uppercase;
    margin-top: 2px;
  }
  .mgr-nav { padding: 16px 12px; flex: 1; }
  .mgr-nav-item {
    display: flex; align-items: center; gap: 10px;
    padding: 10px 14px; border-radius: 8px;
    color: #666; cursor: pointer; transition: all .2s;
    margin-bottom: 2px;
  }
  .mgr-nav-item:hover { background: #1a1d24; color: #aaa; }
  .mgr-nav-item.active { background: linear-gradient(135deg, #e8174b 0%, #f7a41f 100%); color: #ffffff; }
  .mgr-nav-item.active svg { color: #111; }
  .mgr-nav-label { font-size: 13px; font-weight: 500; }
  .mgr-nav-badge {
    margin-left: auto; background: #e8a317; color: #111;
    font-size: 10px; font-weight: 700; padding: 2px 7px; border-radius: 10px;
  }

  /* ── Main ── */
  .mgr-main { margin-left: 230px; flex: 1; padding: 28px 32px; min-height: 100vh; }

  /* ── Header ── */
  .mgr-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 28px; }
  .mgr-header-left h1 { font-family: 'Bebas Neue', sans-serif; font-size: 28px; letter-spacing: 2px; color: #fff; }
  .mgr-header-left p { color: #555; font-size: 13px; margin-top: 2px; }
  .mgr-header-right { display: flex; gap: 12px; align-items: center; }

  /* ── Buttons ── */
  .btn {
    display: inline-flex; align-items: center; gap: 7px;
    padding: 9px 18px; border-radius: 8px; border: none;
    font-family: inherit; font-size: 13px; font-weight: 600;
    cursor: pointer; transition: all .2s; white-space: nowrap;
  }
  .btn-primary { background: linear-gradient(135deg, #e8174b, #f09f1e); color: #ffffff; }
  .btn-primary:hover { background: linear-gradient(135deg, #f0b530, #e8174b); box-shadow: 0 4px 14px rgba(232,163,23,.3); }
  .btn-ghost { background: transparent; color: #888; }
  .btn-ghost:hover { color: #e2e4e8; }
  .btn-danger { background: transparent; color: #e85d5d; }
  .btn-danger:hover { background: rgba(232,93,93,.1); }
  .btn-sm { padding: 6px 12px; font-size: 12px; }

  /* ── Search / Filter Bar ── */
  .mgr-toolbar { display: flex; gap: 12px; align-items: center; margin-bottom: 20px; flex-wrap: wrap; }
  .mgr-search-wrap { position: relative; flex: 1; min-width: 200px; max-width: 340px; }
  .mgr-search-wrap svg { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: #555; }
  .mgr-search {
    width: 100%; padding: 9px 14px 9px 38px;
    background: #141720; border: 1px solid #1e2128; border-radius: 8px;
    color: #e2e4e8; font-family: inherit; font-size: 13px;
    outline: none; transition: border .2s;
  }
  .mgr-search:focus { border-color: #e8a317; }
  .mgr-search::placeholder { color: #555; }

  .mgr-select {
    padding: 9px 32px 9px 12px; background: #141720; border: 1px solid #1e2128;
    border-radius: 8px; color: #e2e4e8; font-family: inherit; font-size: 13px;
    outline: none; appearance: none; cursor: pointer; min-width: 130px;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='%23666'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E");
    background-repeat: no-repeat; background-position: right 10px center;
    transition: border .2s;
  }
  .mgr-select:focus { border-color: #e8a317; }
  .mgr-select option { background: #111318; }

  /* ── Stats Cards ── */
  .mgr-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px; }
  .mgr-stat-card {
    background: #111318; border: 1px solid #1e2128; border-radius: 12px;
    padding: 20px; position: relative; overflow: hidden; transition: border .25s;
  }
  .mgr-stat-card:hover { border-color: #2a2d35; }
  .mgr-stat-card::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
  }
  .mgr-stat-card:nth-child(1)::before { background: #e8a317; }
  .mgr-stat-card:nth-child(2)::before { background: #4da6ff; }
  .mgr-stat-card:nth-child(3)::before { background: #5dcc8e; }
  .mgr-stat-card:nth-child(4)::before { background: #e85d5d; }
  .mgr-stat-icon {
    width: 38px; height: 38px; border-radius: 10px; display: flex;
    align-items: center; justify-content: center; margin-bottom: 14px;
  }
  .mgr-stat-card:nth-child(1) .mgr-stat-icon { background: rgba(232,163,23,.12); color: #e8a317; }
  .mgr-stat-card:nth-child(2) .mgr-stat-icon { background: rgba(77,166,255,.12); color: #4da6ff; }
  .mgr-stat-card:nth-child(3) .mgr-stat-icon { background: rgba(93,204,142,.12); color: #5dcc8e; }
  .mgr-stat-card:nth-child(4) .mgr-stat-icon { background: rgba(232,93,93,.12); color: #e85d5d; }
  .mgr-stat-label { color: #555; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; }
  .mgr-stat-value { font-family: 'Bebas Neue', sans-serif; font-size: 28px; color: #fff; letter-spacing: 1px; margin-top: 4px; }

  /* ── Table ── */
  .mgr-table-wrap {
    background: #111318; border: 1px solid #1e2128; border-radius: 12px;
    overflow: hidden;
  }
  .mgr-table { width: 100%; border-collapse: collapse; }
  .mgr-table thead { border-bottom: 1px solid #1e2128; }
  .mgr-table th {
    padding: 13px 16px; text-align: left; color: #555; font-size: 11px;
    text-transform: uppercase; letter-spacing: 1.2px; font-weight: 600;
    white-space: nowrap;
  }
  .mgr-table td { padding: 14px 16px; border-bottom: 1px solid #161921; }
  .mgr-table tr:last-child td { border-bottom: none; }
  .mgr-table tr:hover td { background: #141720; }

  .mgr-car-thumb {
    width: 48px; height: 36px; border-radius: 6px; background: #1a1d24;
    display: flex; align-items: center; justify-content: center; color: #444;
    overflow: hidden;
  }
  .mgr-car-thumb img { width: 100%; height: 100%; object-fit: cover; }
  .mgr-car-row { display: flex; align-items: center; gap: 12px; }
  .mgr-car-name { color: #fff; font-weight: 600; font-size: 13px; }
  .mgr-car-sub { color: #555; font-size: 12px; margin-top: 1px; }

  .mgr-badge {
    display: inline-block; padding: 3px 10px; border-radius: 20px;
    font-size: 11px; font-weight: 600; letter-spacing: .3px;
  }
  .badge-available { background: rgba(93,204,142,.1); color: #5dcc8e; }
  .badge-sold { background: rgba(232,93,93,.1); color: #e85d5d; }
  .badge-reserved { background: rgba(232,163,23,.1); color: #e8a317; }
  .badge-on-hold { background: rgba(77,166,255,.1); color: #4da6ff; }

  .mgr-price { color: #fff; font-weight: 600; font-size: 14px; }
  .mgr-actions { display: flex; gap: 4px; }

  /* ── Toast ── */
  .mgr-toast {
    position: fixed; bottom: 28px; right: 32px; z-index: 999;
    background: #1a1d24; border: 1px solid #2a2d35; border-radius: 10px;
    padding: 14px 20px; display: flex; align-items: center; gap: 10px;
    box-shadow: 0 8px 32px rgba(0,0,0,.4); animation: toastIn .3s ease;
    max-width: 340px; color: #e2e4e8; font-size: 13px;
  }
  .mgr-toast.success .mgr-toast-icon { color: #5dcc8e; }
  .mgr-toast.error .mgr-toast-icon { color: #e85d5d; }
  @keyframes toastIn { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

  /* ── Modal ── */
  .mgr-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,.6);
    z-index: 200; display: flex; align-items: center; justify-content: center;
    backdrop-filter: blur(3px);
  }
  .mgr-modal {
    background: #141720; border: 1px solid #1e2128; border-radius: 14px;
    width: 560px; max-height: 90vh; overflow-y: auto;
    box-shadow: 0 20px 60px rgba(0,0,0,.5);
    animation: modalIn .25s ease;
  }
  @keyframes modalIn { from { transform: scale(.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
  .mgr-modal-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 22px 24px 16px;
  }
  .mgr-modal-header h2 { color: #fff; font-size: 18px; font-weight: 600; }
  .mgr-modal-body { padding: 0 24px 24px; }

  .mgr-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  .mgr-form-group { display: flex; flex-direction: column; gap: 6px; }
  .mgr-form-group.full { grid-column: 1 / -1; }
  .mgr-form-label { color: #888; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; font-weight: 600; }
  .mgr-input, .mgr-select-modal {
    padding: 10px 12px; background: #111318; border: 1px solid #1e2128;
    border-radius: 8px; color: #e2e4e8; font-family: inherit; font-size: 13px;
    outline: none; transition: border .2s;
  }
  .mgr-input:focus, .mgr-select-modal:focus { border-color: #e8a317; }
  .mgr-input::placeholder { color: #444; }
  .mgr-select-modal { appearance: none; cursor: pointer; min-width: 0; }
  .mgr-select-modal option { background: #111318; }
  textarea.mgr-input { resize: vertical; min-height: 70px; }

  .mgr-upload-area {
    border: 2px dashed #2a2d35; border-radius: 10px; padding: 24px;
    text-align: center; cursor: pointer; transition: all .2s; position: relative;
  }
  .mgr-upload-area:hover { border-color: #e8a317; background: rgba(232,163,23,.03); }
  .mgr-upload-area input { position: absolute; inset: 0; opacity: 0; cursor: pointer; }
  .mgr-upload-area .upload-icon { color: #444; margin-bottom: 8px; }
  .mgr-upload-area p { color: #666; font-size: 13px; }
  .mgr-upload-area p span { color: #e8a317; font-weight: 600; }
  .mgr-upload-preview {
    width: 100%; height: 100px; object-fit: cover; border-radius: 8px;
    margin-top: 10px; border: 1px solid #1e2128;
  }

  .mgr-modal-footer {
    display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px;
    padding-top: 18px; border-top: 1px solid #1e2128;
  }

  /* ── Detail View ── */
  .mgr-detail-hero { display: flex; gap: 28px; margin-bottom: 24px; }
  .mgr-detail-img {
    width: 300px; height: 200px; border-radius: 14px; background: #141720;
    border: 1px solid #1e2128; display: flex; align-items: center;
    justify-content: center; color: #444; overflow: hidden; flex-shrink: 0;
  }
  .mgr-detail-img img { width: 100%; height: 100%; object-fit: cover; }
  .mgr-detail-info { flex: 1; display: flex; flex-direction: column; justify-content: center; }
  .mgr-detail-info h1 { font-family: 'Bebas Neue', sans-serif; font-size: 30px; letter-spacing: 1px; color: #fff; }
  .mgr-detail-info .mgr-detail-price { font-size: 22px; font-weight: 700; color: #e8a317; margin-top: 4px; }
  .mgr-detail-specs {
    display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-top: 20px;
  }
  .mgr-spec-card {
    background: #141720; border: 1px solid #1e2128; border-radius: 10px; padding: 14px;
  }
  .mgr-spec-card .spec-label { color: #555; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; }
  .mgr-spec-card .spec-value { color: #fff; font-size: 15px; font-weight: 600; margin-top: 3px; }

  /* ── Empty & Loading ── */
  .mgr-empty {
    text-align: center; padding: 60px 20px; color: #444;
  }
  .mgr-empty svg { color: #2a2d35; margin-bottom: 12px; }
  .mgr-empty p { font-size: 15px; color: #555; }

  .mgr-spinner {
    width: 36px; height: 36px; border: 3px solid #1e2128; border-top-color: #e8a317;
    border-radius: 50%; animation: spin .7s linear infinite; margin: 40px auto;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* ── Delete confirm ── */
  .mgr-confirm-icon { width: 48px; height: 48px; border-radius: 50%; background: rgba(232,93,93,.1); display: flex; align-items: center; justify-content: center; color: #e85d5d; margin: 0 auto 16px; }
  .mgr-confirm-title { color: #fff; font-size: 17px; font-weight: 600; text-align: center; }
  .mgr-confirm-desc { color: #666; font-size: 13px; text-align: center; margin-top: 6px; }
`;

// ─── Helpers ──────────────────────────────────────────────
const fmt = (n) =>
  new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    maximumFractionDigits: 0,
  }).format(n);

const statusClass = (s) => {
  const m = {
    Available: "badge-available",
    Sold: "badge-sold",
    Reserved: "badge-reserved",
    "On Hold": "badge-on-hold",
  };
  return m[s] || "badge-available";
};

// ─── App ──────────────────────────────────────────────────
export default function MaguruAutoDashboard() {
  const navigate = useNavigate();
  const { user, token, logout } = useAuth();

  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("list"); // list | detail | add | edit | analytics | users
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterMake, setFilterMake] = useState("All");
  const [toast, setToast] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [form, setForm] = useState(defaultForm());
  const [imgPreviews, setImgPreviews] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  function defaultForm() {
    return {
      title: "",
      make: "",
      model: "",
      year: new Date().getFullYear(),
      mileage: "",
      price: "",
      transmission: "Automatic",
      fuel_type: "Petrol",
      body_type: "Sedan",
      color: "Black",
      engine_cc: "",
      condition: "Good",
      status: "Available",
      description: "",
      images: [],
    };
  }

  // Helper function for authenticated API calls
  const authenticatedFetch = async (url, options = {}) => {
    const headers = {
      ...options.headers,
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    // Handle 401 Unauthorized
    if (response.status === 401) {
      logout();
      navigate("/admin/login");
      showToast("Session expired. Please login again.", "error");
      throw new Error("Unauthorized");
    }

    return response;
  };

  const showToast = useCallback((msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3200);
  }, []);

  // ── Fetch all cars ──
  const fetchCars = useCallback(async () => {
    setLoading(true);
    try {
      const headers = {
        "Content-Type": "application/json",
      };

      // Add auth token to protected endpoints
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const res = await fetch(`${API_BASE}/cars`, { headers });

      // Handle 401 Unauthorized - token expired or invalid
      if (res.status === 401) {
        logout();
        navigate("/admin/login");
        showToast("Session expired. Please login again.", "error");
        return;
      }

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      // Handle both direct array and Laravel's data wrapper
      setCars(Array.isArray(data) ? data : data.data || []);
    } catch (error) {
      console.error("Failed to fetch cars:", error);
      showToast("Failed to load cars from database", "error");
      // For development/testing: uncomment the line below to use sample data
      // setCars(sampleCars());
    }
    setLoading(false);
  }, [showToast, token, logout, navigate]);

  useEffect(() => {
    fetchCars();
  }, [fetchCars]);

  // ── Filtered / searched list ──
  const filtered = cars.filter((c) => {
    const q = search.toLowerCase();
    const matchQ =
      !q ||
      `${c.title} ${c.make} ${c.model} ${c.color}`.toLowerCase().includes(q);
    const matchS = filterStatus === "All" || c.status === filterStatus;
    const matchM = filterMake === "All" || c.make === filterMake;
    return matchQ && matchS && matchM;
  });

  // ── Stats ──
  const stats = {
    total: cars.length,
    available: cars.filter((c) => c.status === "Available").length,
    sold: cars.filter((c) => c.status === "Sold").length,
    avgPrice: cars.length
      ? cars.reduce((a, c) => a + Number(c.price), 0) / cars.length
      : 0,
  };

  // ── Handlers ──
  const openAdd = () => {
    setForm(defaultForm());
    setImgPreviews([]);
    setView("add");
  };
  const openEdit = (car) => {
    setForm({
      ...car,
      mileage: car.mileage ?? "",
      engine_cc: car.engine_cc ?? "",
      description: car.description ?? "",
      images: car.images || [],
    });
    setImgPreviews(car.images || []);
    setView("edit");
  };
  const openDetail = (car) => {
    setSelected(car);
    setView("detail");
  };

  const handleSubmit = async () => {
    if (!form.title || !form.make || !form.model || !form.price) {
      showToast("Please fill required fields", "error");
      return;
    }
    if (imgPreviews.length < 2) {
      showToast("Please upload at least 2 car images", "error");
      return;
    }
    if (imgPreviews.length > 6) {
      showToast("Maximum 6 images allowed", "error");
      return;
    }
    setSubmitting(true);

    const payload = {
      title: form.title,
      make: form.make,
      model: form.model,
      year: Number(form.year),
      mileage: form.mileage ? Number(form.mileage) : null,
      price: Number(form.price),
      transmission: form.transmission,
      fuel_type: form.fuel_type,
      body_type: form.body_type,
      color: form.color,
      engine_cc: form.engine_cc ? Number(form.engine_cc) : null,
      condition: form.condition,
      status: form.status,
      description: form.description || null,
      images: imgPreviews,
    };

    try {
      const isEdit = view === "edit";
      const url = isEdit ? `${API_BASE}/cars/${form.id}` : `${API_BASE}/cars`;
      const method = isEdit ? "PUT" : "POST";

      const res = await authenticatedFetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        // Refresh from server to ensure sync
        await fetchCars();
        showToast(
          isEdit ? "Car updated successfully" : "Car added successfully",
        );
        setView("list");
      } else {
        const errorMsg = data.message || data.error || "Error saving car";
        showToast(errorMsg, "error");
      }
    } catch (error) {
      if (error.message !== "Unauthorized") {
        console.error("Submit error:", error);
        showToast("Network error: Could not save car", "error");
      }
    }
    setSubmitting(false);
  };

  const handleUploadImages = async (files) => {
    if (!files || files.length === 0) return;

    const newImages = Array.from(files);
    const totalImages = imgPreviews.length + newImages.length;

    if (totalImages > 6) {
      showToast(
        `Maximum 6 images allowed. You can add ${6 - imgPreviews.length} more.`,
        "error",
      );
      return;
    }

    const uploadedImages = [];
    let uploadCount = 0;

    for (const file of newImages) {
      try {
        // Create preview immediately
        const preview = URL.createObjectURL(file);
        uploadedImages.push(preview);

        // Upload to server
        const fd = new FormData();
        fd.append("image", file);
        const res = await authenticatedFetch(`${API_BASE}/cars/upload`, {
          method: "POST",
          body: fd,
        });
        const data = await res.json();
        if (data.url) {
          uploadedImages[uploadCount] = data.url;
        }
        uploadCount++;
      } catch (error) {
        if (error.message !== "Unauthorized") {
          console.error("Upload error:", error);
          showToast("Failed to upload one or more images", "error");
        }
      }
    }

    setImgPreviews((prev) => [...prev, ...uploadedImages]);
  };

  const removeImage = (index) => {
    setImgPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const deleteCar = async (id) => {
    try {
      const res = await authenticatedFetch(`${API_BASE}/cars/${id}`, {
        method: "DELETE",
        headers: { Accept: "application/json" },
      });

      if (res.ok) {
        // Refresh from server
        await fetchCars();
        setConfirmDelete(null);
        if (view === "detail") setView("list");
        showToast("Car deleted successfully");
      } else {
        const data = await res.json();
        showToast(data.message || "Failed to delete car", "error");
      }
    } catch (error) {
      if (error.message !== "Unauthorized") {
        console.error("Delete error:", error);
        showToast("Network error: Could not delete car", "error");
      }
    }
  };

  // ── Renders ──
  const renderStats = () => (
    <div className="mgr-stats">
      {[
        { label: "Total Cars", value: stats.total, icon: "cars" },
        { label: "Available", value: stats.available, icon: "status" },
        { label: "Sold", value: stats.sold, icon: "dollar" },
        { label: "Avg Price", value: fmt(stats.avgPrice), icon: "dollar" },
      ].map((s, i) => (
        <div className="mgr-stat-card" key={i}>
          <div className="mgr-stat-icon">
            <Icon name={s.icon} size={18} />
          </div>
          <div className="mgr-stat-label">{s.label}</div>
          <div className="mgr-stat-value">{s.value}</div>
        </div>
      ))}
    </div>
  );

  const renderAnalytics = () => {
    const statusBreakdown = STATUSES.map((status) => ({
      status,
      count: cars.filter((c) => c.status === status).length,
    }));

    const makeBreakdown = [...new Set(cars.map((c) => c.make))]
      .map((make) => ({
        make,
        count: cars.filter((c) => c.make === make).length,
        avgPrice:
          cars
            .filter((c) => c.make === make)
            .reduce((sum, c) => sum + parseFloat(c.price), 0) /
            cars.filter((c) => c.make === make).length || 0,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    const bodyTypeBreakdown = [...new Set(cars.map((c) => c.body_type))]
      .map((type) => ({
        type,
        count: cars.filter((c) => c.body_type === type).length,
      }))
      .sort((a, b) => b.count - a.count);

    const priceRanges = [
      { range: "< 1M", min: 0, max: 1000000, count: 0 },
      { range: "1M - 2M", min: 1000000, max: 2000000, count: 0 },
      { range: "2M - 3M", min: 2000000, max: 3000000, count: 0 },
      { range: "3M - 5M", min: 3000000, max: 5000000, count: 0 },
      { range: "5M - 8M", min: 5000000, max: 8000000, count: 0 },
      { range: "> 8M", min: 8000000, max: Infinity, count: 0 },
    ];

    cars.forEach((car) => {
      const price = parseFloat(car.price);
      priceRanges.forEach((range) => {
        if (price >= range.min && price < range.max) range.count++;
      });
    });

    return (
      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "24px" }}>
        {/* Key Metrics */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "16px",
          }}
        >
          <div
            style={{
              padding: "20px",
              borderRadius: "12px",
              background:
                "linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(249, 115, 22, 0.1) 100%)",
              border: "1px solid rgba(239, 68, 68, 0.2)",
            }}
          >
            <div
              style={{ fontSize: "12px", color: "#999", marginBottom: "8px" }}
            >
              Total Revenue
            </div>
            <div
              style={{ fontSize: "24px", fontWeight: "bold", color: "#fff" }}
            >
              {fmt(cars.reduce((sum, c) => sum + parseFloat(c.price), 0))}
            </div>
            <div style={{ fontSize: "12px", color: "#666", marginTop: "8px" }}>
              From {cars.length} listings
            </div>
          </div>

          <div
            style={{
              padding: "20px",
              borderRadius: "12px",
              background:
                "linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(99, 102, 241, 0.1) 100%)",
              border: "1px solid rgba(59, 130, 246, 0.2)",
            }}
          >
            <div
              style={{ fontSize: "12px", color: "#999", marginBottom: "8px" }}
            >
              Avg Price per Car
            </div>
            <div
              style={{ fontSize: "24px", fontWeight: "bold", color: "#fff" }}
            >
              {fmt(
                cars.length > 0
                  ? cars.reduce((sum, c) => sum + parseFloat(c.price), 0) /
                      cars.length
                  : 0,
              )}
            </div>
            <div style={{ fontSize: "12px", color: "#666", marginTop: "8px" }}>
              Across all vehicles
            </div>
          </div>

          <div
            style={{
              padding: "20px",
              borderRadius: "12px",
              background:
                "linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(34, 197, 94, 0.1) 100%)",
              border: "1px solid rgba(16, 185, 129, 0.2)",
            }}
          >
            <div
              style={{ fontSize: "12px", color: "#999", marginBottom: "8px" }}
            >
              Listed Vehicles
            </div>
            <div
              style={{ fontSize: "24px", fontWeight: "bold", color: "#fff" }}
            >
              {cars.length}
            </div>
            <div style={{ fontSize: "12px", color: "#666", marginTop: "8px" }}>
              {cars.filter((c) => c.status === "Available").length} available
            </div>
          </div>

          <div
            style={{
              padding: "20px",
              borderRadius: "12px",
              background:
                "linear-gradient(135deg, rgba(168, 85, 247, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)",
              border: "1px solid rgba(168, 85, 247, 0.2)",
            }}
          >
            <div
              style={{ fontSize: "12px", color: "#999", marginBottom: "8px" }}
            >
              Sold Vehicles
            </div>
            <div
              style={{ fontSize: "24px", fontWeight: "bold", color: "#fff" }}
            >
              {cars.filter((c) => c.status === "Sold").length}
            </div>
            <div style={{ fontSize: "12px", color: "#666", marginTop: "8px" }}>
              {cars.length > 0
                ? (
                    (cars.filter((c) => c.status === "Sold").length /
                      cars.length) *
                    100
                  ).toFixed(1)
                : 0}
              % conversion
            </div>
          </div>
        </div>

        {/* Status Distribution */}
        <div
          style={{
            padding: "24px",
            borderRadius: "16px",
            background: "rgba(0, 0, 0, 0.3)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <h3
            style={{
              marginBottom: "20px",
              fontSize: "18px",
              fontWeight: "600",
              color: "#fff",
            }}
          >
            Vehicle Status Distribution
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
              gap: "16px",
            }}
          >
            {statusBreakdown.map((item, idx) => {
              const total = cars.length || 1;
              const percentage = (item.count / total) * 100;
              const colors = ["#ef4444", "#3b82f6", "#10b981", "#f59e0b"];
              return (
                <div key={idx}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "8px",
                    }}
                  >
                    <span style={{ fontSize: "14px", color: "#ccc" }}>
                      {item.status}
                    </span>
                    <span
                      style={{
                        fontSize: "14px",
                        fontWeight: "600",
                        color: "#fff",
                      }}
                    >
                      {item.count}
                    </span>
                  </div>
                  <div
                    style={{
                      height: "8px",
                      borderRadius: "4px",
                      background: "rgba(255, 255, 255, 0.1)",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${percentage}%`,
                        background: colors[idx % colors.length],
                        transition: "width 0.3s ease",
                      }}
                    />
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#666",
                      marginTop: "4px",
                    }}
                  >
                    {percentage.toFixed(1)}%
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Makes */}
        <div
          style={{
            padding: "24px",
            borderRadius: "16px",
            background: "rgba(0, 0, 0, 0.3)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <h3
            style={{
              marginBottom: "20px",
              fontSize: "18px",
              fontWeight: "600",
              color: "#fff",
            }}
          >
            Top Car Makes
          </h3>
          <div style={{ display: "grid", gap: "12px" }}>
            {makeBreakdown.map((item, idx) => (
              <div
                key={idx}
                style={{
                  padding: "12px",
                  borderRadius: "8px",
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: "500",
                      color: "#fff",
                    }}
                  >
                    {item.make}
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#666",
                      marginTop: "2px",
                    }}
                  >
                    Avg: {fmt(item.avgPrice)}
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                  }}
                >
                  <div
                    style={{
                      width: "100px",
                      height: "6px",
                      borderRadius: "3px",
                      background: "rgba(255, 255, 255, 0.1)",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${(item.count / makeBreakdown[0].count) * 100}%`,
                        background: "linear-gradient(90deg, #ef4444, #f97316)",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#fff",
                      minWidth: "30px",
                    }}
                  >
                    {item.count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Body Type & Price Range */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "20px",
          }}
        >
          <div
            style={{
              padding: "24px",
              borderRadius: "16px",
              background: "rgba(0, 0, 0, 0.3)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          >
            <h3
              style={{
                marginBottom: "20px",
                fontSize: "18px",
                fontWeight: "600",
                color: "#fff",
              }}
            >
              Vehicle Type Distribution
            </h3>
            <div style={{ display: "grid", gap: "12px" }}>
              {bodyTypeBreakdown.map((item, idx) => {
                const total = cars.length || 1;
                const percentage = (item.count / total) * 100;
                return (
                  <div
                    key={idx}
                    style={{
                      padding: "12px",
                      borderRadius: "8px",
                      background: "rgba(255, 255, 255, 0.05)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "8px",
                      }}
                    >
                      <span style={{ fontSize: "14px", color: "#ccc" }}>
                        {item.type}
                      </span>
                      <span
                        style={{
                          fontSize: "14px",
                          fontWeight: "600",
                          color: "#fff",
                        }}
                      >
                        {item.count}
                      </span>
                    </div>
                    <div
                      style={{
                        height: "6px",
                        borderRadius: "3px",
                        background: "rgba(255, 255, 255, 0.1)",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          width: `${percentage}%`,
                          background:
                            "linear-gradient(90deg, #3b82f6, #8b5cf6)",
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div
            style={{
              padding: "24px",
              borderRadius: "16px",
              background: "rgba(0, 0, 0, 0.3)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          >
            <h3
              style={{
                marginBottom: "20px",
                fontSize: "18px",
                fontWeight: "600",
                color: "#fff",
              }}
            >
              Price Range Distribution
            </h3>
            <div style={{ display: "grid", gap: "12px" }}>
              {priceRanges.map((item, idx) => {
                const total = cars.length || 1;
                const percentage = (item.count / total) * 100;
                return (
                  <div
                    key={idx}
                    style={{
                      padding: "12px",
                      borderRadius: "8px",
                      background: "rgba(255, 255, 255, 0.05)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "8px",
                      }}
                    >
                      <span style={{ fontSize: "14px", color: "#ccc" }}>
                        KES {item.range}
                      </span>
                      <span
                        style={{
                          fontSize: "14px",
                          fontWeight: "600",
                          color: "#fff",
                        }}
                      >
                        {item.count}
                      </span>
                    </div>
                    <div
                      style={{
                        height: "6px",
                        borderRadius: "3px",
                        background: "rgba(255, 255, 255, 0.1)",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          width: `${percentage}%`,
                          background:
                            "linear-gradient(90deg, #10b981, #06b6d4)",
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderTable = () => (
    <div className="mgr-table-wrap">
      {loading ? (
        <div className="mgr-spinner" />
      ) : filtered.length === 0 ? (
        <div className="mgr-empty">
          <Icon name="cars" size={40} />
          <p>No cars match your filters</p>
        </div>
      ) : (
        <table className="mgr-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Car</th>
              <th>Year</th>
              <th>Mileage</th>
              <th>Price</th>
              <th>Transmission</th>
              <th>Status</th>
              <th style={{ textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c, i) => (
              <tr key={c.id}>
                <td style={{ color: "#444", fontWeight: 600 }}>{i + 1}</td>
                <td>
                  <div
                    className="mgr-car-row"
                    style={{ cursor: "pointer" }}
                    onClick={() => openDetail(c)}
                  >
                    <div className="mgr-car-thumb">
                      {c.image_url ? (
                        <img src={c.image_url} alt="" />
                      ) : (
                        <Icon name="cars" size={20} />
                      )}
                    </div>
                    <div>
                      <div className="mgr-car-name">{c.title}</div>
                      <div className="mgr-car-sub">
                        {c.make} {c.model} · {c.color}
                      </div>
                    </div>
                  </div>
                </td>
                <td>{c.year}</td>
                <td>
                  {c.mileage ? Number(c.mileage).toLocaleString() + " km" : "—"}
                </td>
                <td>
                  <span className="mgr-price">{fmt(c.price)}</span>
                </td>
                <td>{c.transmission}</td>
                <td>
                  <span className={`mgr-badge ${statusClass(c.status)}`}>
                    {c.status}
                  </span>
                </td>
                <td>
                  <div
                    className="mgr-actions"
                    style={{ justifyContent: "flex-end" }}
                  >
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => openEdit(c)}
                    >
                      <Icon name="edit" size={14} />
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => setConfirmDelete(c.id)}
                    >
                      <Icon name="trash" size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );

  const renderDetail = () => {
    const c = selected;
    if (!c) return null;
    return (
      <>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 20,
          }}
        >
          <button className="btn btn-ghost" onClick={() => setView("list")}>
            <Icon name="arrow" size={16} /> Back
          </button>
          <div style={{ flex: 1 }} />
          <button
            className="btn btn-primary btn-sm"
            onClick={() => openEdit(c)}
          >
            <Icon name="edit" size={14} /> Edit
          </button>
          <button
            className="btn btn-danger btn-sm"
            onClick={() => setConfirmDelete(c.id)}
          >
            <Icon name="trash" size={14} /> Delete
          </button>
        </div>
        <div className="mgr-detail-hero">
          <div className="mgr-detail-img">
            {c.image_url ? (
              <img src={c.image_url} alt={c.title} />
            ) : (
              <Icon name="img" size={48} />
            )}
          </div>
          <div className="mgr-detail-info">
            <span
              className={`mgr-badge ${statusClass(c.status)}`}
              style={{ width: "fit-content" }}
            >
              {c.status}
            </span>
            <h1 style={{ marginTop: 8 }}>{c.title}</h1>
            <div className="mgr-detail-price">{fmt(c.price)}</div>
            {c.description && (
              <p
                style={{
                  color: "#777",
                  fontSize: 13,
                  marginTop: 10,
                  lineHeight: 1.6,
                }}
              >
                {c.description}
              </p>
            )}
          </div>
        </div>
        <div className="mgr-detail-specs">
          {[
            ["Make", c.make],
            ["Model", c.model],
            ["Year", c.year],
            ["Color", c.color],
            [
              "Mileage",
              c.mileage ? Number(c.mileage).toLocaleString() + " km" : "—",
            ],
            ["Engine", c.engine_cc ? c.engine_cc + " cc" : "—"],
            ["Transmission", c.transmission],
            ["Fuel Type", c.fuel_type],
            ["Body Type", c.body_type],
            ["Condition", c.condition],
          ].map(([l, v]) => (
            <div className="mgr-spec-card" key={l}>
              <div className="spec-label">{l}</div>
              <div className="spec-value">{v}</div>
            </div>
          ))}
        </div>
      </>
    );
  };

  const renderForm = () => {
    const isEdit = view === "edit";
    const fields = [
      {
        key: "title",
        label: "Title *",
        type: "text",
        placeholder: "e.g. 2023 Toyota Camry XLE",
        full: true,
      },
      { key: "make", label: "Make *", type: "select", options: MAKES },
      {
        key: "model",
        label: "Model *",
        type: "text",
        placeholder: "e.g. Camry",
      },
      { key: "year", label: "Year", type: "number", placeholder: "2024" },
      {
        key: "mileage",
        label: "Mileage (km)",
        type: "number",
        placeholder: "45000",
      },
      {
        key: "price",
        label: "Price (KES) *",
        type: "number",
        placeholder: "1500000",
      },
      {
        key: "transmission",
        label: "Transmission",
        type: "select",
        options: TRANSMISSIONS,
      },
      {
        key: "fuel_type",
        label: "Fuel Type",
        type: "select",
        options: FUEL_TYPES,
      },
      {
        key: "body_type",
        label: "Body Type",
        type: "select",
        options: BODY_TYPES,
      },
      { key: "color", label: "Color", type: "select", options: COLORS },
      {
        key: "engine_cc",
        label: "Engine (cc)",
        type: "number",
        placeholder: "2000",
      },
      {
        key: "condition",
        label: "Condition",
        type: "select",
        options: CONDITIONS,
      },
      { key: "status", label: "Status", type: "select", options: STATUSES },
      {
        key: "description",
        label: "Description",
        type: "textarea",
        placeholder: "Enter car details…",
        full: true,
      },
    ];
    return (
      <>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 20,
          }}
        >
          <button className="btn btn-ghost" onClick={() => setView("list")}>
            <Icon name="arrow" size={16} /> Back
          </button>
        </div>
        <div
          style={{
            background: "#111318",
            border: "1px solid #1e2128",
            borderRadius: 14,
            padding: 28,
            maxWidth: 640,
          }}
        >
          <h2
            style={{
              color: "#fff",
              fontSize: 20,
              fontWeight: 600,
              marginBottom: 4,
            }}
          >
            {isEdit ? "Edit Car" : "Add New Car"}
          </h2>
          <p style={{ color: "#555", fontSize: 13, marginBottom: 24 }}>
            {isEdit
              ? "Update the details below"
              : "Fill in the details to list a new car"}
          </p>
          <div className="mgr-form-grid">
            {fields.map((f) => (
              <div
                className="mgr-form-group"
                key={f.key}
                style={f.full ? { gridColumn: "1 / -1" } : {}}
              >
                <label className="mgr-form-label">{f.label}</label>
                {f.type === "select" ? (
                  <select
                    className="mgr-select-modal"
                    value={form[f.key]}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, [f.key]: e.target.value }))
                    }
                  >
                    {f.options.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                ) : f.type === "textarea" ? (
                  <textarea
                    className="mgr-input"
                    placeholder={f.placeholder}
                    value={form[f.key]}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, [f.key]: e.target.value }))
                    }
                  />
                ) : (
                  <input
                    className="mgr-input"
                    type={f.type}
                    placeholder={f.placeholder}
                    value={form[f.key]}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, [f.key]: e.target.value }))
                    }
                  />
                )}
              </div>
            ))}
            <div className="mgr-form-group" style={{ gridColumn: "1 / -1" }}>
              <label className="mgr-form-label">
                Car Images * ({imgPreviews.length}/6)
              </label>
              <p style={{ color: "#888", fontSize: 12, marginBottom: 12 }}>
                Upload 2-6 images of your car
              </p>

              <div
                className="mgr-upload-area"
                onClick={() =>
                  imgPreviews.length < 6 &&
                  document.getElementById("img-input").click()
                }
                onDragOver={(e) => {
                  if (imgPreviews.length < 6) e.preventDefault();
                }}
                onDrop={(e) => {
                  if (imgPreviews.length < 6) {
                    e.preventDefault();
                    handleUploadImages(e.dataTransfer.files);
                  }
                }}
                style={
                  imgPreviews.length >= 6
                    ? { opacity: 0.6, cursor: "not-allowed" }
                    : {}
                }
              >
                <input
                  id="img-input"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => handleUploadImages(e.target.files)}
                  style={{ display: "none" }}
                  disabled={imgPreviews.length >= 6}
                />

                {imgPreviews.length === 0 ? (
                  <>
                    <div className="upload-icon">
                      <Icon name="img" size={32} />
                    </div>
                    <p>
                      Drag & drop or click to <span>browse</span>
                    </p>
                  </>
                ) : (
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fill, minmax(100px, 1fr))",
                      gap: 8,
                      width: "100%",
                    }}
                  >
                    {imgPreviews.map((img, idx) => (
                      <div
                        key={idx}
                        style={{
                          position: "relative",
                          paddingBottom: "100%",
                          borderRadius: 8,
                          overflow: "hidden",
                          border: "1px solid #333",
                          cursor: "pointer",
                        }}
                      >
                        <img
                          src={img}
                          alt={`preview ${idx + 1}`}
                          style={{
                            position: "absolute",
                            inset: 0,
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeImage(idx);
                          }}
                          style={{
                            position: "absolute",
                            top: 4,
                            right: 4,
                            background: "rgba(0,0,0,0.7)",
                            border: "none",
                            color: "#fff",
                            borderRadius: 4,
                            width: 24,
                            height: 24,
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 16,
                            padding: 0,
                          }}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                    {imgPreviews.length < 6 && (
                      <div
                        onClick={() =>
                          document.getElementById("img-input").click()
                        }
                        style={{
                          paddingBottom: "100%",
                          borderRadius: 8,
                          border: "2px dashed #e8a317",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          position: "relative",
                        }}
                      >
                        <div
                          style={{
                            position: "absolute",
                            textAlign: "center",
                            color: "#e8a317",
                            fontSize: 24,
                          }}
                        >
                          +
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
              {imgPreviews.length < 2 && (
                <p style={{ color: "#e8a317", fontSize: 12, marginTop: 8 }}>
                  Add at least {2 - imgPreviews.length} more
                  {2 - imgPreviews.length === 1 ? " image" : " images"}
                </p>
              )}
            </div>
          </div>
          <div className="mgr-modal-footer">
            <button className="btn btn-ghost" onClick={() => setView("list")}>
              Cancel
            </button>
            <button
              className="btn btn-primary"
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? "Saving…" : isEdit ? "Update Car" : "Add Car"}
            </button>
          </div>
        </div>
      </>
    );
  };

  // ── Confirm Delete Modal ──
  const renderConfirmDelete = () =>
    confirmDelete && (
      <div className="mgr-overlay" onClick={() => setConfirmDelete(null)}>
        <div
          className="mgr-modal"
          style={{ width: 380 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="mgr-modal-body" style={{ padding: "28px 24px 24px" }}>
            <div className="mgr-confirm-icon">
              <Icon name="trash" size={22} />
            </div>
            <div className="mgr-confirm-title">Delete this car?</div>
            <div className="mgr-confirm-desc">
              This action cannot be undone. The car listing will be permanently
              removed.
            </div>
            <div className="mgr-modal-footer">
              <button
                className="btn btn-ghost"
                onClick={() => setConfirmDelete(null)}
              >
                Cancel
              </button>
              <button
                className="btn"
                style={{ background: "#e85d5d", color: "#fff" }}
                onClick={() => deleteCar(confirmDelete)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    );

  // ── Main Render ──
  return (
    <>
      <style>{css}</style>
      <div className="mgr-root">
        {/* Sidebar */}
        <aside className="mgr-sidebar">
          <div className="flex items-center justify-center mt-4 overflow-hidden rounded w-18 h-14">
            <img
              src={Logo}
              alt="Maguru Logo"
              className="object-contain w-full h-full"
            />
          </div>
          <nav className="mgr-nav">
            {[
              { id: "dashboard", label: "Dashboard", icon: "cars" },
              {
                id: "inventory",
                label: "Inventory",
                icon: "cars",
                badge: cars.filter((c) => c.status === "Available").length,
              },
              {
                id: "users",
                label: "Users",
                icon: "cars",
              },
              {
                id: "analytics",
                label: "Analytics",
                icon: "dollar",
              },
            ].map((n) => (
              <div
                key={n.id}
                className={`mgr-nav-item ${((view === "list" || view === "detail" || view === "add" || view === "edit") && n.id === "inventory") || view === n.id ? "active" : ""}`}
                onClick={() => {
                  if (n.id === "inventory") setView("list");
                  else setView(n.id);
                }}
              >
                <Icon name={n.icon} size={18} />
                <span className="mgr-nav-label">{n.label}</span>
                {n.badge !== undefined && (
                  <span className="mgr-nav-badge">{n.badge}</span>
                )}
              </div>
            ))}
            <button
              onClick={() => {
                logout();
                navigate("/admin/login");
              }}
              className="absolute w-3/4 px-4 py-2 text-white transition-colors duration-200 transform -translate-x-1/2 bg-red-600 rounded bottom-7 left-1/2 hover:bg-red-700"
            >
              Logout
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="mgr-main">
          {/* Header */}
          <div className="mgr-header">
            <div className="mgr-header-left">
              <h1>
                {view === "detail"
                  ? "Car Details"
                  : view === "add"
                    ? "Add Car"
                    : view === "edit"
                      ? "Edit Car"
                      : view === "analytics"
                        ? "Analytics & Insights"
                        : view === "users"
                          ? "Users Management"
                          : "Inventory"}
              </h1>
              <p>
                {view === "list"
                  ? `${filtered.length} car${filtered.length !== 1 ? "s" : ""} found`
                  : view === "analytics"
                    ? "Business performance metrics"
                    : view === "users"
                      ? "Manage admin users"
                      : "Manage your car listings"}
              </p>
            </div>
            <div
              className="mgr-header-right"
              style={{ display: "flex", alignItems: "center", gap: "16px" }}
            >
              {user && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    paddingRight: "16px",
                    borderRight: "1px solid rgba(255, 255, 255, 0.1)",
                  }}
                >
                  <span style={{ fontSize: "14px", color: "#ccc" }}>
                    {user.name}
                  </span>
                  <span style={{ fontSize: "12px", color: "#666" }}>
                    ({user.email})
                  </span>
                </div>
              )}
              {view === "list" && (
                <button className="btn btn-primary" onClick={openAdd}>
                  <Icon name="plus" size={16} /> Add Car
                </button>
              )}
            </div>
          </div>

          {/* Stats (list only) */}
          {view === "list" && renderStats()}

          {/* Toolbar (list only) */}
          {view === "list" && (
            <div className="mgr-toolbar">
              <div className="mgr-search-wrap">
                <Icon name="search" size={16} />
                <input
                  className="mgr-search"
                  type="text"
                  placeholder="Search cars…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <select
                className="mgr-select"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="All">All Status</option>
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <select
                className="mgr-select"
                value={filterMake}
                onChange={(e) => setFilterMake(e.target.value)}
              >
                <option value="All">All Makes</option>
                {[...new Set(cars.map((c) => c.make))].sort().map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Views */}
          {view === "list" && renderTable()}
          {view === "detail" && renderDetail()}
          {(view === "add" || view === "edit") && renderForm()}
          {view === "analytics" && renderAnalytics()}
          {view === "users" && <UsersPage />}

          {/* Modals */}
          {renderConfirmDelete()}

          {/* Toast */}
          {toast && (
            <div className={`mgr-toast ${toast.type}`}>
              <span className="mgr-toast-icon">
                <Icon
                  name={toast.type === "success" ? "status" : "alert"}
                  size={18}
                />
              </span>
              {toast.msg}
            </div>
          )}
        </main>
      </div>
    </>
  );
}

// ─── Sample Data (fallback when API is not reachable) ──────
function sampleCars() {
  return [
    {
      id: 1,
      title: "2023 Toyota Camry XLE",
      make: "Toyota",
      model: "Camry",
      year: 2023,
      mileage: 28000,
      price: 3200000,
      transmission: "Automatic",
      fuel_type: "Petrol",
      body_type: "Sedan",
      color: "Silver",
      engine_cc: 2500,
      condition: "Good",
      status: "Available",
      description: "Well-maintained family sedan with full service history.",
      image_url: null,
    },
    {
      id: 2,
      title: "2022 Honda CR-V Sport",
      make: "Honda",
      model: "CR-V",
      year: 2022,
      mileage: 42000,
      price: 4100000,
      transmission: "Automatic",
      fuel_type: "Hybrid",
      body_type: "SUV",
      color: "Blue",
      engine_cc: 1500,
      condition: "Like New",
      status: "Available",
      description: "Hybrid SUV, excellent fuel economy. One owner.",
      image_url: null,
    },
    {
      id: 3,
      title: "2021 BMW 320i M-Sport",
      make: "BMW",
      model: "320i",
      year: 2021,
      mileage: 55000,
      price: 5800000,
      transmission: "Automatic",
      fuel_type: "Petrol",
      body_type: "Sedan",
      color: "Black",
      engine_cc: 2000,
      condition: "Good",
      status: "Sold",
      description: "M-Sport package, panoramic sunroof, full leather.",
      image_url: null,
    },
    {
      id: 4,
      title: "2023 Hyundai Tucson N-Line",
      make: "Hyundai",
      model: "Tucson",
      year: 2023,
      mileage: 12000,
      price: 3600000,
      transmission: "Automatic",
      fuel_type: "Petrol",
      body_type: "SUV",
      color: "White",
      engine_cc: 1600,
      condition: "Like New",
      status: "Reserved",
      description: "N-Line trim, loaded with tech features.",
      image_url: null,
    },
    {
      id: 5,
      title: "2020 Ford Ranger Wildtrak",
      make: "Ford",
      model: "Ranger",
      year: 2020,
      mileage: 68000,
      price: 2900000,
      transmission: "Manual",
      fuel_type: "Diesel",
      body_type: "Pickup",
      color: "Grey",
      engine_cc: 2000,
      condition: "Fair",
      status: "Available",
      description: "Wildtrak trim, tow bar fitted, 4WD.",
      image_url: null,
    },
    {
      id: 6,
      title: "2022 Volkswagen Golf GTI",
      make: "Volkswagen",
      model: "Golf",
      year: 2022,
      mileage: 33000,
      price: 3900000,
      transmission: "Manual",
      fuel_type: "Petrol",
      body_type: "Hatchback",
      color: "Red",
      engine_cc: 1800,
      condition: "Good",
      status: "On Hold",
      description: "GTI performance package, sporty and fun.",
      image_url: null,
    },
    {
      id: 7,
      title: "2023 Kia Sportage EX",
      make: "Kia",
      model: "Sportage",
      year: 2023,
      mileage: 9000,
      price: 3400000,
      transmission: "Automatic",
      fuel_type: "Petrol",
      body_type: "SUV",
      color: "Brown",
      engine_cc: 1600,
      condition: "Like New",
      status: "Available",
      description: "EX trim with Apple CarPlay and heated seats.",
      image_url: null,
    },
    {
      id: 8,
      title: "2021 Mercedes C200 Avantgarde",
      make: "Mercedes-Benz",
      model: "C200",
      year: 2021,
      mileage: 47000,
      price: 6200000,
      transmission: "Automatic",
      fuel_type: "Petrol",
      body_type: "Sedan",
      color: "Black",
      engine_cc: 1600,
      condition: "Good",
      status: "Available",
      description: "Avantgarde package, AMG-style bumpers.",
      image_url: null,
    },
  ];
}
