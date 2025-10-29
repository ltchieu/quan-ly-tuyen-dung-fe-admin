import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import MainLayout from "../layouts/main_layout";
import Dashboard from "../pages/dashboard";
import Login from "../auth/login";
import ProtectedRoute from "./protected_routes";
import { useAuth } from "../hook/useAuth";

type Props = {};

const AppRoute = (props: Props) => {
  const { user, isLoading } = useAuth();

  if (isLoading) return <div>Loading session...</div>;

  return (
    <div>
      <Routes>
        {user ? (
          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              <Route path="/" element={<Dashboard />} />
            </Route>
          </Route>
        ) : (
          <Route path="/login" element={<Login />} />
        )}

        <Route
          path="*"
          element={<Navigate to={user ? "/" : "/login"} replace />}
        />
      </Routes>
    </div>
  );
};

export default AppRoute;
