import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Collections from "./Collections.jsx";
import AdminLogin from "./AdminLogin.jsx";
import Home from "./Home.jsx";
import AdminHome from "./AdminHome.jsx";

function App() {
  return (
    <Router>
      <div>
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
          <img
            width="auto"
            height="40"
            alt=""
            src="./src/images/book-icon.png"
          />
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbar"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbar">
            <div className="navbar-nav">
              <Link
                to="/home"
                className="nav-item nav-link"
                style={{ marginTop: 3 }}
              >
                Home
              </Link>
              <Link
                to="/collections"
                className="nav-item nav-link"
                style={{ marginTop: 3 }}
              >
                Collections
              </Link>
              <Link
                to="/admin-login"
                className="nav-item nav-link"
                style={{ marginTop: 3, marginLeft: 1150 }}
              >
                Admin Login
              </Link>
            </div>
          </div>
        </nav>

        <div id="root"></div>

        {/* Define routes for different components */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/collections" element={<Collections />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin-home" element={<AdminHome />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
