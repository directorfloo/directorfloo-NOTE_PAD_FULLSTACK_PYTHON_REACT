# Notes App — Frontend

A React + Redux frontend with authentication (Register / Login / Logout),
a user profile with avatar upload, and the existing Notes CRUD connected
to the Django REST API.

## Project Structure

```
src/
├── main.jsx                  # Entry point, wraps app in Redux Provider
├── App.jsx                   # Routes + auth-aware redirects
├── index.css                 # Global styles (dark theme)
│
├── store/
│   ├── store.js              # Redux store config
│   └── slices/
│       └── authSlice.js      # Current session (login/logout/avatar)
│
├── utils/
│   └── userStore.js          # Local "user database" (localStorage)
│
├── components/
│   ├── Header.jsx             # Nav bar: avatar, "Hi, {username}", Logout
│   └── ProtectedRoute.jsx      # Redirects to /login if not authenticated
│
└── pages/
    ├── RegisterPage.jsx        # Registration form
    ├── LoginPage.jsx            # Login form
    ├── ProfilePage.jsx          # Profile info + avatar upload
    └── NotesPage.jsx            # Notes CRUD (Django API)
```

## Authentication Flow

1. **`/`** → redirects to `/notes` if logged in, otherwise `/register`.
2. **`/register`** → create an account (username, email, password).
   On success, redirects to `/login`.
3. **`/login`** → log in with username/email + password.
   On success, redirects to `/notes`.
4. **Log Out** → always visible in the header on every authenticated page.
5. **`/notes`** and **`/profile`** are protected — unauthenticated users are
   redirected to `/login`.

> Accounts are currently stored in `localStorage` (see `utils/userStore.js`).
> When your backend exposes `VITE_AUTH_URL` register/login endpoints, swap
> the function bodies in `userStore.js` for `fetch` calls — the page
> components don't need to change.

## Profile

- Visiting **Profile** shows the username, email, and a circular avatar.
- **Change Photo** opens a file picker; the image is converted to a data URL
  and stored against the user (and the active session), then shown
  immediately in the header and profile page.
- The header always shows a circular avatar + **"Hi, [Username]"** next to
  it, linking to `/profile`.

## Notes (existing feature)

`NotesPage.jsx` talks to the Django REST API configured via `VITE_API_URL`
in `.env` (defaults to `http://localhost:8000/api/notes`). CRUD operations
are unchanged from the previous implementation, just moved behind the
header/auth layout.

## Setup

```bash
npm install
cp .env.example .env   # fill in VITE_API_URL (and auth vars later)
npm run dev
```

App runs at **http://localhost:5173**.

## Environment Variables (`.env`)

```env
VITE_API_URL=http://localhost:8000/api/notes

# Optional — wire these up later for real backend auth / Google sign-in
VITE_AUTH_URL=
VITE_GOOGLE_CLIENT_ID=
```
