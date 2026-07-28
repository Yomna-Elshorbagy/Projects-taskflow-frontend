import { Suspense, lazy } from "react";
import { Provider } from "react-redux";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { store, useAppSelector } from "./Store/store";
import DashboardLayout from "./Shared/Layouts/DashboardLayout";

const SignupPage = lazy(() => import("./Pages/SignupPage"));
const LoginPage = lazy(() => import("./Pages/Loginpage"));
const ProjectsPage = lazy(() => import("./Pages/ProjectsPage"));
const TasksPage = lazy(() => import("./Pages/TasksPage"));
const NotFoundPage = lazy(() => import("./Pages/NotFoundPage"));

import "./App.css";

const queryClient = new QueryClient();

/** Redirect authenticated users away from auth pages */
function RequireGuest({ children }: { children: React.ReactNode }) {
  const token = useAppSelector((state) => state.auth.token);
  return token ? <Navigate to="/" replace /> : <>{children}</>;
}

/** Redirect unauthenticated users to signup */
function RequireAuth({ children }: { children: React.ReactNode }) {
  const token = useAppSelector((state) => state.auth.token);
  return token ? <>{children}</> : <Navigate to="/signup" replace />;
}

function AppRoutes() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div className="flex h-screen w-full items-center justify-center text-[#1a6b5a] font-medium">Loading TaskFlow...</div>}>
        <Routes>
          {/* Public auth routes */}
          <Route
            path="/signup"
            element={
              <RequireGuest>
                <SignupPage />
              </RequireGuest>
            }
          />
          <Route
            path="/login"
            element={
              <RequireGuest>
                <LoginPage />
              </RequireGuest>
            }
          />

          {/* Protected routes wrapped in DashboardLayout */}
          <Route
            element={
              <RequireAuth>
                <DashboardLayout />
              </RequireAuth>
            }
          >
            <Route path="/" element={<Navigate to="/projects" replace />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/projects/:projectId/tasks" element={<TasksPage />} />
          </Route>

          {/* Fallback → 404 Not Found */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AppRoutes />
      </QueryClientProvider>
    </Provider>
  );
}

export default App;
