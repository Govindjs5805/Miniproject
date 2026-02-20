import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Events from "./pages/Events";
import Navbar from "./components/Navbar/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import AdminRegistrations from "./pages/AdminRegistrations";
import AdminEventReport from "./pages/AdminEventReport";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminCreateEvent from "./pages/AdminCreateEvent";
import StudentDashboard from "./pages/StudentDashboard";
import EditProfile from "./pages/EditProfile";
import AdminAttendanceAnalytics from "./pages/AdminAttendanceAnalytics";
import MyEvents from "./pages/MyEvents";
import TicketView from "./pages/TicketView";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/events" element={<Events />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={ <ProtectedRoute allowedRole="admin"><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/registrations" element={ <ProtectedRoute allowedRole="admin"><AdminRegistrations /></ProtectedRoute>} />
        <Route path="/admin/report" element={ <ProtectedRoute allowedRole="admin"><AdminEventReport /></ProtectedRoute>} />
        <Route path="/admin/create-event" element={ <ProtectedRoute allowedRole="clubLead"><AdminCreateEvent /></ProtectedRoute>} />
        <Route path="/edit-profile" element={ <ProtectedRoute allowedRole="student"><EditProfile /></ProtectedRoute>} />
        <Route path="/admin/analytics" element={ <ProtectedRoute allowedRole="admin"><AdminAttendanceAnalytics /></ProtectedRoute>} />
        <Route path="/my-events" element={<ProtectedRoute allowedRole="student"><MyEvents /></ProtectedRoute>} />
        <Route path="/ticket/:registrationId" element={<ProtectedRoute allowedRole="student"><TicketView /></ProtectedRoute>
  }
/>
      </Routes>
    </>
  );
}

export default App;