# E-Waste Recycling Portal (MERN)

A full-stack starter project for managing electronic waste recycling, supporting home pickup and recycling-center drop-off.

## Features
- User registration/login with bcrypt password hashing and JWT authentication
- Role-based user/admin authorization
- Create recycling requests for home pickup or center drop-off
- View a user's own requests and track status
- Admin request list, status updates, dashboard stats, and center management
- Responsive eco-friendly React UI using Tailwind CSS
- MongoDB/Mongoose persistence

## Requirements
- Node.js 20+
- MongoDB local instance or MongoDB Atlas connection string

## 1. Configure the backend
```bash
cd server
cp .env.example .env
```
Edit `.env` and set `MONGO_URI` and a long random `JWT_SECRET`.

Install and run:
```bash
npm install
npm run dev
```
The API runs at `http://localhost:5000`.

### Create an admin account
Register a normal account through the UI, then promote it in MongoDB:
```javascript
db.users.updateOne({ email: "admin@example.com" }, { $set: { role: "admin" } })
```
Do not expose admin self-registration in a public deployment.

## 2. Configure the frontend
In a second terminal:
```bash
cd client
npm install
npm run dev
```
Open the URL printed by Vite (usually `http://localhost:5173`).

## API endpoints
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/categories`
- `GET /api/centers`
- `POST /api/centers` (admin)
- `GET /api/requests/my`
- `POST /api/requests`
- `GET /api/requests` (admin)
- `PATCH /api/requests/:id/status` (admin)
- `GET /api/admin/stats` (admin)
- `GET /api/health`

## Notes for production
This is a functional MVP starter, not a fully audited production system. Before deployment, add rate limiting, email verification/password reset, audit logging, stronger request validation, secure cookie-based token handling or a carefully designed token lifecycle, pagination, automated tests, backups, monitoring, and privacy/legal notices. Configure CORS to your exact deployed frontend origin. Never commit `.env`.
