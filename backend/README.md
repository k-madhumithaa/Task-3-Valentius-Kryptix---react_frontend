# Task REST API

A simple REST API built using Node.js, Express.js and SQLite. It supports user registration, login and complete task management with JWT authentication.

## Features

- User registration and login
- Password hashing using bcryptjs
- JWT-based authentication
- Create, read, update and delete tasks
- Protected API endpoints
- Input validation
- SQLite database

## Technologies Used

- Node.js 22
- Express.js 5
- SQLite (better-sqlite3)
- bcryptjs
- JSON Web Token (JWT)
- dotenv

## Project Structure

```text
task-rest-api/
├── config/
│   └── database.js
├── middleware/
│   └── auth.js
├── routes/
│   ├── auth.js
│   └── tasks.js
├── .env
├── .gitignore
├── package.json
├── package-lock.json
├── server.js
└── README.md
```

## Installation and Setup

1. Clone the repository:

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd task-rest-api
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory:

```env
PORT=5000
JWT_SECRET=your_secure_secret_key
```

4. Start the development server:

```bash
npm run dev
```

The API will run at:

`http://localhost:5000`

The SQLite database is created automatically when the application starts.

## API Endpoints

### 1. Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get logged-in user |

**Register User**

Request body:

```json
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "password123"
}
```

Success response: `201 Created`

**Login User**

Request body:

```json
{
  "email": "test@example.com",
  "password": "password123"
}
```

Success response: `200 OK`

Returns a JWT authentication token.

### 2. Task Management

All task endpoints require JWT authentication.

Add this header to protected requests:

```text
Authorization: Bearer YOUR_JWT_TOKEN
```

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/tasks` | Create a task |
| GET | `/api/tasks` | Get all tasks |
| GET | `/api/tasks/:id` | Get a specific task |
| PATCH | `/api/tasks/:id` | Update a task |
| DELETE | `/api/tasks/:id` | Delete a task |

**Create Task**

Request body:

```json
{
  "title": "Complete REST API",
  "description": "Finish the project"
}
```

Success response: `201 Created`

**Get All Tasks**

Returns all tasks belonging to the authenticated user.

Success response: `200 OK`

**Get Single Task**

Example endpoint:

`GET /api/tasks/1`

Success response: `200 OK`

**Update Task**

Example endpoint:

`PATCH /api/tasks/1`

Request body:

```json
{
  "completed": true
}
```

Success response: `200 OK`

**Delete Task**

Example endpoint:

`DELETE /api/tasks/1`

Success response: `200 OK`

## HTTP Status Codes

| Status Code | Description |
|---|---|
| 200 | Request successful |
| 201 | Resource created |
| 400 | Invalid input |
| 401 | Unauthorized or invalid token |
| 404 | Resource not found |
| 409 | Email already registered |
| 500 | Internal server error |

## Security

- Passwords are hashed before being stored.
- JWT tokens are used for authentication.
- Task endpoints are protected.
- Users can only access and modify their own tasks.
- Environment variables are used for secret configuration.

## Testing

All API endpoints were tested using Postman, including registration, login, task creation, retrieval, updating, deletion and unauthorized access.

## Author

Developed as a REST API project demonstrating backend development, CRUD operations and user authentication.