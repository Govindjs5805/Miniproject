import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

function AdminOverview({ clubs, events, registrations }) {
  const chartRef = useRef(null);

  const totalAttendance = registrations.filter(r => r.checkInStatus).length;
  const attendanceRate = registrations.length > 0 
    ? ((totalAttendance / registrations.length) * 100).toFixed(1) : 0;

  useEffect(() => {
    if (!clubs.length || !chartRef.current) return;
    
    const ctx = chartRef.current.getContext("2d");
    const myChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: clubs.map(c => c.name),
        datasets: [{
          label: "Events per Forum",
          data: clubs.map(c => events.filter(e => e.clubId === c.id).length),
          backgroundColor: "#7c3aed",
          borderRadius: 8
        }]
      },
      options: { 
        responsive: true, 
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true, ticks: { color: "#94a3b8" } }, x: { ticks: { color: "#94a3b8" } } }
      }
    });

    return () => myChart.destroy();
  }, [clubs, events]);

  return (
    <div className="admin-overview-content">
      <div className="kpi-grid">
        <div className="stat-card"><span>Total Clubs</span><h2>{clubs.length}</h2></div>
        <div className="stat-card"><span>Global Events</span><h2>{events.length}</h2></div>
        <div className="stat-card"><span>Total Regs</span><h2>{registrations.length}</h2></div>
        <div className="stat-card"><span>Avg Attendance</span><h2>{attendanceRate}%</h2></div>
      </div>

      <div className="chart-container-large">
        <h3>Forum Activity Analysis</h3>
        <div style={{ height: "300px" }}>
          <canvas ref={chartRef}></canvas>
        </div>
      </div>
    </div>
  );
}

export default AdminOverview;