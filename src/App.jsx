import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Login";
import Dashboard from "./Dashboard";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("fitcoach_logged_in") === "true"
  );

  return (
<<<<<<< HEAD
    <div style={{ textAlign: "center" }}>
      <h1>AI Fitness Coach - Camera Test</h1>

      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        style={{
          width: "400px",
          height: "300px",
          border: "2px solid black",
          background: "black",
        }}
      />
    </div>
=======
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={<Login onLogin={() => setIsLoggedIn(true)} />}
        />
        <Route
          path="/dashboard"
          element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="*"
          element={<Navigate to={isLoggedIn ? "/dashboard" : "/login"} />}
        />
      </Routes>
    </BrowserRouter>
>>>>>>> 9e0807c (clean upload)
  );
}