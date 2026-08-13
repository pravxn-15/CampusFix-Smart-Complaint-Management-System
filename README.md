# CampusFix — Smart Complaint Management System

A premium, enterprise-grade complaint management system for colleges, hostels, and campuses —
React (Vite) frontend, Express/MongoDB backend, Student / Staff / Admin portals.

**Current state: the frontend is wired to a real backend API.** Auth, complaints, categories,
staff/user management, notifications, comments, internal notes, and feedback all go through
real HTTP calls to `/server` and persist in MongoDB — this is no longer a mock-data demo for
those flows. See [What's still mocked](#whats-still-mocked-or-unwired) for the handful of pieces
that aren't (yet).

---

## Quick start (both pieces)

```bash
# 1. Backend
cd server
npm install
cp .env.example .env        # fill in MONGO_URI at minimum — see server/README.md
npm run seed                 # populates MongoDB with the same demo data below
npm run dev                   # → http://localhost:5000

# 2. Frontend (separate terminal, from the repo root)
npm install
npm run dev                    # → http://localhost:5173
```

The frontend expects the API at `http://localhost:5000/api` by default (see `.env.example` /
`VITE_API_BASE_URL`) — no extra config needed if you're running both locally as above.

> **Note on how this was built:** written in a sandboxed environment with no network access, so
> neither `npm install` has actually been run here. Every file was syntax-checked with a
> standalone esbuild pass (frontend: bundled with all third-party packages marked external and
> both `.jsx`/`.css` loaders run to catch syntax errors in every file; backend: bundled with
> `--platform=node --packages=external`). Beyond syntax, the frontend↔backend integration was
> reviewed by hand for shape mismatches (Mongo's `_id` vs. the plain string ids the UI was
> originally built against, populated references, embedded vs. separate-collection data like
> feedback) — several real bugs were caught and fixed this way. What hasn't happened is actually
> booting both servers and clicking through it, so treat this as carefully reviewed, not
> battle-tested — expect the occasional small thing once you run it for real.

### Demo accounts

Log in at `/login` and either type credentials or tap one of the three demo account buttons.

| Role    | Email                        | Password      |
|---------|-------------------------------|---------------|
| Student | aditi.sharma@campus.edu       | `campus@123`  |
| Staff   | suresh.nair@campus.edu        | `campus@123`  |
| Admin   | vikram.singh@campus.edu       | `campus@123`  |

These exist in both `src/data/mockData.js` (frontend display copy, e.g. the demo buttons) and
`server/src/seed/seedData.js` (what actually lands in MongoDB) — kept in sync intentionally.

---

## What's implemented (real, backed by the API)

- **Auth** — register/login/logout, JWT sessions that survive a page refresh, profile edit,
  password change
- **Complaints** — raise (with real photo upload to Cloudinary), list with search/filter/paginate
  (scoped automatically by role), full detail view with timeline, status transitions (validated
  server-side against the workflow), staff assignment, comments, staff-only internal notes,
  feedback
- **Chat** — per-complaint message threads, fetched on open and sent via the API
- **Admin management** — categories, staff, and user CRUD, all persisted
- **Notifications** — created server-side on assignment/status changes, fetched and markable as
  read from the UI
- **Design system** — full token set (colors, 8px spacing, 14px radius, shadows, dark mode),
  ~25 reusable components, Framer Motion transitions, responsive layouts throughout

## What's still mocked or unwired

- **Real-time push** — the backend's Socket.IO server is fully built (JWT-authenticated, per-user
  and per-complaint rooms) but the frontend doesn't connect to it yet. Chat and notifications
  work today via plain REST (fetch on open / after an action), not live push — you won't see a
  new message appear without navigating back to it.
- **Forgot/Reset Password** — no backend endpoint exists for this yet; those two pages are still
  a pure UI demo (fake delay, no real email).
- **PDF/CSV export, QR tracking** — the admin Reports page can pull real filtered data from the
  API, but generating an actual downloadable file isn't implemented — buttons show a toast
  instead.
- **System Settings** (admin) — UI-only, doesn't persist anywhere; there's no backend concept of
  campus-wide settings yet.
- **Email notifications** — Nodemailer is wired on the backend and will send if you configure SMTP
  credentials, but nothing in the current flows is written to actually trigger one yet (only
  in-app notifications fire today).

---

## Project structure

```
campusfix/
  src/                    frontend (this file's directory)
    components/
      common/              Button, Card, Badge, form fields, Modal, etc.
      layout/               navbars, sidebar, topbar, page shells, route guards
      charts/                Chart.js wrapper components
    context/               AuthContext, DataContext (now call the real API), ThemeContext
    services/              api.js — Axios client with JWT + 401 handling
    utils/normalize.js      adapts backend Mongo shapes to the flat ids the UI expects
    data/mockData.js       demo-account display data (mirrors the backend seed)
    pages/                 public/ user/ staff/ admin/ shared/
    routes/ProtectedRoute.jsx
  server/                  backend — see server/README.md for full API reference
    src/
      models/ controllers/ routes/ middleware/ config/ utils/ seed/
```

---

## Roadmap

**Done:**
- ✅ Phase 1 — Frontend (React/Vite, full design system, all three portals)
- ✅ Phase 2 — Backend (Express/MongoDB, JWT auth, Cloudinary, Nodemailer, Socket.IO server)
- ✅ Phase 3 — Wire frontend to backend (this round — auth, complaints, categories, staff/users,
  notifications, comments/notes, feedback, chat-via-REST)

**Left:**
- Connect `socket.io-client` for live chat/notification push (backend already supports it)
- Build a real forgot-password endpoint + email flow
- PDF/CSV generation for the Reports page (data is already fetchable via `/admin/reports`)
- Deployment: Frontend → Vercel, Backend → Render, as specified
