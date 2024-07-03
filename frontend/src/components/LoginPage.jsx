// LoginPage.jsx

import React, { useState } from "react";
import axios from "axios";
import "../LoginForm.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!email || !password) {
        setError("Please fill in all fields.");
      }
      if (email && password) {
        const response = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/admin/login`,
          {
            email,
            password,
          }
        );

        // Assuming your API responds with a success message or token upon successful login
        const token = response.data.token;

        // Store the token in localStorage
        localStorage.setItem("token", token);

        // Call onLogin to notify parent component (App.jsx) about successful login
        onLogin();
        toast.success("Login successful!");
      }
    } catch (error) {
      // console.error("Login failed:", error.response.data);
      // setError(error.response.data.message);
      console.log(error);
    }
  };

  return (
    <div className="login-container">
      <div className="login-content">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button className="login-button" type="submit">
            Login
          </button>
        </form>
        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
};

export default LoginPage;
