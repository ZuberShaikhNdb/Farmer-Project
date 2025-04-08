// src/components/Layout.jsx
import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import BackButton from "./BackButton";

const Layout = () => {
  const location = useLocation();

  return (
    <div>
      <Navbar />
      
      {/* Show BackButton on all pages except home */}
      {location.pathname !== "/home" && location.pathname !== "/" && (
        <div style={{ padding: "10px 30px" }}>
          <BackButton />
        </div>
      )}

      {/* This renders the actual page (Home, About, Contact etc.) */}
      <Outlet />
    </div>
  );
};

export default Layout;
