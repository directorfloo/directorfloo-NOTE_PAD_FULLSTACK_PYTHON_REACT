// Lightweight local "database" for users, backed by localStorage.
// Swap these out for real API calls once VITE_AUTH_URL endpoints exist.

const USERS_KEY = "notes_app_users";

export const getUsers = () => {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
  } catch {
    return [];
  }
};

export const saveUsers = (users) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const findUserByEmail = (email) =>
  getUsers().find((u) => u.email.toLowerCase() === email.toLowerCase());

export const findUserByIdentifier = (identifier, password) =>
  getUsers().find(
    (u) =>
      (u.email.toLowerCase() === identifier.toLowerCase() ||
        u.username.toLowerCase() === identifier.toLowerCase()) &&
      u.password === password
  );

export const addUser = (user) => {
  const users = getUsers();
  users.push(user);
  saveUsers(users);
};

export const updateUserAvatar = (email, avatar) => {
  const users = getUsers();
  const idx = users.findIndex((u) => u.email.toLowerCase() === email.toLowerCase());
  if (idx !== -1) {
    users[idx].avatar = avatar;
    saveUsers(users);
  }
};
