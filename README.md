
# TaskFlow – Task Management Application

A responsive full-stack task management application built with React and Node.js. Users can register, log in, create tasks, update task details, track completion status, and delete tasks.

## Features

- User registration and authentication
- JWT-based protected routes
- Create, view, edit and delete tasks
- Mark tasks as completed or pending
- Dashboard with task statistics
- Search tasks by title and description
- Filter tasks by completion status
- Loading, error and empty states
- Responsive desktop, tablet and mobile interface

## Technology Stack

### Frontend
- React
- Vite
- React Router
- Tailwind CSS
- Lucide React
- JavaScript

### Backend
- Node.js
- Express.js
- SQLite
- better-sqlite3
- JSON Web Tokens
- bcryptjs

## Project Structure

```text
Task-3/
├── backend/
│   ├── config/
│   ├── middleware/
│   ├── routes/
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── pages/
│   │   └── services/
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

## Prerequisites

- Node.js 22.x
- npm 10.x
- Git

## Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/k-madhumithaa/Task-3-Valentius-Kryptix---react_frontend.git
cd Task-3
```

### 2. Configure the backend

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:

```env
PORT=5000
JWT_SECRET=replace_with_a_long_random_secret
```

Use a strong, private JWT secret. Never commit `.env`.

Start the backend:

```bash
npm run dev
```

The backend runs at:

http://localhost:5000

### 3. Configure the frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend runs at:

http://localhost:5173

The Vite development server proxies `/api` requests to the backend.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | /api/auth/register | Register a user |
| POST | /api/auth/login | Log in |
| GET | /api/auth/me | Get current user |
| POST | /api/tasks | Create a task |
| GET | /api/tasks | Get all tasks |
| GET | /api/tasks/:id | Get a task |
| PATCH | /api/tasks/:id | Update a task |
| DELETE | /api/tasks/:id | Delete a task |

Task endpoints require JWT authentication.

## Production Build

From the frontend directory:

```bash
npm run build
```

## Security

- Password hashing with bcryptjs
- JWT-based authentication
- Protected API endpoints
- Environment-based secret configuration
- Client-side form validation

## Database

The backend uses SQLite. The database file is created automatically when the backend initializes.

## Author

Developed as part of the Valentius internship frontend development task.
