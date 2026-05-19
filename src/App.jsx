import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Login from "./Login";
import Dashboard from "./Dashboard";

function LoginWrapper() {
  const navigate = useNavigate();

  const handleLogin = () => {
    localStorage.setItem("fitcoach_logged_in", "true");
    navigate("/dashboard");
  };

  return <Login onLogin={handleLogin} />;
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("fitcoach_logged_in") === "true"
  );

  const handleLogin = () => {
    localStorage.setItem("fitcoach_logged_in", "true");
    setIsLoggedIn(true);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
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
  );
}