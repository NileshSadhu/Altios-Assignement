# Task Management API

A RESTful Task Management API built with Node.js, Express, TypeScript, MongoDB, Mongoose, JWT Authentication, and Zod validation.

## Features

- User Registration
- User Login
- JWT Authentication
- Create Task
- Get All Tasks
- Get Task By ID
- Update Task
- Delete Task
- Task Ownership (Users can only access their own tasks)
- Task Status Filtering
- Request Validation using Zod
- Password Hashing using Bcrypt

## Tech Stack

- Node.js
- Express.js
- TypeScript
- MongoDB
- Mongoose
- JWT (JSON Web Token)
- Bcrypt
- Zod

---

## Installation

### Clone Repository

```bash
git clone <repository-url>
cd backend
```

### Install Dependencies

```bash
npm install
```

### Environment Variables

Create a `.env` file in the root directory.

```env
PORT=
MONGODB_URI=your-mongodb-url
JWT_SECRET=your-secret-key
```

### Run Development Server

```bash
npm run dev
```

### Build Project

```bash
npm run build
```

### Start Production Server

```bash
npm start
```

---

## Authentication

Protected routes require a JWT token.

Example:

```http
Authorization: Bearer <your-token>
```

---

## API Endpoints

### Auth Routes

#### Register User

```http
POST /api/auth/register
```

Request Body:

```json
{
  "username": "Nilesh Sadhu",
  "email": "nilesh@example.com",
  "password": "password123"
}
```

---

#### Login User

```http
POST /api/auth/login
```

Request Body:

```json
{
  "email": "nilesh@example.com",
  "password": "password123"
}
```

Response:

```json
{
  "message": "Login successful",
  "token": "jwt-token"
}
```

---

### Task Routes

#### Create Task

```http
POST /api/tasks
```

Headers:

```http
Authorization: Bearer <token>
```

Request Body:

```json
{
  "title": "Complete assignment",
  "description": "Finish backend API",
  "priority": "high"
}
```

---

#### Get All Tasks

```http
GET /api/tasks
```

Optional Query:

```http
GET /api/tasks?status=pending
```

---

#### Get Task By ID

```http
GET /api/tasks/:id
```

---

#### Update Task

```http
PUT /api/tasks/:id
```

Request Body:

```json
{
  "status": "completed"
}
```

---

#### Delete Task

```http
DELETE /api/tasks/:id
```

---

## Task Status Values

```text
pending
in-progress
completed
```

## Task Priority Values

```text
low
medium
high
```

---

## Project Structure

```text
src
├── controllers
├── middleware
├── models
├── routes
├── validator
├── config
├── app.ts
└── server.ts
```

---

## Security

- Passwords are hashed using Bcrypt.
- JWT authentication protects task routes.
- Users can only access and modify their own tasks.

---

## Future Improvements

- Pagination
- Search Functionality
- Docker Support

---

## Author

Nilesh
