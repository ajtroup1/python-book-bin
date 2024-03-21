import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/AdminLogin.css";

function AdminLogin({ handleAdminLogin }) {
  const [admins, setAdmins] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    const response = await fetch("http://127.0.0.1:5000/admins");
    const data = await response.json();
    setAdmins(data.admins);
    console.log("admins received: ", data.admins); //not practical to display login info to user, but this isnt real
  };

  const checkLoginInput = () => {
    let loggedIn = false;

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const inputAdmin = {
      username: username,
      password: password,
    };

    console.log("admin info input", inputAdmin);

    let found = false;
    admins.forEach((admin) => {
      if (inputAdmin.username == admin.username) {
        found = true;
        if (inputAdmin.password == admin.password) {
          loggedIn = true;
        } else {
          alert("Incorrect password");
        }
      }
    });

    if (found == false) {
      alert("No user found with that username");
      document.getElementById("username").value = "";
    }

    document.getElementById("password").value = "";

    if (loggedIn == true) {
      handleAdminLogin(); // Update admin status upon successful login
      navigate("/admin-home");
    }
  };

  return (
    <>
      <div className="login-container">
        <h2>Admin Login</h2>
        <div className="login-form-container">
          <form>
            <div className="form-group">
              <label htmlFor="username">Username:</label>
              <input
                type="text"
                className="form-control"
                id="username"
                placeholder="Enter username"
                autoComplete="off"
              ></input>
            </div>
            <div className="form-group">
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                className="form-control"
                id="password"
                placeholder="Password"
                autoComplete="off"
              ></input>
            </div>
            <button
              type="button"
              className="btn btn-primary"
              onClick={checkLoginInput}
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default AdminLogin;
