import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAvatar } from "../store/slices/authSlice.js";
import { updateUserAvatar } from "../utils/userStore.js";
import Header from "../components/Header.jsx";

export default function ProfilePage() {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  const [notice, setNotice] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setNotice("Please choose an image file.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setNotice("Please choose an image smaller than 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result;
      dispatch(setAvatar(dataUrl));
      updateUserAvatar(user.email, dataUrl);
      setNotice("Profile picture updated.");
      setTimeout(() => setNotice(""), 2500);
    };
    reader.readAsDataURL(file);
  };

  const initials = user?.username ? user.username.charAt(0).toUpperCase() : "?";

  return (
    <div className="page">
      <Header />
      <main className="profile-main">
        <div className="profile-card">
          <div className="profile-avatar-wrap">
            {user?.avatar ? (
              <img src={user.avatar} alt={user.username} className="profile-avatar" />
            ) : (
              <div className="profile-avatar profile-avatar-fallback">{initials}</div>
            )}
            <button className="upload-btn" onClick={() => fileInputRef.current?.click()}>
              Change Photo
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              hidden
            />
            {notice && <p className="profile-notice">{notice}</p>}
          </div>

          <div className="profile-info">
            <span className="section-eyebrow">Account</span>
            <h1 className="profile-name">Hi, {user?.username}</h1>

            <div className="profile-field">
              <span className="profile-label">Username</span>
              <span className="profile-value">{user?.username}</span>
            </div>
            <div className="profile-field">
              <span className="profile-label">Email</span>
              <span className="profile-value">{user?.email}</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
