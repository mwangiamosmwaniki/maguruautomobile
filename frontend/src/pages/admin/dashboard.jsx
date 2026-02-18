import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../lib/AuthContext";
import UsersPage from "./Users";
import Logo from "../../assets/images/maguruLogo.png";
import {
  fetchCars as fetchCarsFromFirebase,
  createCar as createCarFirebase,
  updateCar as updateCarFirebase,
  deleteCar as deleteCarFirebase,
  fetchDashboardStats,
  fetchInquiries as fetchInquiriesFromFirebase,
  updateInquiryStatus as updateInquiryStatusFirebase,
  deleteInquiry as deleteInquiryFirebase,
} from "../../lib/firebaseService";
import { uploadMultipleToCloudinary } from "../../lib/cloudinaryService";

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
const CONDITIONS = ["Foreign Used", "Locally Used"];
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
    menu: "M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z",
    trendUp:
      "M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z",
    trendDown:
      "M16 18l2.29-2.29-4.88-4.88-4 4L2 7.41 3.41 6l6 6 4-4 6.3 6.29L22 12v6z",
    mail: "M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z",
    phone:
      "M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z",
    check: "M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z",
    inbox:
      "M19 3H4.99c-1.11 0-1.98.89-1.98 2L3 19c0 1.1.88 2 1.99 2H19c1.1 0 2-.9 2-2V5c0-1.11-.9-2-2-2zm0 12h-4c0 1.66-1.35 3-3 3s-3-1.34-3-3H4.99V5H19v10z",
    reply: "M10 9V5l-7 7 7 7v-4.1c5 0 8.5 1.6 11 5.1-1-5-4-10-11-11z",
    eye: "M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z",
    ban: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM4 12c0-4.42 3.58-8 8-8 1.85 0 3.55.63 4.9 1.68L5.68 16.9C4.63 15.55 4 13.85 4 12zm8 8c-1.85 0-3.55-.63-4.9-1.68l11.22-11.22C19.37 8.45 20 10.15 20 12c0 4.42-3.58 8-8 8z",
  };
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      style={{ flexShrink: 0 }}
    >
      <path d={paths[name] || paths.cars} />
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

  .mgr-sidebar {
    width: 230px; min-height: 100vh; background: #111318;
    border-right: 1px solid #1e2128; display: flex; flex-direction: column;
    position: fixed; top: 0; left: 0; bottom: 0; z-index: 100;
    transition: transform 0.3s ease; transform: translateX(0);
  }
  .mgr-logo { padding: 28px 24px 24px; border-bottom: 1px solid #1e2128; }
  .mgr-logo-title { font-family: 'Bebas Neue', sans-serif; font-size: 24px; letter-spacing: 3px; color: #fff; text-transform: uppercase; }
  .mgr-logo-sub { font-size: 10px; color: #555; letter-spacing: 2px; text-transform: uppercase; margin-top: 2px; }
  .mgr-nav { padding: 16px 12px; flex: 1; }
  .mgr-nav-item {
    display: flex; align-items: center; gap: 10px;
    padding: 10px 14px; border-radius: 8px;
    color: #666; cursor: pointer; transition: all .2s; margin-bottom: 2px;
  }
  .mgr-nav-item:hover { background: #1a1d24; color: #aaa; }
  .mgr-nav-item.active { background: linear-gradient(135deg, #e8174b 0%, #f7a41f 100%); color: #ffffff; }
  .mgr-nav-item.active svg { color: #111; }
  .mgr-nav-label { font-size: 13px; font-weight: 500; }
  .mgr-nav-badge { margin-left: auto; background: #e8a317; color: #111; font-size: 10px; font-weight: 700; padding: 2px 7px; border-radius: 10px; }

  .mgr-mobile-menu-btn {
    display: none; position: fixed; top: 16px; left: 16px; z-index: 101;
    background: #111318; border: 1px solid #1e2128; border-radius: 8px;
    padding: 8px; cursor: pointer; color: #e2e4e8;
  }
  .mgr-overlay-mobile { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 99; }
  .mgr-overlay-mobile.show { display: block; }

  .mgr-main { margin-left: 230px; flex: 1; padding: 28px 32px; min-height: 100vh; width: calc(100% - 230px); }

  .mgr-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 28px; flex-wrap: wrap; gap: 16px; }
  .mgr-header-left h1 { font-family: 'Bebas Neue', sans-serif; font-size: 28px; letter-spacing: 2px; color: #fff; }
  .mgr-header-left p { color: #555; font-size: 13px; margin-top: 2px; }
  .mgr-header-right { display: flex; gap: 12px; align-items: center; flex-wrap: wrap; }

  .btn { display: inline-flex; align-items: center; gap: 7px; padding: 9px 18px; border-radius: 8px; border: none; font-family: inherit; font-size: 13px; font-weight: 600; cursor: pointer; transition: all .2s; white-space: nowrap; }
  .btn-primary { background: linear-gradient(135deg, #e8174b, #f09f1e); color: #ffffff; }
  .btn-primary:hover { background: linear-gradient(135deg, #f0b530, #e8174b); box-shadow: 0 4px 14px rgba(232,163,23,.3); }
  .btn-ghost { background: transparent; color: #888; }
  .btn-ghost:hover { color: #e2e4e8; }
  .btn-danger { background: transparent; color: #e85d5d; }
  .btn-danger:hover { background: rgba(232,93,93,.1); }
  .btn-sm { padding: 6px 12px; font-size: 12px; }

  .mgr-toolbar { display: flex; gap: 12px; align-items: center; margin-bottom: 20px; flex-wrap: wrap; }
  .mgr-search-wrap { position: relative; flex: 1; min-width: 200px; max-width: 340px; }
  .mgr-search-wrap svg { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: #555; }
  .mgr-search { width: 100%; padding: 9px 14px 9px 38px; background: #141720; border: 1px solid #1e2128; border-radius: 8px; color: #e2e4e8; font-family: inherit; font-size: 13px; outline: none; transition: border .2s; }
  .mgr-search:focus { border-color: #e8a317; }
  .mgr-search::placeholder { color: #555; }
  .mgr-select { padding: 9px 32px 9px 12px; background: #141720; border: 1px solid #1e2128; border-radius: 8px; color: #e2e4e8; font-family: inherit; font-size: 13px; outline: none; appearance: none; cursor: pointer; min-width: 130px; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='%23666'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 10px center; transition: border .2s; }
  .mgr-select:focus { border-color: #e8a317; }
  .mgr-select option { background: #111318; }

  .mgr-stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 16px; margin-bottom: 24px; }
  .mgr-stat-card { background: #111318; border: 1px solid #1e2128; border-radius: 12px; padding: 20px; position: relative; overflow: hidden; transition: border .25s; }
  .mgr-stat-card:hover { border-color: #2a2d35; }
  .mgr-stat-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; }
  .mgr-stat-card:nth-child(1)::before { background: #e8a317; }
  .mgr-stat-card:nth-child(2)::before { background: #4da6ff; }
  .mgr-stat-card:nth-child(3)::before { background: #5dcc8e; }
  .mgr-stat-card:nth-child(4)::before { background: #e85d5d; }
  .mgr-stat-icon { width: 38px; height: 38px; border-radius: 10px; display: flex; align-items: center; justify-content: center; margin-bottom: 14px; }
  .mgr-stat-card:nth-child(1) .mgr-stat-icon { background: rgba(232,163,23,.12); color: #e8a317; }
  .mgr-stat-card:nth-child(2) .mgr-stat-icon { background: rgba(77,166,255,.12); color: #4da6ff; }
  .mgr-stat-card:nth-child(3) .mgr-stat-icon { background: rgba(93,204,142,.12); color: #5dcc8e; }
  .mgr-stat-card:nth-child(4) .mgr-stat-icon { background: rgba(232,93,93,.12); color: #e85d5d; }
  .mgr-stat-label { color: #555; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; }
  .mgr-stat-value { font-family: 'Bebas Neue', sans-serif; font-size: 28px; color: #fff; letter-spacing: 1px; margin-top: 4px; }

  .mgr-table-wrap { background: #111318; border: 1px solid #1e2128; border-radius: 12px; overflow: hidden; overflow-x: auto; }
  .mgr-table { width: 100%; border-collapse: collapse; min-width: 800px; }
  .mgr-table thead { border-bottom: 1px solid #1e2128; }
  .mgr-table th { padding: 13px 16px; text-align: left; color: #555; font-size: 11px; text-transform: uppercase; letter-spacing: 1.2px; font-weight: 600; white-space: nowrap; }
  .mgr-table td { padding: 14px 16px; border-bottom: 1px solid #161921; }
  .mgr-table tr:last-child td { border-bottom: none; }
  .mgr-table tr:hover td { background: #141720; }

  .mgr-car-thumb { width: 48px; height: 36px; border-radius: 6px; background: #1a1d24; display: flex; align-items: center; justify-content: center; color: #444; overflow: hidden; }
  .mgr-car-thumb img { width: 100%; height: 100%; object-fit: cover; }
  .mgr-car-row { display: flex; align-items: center; gap: 12px; }
  .mgr-car-name { color: #fff; font-weight: 600; font-size: 13px; }
  .mgr-car-sub { color: #555; font-size: 12px; margin-top: 1px; }

  .mgr-badge { display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; letter-spacing: .3px; }
  .badge-available { background: rgba(93,204,142,.1); color: #5dcc8e; }
  .badge-sold { background: rgba(232,93,93,.1); color: #e85d5d; }
  .badge-reserved { background: rgba(232,163,23,.1); color: #e8a317; }
  .badge-on-hold { background: rgba(77,166,255,.1); color: #4da6ff; }
  .mgr-price { color: #fff; font-weight: 600; font-size: 14px; }
  .mgr-actions { display: flex; gap: 4px; }

  .mgr-toast { position: fixed; bottom: 28px; right: 32px; z-index: 999; background: #1a1d24; border: 1px solid #2a2d35; border-radius: 10px; padding: 14px 20px; display: flex; align-items: center; gap: 10px; box-shadow: 0 8px 32px rgba(0,0,0,.4); animation: toastIn .3s ease; max-width: 340px; color: #e2e4e8; font-size: 13px; }
  .mgr-toast.success .mgr-toast-icon { color: #5dcc8e; }
  .mgr-toast.error .mgr-toast-icon { color: #e85d5d; }
  @keyframes toastIn { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

  .mgr-overlay { position: fixed; inset: 0; background: rgba(0,0,0,.6); z-index: 200; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(3px); padding: 20px; }
  .mgr-modal { background: #141720; border: 1px solid #1e2128; border-radius: 14px; width: 100%; max-width: 560px; max-height: 90vh; overflow-y: auto; box-shadow: 0 20px 60px rgba(0,0,0,.5); animation: modalIn .25s ease; }
  @keyframes modalIn { from { transform: scale(.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
  .mgr-modal-header { display: flex; align-items: center; justify-content: space-between; padding: 22px 24px 16px; }
  .mgr-modal-header h2 { color: #fff; font-size: 18px; font-weight: 600; }
  .mgr-modal-body { padding: 0 24px 24px; }
  .mgr-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  .mgr-form-group { display: flex; flex-direction: column; gap: 6px; }
  .mgr-form-group.full { grid-column: 1 / -1; }
  .mgr-form-label { color: #888; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; font-weight: 600; }
  .mgr-input, .mgr-select-modal { padding: 10px 12px; background: #111318; border: 1px solid #1e2128; border-radius: 8px; color: #e2e4e8; font-family: inherit; font-size: 13px; outline: none; transition: border .2s; }
  .mgr-input:focus, .mgr-select-modal:focus { border-color: #e8a317; }
  .mgr-input::placeholder { color: #444; }
  .mgr-select-modal { appearance: none; cursor: pointer; min-width: 0; }
  .mgr-select-modal option { background: #111318; }
  textarea.mgr-input { resize: vertical; min-height: 70px; }
  .mgr-upload-area { border: 2px dashed #2a2d35; border-radius: 10px; padding: 24px; text-align: center; cursor: pointer; transition: all .2s; position: relative; }
  .mgr-upload-area:hover { border-color: #e8a317; background: rgba(232,163,23,.03); }
  .mgr-upload-area input { position: absolute; inset: 0; opacity: 0; cursor: pointer; }
  .mgr-upload-area .upload-icon { color: #444; margin-bottom: 8px; }
  .mgr-upload-area p { color: #666; font-size: 13px; }
  .mgr-upload-area p span { color: #e8a317; font-weight: 600; }
  .mgr-upload-preview { width: 100%; height: 100px; object-fit: cover; border-radius: 8px; margin-top: 10px; border: 1px solid #1e2128; }
  .mgr-modal-footer { display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px; padding-top: 18px; border-top: 1px solid #1e2128; flex-wrap: wrap; }

  .mgr-detail-hero { display: flex; gap: 28px; margin-bottom: 24px; flex-wrap: wrap; }
  .mgr-detail-img { width: 300px; height: 200px; border-radius: 14px; background: #141720; border: 1px solid #1e2128; display: flex; align-items: center; justify-content: center; color: #444; overflow: hidden; flex-shrink: 0; }
  .mgr-detail-img img { width: 100%; height: 100%; object-fit: cover; }
  .mgr-detail-info { flex: 1; display: flex; flex-direction: column; justify-content: center; min-width: 250px; }
  .mgr-detail-info h1 { font-family: 'Bebas Neue', sans-serif; font-size: 30px; letter-spacing: 1px; color: #fff; }
  .mgr-detail-info .mgr-detail-price { font-size: 22px; font-weight: 700; color: #e8a317; margin-top: 4px; }
  .mgr-detail-specs { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 14px; margin-top: 20px; }
  .mgr-spec-card { background: #141720; border: 1px solid #1e2128; border-radius: 10px; padding: 14px; }
  .mgr-spec-card .spec-label { color: #555; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; }
  .mgr-spec-card .spec-value { color: #fff; font-size: 15px; font-weight: 600; margin-top: 3px; }

  .mgr-empty { text-align: center; padding: 60px 20px; color: #444; }
  .mgr-empty svg { color: #2a2d35; margin-bottom: 12px; }
  .mgr-empty p { font-size: 15px; color: #555; }
  .mgr-spinner { width: 36px; height: 36px; border: 3px solid #1e2128; border-top-color: #e8a317; border-radius: 50%; animation: spin .7s linear infinite; margin: 40px auto; }
  @keyframes spin { to { transform: rotate(360deg); } }

  .analytics-container { display: grid; grid-template-columns: 1fr; gap: 24px; }
  .chart-card { background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 24px; }
  .chart-header { margin-bottom: 20px; }
  .chart-title { font-size: 18px; font-weight: 600; color: #fff; margin-bottom: 4px; }
  .chart-subtitle { font-size: 13px; color: #666; }
  .metrics-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 24px; }
  .metric-card { padding: 20px; border-radius: 12px; }
  .metric-label { font-size: 12px; color: #999; margin-bottom: 8px; }
  .metric-value { font-size: 24px; font-weight: bold; color: #fff; }
  .metric-change { font-size: 12px; color: #666; margin-top: 8px; display: flex; align-items: center; gap: 4px; }
  .metric-change.positive { color: #5dcc8e; }
  .metric-change.negative { color: #e85d5d; }

  .mgr-delete-overlay {
    position: fixed; inset: 0;
    background: rgba(0,0,0,0.78);
    z-index: 300;
    display: flex; align-items: center; justify-content: center;
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    padding: 20px;
    animation: fadeInOverlay 0.2s ease;
  }
  @keyframes fadeInOverlay { from { opacity: 0; } to { opacity: 1; } }

  .mgr-delete-modal {
    background: #141720;
    border: 1px solid rgba(232,23,75,0.15);
    border-radius: 22px;
    width: 100%;
    max-width: 400px;
    box-shadow: 0 40px 100px rgba(0,0,0,0.7), 0 0 60px rgba(232,23,75,0.06);
    animation: deleteModalIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
    overflow: hidden;
  }
  @keyframes deleteModalIn {
    from { transform: scale(0.82) translateY(24px); opacity: 0; }
    to   { transform: scale(1)    translateY(0);    opacity: 1; }
  }

  .mgr-delete-danger-strip {
    height: 3px;
    background: linear-gradient(90deg, #e8174b 0%, #ff6b35 40%, #e8174b 80%, #ff6b35 100%);
    background-size: 300% 100%;
    animation: stripShimmer 3s linear infinite;
  }
  @keyframes stripShimmer {
    from { background-position: 100% 0; }
    to   { background-position: -100% 0; }
  }

  .mgr-delete-body { padding: 36px 28px 28px; text-align: center; }

  .mgr-delete-icon-wrap { position: relative; width: 80px; height: 80px; margin: 0 auto 22px; }
  .mgr-delete-icon-ripple {
    position: absolute; inset: -12px;
    border-radius: 50%;
    background: rgba(232,23,75,0.08);
    animation: rippleOut 2.5s ease-in-out infinite;
  }
  .mgr-delete-icon-ripple:nth-child(2) { inset: -4px; animation-delay: 0.4s; background: rgba(232,23,75,0.12); }
  @keyframes rippleOut {
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.12); opacity: 0.5; }
  }
  .mgr-delete-icon-ring {
    position: relative; z-index: 1;
    width: 80px; height: 80px;
    border-radius: 50%;
    background: linear-gradient(135deg, rgba(232,23,75,0.15) 0%, rgba(232,23,75,0.05) 100%);
    border: 1.5px solid rgba(232,23,75,0.3);
    display: flex; align-items: center; justify-content: center;
  }
  .mgr-delete-icon-ring svg { color: #e8174b; }

  .mgr-delete-title { font-family: 'Bebas Neue', sans-serif; font-size: 28px; letter-spacing: 3px; color: #fff; margin-bottom: 8px; }
  .mgr-delete-subtitle { font-size: 13px; color: #666; line-height: 1.6; }
  .mgr-delete-car-pill {
    display: inline-flex; align-items: center; gap: 8px;
    background: rgba(232,23,75,0.07);
    border: 1px solid rgba(232,23,75,0.18);
    border-radius: 100px;
    padding: 7px 16px;
    font-size: 13px; font-weight: 600; color: #e8174b;
    margin: 14px 0;
    max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  }
  .mgr-delete-car-pill svg { flex-shrink: 0; }

  .mgr-delete-warning-box {
    display: flex; align-items: flex-start; gap: 10px;
    background: rgba(232,163,23,0.05);
    border: 1px solid rgba(232,163,23,0.12);
    border-radius: 12px;
    padding: 12px 14px;
    margin: 16px 0 24px;
    text-align: left;
  }
  .mgr-delete-warning-box svg { color: #e8a317; flex-shrink: 0; margin-top: 1px; }
  .mgr-delete-warning-box span { font-size: 12px; color: #887766; line-height: 1.5; }

  .mgr-delete-actions { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .mgr-delete-cancel {
    padding: 13px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 12px;
    color: #777; font-family: inherit; font-size: 14px; font-weight: 600;
    cursor: pointer; transition: all 0.2s; letter-spacing: 0.3px;
  }
  .mgr-delete-cancel:hover { background: rgba(255,255,255,0.08); color: #bbb; border-color: rgba(255,255,255,0.12); }

  .mgr-delete-confirm-btn {
    padding: 13px;
    background: #e8174b; border: none; border-radius: 12px;
    color: #fff; font-family: inherit; font-size: 14px; font-weight: 700;
    cursor: pointer; transition: all 0.2s; letter-spacing: 0.5px;
    position: relative; overflow: hidden;
    display: flex; align-items: center; justify-content: center; gap: 7px;
  }
  .mgr-delete-confirm-btn::after {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(to bottom, rgba(255,255,255,0.12) 0%, transparent 100%);
    pointer-events: none;
  }
  .mgr-delete-confirm-btn:hover { background: #c8103f; transform: translateY(-1px); box-shadow: 0 8px 24px rgba(232,23,75,0.45); }
  .mgr-delete-confirm-btn:active { transform: translateY(0); box-shadow: none; }

  .inq-container { display: flex; flex-direction: column; gap: 20px; }

  .inq-stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 14px; }
  .inq-stat { background: #111318; border: 1px solid #1e2128; border-radius: 12px; padding: 18px 20px; position: relative; overflow: hidden; }
  .inq-stat::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; }
  .inq-stat:nth-child(1)::before { background: #e8a317; }
  .inq-stat:nth-child(2)::before { background: #4da6ff; }
  .inq-stat:nth-child(3)::before { background: #5dcc8e; }
  .inq-stat:nth-child(4)::before { background: #888; }
  .inq-stat-label { color: #555; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; font-weight: 600; }
  .inq-stat-value { font-family: 'Bebas Neue', sans-serif; font-size: 26px; color: #fff; letter-spacing: 1px; margin-top: 4px; }

  .inq-toolbar { display: flex; gap: 10px; align-items: center; flex-wrap: wrap; }

  .inq-list { display: flex; flex-direction: column; gap: 10px; }

  .inq-card {
    background: #111318;
    border: 1px solid #1e2128;
    border-radius: 14px;
    padding: 18px 20px 18px 24px;
    transition: border-color 0.2s, box-shadow 0.2s;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .inq-card::before {
    content: ''; position: absolute; left: 0; top: 12px; bottom: 12px;
    width: 3px; border-radius: 0 3px 3px 0;
  }
  .inq-card.new::before     { background: #e8a317; }
  .inq-card.open::before    { background: #4da6ff; }
  .inq-card.replied::before { background: #5dcc8e; }
  .inq-card.closed::before  { background: #333; }
  .inq-card:hover { border-color: #2a2d35; box-shadow: 0 4px 20px rgba(0,0,0,0.3); }

  .inq-card-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 14px; }
  .inq-card-left { display: flex; align-items: flex-start; gap: 12px; flex: 1; min-width: 0; }
  .inq-card-right { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }

  .inq-avatar {
    width: 40px; height: 40px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-family: 'Bebas Neue', sans-serif; font-size: 16px;
    flex-shrink: 0; letter-spacing: 1px;
  }

  .inq-info { flex: 1; min-width: 0; }
  .inq-name { font-weight: 600; font-size: 14px; color: #fff; }
  .inq-meta { font-size: 12px; color: #555; margin-top: 3px; display: flex; gap: 6px; flex-wrap: wrap; align-items: center; }
  .inq-meta-dot { color: #2a2d35; }
  .inq-car-pill {
    display: inline-flex; align-items: center; gap: 4px;
    background: rgba(77,166,255,0.08); border: 1px solid rgba(77,166,255,0.14);
    border-radius: 6px; padding: 1px 8px;
    font-size: 11px; color: #4da6ff; font-weight: 600;
  }
  .inq-preview { font-size: 13px; color: #666; margin-top: 8px; line-height: 1.5; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

  .inq-status-badge {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 4px 11px; border-radius: 20px;
    font-size: 10px; font-weight: 700;
    letter-spacing: 0.5px; text-transform: uppercase; white-space: nowrap;
  }
  .inq-status-dot { width: 5px; height: 5px; border-radius: 50%; background: currentColor; }
  .inq-status-badge.new     { background: rgba(232,163,23,0.12); color: #e8a317; }
  .inq-status-badge.open    { background: rgba(77,166,255,0.12); color: #4da6ff; }
  .inq-status-badge.replied { background: rgba(93,204,142,0.12); color: #5dcc8e; }
  .inq-status-badge.closed  { background: rgba(100,100,100,0.1); color: #555; }
  .inq-status-badge.pending { background: rgba(232,163,23,0.12); color: #e8a317; }

  .inq-time { font-size: 11px; color: #444; white-space: nowrap; }

  .inq-expanded {
    margin-top: 16px; padding-top: 16px;
    border-top: 1px solid #1e2128;
    animation: expandDown 0.2s ease;
  }
  @keyframes expandDown { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }

  .inq-message-box {
    background: #0c0e11; border: 1px solid #1e2128;
    border-radius: 10px; padding: 14px 16px;
    font-size: 13px; color: #bbb; line-height: 1.65;
    margin-bottom: 14px;
  }

  .inq-contact-row {
    display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 10px; margin-bottom: 14px;
  }
  .inq-contact-item { background: #0c0e11; border: 1px solid #1e2128; border-radius: 8px; padding: 10px 12px; }
  .inq-contact-lbl { font-size: 10px; color: #555; text-transform: uppercase; letter-spacing: 1px; font-weight: 600; }
  .inq-contact-val { font-size: 13px; color: #ccc; margin-top: 3px; font-weight: 500; }

  .inq-btns { display: flex; gap: 8px; flex-wrap: wrap; }
  .inq-btn {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 7px 14px; border-radius: 8px; border: none;
    font-family: inherit; font-size: 12px; font-weight: 600;
    cursor: pointer; transition: all 0.2s;
  }
  .inq-btn.grad { background: linear-gradient(135deg, #e8174b, #f09f1e); color: #fff; }
  .inq-btn.grad:hover { transform: translateY(-1px); box-shadow: 0 4px 14px rgba(232,163,23,.3); }
  .inq-btn.ghost { background: rgba(255,255,255,0.04); color: #888; border: 1px solid rgba(255,255,255,0.07); }
  .inq-btn.ghost:hover { background: rgba(255,255,255,0.08); color: #ccc; }
  .inq-btn.green { background: rgba(93,204,142,0.1); color: #5dcc8e; border: 1px solid rgba(93,204,142,0.18); }
  .inq-btn.green:hover { background: rgba(93,204,142,0.16); }
  .inq-btn.red { background: rgba(232,93,93,0.08); color: #e85d5d; border: 1px solid rgba(232,93,93,0.14); }
  .inq-btn.red:hover { background: rgba(232,93,93,0.14); }

  .inq-empty { text-align: center; padding: 80px 20px; }
  .inq-empty-icon { width: 60px; height: 60px; border-radius: 14px; background: rgba(255,255,255,0.03); border: 1px solid #1e2128; display: flex; align-items: center; justify-content: center; margin: 0 auto 14px; color: #2a2d35; }
  .inq-empty p { font-size: 15px; color: #555; margin-top: 4px; }
  .inq-empty small { font-size: 12px; color: #3a3d45; }

  @media (max-width: 1024px) {
    .mgr-stats { grid-template-columns: repeat(2, 1fr); }
    .mgr-detail-specs { grid-template-columns: repeat(2, 1fr); }
  }
  @media (max-width: 768px) {
    .mgr-sidebar { width: 260px; transform: translateX(-100%); }
    .mgr-sidebar.mobile-open { transform: translateX(0); }
    .mgr-mobile-menu-btn { display: flex; align-items: center; justify-content: center; }
    .mgr-main { margin-left: 0; width: 100%; padding: 72px 20px 20px; }
    .mgr-header { flex-direction: column; align-items: flex-start; }
    .mgr-header-right { width: 100%; justify-content: flex-start; }
    .mgr-stats { grid-template-columns: 1fr; }
    .mgr-toolbar { flex-direction: column; align-items: stretch; }
    .mgr-search-wrap { max-width: 100%; }
    .mgr-select { width: 100%; }
    .mgr-form-grid { grid-template-columns: 1fr; }
    .mgr-detail-hero { flex-direction: column; }
    .mgr-detail-img { width: 100%; }
    .mgr-detail-specs { grid-template-columns: 1fr; }
    .mgr-table { font-size: 12px; }
    .mgr-table th, .mgr-table td { padding: 10px 8px; }
    .metrics-grid { grid-template-columns: 1fr; }
    .mgr-toast { left: 20px; right: 20px; bottom: 20px; }
    .mgr-delete-actions { grid-template-columns: 1fr; }
    .inq-contact-row { grid-template-columns: 1fr; }
  }
  @media (max-width: 480px) {
    .mgr-main { padding: 72px 16px 16px; }
    .mgr-header-left h1 { font-size: 24px; }
    .btn { padding: 8px 14px; font-size: 12px; }
    .mgr-stat-value { font-size: 24px; }
    .mgr-modal { margin: 0; border-radius: 0; max-height: 100vh; }
    .mgr-delete-modal { border-radius: 16px; }
  }
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

const timeAgo = (date) => {
  if (!date) return "—";
  const d = date instanceof Date ? date : new Date(date);
  const diff = Date.now() - d.getTime();
  const mins = Math.floor(diff / 60000);
  const hrs = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 60) return `${mins}m ago`;
  if (hrs < 24) return `${hrs}h ago`;
  return `${days}d ago`;
};

const avatarColors = [
  ["#e8174b", "#3a0010"],
  ["#e8a317", "#3a2800"],
  ["#4da6ff", "#001a3a"],
  ["#5dcc8e", "#00321a"],
  ["#b47fff", "#1a0040"],
  ["#ff7b50", "#3a1400"],
];

// ─── Chart Components ─────────────────────────────────────
const PieChart = ({ data, colors, size = 200 }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let currentAngle = -90;
  const segments = data.map((item, index) => {
    const angle = (item.value / total) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;
    currentAngle = endAngle;
    const radius = size / 2 - 20;
    const sx = size / 2 + radius * Math.cos((startAngle * Math.PI) / 180);
    const sy = size / 2 + radius * Math.sin((startAngle * Math.PI) / 180);
    const ex = size / 2 + radius * Math.cos((endAngle * Math.PI) / 180);
    const ey = size / 2 + radius * Math.sin((endAngle * Math.PI) / 180);
    const path = `M ${size / 2} ${size / 2} L ${sx} ${sy} A ${radius} ${radius} 0 ${angle > 180 ? 1 : 0} 1 ${ex} ${ey} Z`;
    return { path, color: colors[index % colors.length], ...item };
  });
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "32px",
        flexWrap: "wrap",
      }}
    >
      <svg width={size} height={size} style={{ flexShrink: 0 }}>
        {segments.map((s, i) => (
          <path
            key={i}
            d={s.path}
            fill={s.color}
            opacity={0.85}
            style={{ transition: "opacity .2s", cursor: "pointer" }}
            onMouseEnter={(e) => (e.target.style.opacity = 1)}
            onMouseLeave={(e) => (e.target.style.opacity = 0.85)}
          />
        ))}
      </svg>
      <div style={{ flex: 1, minWidth: "200px" }}>
        {segments.map((s, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "10px 0",
              borderBottom:
                i < segments.length - 1
                  ? "1px solid rgba(255,255,255,0.05)"
                  : "none",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div
                style={{
                  width: "12px",
                  height: "12px",
                  borderRadius: "2px",
                  background: s.color,
                }}
              />
              <span style={{ fontSize: "13px", color: "#ccc" }}>{s.label}</span>
            </div>
            <span
              style={{ fontSize: "13px", fontWeight: "600", color: s.color }}
            >
              {s.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const DoughnutChart = ({ data, colors, size = 200 }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let currentAngle = -90;
  const segments = data.map((item, index) => {
    const angle = (item.value / total) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;
    currentAngle = endAngle;
    const or = size / 2 - 20,
      ir = size / 2 - 60;
    const sx = size / 2 + or * Math.cos((startAngle * Math.PI) / 180);
    const sy = size / 2 + or * Math.sin((startAngle * Math.PI) / 180);
    const ex = size / 2 + or * Math.cos((endAngle * Math.PI) / 180);
    const ey = size / 2 + or * Math.sin((endAngle * Math.PI) / 180);
    const isx = size / 2 + ir * Math.cos((startAngle * Math.PI) / 180);
    const isy = size / 2 + ir * Math.sin((startAngle * Math.PI) / 180);
    const iex = size / 2 + ir * Math.cos((endAngle * Math.PI) / 180);
    const iey = size / 2 + ir * Math.sin((endAngle * Math.PI) / 180);
    const laf = angle > 180 ? 1 : 0;
    const path = `M ${sx} ${sy} A ${or} ${or} 0 ${laf} 1 ${ex} ${ey} L ${iex} ${iey} A ${ir} ${ir} 0 ${laf} 0 ${isx} ${isy} Z`;
    return { path, color: colors[index % colors.length], ...item };
  });
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "32px",
        flexWrap: "wrap",
      }}
    >
      <svg width={size} height={size} style={{ flexShrink: 0 }}>
        {segments.map((s, i) => (
          <path
            key={i}
            d={s.path}
            fill={s.color}
            opacity={0.8}
            style={{ transition: "opacity .2s" }}
            onMouseEnter={(e) => (e.target.style.opacity = 1)}
            onMouseLeave={(e) => (e.target.style.opacity = 0.8)}
          />
        ))}
        <circle cx={size / 2} cy={size / 2} r={size / 2 - 60} fill="#141720" />
        <text
          x={size / 2}
          y={size / 2 - 10}
          textAnchor="middle"
          fill="#fff"
          fontSize="24"
          fontWeight="bold"
        >
          {total}
        </text>
        <text
          x={size / 2}
          y={size / 2 + 15}
          textAnchor="middle"
          fill="#666"
          fontSize="12"
        >
          Total
        </text>
      </svg>
      <div style={{ flex: 1, minWidth: "200px" }}>
        {segments.map((s, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "8px 0",
              borderBottom:
                i < segments.length - 1
                  ? "1px solid rgba(255,255,255,0.05)"
                  : "none",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div
                style={{
                  width: "12px",
                  height: "12px",
                  borderRadius: "3px",
                  background: s.color,
                }}
              />
              <span style={{ fontSize: "14px", color: "#ccc" }}>{s.label}</span>
            </div>
            <span
              style={{ fontSize: "14px", fontWeight: "600", color: "#fff" }}
            >
              {s.value} ({((s.value / total) * 100).toFixed(1)}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const BarChart = ({ data, colors }) => {
  const maxValue = Math.max(...data.map((i) => i.value));
  return (
    <div style={{ width: "100%" }}>
      {data.map((item, index) => (
        <div key={index} style={{ marginBottom: "16px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "8px",
            }}
          >
            <span style={{ fontSize: "14px", color: "#ccc" }}>
              {item.label}
            </span>
            <span
              style={{ fontSize: "14px", fontWeight: "600", color: "#fff" }}
            >
              {item.value}
            </span>
          </div>
          <div
            style={{
              height: "32px",
              borderRadius: "6px",
              background: "rgba(255,255,255,0.05)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${(item.value / maxValue) * 100}%`,
                background: colors[index % colors.length],
                transition: "width .5s ease",
                display: "flex",
                alignItems: "center",
                paddingLeft: "12px",
              }}
            >
              {item.secondaryValue && (
                <span
                  style={{ fontSize: "12px", color: "#fff", fontWeight: "500" }}
                >
                  {item.secondaryValue}
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// ─── App ──────────────────────────────────────────────────
export default function MaguruAutoDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("dashboard");
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterMake, setFilterMake] = useState("All");
  const [toast, setToast] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [form, setForm] = useState(defaultForm());
  const [imgPreviews, setImgPreviews] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  // ── Inquiries state ──────────────────────────────────
  const [inquiries, setInquiries] = useState([]);
  const [inqLoading, setInqLoading] = useState(false);
  const [inqSearch, setInqSearch] = useState("");
  const [inqFilter, setInqFilter] = useState("All");
  const [expandedInq, setExpandedInq] = useState(null);

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

  const showToast = useCallback((msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3200);
  }, []);

  // ── Fetch cars ───────────────────────────────────────
  const fetchCars = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchCarsFromFirebase();
      setCars(Array.isArray(data) ? data : data.data || []);
    } catch (error) {
      console.error("Failed to fetch cars:", error);
      showToast("Failed to load cars from database", "error");
    }
    setLoading(false);
  }, [showToast]);

  // ── Fetch inquiries ──────────────────────────────────
  const fetchInquiries = useCallback(async () => {
    setInqLoading(true);
    try {
      const data = await fetchInquiriesFromFirebase();
      setInquiries(data);
    } catch (error) {
      console.error("Failed to fetch inquiries:", error);
      showToast("Failed to load inquiries", "error");
    } finally {
      setInqLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchCars();
    fetchInquiries();
  }, [fetchCars, fetchInquiries]);

  const filtered = cars.filter((c) => {
    const q = search.toLowerCase();
    const matchQ =
      !q ||
      `${c.title} ${c.make} ${c.model} ${c.color}`.toLowerCase().includes(q);
    const matchS = filterStatus === "All" || c.status === filterStatus;
    const matchM = filterMake === "All" || c.make === filterMake;
    return matchQ && matchS && matchM;
  });

  const stats = {
    total: cars.length,
    available: cars.filter((c) => c.status === "Available").length,
    sold: cars.filter((c) => c.status === "Sold").length,
    avgPrice: cars.length
      ? cars.reduce((a, c) => a + Number(c.price), 0) / cars.length
      : 0,
  };

  const openAdd = () => {
    setForm(defaultForm());
    setImgPreviews([]);
    setView("add");
    setMobileMenuOpen(false);
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
    setMobileMenuOpen(false);
  };

  const openDetail = (car) => {
    setSelected(car);
    setView("detail");
    setMobileMenuOpen(false);
  };

  const validateForm = () => {
    const errors = {};
    if (!form.title) errors.title = "Title is required";
    if (!form.make) errors.make = "Make is required";
    if (!form.model) errors.model = "Model is required";
    if (!form.price) errors.price = "Price is required";
    if (imgPreviews.length < 2) errors.images = "Minimum 2 images required";
    if (imgPreviews.length > 6) errors.images = "Maximum 6 images allowed";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
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
      if (view === "edit") {
        await updateCarFirebase(form.id, payload);
      } else {
        await createCarFirebase(payload);
      }
      await fetchCars();
      showToast(
        view === "edit" ? "Car updated successfully" : "Car added successfully",
      );
      setView("list");
    } catch (error) {
      console.error("Submit error:", error);
      showToast("Error saving car", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUploadImages = async (files) => {
    if (!files || files.length === 0) return;
    const newImages = Array.from(files);
    if (imgPreviews.length + newImages.length > 6) {
      showToast(
        `Maximum 6 images allowed. You can add ${6 - imgPreviews.length} more.`,
        "error",
      );
      return;
    }
    try {
      showToast("Uploading images to Cloudinary...", "loading");
      const urls = await uploadMultipleToCloudinary(
        newImages,
        "maguruauto/cars",
      );
      setImgPreviews((prev) => [...prev, ...urls]);
      showToast(`Successfully uploaded ${newImages.length} images`, "success");
    } catch (error) {
      showToast(
        error.message || "Failed to upload images to Cloudinary",
        "error",
      );
    }
  };

  const removeImage = (index) =>
    setImgPreviews((prev) => prev.filter((_, i) => i !== index));

  const deleteCar = async (id) => {
    try {
      await deleteCarFirebase(id);
      await fetchCars();
      setConfirmDelete(null);
      if (view === "detail") setView("list");
      showToast("Car deleted successfully");
    } catch (error) {
      showToast("Failed to delete car", "error");
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleDateString("en-KE", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return "N/A";
    }
  };

  const recentAdditions = [...cars]
    .sort((a, b) => {
      const da = a.createdAt
        ? a.createdAt.toDate
          ? a.createdAt.toDate()
          : new Date(a.createdAt)
        : new Date(0);
      const db = b.createdAt
        ? b.createdAt.toDate
          ? b.createdAt.toDate()
          : new Date(b.createdAt)
        : new Date(0);
      return db - da;
    })
    .slice(0, 5);

  const recentSales = cars
    .filter((c) => c.status === "Sold")
    .sort((a, b) => {
      const da = a.updatedAt
        ? a.updatedAt.toDate
          ? a.updatedAt.toDate()
          : new Date(a.updatedAt)
        : new Date(0);
      const db = b.updatedAt
        ? b.updatedAt.toDate
          ? b.updatedAt.toDate()
          : new Date(b.updatedAt)
        : new Date(0);
      return db - da;
    })
    .slice(0, 5);

  const topMakes = [...new Set(cars.map((c) => c.make))]
    .map((make) => ({
      name: make,
      count: cars.filter((c) => c.make === make).length,
      sold: cars.filter((c) => c.make === make && c.status === "Sold").length,
    }))
    .sort((a, b) => b.sold - a.sold)
    .slice(0, 5);

  // ── Inquiries helpers ──────────────────────────────────
  const filteredInquiries = inquiries.filter((inq) => {
    const q = inqSearch.toLowerCase();
    const carLabel = inq.carTitle || inq.carRef || "";
    const matchQ =
      !q ||
      `${inq.name} ${inq.email} ${carLabel} ${inq.message}`
        .toLowerCase()
        .includes(q);
    const matchF =
      inqFilter === "All" || inq.status === inqFilter.toLowerCase();
    return matchQ && matchF;
  });

  const updateInqStatus = async (id, newStatus) => {
    try {
      await updateInquiryStatusFirebase(id, newStatus);
      setInquiries((prev) =>
        prev.map((inq) =>
          inq.id === id ? { ...inq, status: newStatus } : inq,
        ),
      );
      showToast(`Inquiry marked as ${newStatus}`);
    } catch {
      showToast("Failed to update inquiry", "error");
    }
  };

  const deleteInquiry = async (id) => {
    try {
      await deleteInquiryFirebase(id);
      setInquiries((prev) => prev.filter((inq) => inq.id !== id));
      if (expandedInq === id) setExpandedInq(null);
      showToast("Inquiry deleted");
    } catch {
      showToast("Failed to delete inquiry", "error");
    }
  };

  const getInitials = (name) =>
    name
      .split(" ")
      .map((p) => p[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

  // ── RENDERERS ──────────────────────────────────────────

  const renderDeleteConfirmModal = () => {
    if (!confirmDelete) return null;
    const car = cars.find((c) => c.id === confirmDelete);
    const carName = car
      ? `${car.year} ${car.make} ${car.model}`
      : "this vehicle";
    return (
      <div
        className="mgr-delete-overlay"
        onClick={() => setConfirmDelete(null)}
      >
        <div className="mgr-delete-modal" onClick={(e) => e.stopPropagation()}>
          <div className="mgr-delete-danger-strip" />
          <div className="mgr-delete-body">
            <div className="mgr-delete-icon-wrap">
              <div className="mgr-delete-icon-ripple" />
              <div className="mgr-delete-icon-ripple" />
              <div className="mgr-delete-icon-ring">
                <Icon name="trash" size={28} />
              </div>
            </div>
            <div className="mgr-delete-title">Delete Listing</div>
            <div className="mgr-delete-subtitle">
              You're about to permanently remove
            </div>
            <div className="mgr-delete-car-pill">
              <Icon name="cars" size={13} />
              {carName}
            </div>
            <div className="mgr-delete-warning-box">
              <Icon name="alert" size={15} />
              <span>
                This action is irreversible. All listing data, images, and
                associated records will be permanently deleted from the system.
              </span>
            </div>
            <div className="mgr-delete-actions">
              <button
                className="mgr-delete-cancel"
                onClick={() => setConfirmDelete(null)}
              >
                Keep Listing
              </button>
              <button
                className="mgr-delete-confirm-btn"
                onClick={() => deleteCar(confirmDelete)}
              >
                <Icon name="trash" size={14} /> Yes, Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderInquiries = () => {
    if (inqLoading) return <div className="mgr-spinner" />;

    const inqStats = {
      total: inquiries.length,
      new: inquiries.filter((i) => i.status === "new" || i.status === "pending")
        .length,
      replied: inquiries.filter((i) => i.status === "replied").length,
      closed: inquiries.filter((i) => i.status === "closed").length,
    };

    return (
      <div className="inq-container">
        {/* Stats */}
        <div className="inq-stats">
          {[
            { label: "Total Inquiries", value: inqStats.total },
            { label: "New", value: inqStats.new },
            { label: "Replied", value: inqStats.replied },
            { label: "Closed", value: inqStats.closed },
          ].map((s, i) => (
            <div className="inq-stat" key={i}>
              <div className="inq-stat-label">{s.label}</div>
              <div className="inq-stat-value">{s.value}</div>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="inq-toolbar">
          <div className="mgr-search-wrap" style={{ maxWidth: 320 }}>
            <Icon name="search" size={16} />
            <input
              className="mgr-search"
              type="text"
              placeholder="Search inquiries…"
              value={inqSearch}
              onChange={(e) => setInqSearch(e.target.value)}
            />
          </div>
          <select
            className="mgr-select"
            value={inqFilter}
            onChange={(e) => setInqFilter(e.target.value)}
          >
            <option value="All">All Status</option>
            <option value="New">New</option>
            <option value="Open">Open</option>
            <option value="Replied">Replied</option>
            <option value="Closed">Closed</option>
          </select>
          <button className="btn btn-ghost btn-sm" onClick={fetchInquiries}>
            ↻ Refresh
          </button>
        </div>

        {/* List */}
        {filteredInquiries.length === 0 ? (
          <div className="inq-empty">
            <div className="inq-empty-icon">
              <Icon name="inbox" size={28} />
            </div>
            <p>No inquiries found</p>
            <small>Inquiries from your website will appear here</small>
          </div>
        ) : (
          <div className="inq-list">
            {filteredInquiries.map((inq, idx) => {
              const isExpanded = expandedInq === inq.id;
              const avatarColor = avatarColors[idx % avatarColors.length];
              const carLabel = inq.carTitle || inq.carRef || "Unknown Car";
              return (
                <div
                  key={inq.id}
                  className={`inq-card ${inq.status}`}
                  onClick={() => setExpandedInq(isExpanded ? null : inq.id)}
                >
                  <div className="inq-card-top">
                    <div className="inq-card-left">
                      <div
                        className="inq-avatar"
                        style={{
                          background: avatarColor[1],
                          color: avatarColor[0],
                          border: `1.5px solid ${avatarColor[0]}33`,
                        }}
                      >
                        {getInitials(inq.name)}
                      </div>
                      <div className="inq-info">
                        <div className="inq-name">{inq.name}</div>
                        <div className="inq-meta">
                          <span>{inq.email}</span>
                          <span className="inq-meta-dot">·</span>
                          <span className="inq-car-pill">
                            <Icon name="cars" size={10} />
                            {carLabel}
                          </span>
                        </div>
                        {!isExpanded && (
                          <div className="inq-preview">{inq.message}</div>
                        )}
                      </div>
                    </div>
                    <div className="inq-card-right">
                      <span className={`inq-status-badge ${inq.status}`}>
                        <span className="inq-status-dot" />
                        {inq.status}
                      </span>
                      <span className="inq-time">{timeAgo(inq.date)}</span>
                    </div>
                  </div>

                  {isExpanded && (
                    <div
                      className="inq-expanded"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="inq-message-box">{inq.message}</div>

                      <div className="inq-contact-row">
                        <div className="inq-contact-item">
                          <div className="inq-contact-lbl">Full Name</div>
                          <div className="inq-contact-val">{inq.name}</div>
                        </div>
                        <div className="inq-contact-item">
                          <div className="inq-contact-lbl">Email</div>
                          <div className="inq-contact-val">{inq.email}</div>
                        </div>
                        <div className="inq-contact-item">
                          <div className="inq-contact-lbl">Phone</div>
                          <div className="inq-contact-val">
                            {inq.phone || "—"}
                          </div>
                        </div>
                        <div className="inq-contact-item">
                          <div className="inq-contact-lbl">Received</div>
                          <div className="inq-contact-val">
                            {inq.date instanceof Date
                              ? inq.date.toLocaleDateString("en-KE", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })
                              : "—"}
                          </div>
                        </div>
                      </div>

                      <div className="inq-btns">
                        <a
                          href={`mailto:${inq.email}`}
                          className="inq-btn grad"
                          style={{ textDecoration: "none" }}
                        >
                          <Icon name="reply" size={13} /> Reply via Email
                        </a>
                        {inq.phone && (
                          <a
                            href={`tel:${inq.phone}`}
                            className="inq-btn ghost"
                            style={{ textDecoration: "none" }}
                          >
                            <Icon name="phone" size={13} /> Call
                          </a>
                        )}
                        {inq.status !== "replied" && (
                          <button
                            className="inq-btn green"
                            onClick={() => updateInqStatus(inq.id, "replied")}
                          >
                            <Icon name="check" size={13} /> Mark Replied
                          </button>
                        )}
                        {inq.status !== "closed" && (
                          <button
                            className="inq-btn ghost"
                            onClick={() => updateInqStatus(inq.id, "closed")}
                          >
                            <Icon name="ban" size={13} /> Close
                          </button>
                        )}
                        {inq.status !== "open" &&
                          inq.status !== "new" &&
                          inq.status !== "pending" && (
                            <button
                              className="inq-btn ghost"
                              onClick={() => updateInqStatus(inq.id, "open")}
                            >
                              <Icon name="eye" size={13} /> Reopen
                            </button>
                          )}
                        <button
                          className="inq-btn red"
                          onClick={() => deleteInquiry(inq.id)}
                        >
                          <Icon name="trash" size={13} /> Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  const renderDashboardOverview = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {renderStats()}
      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}
      >
        {/* Recent Additions */}
        <div
          style={{
            backgroundColor: "#111318",
            border: "1px solid #1e2128",
            borderRadius: "12px",
            padding: "20px",
          }}
        >
          <h3
            style={{
              marginBottom: "16px",
              fontSize: "16px",
              fontWeight: "600",
              color: "#fff",
            }}
          >
            Recent Additions
          </h3>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "12px" }}
          >
            {recentAdditions.length === 0 ? (
              <p
                style={{
                  color: "#666",
                  textAlign: "center",
                  padding: "20px 0",
                }}
              >
                No cars yet
              </p>
            ) : (
              recentAdditions.map((car, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: "12px",
                    backgroundColor: "#0c0e11",
                    borderRadius: "8px",
                    borderLeft: "3px solid #3b82f6",
                    cursor: "pointer",
                    transition: "background-color 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#15191f")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "#0c0e11")
                  }
                  onClick={() => {
                    setSelected(car);
                    setView("detail");
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "4px",
                    }}
                  >
                    <span style={{ fontWeight: "600", fontSize: "13px" }}>
                      {car.year} {car.make} {car.model}
                    </span>
                    <span style={{ fontSize: "12px", color: "#3b82f6" }}>
                      {fmt(car.price)}
                    </span>
                  </div>
                  <span style={{ fontSize: "11px", color: "#666" }}>
                    {formatDate(car.createdAt)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
        {/* Recent Sales */}
        <div
          style={{
            backgroundColor: "#111318",
            border: "1px solid #1e2128",
            borderRadius: "12px",
            padding: "20px",
          }}
        >
          <h3
            style={{
              marginBottom: "16px",
              fontSize: "16px",
              fontWeight: "600",
              color: "#fff",
            }}
          >
            Recent Sales
          </h3>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "12px" }}
          >
            {recentSales.length === 0 ? (
              <p
                style={{
                  color: "#666",
                  textAlign: "center",
                  padding: "20px 0",
                }}
              >
                No sales yet
              </p>
            ) : (
              recentSales.map((car, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: "12px",
                    backgroundColor: "#0c0e11",
                    borderRadius: "8px",
                    borderLeft: "3px solid #10b981",
                    cursor: "pointer",
                    transition: "background-color 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#15191f")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "#0c0e11")
                  }
                  onClick={() => {
                    setSelected(car);
                    setView("detail");
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "4px",
                    }}
                  >
                    <span style={{ fontWeight: "600", fontSize: "13px" }}>
                      {car.year} {car.make} {car.model}
                    </span>
                    <span style={{ fontSize: "12px", color: "#10b981" }}>
                      {fmt(car.price)}
                    </span>
                  </div>
                  <span style={{ fontSize: "11px", color: "#666" }}>
                    Sold: {formatDate(car.updatedAt)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}
      >
        {/* Top Selling Makes */}
        <div
          style={{
            backgroundColor: "#111318",
            border: "1px solid #1e2128",
            borderRadius: "12px",
            padding: "20px",
          }}
        >
          <h3
            style={{
              marginBottom: "16px",
              fontSize: "16px",
              fontWeight: "600",
              color: "#fff",
            }}
          >
            Top Selling Makes
          </h3>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "12px" }}
          >
            {topMakes.length === 0 ? (
              <p
                style={{
                  color: "#666",
                  textAlign: "center",
                  padding: "20px 0",
                }}
              >
                No data yet
              </p>
            ) : (
              topMakes.map((make, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontWeight: "600",
                        fontSize: "13px",
                        marginBottom: "2px",
                      }}
                    >
                      {make.name}
                    </div>
                    <div style={{ fontSize: "11px", color: "#666" }}>
                      {make.sold} sold of {make.count}
                    </div>
                  </div>
                  <div
                    style={{
                      width: "50px",
                      height: "30px",
                      backgroundColor: "#0c0e11",
                      borderRadius: "6px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "12px",
                      fontWeight: "600",
                      color: "#10b981",
                    }}
                  >
                    {make.sold}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        {/* Inventory Status */}
        <div
          style={{
            backgroundColor: "#111318",
            border: "1px solid #1e2128",
            borderRadius: "12px",
            padding: "20px",
          }}
        >
          <h3
            style={{
              marginBottom: "16px",
              fontSize: "16px",
              fontWeight: "600",
              color: "#fff",
            }}
          >
            Inventory Status
          </h3>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "14px" }}
          >
            {[
              {
                label: "Available",
                value: cars.filter((c) => c.status === "Available").length,
                color: "#3b82f6",
              },
              {
                label: "Sold",
                value: cars.filter((c) => c.status === "Sold").length,
                color: "#10b981",
              },
              {
                label: "Reserved",
                value: cars.filter((c) => c.status === "Reserved").length,
                color: "#f59e0b",
              },
              {
                label: "On Hold",
                value: cars.filter((c) => c.status === "On Hold").length,
                color: "#ef4444",
              },
            ].map((s, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <div
                    style={{
                      width: "10px",
                      height: "10px",
                      borderRadius: "50%",
                      backgroundColor: s.color,
                    }}
                  />
                  <span style={{ fontSize: "13px" }}>{s.label}</span>
                </div>
                <span
                  style={{
                    fontWeight: "600",
                    fontSize: "13px",
                    color: s.color,
                  }}
                >
                  {s.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

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
    const totalRevenue = cars.reduce((sum, c) => sum + parseFloat(c.price), 0);
    const avgPrice = cars.length > 0 ? totalRevenue / cars.length : 0;
    const soldCount = cars.filter((c) => c.status === "Sold").length;
    const conversionRate =
      cars.length > 0 ? (soldCount / cars.length) * 100 : 0;
    const availableCount = cars.filter((c) => c.status === "Available").length;
    const statusData = STATUSES.map((s) => ({
      label: s,
      value: cars.filter((c) => c.status === s).length,
    })).filter((s) => s.value > 0);
    const makeData = [...new Set(cars.map((c) => c.make))]
      .map((make) => ({
        label: make,
        value: cars.filter((c) => c.make === make).length,
        secondaryValue: fmt(
          cars
            .filter((c) => c.make === make)
            .reduce((s, c) => s + parseFloat(c.price), 0) /
            cars.filter((c) => c.make === make).length || 0,
        ),
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);
    const priceRanges = [
      { range: "< 1M", min: 0, max: 1e6 },
      { range: "1M-2M", min: 1e6, max: 2e6 },
      { range: "2M-3M", min: 2e6, max: 3e6 },
      { range: "3M-5M", min: 3e6, max: 5e6 },
      { range: "5M-8M", min: 5e6, max: 8e6 },
      { range: "> 8M", min: 8e6, max: Infinity },
    ];
    const priceData = priceRanges
      .map((r) => ({
        label: `KES ${r.range}`,
        value: cars.filter((c) => {
          const p = parseFloat(c.price);
          return p >= r.min && p < r.max;
        }).length,
      }))
      .filter((p) => p.value > 0);
    const fuelData = [...new Set(cars.map((c) => c.fuel_type))]
      .map((f) => ({
        label: f,
        value: cars.filter((c) => c.fuel_type === f).length,
      }))
      .sort((a, b) => b.value - a.value)
      .filter((f) => f.value > 0);

    return (
      <div className="analytics-container">
        <div className="metrics-grid">
          {[
            {
              label: "Total Revenue",
              value: fmt(totalRevenue),
              sub: `From ${cars.length} listings`,
              bg: "rgba(239,68,68,0.1)",
              border: "rgba(239,68,68,0.2)",
            },
            {
              label: "Avg Price / Car",
              value: fmt(avgPrice),
              sub: "Across all vehicles",
              bg: "rgba(59,130,246,0.1)",
              border: "rgba(59,130,246,0.2)",
            },
            {
              label: "Conversion Rate",
              value: `${conversionRate.toFixed(1)}%`,
              sub: `${soldCount} vehicles sold`,
              bg: "rgba(16,185,129,0.1)",
              border: "rgba(16,185,129,0.2)",
            },
            {
              label: "Available",
              value: availableCount,
              sub: "Ready to sell",
              bg: "rgba(168,85,247,0.1)",
              border: "rgba(168,85,247,0.2)",
            },
          ].map((m, i) => (
            <div
              key={i}
              className="metric-card"
              style={{
                background: `linear-gradient(135deg,${m.bg},${m.bg})`,
                border: `1px solid ${m.border}`,
              }}
            >
              <div className="metric-label">{m.label}</div>
              <div className="metric-value">{m.value}</div>
              <div className="metric-change">{m.sub}</div>
            </div>
          ))}
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))",
            gap: "20px",
          }}
        >
          <div className="chart-card">
            <div className="chart-header">
              <h3 className="chart-title">Vehicle Status</h3>
              <p className="chart-subtitle">Distribution of inventory status</p>
            </div>
            {statusData.length > 0 ? (
              <DoughnutChart
                data={statusData}
                colors={["#ef4444", "#3b82f6", "#10b981", "#f59e0b"]}
                size={220}
              />
            ) : (
              <p
                style={{ color: "#666", textAlign: "center", padding: "40px" }}
              >
                No data available
              </p>
            )}
          </div>
          <div className="chart-card">
            <div className="chart-header">
              <h3 className="chart-title">Top Brands</h3>
              <p className="chart-subtitle">Most stocked car makes</p>
            </div>
            {makeData.length > 0 ? (
              <BarChart
                data={makeData}
                colors={[
                  "#e8174b",
                  "#f09f1e",
                  "#4da6ff",
                  "#5dcc8e",
                  "#8b5cf6",
                  "#ec4899",
                ]}
              />
            ) : (
              <p
                style={{ color: "#666", textAlign: "center", padding: "40px" }}
              >
                No data available
              </p>
            )}
          </div>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))",
            gap: "20px",
          }}
        >
          <div className="chart-card">
            <div className="chart-header">
              <h3 className="chart-title">Price Distribution</h3>
              <p className="chart-subtitle">Vehicles by price bracket</p>
            </div>
            {priceData.length > 0 ? (
              <PieChart
                data={priceData}
                colors={[
                  "#10b981",
                  "#06b6d4",
                  "#3b82f6",
                  "#8b5cf6",
                  "#ec4899",
                  "#ef4444",
                ]}
                size={220}
              />
            ) : (
              <p
                style={{ color: "#666", textAlign: "center", padding: "40px" }}
              >
                No data available
              </p>
            )}
          </div>
          {fuelData.length > 0 && (
            <div className="chart-card">
              <div className="chart-header">
                <h3 className="chart-title">Fuel Types</h3>
                <p className="chart-subtitle">Vehicles by fuel type</p>
              </div>
              <DoughnutChart
                data={fuelData}
                colors={["#3b82f6", "#8b5cf6", "#06b6d4", "#10b981", "#f59e0b"]}
                size={220}
              />
            </div>
          )}
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
                      {c.images?.[0] ? (
                        <img src={c.images[0]} alt="" />
                      ) : c.image_url ? (
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
            flexWrap: "wrap",
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
            {c.images?.[0] ? (
              <img src={c.images[0]} alt={c.title} />
            ) : c.image_url ? (
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
                  <div>
                    <select
                      className="mgr-select-modal"
                      style={
                        formErrors[f.key] ? { borderColor: "#dc3545" } : {}
                      }
                      value={form[f.key]}
                      onChange={(e) => {
                        setForm((p) => ({ ...p, [f.key]: e.target.value }));
                        setFormErrors((p) => {
                          const n = { ...p };
                          delete n[f.key];
                          return n;
                        });
                      }}
                    >
                      {f.options.map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                    {formErrors[f.key] && (
                      <p
                        style={{ color: "#dc3545", fontSize: 12, marginTop: 4 }}
                      >
                        {formErrors[f.key]}
                      </p>
                    )}
                  </div>
                ) : f.type === "textarea" ? (
                  <div>
                    <textarea
                      className="mgr-input"
                      placeholder={f.placeholder}
                      value={form[f.key]}
                      onChange={(e) => {
                        setForm((p) => ({ ...p, [f.key]: e.target.value }));
                        setFormErrors((p) => {
                          const n = { ...p };
                          delete n[f.key];
                          return n;
                        });
                      }}
                    />
                    {formErrors[f.key] && (
                      <p
                        style={{ color: "#dc3545", fontSize: 12, marginTop: 4 }}
                      >
                        {formErrors[f.key]}
                      </p>
                    )}
                  </div>
                ) : (
                  <div>
                    <input
                      className="mgr-input"
                      type={f.type}
                      placeholder={f.placeholder}
                      style={
                        formErrors[f.key] ? { borderColor: "#dc3545" } : {}
                      }
                      value={form[f.key]}
                      onChange={(e) => {
                        setForm((p) => ({ ...p, [f.key]: e.target.value }));
                        setFormErrors((p) => {
                          const n = { ...p };
                          delete n[f.key];
                          return n;
                        });
                      }}
                    />
                    {formErrors[f.key] && (
                      <p
                        style={{ color: "#dc3545", fontSize: 12, marginTop: 4 }}
                      >
                        {formErrors[f.key]}
                      </p>
                    )}
                  </div>
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
              {formErrors.images && (
                <p style={{ color: "#dc3545", fontSize: 12, marginBottom: 12 }}>
                  {formErrors.images}
                </p>
              )}
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
                  Add at least {2 - imgPreviews.length} more{" "}
                  {2 - imgPreviews.length === 1 ? "image" : "images"}
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

  const newInqCount = inquiries.filter(
    (i) => i.status === "new" || i.status === "pending",
  ).length;

  return (
    <>
      <style>{css}</style>
      <div className="mgr-root">
        <button
          className="mgr-mobile-menu-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <Icon name="menu" size={20} />
        </button>
        <div
          className={`mgr-overlay-mobile ${mobileMenuOpen ? "show" : ""}`}
          onClick={() => setMobileMenuOpen(false)}
        />

        <aside className={`mgr-sidebar ${mobileMenuOpen ? "mobile-open" : ""}`}>
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
                id: "inquiries",
                label: "Inquiries",
                icon: "inbox",
                badge: newInqCount > 0 ? newInqCount : undefined,
              },
              { id: "users", label: "Users", icon: "cars" },
              { id: "analytics", label: "Analytics", icon: "dollar" },
            ].map((n) => (
              <div
                key={n.id}
                className={`mgr-nav-item ${view === n.id || (["list", "detail", "add", "edit"].includes(view) && n.id === "inventory") ? "active" : ""}`}
                onClick={() => {
                  if (n.id === "inventory") setView("list");
                  else setView(n.id);
                  setMobileMenuOpen(false);
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

        <main className="mgr-main">
          <div className="mgr-header">
            <div className="mgr-header-left">
              <h1>
                {view === "dashboard"
                  ? "Dashboard Overview"
                  : view === "detail"
                    ? "Car Details"
                    : view === "add"
                      ? "Add Car"
                      : view === "edit"
                        ? "Edit Car"
                        : view === "analytics"
                          ? "Analytics & Insights"
                          : view === "users"
                            ? "Users Management"
                            : view === "inquiries"
                              ? "Inquiries"
                              : "Inventory"}
              </h1>
              <p>
                {view === "dashboard"
                  ? "Quick overview of your business"
                  : view === "list"
                    ? `${filtered.length} car${filtered.length !== 1 ? "s" : ""} found`
                    : view === "analytics"
                      ? "Business performance metrics"
                      : view === "users"
                        ? "Manage admin users"
                        : view === "inquiries"
                          ? `${inquiries.length} total · ${newInqCount} new`
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
                    borderRight: "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  <span style={{ fontSize: "14px", color: "#ccc" }}>
                    {user.name}
                  </span>
                  <span
                    style={{
                      fontSize: "12px",
                      color: "#666",
                      display: window.innerWidth > 480 ? "inline" : "none",
                    }}
                  >
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

          {view === "list" && renderStats()}
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

          {view === "dashboard" && renderDashboardOverview()}
          {view === "list" && renderTable()}
          {view === "detail" && renderDetail()}
          {(view === "add" || view === "edit") && renderForm()}
          {view === "analytics" && renderAnalytics()}
          {view === "users" && <UsersPage />}
          {view === "inquiries" && renderInquiries()}

          {renderDeleteConfirmModal()}

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
