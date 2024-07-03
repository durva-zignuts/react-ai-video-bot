// LogoutButton.jsx

import React from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LogoutButton = ({ onLogout }) => {
  const handleLogout = async () => {
    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/admin/logout`);

      // Clear the token from localStorage
      localStorage.removeItem("token");

      onLogout(); // Notify parent component about successful logout
      toast.success("Logout successful!");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <button
      style={{
        backgroundColor: "#d62d20",
        color: "white",
        padding: "10px 20px",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        transition: "background-color 0.3s ease",
        height: "40px",
        fontSize: "18px",
      }}
      onClick={handleLogout}
    >
      Logout
    </button>
  );
};

export default LogoutButton;
