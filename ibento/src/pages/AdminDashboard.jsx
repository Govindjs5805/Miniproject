import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";

function AdminDashboard() {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("");
  const [venue, setVenue] = useState("");

  const handleCreateEvent = async (e) => {
  e.preventDefault();

  try {
    const docRef = await addDoc(collection(db, "events"), {
      title,
      date,
      category,
      venue,
      createdAt: new Date()
    });

    console.log("EVENT CREATED WITH ID:", docRef.id);
    alert("Event created successfully!");
  } catch (error) {
    console.error("FIRESTORE ERROR:", error);
    alert(error.message);
  }
};

  return (
    <div style={{ padding: "40px", maxWidth: "500px", margin: "auto" }}>
      <h2>Admin Dashboard</h2>
      <p>Create a new campus event</p>

      <form onSubmit={handleCreateEvent}>
        <input
          type="text"
          placeholder="Event Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ width: "100%", padding: "10px", marginBottom: "15px" }}
          required
        />

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          style={{ width: "100%", padding: "10px", marginBottom: "15px" }}
          required
        />

        <input
          type="text"
          placeholder="Category (Tech, Arts, Sports)"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{ width: "100%", padding: "10px", marginBottom: "15px" }}
          required
        />

        <input
          type="text"
          placeholder="Venue"
          value={venue}
          onChange={(e) => setVenue(e.target.value)}
          style={{ width: "100%", padding: "10px", marginBottom: "15px" }}
          required
        />

        <button type="submit" style={{ width: "100%", padding: "10px" }}>
          Create Event
        </button>
      </form>
    </div>
  );
}

export default AdminDashboard;
