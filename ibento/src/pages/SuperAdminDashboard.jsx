import { useEffect, useState, useRef } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import Chart from "chart.js/auto";

function SuperAdminDashboard() {
  const [clubs, setClubs] = useState([]);
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);

  const eventsChartRef = useRef(null);
  const regChartRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      const clubSnap = await getDocs(collection(db, "clubs"));
      const eventSnap = await getDocs(collection(db, "events"));
      const regSnap = await getDocs(collection(db, "registrations"));

      setClubs(clubSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setEvents(eventSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setRegistrations(regSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    fetchData();
  }, []);

  // 🔹 KPI Calculations
  const totalAttendance = registrations.filter(r => r.checkInStatus).length;
  const attendanceRate =
    registrations.length > 0
      ? ((totalAttendance / registrations.length) * 100).toFixed(1)
      : 0;

  // 🔹 Club Stats
  const clubStats = clubs.map(club => {
    const clubEvents = events.filter(e => e.clubId === club.id);
    const clubEventIds = clubEvents.map(e => e.id);

    const clubRegs = registrations.filter(r =>
      clubEventIds.includes(r.eventId)
    );

    const clubAttendance = clubRegs.filter(r => r.checkInStatus);

    return {
      name: club.name,
      eventCount: clubEvents.length,
      registrationCount: clubRegs.length,
      attendanceCount: clubAttendance.length,
      attendanceRate:
        clubRegs.length > 0
          ? ((clubAttendance.length / clubRegs.length) * 100).toFixed(1)
          : 0
    };
  });

  // 🔹 Rankings
  const topByEvents = [...clubStats].sort(
    (a, b) => b.eventCount - a.eventCount
  )[0];

  const topByRegistrations = [...clubStats].sort(
    (a, b) => b.registrationCount - a.registrationCount
  )[0];

  const topByAttendanceRate = [...clubStats].sort(
    (a, b) => b.attendanceRate - a.attendanceRate
  )[0];

  // 🔹 Year-wise grouping
  const eventsPerYear = {};
  events.forEach(event => {
    const year = new Date(event.date).getFullYear();
    eventsPerYear[year] = (eventsPerYear[year] || 0) + 1;
  });

  useEffect(() => {
    if (!clubs.length) return;

    if (eventsChartRef.current?.chart)
      eventsChartRef.current.chart.destroy();

    if (regChartRef.current?.chart)
      regChartRef.current.chart.destroy();

    const eventsChart = new Chart(eventsChartRef.current, {
      type: "bar",
      data: {
        labels: clubStats.map(c => c.name),
        datasets: [
          {
            label: "Events",
            data: clubStats.map(c => c.eventCount),
            backgroundColor: "rgba(54,162,235,0.6)"
          }
        ]
      }
    });

    const regChart = new Chart(regChartRef.current, {
      type: "bar",
      data: {
        labels: clubStats.map(c => c.name),
        datasets: [
          {
            label: "Registrations",
            data: clubStats.map(c => c.registrationCount),
            backgroundColor: "rgba(75,192,192,0.6)"
          },
          {
            label: "Attendance",
            data: clubStats.map(c => c.attendanceCount),
            backgroundColor: "rgba(255,99,132,0.6)"
          }
        ]
      }
    });

    eventsChartRef.current.chart = eventsChart;
    regChartRef.current.chart = regChart;

  }, [clubs, events, registrations]);

  return (
    <div style={{ padding: "40px" }}>
      <h1>Super Admin Dashboard</h1>

      {/* 🔵 KPI Cards */}
      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", marginTop: "30px" }}>
        <Card title="Total Clubs" value={clubs.length} />
        <Card title="Total Events" value={events.length} />
        <Card title="Total Registrations" value={registrations.length} />
        <Card title="Total Attendance" value={totalAttendance} />
        <Card title="Attendance Rate" value={attendanceRate + "%"} />
      </div>

      {/* 🔵 Rankings */}
      <div style={{ marginTop: "40px" }}>
        <h3>Rankings</h3>
        <p>🥇 Most Active Club: {topByEvents?.name}</p>
        <p>🎟 Highest Registrations: {topByRegistrations?.name}</p>
        <p>📈 Best Attendance Rate: {topByAttendanceRate?.name}</p>
      </div>

      {/* 🔵 Events Per Year */}
      <div style={{ marginTop: "40px" }}>
        <h3>Events Per Year</h3>
        {Object.keys(eventsPerYear).map(year => (
          <p key={year}>
            {year}: {eventsPerYear[year]} events
          </p>
        ))}
      </div>

      {/* 🔵 Charts */}
      <div style={{ marginTop: "50px" }}>
        <h3>Events Per Club</h3>
        <canvas ref={eventsChartRef}></canvas>
      </div>

      <div style={{ marginTop: "60px" }}>
        <h3>Registrations vs Attendance</h3>
        <canvas ref={regChartRef}></canvas>
      </div>
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div style={{
      background: "#f5f5f5",
      padding: "20px",
      borderRadius: "10px",
      minWidth: "200px"
    }}>
      <h4>{title}</h4>
      <h2>{value}</h2>
    </div>
  );
}

export default SuperAdminDashboard;