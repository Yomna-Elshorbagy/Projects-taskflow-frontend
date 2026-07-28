import { Provider } from "react-redux";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { store, useAppSelector } from "./Store/store";
import SignupPage from "./Pages/SignupPage";
import LoginPage from "./Pages/Loginpage";
import HomePage from "./Pages/HomePage";
import ProjectsPage from "./Pages/ProjectsPage";
import TasksPage from "./Pages/TasksPage";

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

        {/* Protected routes */}
        <Route
          path="/"
          element={
            <RequireAuth>
              <HomePage />
            </RequireAuth>
          }
        />
        <Route
          path="/projects"
          element={
            <RequireAuth>
              <ProjectsPage />
            </RequireAuth>
          }
        />
        <Route
          path="/tasks"
          element={
            <RequireAuth>
              <TasksPage />
            </RequireAuth>
          }
        />

        {/* Fallback → signup */}
        <Route path="*" element={<Navigate to="/signup" replace />} />
      </Routes>
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
