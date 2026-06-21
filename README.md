# 📝 Notes App

A full-stack notes application with user authentication, built with **React** (frontend) and **Django REST Framework** (backend).

---

## Features

- User registration and login with JWT authentication
- Create, read, update, and delete notes
- Search notes in real time
- Protected routes — only logged-in users can access notes
- Persistent login state via Redux
- Clean two-panel editor UI (sidebar + editor)

---

## Tech Stack

### Frontend
| Tool | Purpose |
|---|---|
| React 18 | UI framework |
| React Router v7 | Client-side routing |
| Redux Toolkit | Global state management |
| RTK Query | API calls & caching |
| Vite | Dev server & bundler |

### Backend
| Tool | Purpose |
|---|---|
| Django | Web framework |
| Django REST Framework | REST API |
| SimpleJWT | JWT authentication |
| django-cors-headers | CORS support |
| SQLite (default) | Database |

---

## Project Structure

```
notes-app/
├── frontend/                  # React app
│   ├── src/
│   │   ├── api/
│   │   │   ├── note.jsx       # RTK Query — CRUD endpoints
│   │   │   ├── login.jsx      # RTK Query — login endpoint
│   │   │   └── register.jsx   # RTK Query — register endpoint
│   │   ├── components/
│   │   │   ├── Header.jsx     # Top navigation bar
│   │   │   └── ProtectedRoute.jsx  # Auth guard
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── NotesPage.jsx
│   │   │   └── ProfilePage.jsx
│   │   ├── store/
│   │   │   ├── store.js
│   │   │   └── slices/authSlice.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.example
│   └── package.json
│
└── backend/                   # Django app
    ├── notes/                 # Notes CRUD app
    ├── accounts/              # Auth app (register/login)
    ├── manage.py
    └── requirements.txt
```

---

## API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register/` | Register a new user |
| `POST` | `/api/auth/login/` | Login and receive JWT token |

**Register body:**
```json
{
  "username": "janedoe",
  "email": "jane@example.com",
  "password": "secret123"
}
```

**Login body:**
```json
{
  "identifier": "janedoe or jane@example.com",
  "password": "secret123"
}
```

**Login response:**
```json
{
  "token": "eyJ...",
  "username": "janedoe",
  "email": "jane@example.com"
}
```

### Notes
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/notes/?search=keyword` | List all notes (with optional search) |
| `POST` | `/api/notes/` | Create a new note |
| `PUT` | `/api/notes/:id/` | Update a note |
| `DELETE` | `/api/notes/:id/` | Delete a note |

**Note body:**
```json
{
  "title": "My Note",
  "content": "Note content here"
}
```

---

## Getting Started

### Prerequisites
- Node.js >= 18
- Python >= 3.10

---

### Frontend Setup

```bash
# 1. Navigate to frontend folder
cd frontend

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
```

Edit `.env`:
```env
VITE_API_URL=http://localhost:8000/api/notes
VITE_AUTH_URL=http://localhost:8000/api
```

```bash
# 4. Start the dev server
npm run dev
```

App runs at **http://localhost:5173**

---

### Backend Setup

```bash
# 1. Navigate to backend folder
cd backend

# 2. Create and activate a virtual environment
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Run migrations
python manage.py migrate

# 5. Start the server
python manage.py runserver
```

API runs at **http://localhost:8000**

---

## Environment Variables

| Variable | Description | Default |
|---|---|---|
| `VITE_API_URL` | Notes API base URL | `http://localhost:8000/api/notes` |
| `VITE_AUTH_URL` | Auth API base URL | `http://localhost:8000/api` |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth Client ID (optional) | — |

---

## Pages & Routes

| Route | Page | Auth Required |
|---|---|---|
| `/register` | Create a new account | No |
| `/login` | Log into existing account | No |
| `/notes` | View and manage notes | ✅ Yes |
| `/profile` | View profile info | ✅ Yes |

Unauthenticated users attempting to visit `/notes` or `/profile` are automatically redirected to `/login`.

---

## How It Works

1. User registers at `/register` → redirected to `/login`
2. User logs in → JWT token saved to `localStorage`, user info saved to Redux store
3. `ProtectedRoute` checks Redux state before rendering `/notes` or `/profile`
4. Notes page fetches all notes on load via RTK Query
5. Creating, editing, or deleting a note automatically refreshes the list via cache invalidation

---

## License

MIT