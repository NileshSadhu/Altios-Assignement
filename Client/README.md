# Task Management Frontend

A React + TypeScript single-page application for managing tasks, built to consume the Task Management API. Includes user authentication, task creation/editing, status filtering, and delete confirmation.

## Features

- User Registration & Login
- JWT stored in `localStorage`, attached automatically to API requests
- Create, view, edit, and delete tasks
- Filter tasks by status (pending, in-progress, completed)
- Color-coded status and priority indicators
- Toast notifications for success and error feedback
- Loading states on every API interaction
- Logout
- Responsive layout (usable on mobile)

## Tech Stack

- React 18
- TypeScript
- Vite
- React Router DOM
- Axios
- Tailwind CSS
- React Hot Toast
- Zod (shared validation conventions with backend)

---

## Installation

### Clone Repository

```bash
git clone <repository-url>
cd frontend
```

### Install Dependencies

```bash
npm install
```

### Environment Variables

Create a `.env` file in the root directory.

```env
SERVER_URL=http://localhost:8000/api
```

### Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173` (or the port Vite assigns).

---

## Backend Dependency

This frontend expects the [Task Management API](../backend/README.md) to be running and reachable at the URL set in `SERVER_URL`. Start the backend first — see its README for setup.

---

## Routes

| Path              | Component   | Description                                    |
| ----------------- | ----------- | ---------------------------------------------- |
| `/login`          | `Login`     | User login                                     |
| `/register`       | `Register`  | User registration                              |
| `/`               | `Dashboard` | Task list with status filter, edit, and delete |
| `/tasks/new`      | `TaskForm`  | Create a new task                              |
| `/tasks/:id/edit` | `TaskForm`  | Edit an existing task                          |

---

## Project Structure

```text
src
├── api
│   └── axios.ts
├── components
│   ├── CustomBtn.tsx
│   └── CustomInput.tsx
├── pages
│   ├── Dashboard.tsx
│   ├── TaskForm.tsx
│   └── auth
│       ├── Login.tsx
│       └── Register.tsx
├── App.tsx
└── main.tsx
```

---

## Design Decisions

- **Single `TaskForm` page handles both create and edit.** Mode is determined by the presence of an `:id` route param, avoiding duplicated form markup and validation logic across two separate pages.
- **JWT is stored in `localStorage`** and attached via an Axios request interceptor, rather than passed manually on each call.
- **Delete uses an inline two-step confirm** (Delete → Confirm/Cancel) directly on the task card instead of a `window.confirm()` dialog or modal, to keep the UI in one component and avoid native browser dialogs that are hard to style or test.
- **Status filtering is server-side**, passed as a `status` query param to `GET /api/tasks`, reusing the filtering already implemented on the backend rather than duplicating it client-side.
- **Empty `description` is omitted from the request payload** rather than sent as `""`, since the backend's validation treats an empty string differently from an absent field.
- **User feedback is handled via `react-hot-toast`** rather than inline error banners — success and failure states for login, registration, task creation/update, fetching, and deletion all surface as toasts.

---

## Future Improvements

- Pagination
- Search Functionality
- Docker Support

## Author

Nilesh Sadhu
