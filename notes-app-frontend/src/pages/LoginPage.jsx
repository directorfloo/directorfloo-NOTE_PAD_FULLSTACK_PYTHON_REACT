import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { setUser } from "../store/slices/authSlice.js";
import { useLoginMutation } from "../api/login.jsx";

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form, setForm] = useState({ identifier: "", password: "" });
  const [error, setError] = useState("");

  const [login, { isLoading }] = useLoginMutation();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.identifier.trim() || !form.password) {
      setError("Please enter your username/email and password.");
      return;
    }

    try {
      const data = await login({
        identifier: form.identifier.trim(),
        password: form.password,
      }).unwrap();

      dispatch(
          setUser({
            username: data.username,
            email: data.email,
            avatar: data.avatar || null,
            token: data.token,    // ✅ token must be included here
            refresh: data.refresh
          })
      );

      // If your backend returns a token, store it for later authenticated requests:
      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      navigate("/notes");
    } catch (err) {
      const data = err?.data;
      const message =
          data?.message ||
          data?.detail ||
          (typeof data === "object" && data
              ? Object.values(data).flat().join(" ")
              : null) ||
          "Invalid username/email or password.";
      setError(message);
    }
  };

  return (
      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-logo">📝 Notes</div>
          <h1 className="auth-title">Welcome back</h1>
          <p className="auth-subtitle">Log in to continue to your notes.</p>

          {error && <div className="auth-message auth-error">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label>Username or Email</label>
              <input name="identifier" value={form.identifier} onChange={handleChange} placeholder="janedoe or jane@example.com" />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Your password" />
            </div>
            <button type="submit" className="auth-submit" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Log In"}
            </button>
          </form>

          <p className="auth-footer">
            Don't have an account? <Link to="/register">Create one</Link>
          </p>
        </div>
      </div>
  );
}
