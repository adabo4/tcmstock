import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import AppLayout from "../layouts/AppLayout";
import SignIn from "../pages/auth/SignIn";
import SignUp from "../pages/auth/SignUp";
import Dashboard from "../pages/Dashboard";
import Catalog from "../pages/Catalog";
import Settings from "../pages/Settings";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />

        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
