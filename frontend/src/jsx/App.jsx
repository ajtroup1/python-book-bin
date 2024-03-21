import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  useLocation,
} from "react-router-dom";
import Collections from "./Collections.jsx";
import AdminLogin from "./AdminLogin.jsx";
import Home from "./Home.jsx";
import AdminHome from "./AdminHome.jsx";
import BooksList from "./BooksList.jsx";

function App() {
  const [isAdmin, setIsAdmin] = useState(() => {
    // Initialize isAdmin state with the value stored in localStorage if available
    return localStorage.getItem("isAdmin") === "true";
  });

  console.clear();
  console.log("Admin Status: ", isAdmin);

  useEffect(() => {
    // Store isAdmin status in localStorage whenever it changes
    localStorage.setItem("isAdmin", isAdmin);
  }, [isAdmin]);

  const handleAdminLogin = () => {
    setIsAdmin(true);
  };

  const handleLogout = () => {
    setIsAdmin(false);
  };

  return (
    <Router>
      <div>
        {/* GUEST NAVBAR */}
        {!isAdmin && (
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
              <div className="navbar-nav" style={{ marginTop: 3 }}>
                <Link to="/home" className="nav-item nav-link">
                  Home
                </Link>
                <Link to="/collections" className="nav-item nav-link">
                  Collections
                </Link>
                <Link
                  to="/admin-login"
                  className="nav-item nav-link"
                  style={{ marginLeft: "1150px" }}
                >
                  Admin Login
                </Link>
              </div>
            </div>
          </nav>
        )}

        {/* ADMIN NAVBAR */}
        {isAdmin && (
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
              <div className="navbar-nav" style={{ marginTop: 3 }}>
                <Link to="/admin-home" className="nav-item nav-link">
                  Admin Home
                </Link>
                <Link
                  to="/"
                  className="nav-item nav-link"
                  onClick={handleLogout}
                  style={{ marginLeft: "1150px" }}
                >
                  Logout
                </Link>
              </div>
            </div>
          </nav>
        )}

        <div id="root"></div>

        {/* Define routes for different components */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/collections" element={<Collections />} />
          <Route
            path="/admin-login"
            element={<AdminLogin handleAdminLogin={handleAdminLogin} />}
          />
          <Route path="/admin-home" element={<AdminHome />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
