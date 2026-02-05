import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import Layout from "./Layout";
import Home from "./pages/Home";
import Cars from "./pages/Cars";
import CarDetails from "./pages/CarDetails";
import AboutUs from "./pages/AboutUs";
import SellCar from "./pages/SellCar";
import AdminLogin from "./pages/AdminLogin";
import MaguruAutoDashboard from "./pages/admin/dashboard";
import { AuthProvider } from "./lib/AuthContext";
import { ProtectedRoute, PublicRoute } from "./lib/ProtectedRoute";

function useScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);
}

function AppRoutes() {
  useScrollToTop();

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Layout currentPageName="Home">
            <Home />
          </Layout>
        }
      />

      <Route
        path="/cars"
        element={
          <Layout currentPageName="Cars">
            <Cars />
          </Layout>
        }
      />

      <Route
        path="/cars/:id"
        element={
          <Layout currentPageName="Cars">
            <CarDetails />
          </Layout>
        }
      />

      <Route
        path="/about"
        element={
          <Layout currentPageName="AboutUs">
            <AboutUs />
          </Layout>
        }
      />

      {/* Admin Routes */}
      <Route
        path="/admin/login"
        element={
          <PublicRoute>
            <AdminLogin />
          </PublicRoute>
        }
      />
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute>
            <MaguruAutoDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <MaguruAutoDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="*"
        element={
          <Layout currentPageName="">
            <div className="p-10 text-xl text-center">Page Not Found</div>
          </Layout>
        }
      />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}
