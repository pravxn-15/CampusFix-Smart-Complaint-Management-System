# CampusFix — Smart Complaint Management System (Frontend)

A premium, enterprise-grade complaint management system for colleges, hostels, and campuses —
built with React (Vite), designed around Student / Staff / Admin portals.

**This is Phase 1: the frontend, running entirely on in-memory mock data.** There is no backend
yet — every "save" happens in React state and resets on page reload. See [Roadmap](#roadmap)
for what's next.

---

## Quick start

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually `http://localhost:5173`).

> **Note:** this was built in a sandboxed environment with no network access, so `npm install`
> has not been run or verified end-to-end here. Every file was hand-written and syntax-checked
> with a standalone esbuild pass (bundling with all third-party packages marked external), which
> catches JSX/syntax errors and broken imports — but it's not a substitute for actually booting
> the dev server. If `npm install` surfaces a version conflict, the fix is almost always bumping
> the dependency in `package.json` to the next compatible minor version.

### Demo accounts

Log in at `/login` and either type credentials or tap one of the three demo account buttons.

| Role    | Email                        | Password      |
|---------|-------------------------------|---------------|
| Student | aditi.sharma@campus.edu       | `campus@123`  |
| Staff   | suresh.nair@campus.edu        | `campus@123`  |
| Admin   | vikram.singh@campus.edu       | `campus@123`  |

(Any account in `src/data/mockData.js` uses the same password.)

---

## What's implemented

- **Public site** — Home (landing), About, Contact, FAQ
- **Auth flows** — Login, Register, Forgot/Reset Password (mock — no real email sent)
- **Student portal** — Dashboard, Raise Complaint (with photo upload preview), My Complaints
  (search/filter/paginate), Complaint Details (timeline, chat, feedback), Notifications,
  Messages, Feedback, Profile
- **Staff portal** — Dashboard, Assigned Complaints, Reports, Messages, Profile
- **Admin console** — Dashboard, Analytics (trends/category/priority charts + staff performance),
  Manage Complaints (assign staff inline), Manage Staff, Manage Users, Manage Categories,
  Reports (filtered export — mocked), Settings
- **Design system** — full token set (colors, 8px spacing, 14px radius, shadows, dark mode),
  ~25 reusable components (Button, Card, Badge, form fields, Modal, Pagination, FileUpload,
  Timeline, ProgressSteps, Tabs, Toggle, chart wrappers, etc.)
- Dark mode, responsive layouts (mobile sidebar drawer, responsive tables), Framer Motion page
  transitions and micro-interactions, toast notifications

## What's mocked (not yet real)

- **Data persistence** — everything lives in `DataContext`/`AuthContext` React state, seeded from
  `src/data/mockData.js`. Refreshing the page resets it.
- **Image uploads** — previewed locally via `URL.createObjectURL`, never actually uploaded
  (Cloudinary integration is a backend task).
- **Email / SMS notifications** — in-app notifications work; nothing is actually emailed or texted.
- **Chat** — messages are stored in local state, not sent over Socket.IO yet.
- **PDF/CSV export, QR tracking** — buttons exist and show a toast explaining they'll work once
  the backend is connected; no real file is generated yet.

---

## Project structure

```
src/
  assets/            static assets
  components/
    common/          Button, Card, Badge, form fields, Modal, etc. — reusable across the app
    layout/           navbars, sidebar, topbar, page shells, route guards
    charts/            Chart.js wrapper components
  context/           AuthContext, DataContext (the mock "backend"), ThemeContext
  data/              mockData.js — every seeded record
  hooks/             small reusable hooks (useClickOutside)
  pages/
    public/          Home, About, Contact, FAQ, auth pages, 404
    user/            student portal pages
    staff/           staff portal pages
    admin/           admin console pages
    shared/          pages used by more than one role (Complaint Details, Messages, Notifications, Profile)
  routes/            ProtectedRoute (role-based route guard)
  styles/            design tokens, global resets, animations
  utils/             status/priority config, date formatting, id generation
```

Routing lives in `src/App.jsx`. Each role's dashboard is nested under `DashboardLayout`, guarded
by `ProtectedRoute` so a student can't browse into `/admin/...` (and vice versa).

---

## Roadmap

**Phase 2 — Backend (Node/Express + MongoDB Atlas)**
- Mongoose models mirroring `mockData.js` (Users, Complaints, Categories, Notifications,
  Feedback, Chats, Activity Logs)
- JWT auth + bcrypt, replacing `AuthContext`'s mock login
- REST API matching the routes already implied by `DataContext`'s function names
  (`POST /api/complaints`, `PUT /api/admin/assign`, etc.)
- Swap `DataContext`/`AuthContext` internals to call Axios against the API instead of mutating
  local state — the component layer shouldn't need to change much, since it already goes through
  these contexts rather than touching mock data directly

**Phase 3 — Real integrations**
- Cloudinary for image uploads (swap `FileUpload`'s local preview for a real upload call)
- Socket.IO for live chat and real-time notifications
- Nodemailer for email notifications
- PDF generation for reports and QR-code complaint tracking

**Phase 4 — Deployment**
- Frontend → Vercel, Backend → Render, as specified
