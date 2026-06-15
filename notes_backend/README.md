# Notes App — Django Backend

A Django REST API backend for the Notes App frontend (React + Redux Toolkit).

## Tech Stack

| Layer | Library |
|---|---|
| Framework | Django 4.2 |
| REST API | Django REST Framework |
| Auth | JWT via `djangorestframework-simplejwt` |
| CORS | `django-cors-headers` |
| Image uploads | Pillow |
| Database | SQLite (dev) / any Django-supported DB |

---

## Project Structure

```
notes_backend/
├── manage.py
├── requirements.txt
├── .env.example
├── notes_backend/          # Django project config
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
├── apps/
│   ├── auth_app/           # Custom user model + auth endpoints
│   │   ├── models.py       # User (extends AbstractUser, unique email, avatar)
│   │   ├── serializers.py
│   │   ├── views.py
│   │   └── urls.py
│   └── notes/              # Notes CRUD
│       ├── models.py       # Note (owner FK, title, content, timestamps)
│       ├── serializers.py
│       ├── views.py
│       └── urls.py
└── media/                  # Uploaded avatars live here
```

---

## Quick Start

```bash
# 1. Clone / unzip the project
cd notes_backend

# 2. Create & activate a virtualenv
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Copy env file (optional — defaults work for local dev)
cp .env .env

# 5. Apply migrations
python manage.py migrate

# 6. (Optional) Create a superuser
python manage.py createsuperuser

# 7. Start the dev server
python manage.py runserver
```

The API is now available at **http://localhost:8000**.

---

## API Endpoints

### Auth  (`/api/auth/`)

| Method | URL | Auth | Body | Returns |
|---|---|---|---|---|
| POST | `/api/auth/register/` | None | `{username, email, password}` | `{message}` |
| POST | `/api/auth/login/` | None | `{identifier, password}` | `{id, username, email, avatar, token, refresh}` |
| GET  | `/api/auth/me/` | Bearer | — | `{id, username, email, avatar}` |
| PATCH| `/api/auth/me/avatar/` | Bearer | `multipart: avatar=<file>` | updated user object |
| POST | `/api/auth/token/refresh/` | None | `{refresh}` | `{access}` |

> `identifier` accepts **username or email**.  
> `token` in the login response is the JWT access token; store it as `localStorage.setItem("token", data.token)` — the frontend already does this.

### Notes  (`/api/notes/`)

All endpoints require `Authorization: Bearer <token>`.

| Method | URL | Query | Body | Returns |
|---|---|---|---|---|
| GET    | `/api/notes/`      | `?search=` | — | `[Note, …]` |
| POST   | `/api/notes/`      | — | `{title, content}` | `Note` |
| GET    | `/api/notes/<id>/` | — | — | `Note` |
| PUT    | `/api/notes/<id>/` | — | `{title, content}` | `Note` |
| PATCH  | `/api/notes/<id>/` | — | partial | `Note` |
| DELETE | `/api/notes/<id>/` | — | — | `204` |

**Note schema:**
```json
{
  "id": 1,
  "title": "My Note",
  "content": "Hello world",
  "created_at": "2026-06-13T10:00:00Z",
  "updated_at": "2026-06-13T10:05:00Z"
}
```

---

## Connecting the Frontend

The frontend already reads these environment variables — create a `.env` in the React project root:

```env
VITE_AUTH_URL=http://localhost:8000/api
VITE_API_URL=http://localhost:8000/api/notes
```

### Authenticated requests

After login the frontend stores the token in `localStorage`. For the Notes API to work you need to send the token on every request. Update `src/api/note.jsx` to pass the header:

```js
baseQuery: fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: (headers) => {
    const token = localStorage.getItem("token");
    if (token) headers.set("Authorization", `Bearer ${token}`);
    return headers;
  },
}),
```

Do the same in `src/api/login.jsx` if you ever call authenticated auth endpoints.

---

## Deployment Notes

* Set `DEBUG=False` in production.
* Generate a strong `SECRET_KEY`.
* Add your domain to `ALLOWED_HOSTS` and `CORS_ALLOWED_ORIGINS`.
* Run `python manage.py collectstatic` and serve `staticfiles/` with Nginx/WhiteNoise.
* Serve `media/` through Nginx or a storage backend (S3, etc.).
* Switch `DATABASES` to PostgreSQL for production.
