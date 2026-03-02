import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import AdminLayout from "../components/Admin/AdminLayout";
import "./AdminDashboard.css";

function AdminDashboard() {
  const { clubId, fullName } = useAuth();
  const [totalEvents, setTotalEvents] = useState(0);
  const [totalRegistrations, setTotalRegistrations] = useState(0);
  const [totalCheckedIn, setTotalCheckedIn] = useState(0);

  useEffect(() => {
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

    loadStats();
  }, [clubId]);

  const attendancePercentage = totalRegistrations > 0 
    ? ((totalCheckedIn / totalRegistrations) * 100).toFixed(1) 
    : 0;

  return (
    <AdminLayout>
      <div className="admin-dash-content">
        <h2 className="dash-welcome">Welcome, {fullName}</h2>
        <p className="dash-subtitle">Club Overview Dashboard</p>

        <div className="stats-grid-container">
          <StatCard title="Total Events" value={totalEvents}  />
          <StatCard title="Total Registrations" value={totalRegistrations}/>
          <StatCard title="Total Checked-In" value={totalCheckedIn} />
          <StatCard title="Attendance Rate" value={`${attendancePercentage}%`}/>
        </div>

        {/* This container replaces the white box seen in your screenshots */}
        <div className="admin-info-card-large">
          <h3 className="card-highlight-title">Quick Insights</h3>
          <p className="card-description">
            Your most recent event has seen a <strong>{attendancePercentage}%</strong> check-in rate. 
            Navigate to the <strong>Reports</strong> tab for a full student breakdown.
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