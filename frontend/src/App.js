import "./App.css";

import VoiceInput from "./components/index";
import { Canvas } from "@react-three/fiber";
import { Experience } from "./components/Experience";
import SpeechRecognitionProvider from "./hooks/useSpeechToText";
import React, { useState, useEffect } from "react";
import LoginPage from "./components/LoginPage";
import LogoutButton from "./components/LogoutButton";
import { ToastContainer } from "react-toastify";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if token exists in localStorage
    const token = localStorage.getItem("token");
    if (token) {
      // Validate token (optional step)
      // For simplicity, assume token is valid if it exists in localStorage
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false); // Update the isLoggedIn state upon logout
    // Additional logout logic can be added here
  };

  return (
    <>
      <ToastContainer />

      <SpeechRecognitionProvider>
        {!isLoggedIn ? (
          <LoginPage onLogin={handleLogin} />
        ) : (
          <>
            <div
              style={{
                position: "absolute",
                top: "20px", // Adjust top position as needed
                right: "20px", // Adjust right position as needed
                zIndex: 1000,
              }}
            >
              <LogoutButton onLogout={handleLogout} />
            </div>
            <Canvas
              style={{
                height: "calc(90vh - 50px)",
                width: "88vw",
                padding: "1%",
                paddingLeft: "90px",
                paddingTop: "60px",
              }}
              shadows
              camera={{ position: [0, 0, 8], fov: 42 }}
            >
              <color attach="background" args={["#ececec"]} />
              <Experience />
            </Canvas>
          </>
        )}
        {isLoggedIn && <VoiceInput />}
      </SpeechRecognitionProvider>
    </>
  );
}

export default App;
