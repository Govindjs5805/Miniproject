import { useEffect, useState } from "react";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import AdminLayout from "../components/Admin/AdminLayout";
import "./AdminDashboard.css";

function AdminDashboard() {
  const { clubId, user } = useAuth();
  const [adminName, setAdminName] = useState("Admin"); // Fallback
  const [totalEvents, setTotalEvents] = useState(0);
  const [totalRegistrations, setTotalRegistrations] = useState(0);
  const [totalCheckedIn, setTotalCheckedIn] = useState(0);

  useEffect(() => {
    const loadAdminProfile = async () => {
      if (!user) return;
      try {
        // Fetching the admin's actual name from the users collection
        const adminDoc = await getDoc(doc(db, "users", user.uid));
        if (adminDoc.exists()) {
          const data = adminDoc.data();
          setAdminName(data.fullName || data.name || "Admin");
        }
      } catch (err) {
        console.error("Error fetching admin profile:", err);
      }
    };

    const loadStats = async () => {
      if (!clubId) return;

      const eventQuery = query(collection(db, "events"), where("clubId", "==", clubId));
      const eventSnap = await getDocs(eventQuery);
      setTotalEvents(eventSnap.size);

      const eventIds = eventSnap.docs.map(doc => doc.id);
      if (eventIds.length === 0) return;

      const regSnap = await getDocs(collection(db, "registrations"));
      let regCount = 0;
      let checkInCount = 0;

      regSnap.forEach(doc => {
        const data = doc.data();
        if (eventIds.includes(data.eventId)) {
          regCount++;
          if (data.checkInStatus) checkInCount++;
        }
      });

      setTotalRegistrations(regCount);
      setTotalCheckedIn(checkInCount);
    };

    loadAdminProfile();
    loadStats();
  }, [clubId, user]);

  const attendancePercentage = totalRegistrations > 0 
    ? ((totalCheckedIn / totalRegistrations) * 100).toFixed(1) 
    : 0;

  return (
    <AdminLayout>
      <div className="admin-dash-content">
        <header className="dash-header-section">
          {/* Now using the fetched adminName */}
          <h2 className="dash-welcome">Welcome, {adminName.toUpperCase()}</h2>
          <p className="dash-subtitle">Club Overview Dashboard</p>
        </header>

        <div className="stats-grid-container">
          <StatCard title="Total Events" value={totalEvents} icon="" />
          <StatCard title="Total Registrations" value={totalRegistrations} icon="" />
          <StatCard title="Total Checked-In" value={totalCheckedIn} icon="" />
          <StatCard title="Attendance Rate" value={`${attendancePercentage}%`} icon="" />
        </div>

        <div className="admin-info-card-large">
          <h3 className="card-highlight-title">Quick Insights</h3>
          <p className="card-description">
            Your club's overall check-in rate is <strong>{attendancePercentage}%</strong>. 
            Navigate to the <strong>Reports</strong> tab to generate official documentation for completed events.
          </p>
        </div>
      </div>
    </AdminLayout>
  );
}

function StatCard({ title, value, icon }) {
  return (
    <div className="admin-stat-card">
      <div className="stat-card-header">
        <span className="stat-icon">{icon}</span>
        <h3 className="stat-title">{title}</h3>
      </div>
      <p className="stat-value">{value}</p>
    </div>
  );
}

export default AdminDashboard;