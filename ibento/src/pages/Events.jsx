function Events() {
  const events = [
    {
      id: 1,
      title: "Hackathon 2026",
      date: "15 March 2026",
      category: "Technology",
      venue: "Main Auditorium"
    },
    {
      id: 2,
      title: "Cultural Fest",
      date: "20 March 2026",
      category: "Arts",
      venue: "Open Ground"
    },
    {
      id: 3,
      title: "Tech Talk: AI",
      date: "25 March 2026",
      category: "Technology",
      venue: "Seminar Hall"
    }
  ];

  return (
    <div style={{ padding: "40px" }}>
      <h1>All Events</h1>
      <p>Browse and register for upcoming campus events</p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "20px",
          marginTop: "30px"
        }}
      >
        {events.map(event => (
          <div
            key={event.id}
            style={{
              border: "1px solid #ccc",
              borderRadius: "10px",
              padding: "20px"
            }}
          >
            <h3>{event.title}</h3>
            <p><strong>Date:</strong> {event.date}</p>
            <p><strong>Category:</strong> {event.category}</p>
            <p><strong>Venue:</strong> {event.venue}</p>
            <button style={{ marginTop: "10px" }}>
              Register
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Events;
