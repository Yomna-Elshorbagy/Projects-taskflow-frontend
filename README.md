# TaskFlow - Frontend Application

TaskFlow is a modern, high-performance project and task management application designed for focus and productivity. This repository contains the **Frontend** of the TaskFlow application, built with a robust, modern React stack.

## ✨ Key Features & User Interface

- **Premium UI/UX Design**: The interface is meticulously crafted using Tailwind CSS to provide a modern, highly polished aesthetic. It features a curated teal (`#1a6b5a`) and amber color palette, soft layered shadows (`shadow-md` to `shadow-lg` on hover), smooth micro-animations (like hover lifts on cards), and a beautifully animated 404 error page with glowing ambient backgrounds and spinning elements.
- **Project Management**: Users can create new projects via the **"New Project" Modal**, accessible directly from the main Projects Dashboard. Each project is represented by a dynamically styled card that lifts on hover.
- **Member Management**: Admins can manage team access using the **"Manage Members" Modal**, which is opened via the "Members" button in the header of any specific Project/Task page. It allows searching and adding registered users to the project.
- **Kanban & Table Views**: Inside a project, users can seamlessly toggle between a visual, color-coded Kanban board (with distinct columns for To Do, In Progress, Done) and a dense, sortable data-table view for tasks.
- **Task Management**: New tasks are created via the **"Create Task" Modal**, opened from the "New task" button in the project header. Tasks require a title, description, due date, and an assignee (selectable from the project's member list).
- **Interactive Task Drawer**: Clicking on any Task Card (or table row) slides open the **Task Details Drawer** from the right side of the screen. This drawer allows users to seamlessly edit task information, update statuses, and change priorities without losing their place on the board.
- **Activity Log Tracking**: Embedded within the Task Details Drawer is a real-time **Activity Log** that tracks the historical status changes of the task, showing exactly who moved a task and when.
- **Advanced State Management**: Combines Redux Toolkit for global auth state with React Query for powerful server-state caching, invalidation, and background synchronization.

## 🔐 Role-Based Access Control (RBAC)

The application implements a strict frontend and backend permission system based on the user's role (`admin` vs `member`):

### 🛡️ Admin Role Permissions
Admins have elevated privileges across the workspace:
- **Member Management**: Uniquely possess the ability to view and interact with the **"Manage Members" Modal**. They can add new users to projects or revoke access.
- **Project Oversight**: Can view all projects across the workspace regardless of membership.
- **Destructive Actions**: Have the authority to delete tasks (via the trash icon in the Task Drawer) and delete entire projects.

### 👤 Member Role Permissions
Members have standard access focused on daily productivity:
- **Task Execution**: Can seamlessly create new tasks, update task statuses (e.g., moving from "To Do" to "In Progress"), and edit task descriptions or due dates within the Task Drawer.
- **Project Visibility**: Can only view and interact with projects they have been explicitly added to by an Admin or projects they created themselves.
- **Restricted Access**: The "Members" management button is completely hidden from their UI, preventing them from modifying project access lists.

### 🧪 Test Accounts
You can use the following pre-configured accounts to test the Role-Based Access Control logic:

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `yumnamohamed@gmail.com` | `Yomn123` |
| **Member** | `yumnamohamed30@gmail.com` | `Yomn123` |

## 🏗 Architecture Overview

This frontend application is built upon a modern Vite + React architecture:

- **Framework**: [React 18](https://react.dev/) powered by [Vite](https://vitejs.dev/) for blazing-fast HMR and optimized builds.
- **Routing**: `react-router-dom` with code-split routes via `React.lazy` and `Suspense` for performance optimization.
- **Server State**: `@tanstack/react-query` handles all API data fetching, caching, invalidation, and loading states.
- **Global State**: `react-redux` (Redux Toolkit) is used exclusively for global authentication state (JWT tokens and user sessions).
- **Styling**: `tailwindcss` for utility-first styling, ensuring a consistent and easily maintainable design system.
- **Form Handling & Validation**: `react-hook-form` paired with `zod` schema validation for strict, type-safe form submissions.
- **Icons & UI Utilities**: `lucide-react` for crisp SVG icons and `sweetalert2` for beautiful, interactive toast notifications.

## ⚙️ Environment Variables

The application relies on a configuration file to connect to the backend API. 
Currently, the API endpoints are managed in `src/Constants/BaseUrl.ts`.

```typescript
// src/Constants/BaseUrl.ts
export const baseURL = "https://electro-pi-taskflow-backend.vercel.app"; // Production Backend
export const baseURLLocal = "http://localhost:3000"; // Local Development Backend
```
*Note: To run the frontend against a local backend, update the API hooks in `src/Apis/` to use `baseURLLocal`.*

## 🚀 Setup Instructions

1. **Clone the repository and navigate to the frontend folder:**
   ```bash
   cd "Frontend Taskflow/taskflow"
   ```

2. **Install all dependencies:**
   Make sure you are using Node.js v18 or higher.
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   *The application will typically start on `http://localhost:5173`.*

4. **Build for production:**
   ```bash
   npm run build
   ```
   *This compiles the application into static assets located in the `/dist` directory, ready for deployment.*

## 🗄️ Database & Backend Connection

Because this is a decoupled frontend architecture, it does not have a direct database connection. Instead, it relies on the TaskFlow Express.js Backend API. 

**Authentication Flow:**
- On login/signup, the API returns a JWT token.
- This token is intercepted by the Redux store, decoded (to extract user information like role and ID), and saved.
- All protected API calls attach this token to the `authentication` header.

## 🧪 Testing and Linting

While automated unit tests (Jest/RTL) can be integrated, the primary verification commands currently rely on TypeScript compiling and ESLint.

**Check TypeScript Types:**
```bash
npm run build
# OR run the compiler without emitting files
npx tsc --noEmit
```

**Run ESLint:**
```bash
npm run lint
```
