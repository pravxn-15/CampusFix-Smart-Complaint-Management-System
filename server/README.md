# CampusFix API (Express + MongoDB)

The backend for CampusFix — JWT auth, role-based access (student/staff/admin), MongoDB Atlas via
Mongoose, Cloudinary image uploads, Nodemailer notifications, and Socket.IO for live chat and
real-time notification delivery.

## Setup

```bash
cd server
npm install
cp .env.example .env   # then fill in MONGO_URI, JWT_SECRET, Cloudinary + SMTP creds
npm run seed            # populates the database with the same demo data the frontend mocks
npm run dev              # starts the API on http://localhost:5000
```

> Built in a sandboxed environment with no network access, so `npm install` hasn't been run here
> — the code was validated with a standalone esbuild bundle check (`--platform=node
> --packages=external`, which treats every npm dependency as external and just verifies syntax +
> internal imports resolve). Logic was reviewed by hand, but there's no substitute for actually
> booting it against a real MongoDB Atlas cluster — expect to fix the occasional small thing.

You'll need, at minimum, a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster and its
connection string for `MONGO_URI`. Cloudinary and SMTP are optional — image uploads and emails are
skipped gracefully (with a console warning) if those env vars are left blank, so the API still
runs without them.

### Demo accounts (after `npm run seed`)

Same accounts and password as the frontend mock — see the root [README](../README.md).

## API reference

All routes are prefixed with `/api`. Protected routes expect `Authorization: Bearer <token>`.

| Method | Route | Access | Notes |
|---|---|---|---|
| POST | `/auth/register` | Public | Creates a student account |
| POST | `/auth/login` | Public | Any role |
| GET | `/auth/profile` | Private | |
| PUT | `/auth/profile` | Private | |
| PUT | `/auth/change-password` | Private | |
| GET | `/complaints` | Private | Scoped by role; `?status&category&priority&search&page&limit` |
| POST | `/complaints` | user | `multipart/form-data`, field `images` (up to 4) |
| GET | `/complaints/:id` | owner / assigned staff / admin | |
| PUT | `/complaints/:id` | owner (while Pending) / admin | Edit title/description/location/priority |
| DELETE | `/complaints/:id` | admin | |
| PUT | `/complaints/:id/assign` | admin | body: `{ staffId }` |
| PUT | `/complaints/:id/status` | assigned staff / admin | body: `{ status, note }` — validated against the workflow |
| POST | `/complaints/:id/comments` | owner / assigned staff / admin | body: `{ text }` |
| POST | `/complaints/:id/notes` | staff / admin | Internal — never returned to the student |
| POST | `/complaints/:id/feedback` | owner | body: `{ rating, comment }`, only once Resolved |
| GET/POST | `/complaints/:id/messages` | participants | Chat history / send message (also emitted over Socket.IO) |
| GET | `/categories` | Private | |
| POST/PUT/DELETE | `/categories(/:id)` | admin | |
| GET | `/notifications` | Private | |
| PUT | `/notifications/read` | Private | Mark all read |
| PUT | `/notifications/:id/read` | Private | |
| GET | `/staff` | admin | Includes live active-assignment counts |
| POST/PUT/DELETE | `/staff(/:id)` | admin | |
| GET | `/users` | admin | `?search&page&limit` |
| DELETE | `/users/:id` | admin | |
| GET | `/admin/dashboard` | admin | Stat cards, status/category breakdowns, recent activity, top staff |
| GET | `/admin/reports` | admin | `?rangeDays&category` |
| GET | `/admin/activity` | admin | Paginated activity log |

## Socket.IO

Connect with `io(url, { auth: { token: jwt } })`. Events:

- `complaint:join` / `complaint:leave` — client emits to subscribe/unsubscribe from a complaint's room
- `chat:message` — server emits when a new message is sent on a complaint you're viewing
- `complaint:updated` — server emits on status change or assignment
- `notification:new` — server emits directly to a user's personal room

## Structure

```
src/
  config/       db.js, cloudinary.js, socket.js
  models/       User, Category, Complaint, Feedback, Notification, ChatMessage, ActivityLog, Counter
  middleware/   auth (JWT), authorize (roles), upload (multer), errorHandler
  controllers/  one file per resource
  routes/       one file per resource, mounted in app.js
  utils/        generateToken, sendEmail, notify, logActivity, statusFlow, statusConstants
  seed/         seedData.js — `npm run seed` / `npm run seed:destroy`
```
