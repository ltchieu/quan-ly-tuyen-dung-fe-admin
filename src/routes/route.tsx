import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import MainLayout from "../layouts/main_layout";
import Dashboard from "../pages/dashboard";
import Login from "../auth/login";
import ProtectedRoute from "./protected_routes";
import { useAuth } from "../hook/useAuth";
import UserPage from "../pages/user_page";
import CompanyPage from "../pages/company_page";
import JobPage from "../pages/job_page";
import UserEdit from "../pages/edit_user";
import CompanyEdit from "../pages/edit_company";
import JobEdit from "../pages/edit_job";
import FileUploadManager from "../pages/file_upload_page";

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
              <Route path="/users" element={<UserPage />} />
              <Route path="/companies" element={<CompanyPage />} />
              <Route path="/jobs" element={<JobPage />} />
              <Route path="/upload" element={<FileUploadManager />} />
              <Route path="/editUser/:id" element={<UserEdit />} />
              <Route path="/editCompany/:id" element={<CompanyEdit />} />
              <Route path="/editJobs/:id" element={<JobEdit />} />
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
