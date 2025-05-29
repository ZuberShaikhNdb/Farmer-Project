import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import BackButton from "./BackButton";

const Layout = () => {
  const location = useLocation();
  const { pathname } = location;

  // Login page is at "/"
  const isLoginPage = pathname === "/";

  return (
    <div>
      {/* Show Navbar on all pages except login */}
      {!isLoginPage && <Navbar />}

      {/* Show BackButton on all pages except login and home */}
      {!isLoginPage && pathname !== "/home" && (
        <div style={{ padding: "10px 30px" }}>
          <BackButton />
        </div>
      )}

      <Outlet />
    </div>
  );
};

export default Layout;
