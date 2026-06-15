import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useRegisterMutation } from "../api/register.jsx";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [register, { isLoading }] = useRegisterMutation();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.username.trim() || !form.email.trim() || !form.password) {
      setError("All fields are required.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (form.password !== form.confirm) {
      setError("Passwords do not match.");
      return;
    }

    try {
      await register({
        username: form.username.trim(),
        email: form.email.trim(),
        password: form.password,
      }).unwrap();

      setSuccess(true);
      setTimeout(() => navigate("/login"), 1000);
    } catch (err) {
      const data = err?.data;
      const message =
          data?.message ||
          data?.detail ||
          (typeof data === "object" && data
              ? Object.values(data).flat().join(" ")
              : null) ||
          "Registration failed.";
      setError(message);
    }
  };

  return (
      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-logo">📝 Notes</div>
          <h1 className="auth-title">Create your account</h1>
          <p className="auth-subtitle">Start capturing your ideas in seconds.</p>

          {error && <div className="auth-message auth-error">{error}</div>}
          {success && (
              <div className="auth-message auth-success">
                Account created! Redirecting you to log in...
              </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label>Username</label>
              <input name="username" value={form.username} onChange={handleChange} placeholder="janedoe" />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="jane@example.com" />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="At least 6 characters" />
            </div>
            <div className="form-group">
              <label>Confirm Password</label>
              <input type="password" name="confirm" value={form.confirm} onChange={handleChange} placeholder="Re-enter your password" />
            </div>
            <button type="submit" className="auth-submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Account"}
            </button>
          </form>

          <p className="auth-footer">
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        </div>
      </div>
  );
}
