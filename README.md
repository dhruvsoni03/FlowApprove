# FlowApprove 🚀

**FlowApprove** is a smart, workflow-based approval system used to manage employee requests such as leave, expenses, and general approvals with dynamic routing, Role-Based Access Control (RBAC), and real-time status tracking.

## 🌟 Features
- **Role-Based Access Control**: Employee, Manager, Admin roles.
- **Dynamic Routing**: Expense requests > $5000 automatically route to Admins.
- **Real-Time Notifications**: Instantly updates UI when a new request is assigned, approved, or rejected using Socket.io.
- **SLA Tracking**: Monitors request time to detect and warn about delays.
- **Dark-Themed Glassmorphic UI**: Beautiful, clean user interface with Framer Motion animations.

## 🛠️ Tech Stack
- **Frontend**: React (Vite), Tailwind CSS v4, Framer Motion, Zustand
- **Backend**: Node.js, Express.js, Socket.io
- **Database**: MongoDB (Mongoose)

## 📦 Project Structure
```
FlowApprove/
├── backend/
│   ├── controllers/      # API Logic
│   ├── middleware/       # JWT Auth and Role Auth
│   ├── models/           # Mongoose schemas (User, Request, Approval, Notification)
│   ├── routes/           # Express routes
│   ├── .env              # Backend environment variables
│   └── server.js         # Entry point
└── frontend/
    ├── src/
    │   ├── components/   # Reusable UI components (Navbar, ProtectedRoute)
    │   ├── pages/        # Main pages (Dashboard, Login, Register, NewRequest)
    │   ├── store/        # Zustand global state (authStore, requestStore)
    │   ├── styles/       # Specific styles if needed
    │   └── index.css     # Global CSS and Tailwind directives
    └── vite.config.js    # Vite config
```

## 🚀 Setup Instructions

### 1. Prerequisites
- [Node.js](https://nodejs.org/en/) installed (v18+)
- [MongoDB](https://www.mongodb.com/try/download/community) installed and running locally on port 27017, or a MongoDB Atlas connection string.

### 2. Backend Setup
1. Open a terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up Environment Variables:
   The backend relies on `.env`. A default has been created.
   Ensure `MONGODB_URI` correctly points to your local MongoDB or Atlas URL.
4. Start the backend server:
   ```bash
   npm run dev
   ```
   *The server runs on `http://localhost:5000`.*

### 3. Frontend Setup
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the frontend application:
   ```bash
   npm run dev
   ```
   *The app runs on `http://localhost:5173`.*

## 🔌 API Documentation

### Auth APIs
- `POST /api/auth/register` - Register a new user (`name`, `email`, `password`, `role`).
- `POST /api/auth/login` - Login (`email`, `password`). Returns JWT.

### Request APIs
- `POST /api/requests` - Create a request (`type`, `title`, `description`, `amount`).
- `GET /api/requests` - Get all requests (filtered by user role).
- `GET /api/requests/:id` - Get a single request with its approval history.

### Approval APIs (Managers/Admins)
- `POST /api/requests/:id/approve` - Approve a request (`comment`).
- `POST /api/requests/:id/reject` - Reject a request (`comment`).

### Dashboard APIs
- `GET /api/dashboard/employee` - Stats for an employee.
- `GET /api/dashboard/manager` - Stats for a manager.
- `GET /api/dashboard/admin` - Stats for an admin.

### Notifications APIs
- `GET /api/notifications` - Get real-time notifications for the current user.
- `PATCH /api/notifications/:id/read` - Mark a notification as read.

## 🧪 Testing the Application
1. **Create users**: Register 3 separate users (Employee, Manager, Admin).
2. **Submit a Request**: Log in as the Employee and create a $6000 expense.
3. **Dynamic Routing**: See that the request goes to the Admin instead of the Manager.
4. **Approve/Reject**: Log in as the assigned approver, view the real-time notification, and approve the request.
5. **Real-Time Feed**: The Employee sees a live update in their dashboard that their request is approved!

## 🌍 Deployment Guide
1. **Database**: Create a free MongoDB Atlas cluster and update the `MONGODB_URI` environment variable.
2. **Backend (Render / Railway / Heroku)**:
   - Connect your GitHub repo to Render.
   - Set the build command to `npm install` and the start command to `npm start`.
   - Add `.env` variables (`JWT_SECRET`, `MONGODB_URI`, `PORT`).
3. **Frontend (Vercel / Netlify)**:
   - In `frontend/src/store/authStore.js` and `requestStore.js`, update the `baseURL` to your deployed backend URL (e.g., `https://flowapprove-api.onrender.com/api`).
   - Connect the `frontend` folder to Vercel.
   - The build command is `npm run build` and output directory is `dist`.

Enjoy managing workflows effortlessly! 🎉
