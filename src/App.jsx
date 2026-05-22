import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import PrivacyPopup from "./PrivacyPopup";
import ProtectedRoute from './ProtectedRoute';
import Login from './Login';
import Dashboard from './Dashboard';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>

        <PrivacyPopup />
        <h1 style={{color:"white", position:"fixed", zIndex:999999}}>
TEST TEXT
</h1>

        <Routes>
          <Route path="/login" element={<Login />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>

      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;