import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import PublicLayout from "./components/layout/PublicLayout";
import AuthLayout from "./components/layout/AuthLayout";
import DashboardLayout from "./components/layout/DashboardLayout";
import ProtectedRoute from "./routes/ProtectedRoute";

import Home from "./pages/public/Home";
import About from "./pages/public/About";
import Contact from "./pages/public/Contact";
import FAQ from "./pages/public/FAQ";
import Login from "./pages/public/Login";
import Register from "./pages/public/Register";
import ForgotPassword from "./pages/public/ForgotPassword";
import ResetPassword from "./pages/public/ResetPassword";
import NotFound from "./pages/public/NotFound";

import UserDashboard from "./pages/user/UserDashboard";
import RaiseComplaint from "./pages/user/RaiseComplaint";
import MyComplaints from "./pages/user/MyComplaints";
import Feedback from "./pages/user/Feedback";

import StaffDashboard from "./pages/staff/StaffDashboard";
import AssignedComplaints from "./pages/staff/AssignedComplaints";
import StaffReports from "./pages/staff/StaffReports";

import AdminDashboard from "./pages/admin/AdminDashboard";
import Analytics from "./pages/admin/Analytics";
import ManageComplaints from "./pages/admin/ManageComplaints";
import ManageStaff from "./pages/admin/ManageStaff";
import ManageUsers from "./pages/admin/ManageUsers";
import ManageCategories from "./pages/admin/ManageCategories";
import AdminReports from "./pages/admin/AdminReports";
import Settings from "./pages/admin/Settings";

import ComplaintDetails from "./pages/shared/ComplaintDetails";
import Notifications from "./pages/shared/Notifications";
import Messages from "./pages/shared/Messages";
import Profile from "./pages/shared/Profile";

export default function App() {
  return (
    <>
      <Routes>
        {/* Public site */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQ />} />
        </Route>

        {/* Auth flows */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Route>

        {/* User portal */}
        <Route element={<ProtectedRoute allowedRoles={["user"]} />}>
          <Route element={<DashboardLayout role="user" title="Student Portal" />}>
            <Route path="/user/dashboard" element={<UserDashboard />} />
            <Route path="/user/raise-complaint" element={<RaiseComplaint />} />
            <Route path="/user/complaints" element={<MyComplaints />} />
            <Route path="/user/complaints/:id" element={<ComplaintDetails role="user" />} />
            <Route path="/user/notifications" element={<Notifications role="user" />} />
            <Route path="/user/messages" element={<Messages role="user" />} />
            <Route path="/user/messages/:id" element={<Messages role="user" />} />
            <Route path="/user/feedback" element={<Feedback />} />
            <Route path="/user/profile" element={<Profile role="user" />} />
          </Route>
        </Route>

        {/* Staff portal */}
        <Route element={<ProtectedRoute allowedRoles={["staff"]} />}>
          <Route element={<DashboardLayout role="staff" title="Staff Portal" />}>
            <Route path="/staff/dashboard" element={<StaffDashboard />} />
            <Route path="/staff/complaints" element={<AssignedComplaints />} />
            <Route path="/staff/complaints/:id" element={<ComplaintDetails role="staff" />} />
            <Route path="/staff/reports" element={<StaffReports />} />
            <Route path="/staff/messages" element={<Messages role="staff" />} />
            <Route path="/staff/messages/:id" element={<Messages role="staff" />} />
            <Route path="/staff/profile" element={<Profile role="staff" />} />
          </Route>
        </Route>

        {/* Admin console */}
        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route element={<DashboardLayout role="admin" title="Admin Console" />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/analytics" element={<Analytics />} />
            <Route path="/admin/complaints" element={<ManageComplaints />} />
            <Route path="/admin/complaints/:id" element={<ComplaintDetails role="admin" />} />
            <Route path="/admin/staff" element={<ManageStaff />} />
            <Route path="/admin/users" element={<ManageUsers />} />
            <Route path="/admin/categories" element={<ManageCategories />} />
            <Route path="/admin/reports" element={<AdminReports />} />
            <Route path="/admin/settings" element={<Settings />} />
            <Route path="/admin/profile" element={<Profile role="admin" />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>

      <ToastContainer position="top-right" autoClose={3500} newestOnTop />
    </>
  );
}
