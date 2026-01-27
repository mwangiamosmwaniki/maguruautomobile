import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./Layout";

// Import your pages
import Home from "./pages/Home";
import Cars from "./pages/Cars";
import CarDetails from "./pages/CarDetails";
import SellCar from "./pages/SellCar";
import AboutUs from "./pages/AboutUs";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Home Page */}
        <Route
          path="/"
          element={
            <Layout currentPageName="Home">
              <Home />
            </Layout>
          }
        />

        {/* Cars Listing */}
        <Route
          path="/cars"
          element={
            <Layout currentPageName="Cars">
              <Cars />
            </Layout>
          }
        />

        {/* Car Details (dynamic route with :id) */}
        <Route
          path="/cars/:id"
          element={
            <Layout currentPageName="Cars">
              <CarDetails />
            </Layout>
          }
        />

        {/* About Us */}
        <Route
          path="/about"
          element={
            <Layout currentPageName="AboutUs">
              <AboutUs />
            </Layout>
          }
        />

        {/* Sell Your Car */}
        {/* <Route
          path="/sellcar"
          element={
            <Layout currentPageName="SellCar">
              <SellCar />
            </Layout>
          }
        /> */}

        {/* Fallback route */}
        <Route
          path="*"
          element={
            <Layout currentPageName="">
              <div className="p-10 text-center text-xl">Page Not Found</div>
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
}
