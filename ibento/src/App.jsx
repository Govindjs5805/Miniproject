import React from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";

// Components
import Navbar from "./components/Navbar/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Splash from "./pages/Splash";

// Pages
import Home from "./pages/Home";
import Events from "./pages/Events";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyEmail from "./pages/VerifyEmail";
import StudentDashboard from "./pages/StudentDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AdminRegistrations from "./pages/AdminRegistrations";
import AdminReport from "./pages/AdminReport";
import AdminAttendanceAnalytics from "./pages/AdminAttendanceAnalytics";
import AdminCheckIn from "./pages/AdminCheckIn";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import EventDetails from "./pages/EventDetails";
import MyEvents from "./pages/MyEvents";
import Ticket from "./pages/Ticket";
import AdminCreateEvent from "./pages/AdminCreateEvent";
import Feedback from "./pages/Feedback";
import AdminFeedbacks from "./pages/AdminFeedbacks";
import AdminEventDocuments from "./pages/AdminEventDocuments";

function AppContent() {
  const location = useLocation();

  // Hide Navbar on Splash, Login, Register, and Verify Email pages
  const noNavbarRoutes = ["/", "/login", "/register", "/verify-email"];
  const showNavbar = !noNavbarRoutes.includes(location.pathname);

  return (
    <div className="app-container">
      {/* Navbar shows only on internal pages */}
      {showNavbar && <Navbar />}
      
      {/* Offset content only if Navbar is visible */}
      <div style={{ marginTop: showNavbar ? "70px" : "0px" }}>
        <Routes>
          {/* Splash Screen */}
          <Route path="/" element={<Splash />} />

          {/* Public Routes */}
          <Route path="/home" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-email" element={<VerifyEmail />} />

          {/* Student Protected Routes */}
          <Route path="/dashboard" element={<ProtectedRoute allowedRole="student"><StudentDashboard /></ProtectedRoute>} />
          <Route path="/feedback/:eventId" element={<Feedback />} />
          <Route path="/my-events" element={<ProtectedRoute allowedRole="student"><MyEvents /></ProtectedRoute>} />
          <Route path="/ticket/:registrationId" element={<ProtectedRoute allowedRole="student"><Ticket /></ProtectedRoute>} />
          <Route path="/events/:id" element={<EventDetails />} />

          {/* Club Lead Protected Routes */}
          <Route path="/admin" element={<ProtectedRoute allowedRole="clubLead"><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/registrations" element={<ProtectedRoute allowedRole="clubLead"><AdminRegistrations /></ProtectedRoute>} />
          <Route path="/admin/report" element={<ProtectedRoute allowedRole="clubLead"><AdminReport /></ProtectedRoute>} />
          <Route path="/admin/analytics" element={<ProtectedRoute allowedRole="clubLead"><AdminAttendanceAnalytics /></ProtectedRoute>} />
          <Route path="/admin/create-event" element={<ProtectedRoute allowedRole="clubLead"><AdminCreateEvent /></ProtectedRoute>} />
          <Route path="/admin/checkin" element={<ProtectedRoute allowedRole="clubLead"><AdminCheckIn /></ProtectedRoute>} />
          <Route path="/admin/feedbacks" element={<ProtectedRoute allowedRole="clubLead"><AdminFeedbacks /></ProtectedRoute>} />
          <Route path="/admin/documents" element={<ProtectedRoute allowedRole="clubLead"><AdminEventDocuments /></ProtectedRoute>} />

          {/* Super Admin Protected Route */}
          <Route path="/superadmin" element={<ProtectedRoute allowedRole="superAdmin"><SuperAdminDashboard /></ProtectedRoute>} />

          {/* Fallback to Splash */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </div>
  );
}

export default function App() {
  return <AppContent />;
}