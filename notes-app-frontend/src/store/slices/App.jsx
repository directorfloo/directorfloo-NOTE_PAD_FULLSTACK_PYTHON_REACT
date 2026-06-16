import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { useSelector } from "react-redux";

import RegisterPage from "../../pages/RegisterPage.jsx";
import LoginPage from "../../pages/LoginPage.jsx";
import ProfilePage from "../../pages/ProfilePage.jsx";
import NotesPage from "../../pages/NotesPage.jsx";
import ProtectedRoute from "../../components/ProtectedRoute.jsx";

export default function App() {
  const user = useSelector((state) => state.auth.user);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Navigate to={user ? "/notes" : "/register"} replace />}
        />

        <Route
          path="/register"
          element={user ? <Navigate to="/notes" replace /> : <RegisterPage />}
        />
        <Route
          path="/login"
          element={user ? <Navigate to="/notes" replace /> : <LoginPage />}
        />

        <Route
          path="/notes"
          element={
            <ProtectedRoute>
              <NotesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
