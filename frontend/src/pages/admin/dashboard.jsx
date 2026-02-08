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
    transition: transform 0.3s ease;
    transform: translateX(0);
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

  /* ── Mobile Menu Button ── */
  .mgr-mobile-menu-btn {
    display: none;
    position: fixed;
    top: 16px;
    left: 16px;
    z-index: 101;
    background: #111318;
    border: 1px solid #1e2128;
    border-radius: 8px;
    padding: 8px;
    cursor: pointer;
    color: #e2e4e8;
  }
  
  .mgr-overlay-mobile {
    display: none;
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.5);
    z-index: 99;
  }
  
  .mgr-overlay-mobile.show {
    display: block;
  }

  /* ── Main ── */
  .mgr-main { 
    margin-left: 230px; 
    flex: 1; 
    padding: 28px 32px; 
    min-height: 100vh;
    width: calc(100% - 230px);
  }

  /* ── Header ── */
  .mgr-header { 
    display: flex; 
    align-items: center; 
    justify-content: space-between; 
    margin-bottom: 28px;
    flex-wrap: wrap;
    gap: 16px;
  }
  .mgr-header-left h1 { 
    font-family: 'Bebas Neue', sans-serif; 
    font-size: 28px; 
    letter-spacing: 2px; 
    color: #fff; 
  }
  .mgr-header-left p { color: #555; font-size: 13px; margin-top: 2px; }
  .mgr-header-right { display: flex; gap: 12px; align-items: center; flex-wrap: wrap; }

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
  .mgr-toolbar { 
    display: flex; 
    gap: 12px; 
    align-items: center; 
    margin-bottom: 20px; 
    flex-wrap: wrap; 
  }
  .mgr-search-wrap { 
    position: relative; 
    flex: 1; 
    min-width: 200px; 
    max-width: 340px; 
  }
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
  .mgr-stats { 
    display: grid; 
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); 
    gap: 16px; 
    margin-bottom: 24px; 
  }
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
    overflow-x: auto;
  }
  .mgr-table { width: 100%; border-collapse: collapse; min-width: 800px; }
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
    padding: 20px;
  }
  .mgr-modal {
    background: #141720; border: 1px solid #1e2128; border-radius: 14px;
    width: 100%;
    max-width: 560px; 
    max-height: 90vh; 
    overflow-y: auto;
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
    flex-wrap: wrap;
  }

  /* ── Detail View ── */
  .mgr-detail-hero { 
    display: flex; 
    gap: 28px; 
    margin-bottom: 24px;
    flex-wrap: wrap;
  }
  .mgr-detail-img {
    width: 300px; 
    height: 200px; 
    border-radius: 14px; 
    background: #141720;
    border: 1px solid #1e2128; 
    display: flex; 
    align-items: center;
    justify-content: center; 
    color: #444; 
    overflow: hidden; 
    flex-shrink: 0;
  }
  .mgr-detail-img img { width: 100%; height: 100%; object-fit: cover; }
  .mgr-detail-info { flex: 1; display: flex; flex-direction: column; justify-content: center; min-width: 250px; }
  .mgr-detail-info h1 { font-family: 'Bebas Neue', sans-serif; font-size: 30px; letter-spacing: 1px; color: #fff; }
  .mgr-detail-info .mgr-detail-price { font-size: 22px; font-weight: 700; color: #e8a317; margin-top: 4px; }
  .mgr-detail-specs {
    display: grid; 
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); 
    gap: 14px; 
    margin-top: 20px;
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

  /* ── Analytics Charts ── */
  .analytics-container {
    display: grid;
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .chart-card {
    background: rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 16px;
    padding: 24px;
  }

  .chart-header {
    margin-bottom: 20px;
  }

  .chart-title {
    font-size: 18px;
    font-weight: 600;
    color: #fff;
    margin-bottom: 4px;
  }

  .chart-subtitle {
    font-size: 13px;
    color: #666;
  }

  .metrics-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
    margin-bottom: 24px;
  }

  .metric-card {
    padding: 20px;
    border-radius: 12px;
    background: linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(249, 115, 22, 0.1) 100%);
    border: 1px solid rgba(239, 68, 68, 0.2);
  }

  .metric-label {
    font-size: 12px;
    color: #999;
    margin-bottom: 8px;
  }

  .metric-value {
    font-size: 24px;
    font-weight: bold;
    color: #fff;
  }

  .metric-change {
    font-size: 12px;
    color: #666;
    margin-top: 8px;
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .metric-change.positive {
    color: #5dcc8e;
  }

  .metric-change.negative {
    color: #e85d5d;
  }

  /* ── Responsive Design ── */
  @media (max-width: 1024px) {
    .mgr-stats {
      grid-template-columns: repeat(2, 1fr);
    }
    
    .mgr-detail-specs {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 768px) {
    .mgr-sidebar {
      width: 260px;
      transform: translateX(-100%);
    }
    
    .mgr-sidebar.mobile-open {
      transform: translateX(0);
    }
    
    .mgr-mobile-menu-btn {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .mgr-main {
      margin-left: 0;
      width: 100%;
      padding: 72px 20px 20px;
    }
    
    .mgr-header {
      flex-direction: column;
      align-items: flex-start;
    }
    
    .mgr-header-right {
      width: 100%;
      justify-content: flex-start;
    }
    
    .mgr-stats {
      grid-template-columns: 1fr;
    }
    
    .mgr-toolbar {
      flex-direction: column;
      align-items: stretch;
    }
    
    .mgr-search-wrap {
      max-width: 100%;
    }
    
    .mgr-select {
      width: 100%;
    }
    
    .mgr-form-grid {
      grid-template-columns: 1fr;
    }
    
    .mgr-detail-hero {
      flex-direction: column;
    }
    
    .mgr-detail-img {
      width: 100%;
    }
    
    .mgr-detail-specs {
      grid-template-columns: 1fr;
    }
    
    .mgr-table {
      font-size: 12px;
    }
    
    .mgr-table th,
    .mgr-table td {
      padding: 10px 8px;
    }
    
    .metrics-grid {
      grid-template-columns: 1fr;
    }
    
    .mgr-toast {
      left: 20px;
      right: 20px;
      bottom: 20px;
    }
  }

  @media (max-width: 480px) {
    .mgr-main {
      padding: 72px 16px 16px;
    }
    
    .mgr-header-left h1 {
      font-size: 24px;
    }
    
    .btn {
      padding: 8px 14px;
      font-size: 12px;
    }
    
    .mgr-stat-value {
      font-size: 24px;
    }
    
    .mgr-modal {
      margin: 0;
      border-radius: 0;
      max-height: 100vh;
    }
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

// ─── Doughnut Chart Component ──────────────────────────────
const DoughnutChart = ({ data, colors, size = 200 }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let currentAngle = -90;

  const segments = data.map((item, index) => {
    const percentage = (item.value / total) * 100;
    const angle = (percentage / 100) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;
    currentAngle = endAngle;

    const startX =
      size / 2 + (size / 2 - 20) * Math.cos((startAngle * Math.PI) / 180);
    const startY =
      size / 2 + (size / 2 - 20) * Math.sin((startAngle * Math.PI) / 180);
    const endX =
      size / 2 + (size / 2 - 20) * Math.cos((endAngle * Math.PI) / 180);
    const endY =
      size / 2 + (size / 2 - 20) * Math.sin((endAngle * Math.PI) / 180);

    const largeArcFlag = angle > 180 ? 1 : 0;

    const innerRadius = size / 2 - 60;
    const innerStartX =
      size / 2 + innerRadius * Math.cos((startAngle * Math.PI) / 180);
    const innerStartY =
      size / 2 + innerRadius * Math.sin((startAngle * Math.PI) / 180);
    const innerEndX =
      size / 2 + innerRadius * Math.cos((endAngle * Math.PI) / 180);
    const innerEndY =
      size / 2 + innerRadius * Math.sin((endAngle * Math.PI) / 180);

    const path = `
      M ${startX} ${startY}
      A ${size / 2 - 20} ${size / 2 - 20} 0 ${largeArcFlag} 1 ${endX} ${endY}
      L ${innerEndX} ${innerEndY}
      A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${innerStartX} ${innerStartY}
      Z
    `;

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
        {segments.map((segment, index) => (
          <path
            key={index}
            d={segment.path}
            fill={segment.color}
            opacity={0.8}
            style={{ transition: "opacity 0.2s" }}
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
        {segments.map((segment, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "8px 0",
              borderBottom:
                index < segments.length - 1
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
                  background: segment.color,
                }}
              />
              <span style={{ fontSize: "14px", color: "#ccc" }}>
                {segment.label}
              </span>
            </div>
            <span
              style={{ fontSize: "14px", fontWeight: "600", color: "#fff" }}
            >
              {segment.value} ({((segment.value / total) * 100).toFixed(1)}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Bar Chart Component ──────────────────────────────────
const BarChart = ({ data, colors, height = 300 }) => {
  const maxValue = Math.max(...data.map((item) => item.value));

  return (
    <div style={{ width: "100%" }}>
      {data.map((item, index) => {
        const percentage = (item.value / maxValue) * 100;
        return (
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
                background: "rgba(255, 255, 255, 0.05)",
                overflow: "hidden",
                position: "relative",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${percentage}%`,
                  background: colors[index % colors.length],
                  transition: "width 0.5s ease",
                  display: "flex",
                  alignItems: "center",
                  paddingLeft: "12px",
                }}
              >
                {item.secondaryValue && (
                  <span
                    style={{
                      fontSize: "12px",
                      color: "#fff",
                      fontWeight: "500",
                    }}
                  >
                    {item.secondaryValue}
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ─── App ──────────────────────────────────────────────────
export default function MaguruAutoDashboard() {
  const navigate = useNavigate();
  const { user, token, logout } = useAuth();

  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("list");
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

  const fetchCars = useCallback(async () => {
    setLoading(true);
    try {
      const headers = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const res = await fetch(`${API_BASE}/cars`, { headers });

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
      setCars(Array.isArray(data) ? data : data.data || []);
    } catch (error) {
      console.error("Failed to fetch cars:", error);
      showToast("Failed to load cars from database", "error");
    }
    setLoading(false);
  }, [showToast, token, logout, navigate]);

  useEffect(() => {
    fetchCars();
  }, [fetchCars]);

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
        const preview = URL.createObjectURL(file);
        uploadedImages.push(preview);

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
    const statusData = STATUSES.map((status) => ({
      label: status,
      value: cars.filter((c) => c.status === status).length,
    }));

    const makeData = [...new Set(cars.map((c) => c.make))]
      .map((make) => ({
        label: make,
        value: cars.filter((c) => c.make === make).length,
        secondaryValue: fmt(
          cars
            .filter((c) => c.make === make)
            .reduce((sum, c) => sum + parseFloat(c.price), 0) /
            cars.filter((c) => c.make === make).length || 0,
        ),
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);

    const bodyTypeData = [...new Set(cars.map((c) => c.body_type))]
      .map((type) => ({
        label: type,
        value: cars.filter((c) => c.body_type === type).length,
      }))
      .sort((a, b) => b.value - a.value);

    const priceRanges = [
      { range: "< 1M", min: 0, max: 1000000 },
      { range: "1M - 2M", min: 1000000, max: 2000000 },
      { range: "2M - 3M", min: 2000000, max: 3000000 },
      { range: "3M - 5M", min: 3000000, max: 5000000 },
      { range: "5M - 8M", min: 5000000, max: 8000000 },
      { range: "> 8M", min: 8000000, max: Infinity },
    ];

    const priceData = priceRanges.map((range) => ({
      label: `KES ${range.range}`,
      value: cars.filter((car) => {
        const price = parseFloat(car.price);
        return price >= range.min && price < range.max;
      }).length,
    }));

    const totalRevenue = cars.reduce((sum, c) => sum + parseFloat(c.price), 0);
    const avgPrice = cars.length > 0 ? totalRevenue / cars.length : 0;
    const soldCount = cars.filter((c) => c.status === "Sold").length;
    const conversionRate =
      cars.length > 0 ? (soldCount / cars.length) * 100 : 0;

    const statusColors = ["#ef4444", "#3b82f6", "#10b981", "#f59e0b"];
    const makeColors = [
      "#e8174b",
      "#f09f1e",
      "#4da6ff",
      "#5dcc8e",
      "#8b5cf6",
      "#ec4899",
      "#06b6d4",
      "#f97316",
    ];
    const bodyTypeColors = [
      "#3b82f6",
      "#8b5cf6",
      "#06b6d4",
      "#10b981",
      "#f59e0b",
      "#ef4444",
    ];
    const priceColors = [
      "#10b981",
      "#06b6d4",
      "#3b82f6",
      "#8b5cf6",
      "#ec4899",
      "#ef4444",
    ];

    return (
      <div className="analytics-container">
        {/* Key Metrics */}
        <div className="metrics-grid">
          <div
            className="metric-card"
            style={{
              background:
                "linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(249, 115, 22, 0.1) 100%)",
              border: "1px solid rgba(239, 68, 68, 0.2)",
            }}
          >
            <div className="metric-label">Total Revenue</div>
            <div className="metric-value">{fmt(totalRevenue)}</div>
            <div className="metric-change">From {cars.length} listings</div>
          </div>

          <div
            className="metric-card"
            style={{
              background:
                "linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(99, 102, 241, 0.1) 100%)",
              border: "1px solid rgba(59, 130, 246, 0.2)",
            }}
          >
            <div className="metric-label">Avg Price per Car</div>
            <div className="metric-value">{fmt(avgPrice)}</div>
            <div className="metric-change">Across all vehicles</div>
          </div>

          <div
            className="metric-card"
            style={{
              background:
                "linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(34, 197, 94, 0.1) 100%)",
              border: "1px solid rgba(16, 185, 129, 0.2)",
            }}
          >
            <div className="metric-label">Listed Vehicles</div>
            <div className="metric-value">{cars.length}</div>
            <div className="metric-change">
              <Icon name="trendUp" size={14} />
              {cars.filter((c) => c.status === "Available").length} available
            </div>
          </div>

          <div
            className="metric-card"
            style={{
              background:
                "linear-gradient(135deg, rgba(168, 85, 247, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)",
              border: "1px solid rgba(168, 85, 247, 0.2)",
            }}
          >
            <div className="metric-label">Conversion Rate</div>
            <div className="metric-value">{conversionRate.toFixed(1)}%</div>
            <div className="metric-change">{soldCount} vehicles sold</div>
          </div>
        </div>

        {/* Status Distribution - Doughnut Chart */}
        <div className="chart-card">
          <div className="chart-header">
            <h3 className="chart-title">Vehicle Status Distribution</h3>
            <p className="chart-subtitle">Current inventory status breakdown</p>
          </div>
          <DoughnutChart data={statusData} colors={statusColors} size={240} />
        </div>

        {/* Top Makes - Bar Chart */}
        <div className="chart-card">
          <div className="chart-header">
            <h3 className="chart-title">Top Car Makes</h3>
            <p className="chart-subtitle">
              Most popular brands with average prices
            </p>
          </div>
          <BarChart data={makeData} colors={makeColors} />
        </div>

        {/* Body Type & Price Range */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "20px",
          }}
        >
          <div className="chart-card">
            <div className="chart-header">
              <h3 className="chart-title">Vehicle Type Distribution</h3>
              <p className="chart-subtitle">Breakdown by body type</p>
            </div>
            <BarChart data={bodyTypeData} colors={bodyTypeColors} />
          </div>

          <div className="chart-card">
            <div className="chart-header">
              <h3 className="chart-title">Price Range Distribution</h3>
              <p className="chart-subtitle">Vehicles by price bracket</p>
            </div>
            <BarChart data={priceData} colors={priceColors} />
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

  const renderConfirmDelete = () =>
    confirmDelete && (
      <div className="mgr-overlay" onClick={() => setConfirmDelete(null)}>
        <div
          className="mgr-modal"
          style={{ width: 380, maxWidth: "90%" }}
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

  return (
    <>
      <style>{css}</style>
      <div className="mgr-root">
        {/* Mobile Menu Button */}
        <button
          className="mgr-mobile-menu-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <Icon name="menu" size={20} />
        </button>

        {/* Mobile Overlay */}
        <div
          className={`mgr-overlay-mobile ${mobileMenuOpen ? "show" : ""}`}
          onClick={() => setMobileMenuOpen(false)}
        />

        {/* Sidebar */}
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
