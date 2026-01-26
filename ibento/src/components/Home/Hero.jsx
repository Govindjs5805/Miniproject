import "./Home.css"

function Hero() {
  return (
    <section
      style={{
        padding: "80px",
        background: "#196843",
        color: "white"
      }}
    >
      <h1 style={{ fontSize: "48px" }}>
        Your Campus, Your Events
      </h1>

      <p style={{ marginTop: "10px", maxWidth: "600px" }}>
        Discover, register, and manage all campus events from one platform.
      </p>

      <div style={{ marginTop: "25px" }}>
        <button style={{ marginRight: "10px" }}>Browse Events</button>
        <button>Host Event</button>
      </div>
    </section>
  );
}

export default Hero;
