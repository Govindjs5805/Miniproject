import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../components/Admin/AdminLayout";

function AdminCreateEvent() {
  const { role, clubId, user } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [venue, setVenue] = useState("");
  const [description, setDescription] = useState("");
  const [poster, setPoster] = useState(null);
  const [ticketTemplate, setTicketTemplate] = useState(null);

  const [qrX, setQrX] = useState(100);
  const [qrY, setQrY] = useState(100);
  const [qrSize, setQrSize] = useState(100);

  const [loading, setLoading] = useState(false);

  if (role !== "clubLead") {
    return (
      <AdminLayout>
        <h2>Access Denied</h2>
      </AdminLayout>
    );
  }

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "ibento_unsigned");

    const response = await fetch(
      "https://api.cloudinary.com/v1_1/dzx6f9qjz/image/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();
    return data.secure_url;
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let posterURL = "";
      let templateURL = "";

      if (poster) {
        posterURL = await uploadToCloudinary(poster);
      }

      if (ticketTemplate) {
        templateURL = await uploadToCloudinary(ticketTemplate);
      }

      await addDoc(collection(db, "events"), {
        title,
        date,
        venue,
        description,
        posterURL,
        ticketTemplateURL: templateURL,
        qrPositionX: qrX,
        qrPositionY: qrY,
        qrSize: qrSize,
        clubId,
        createdBy: user.uid,
        createdAt: serverTimestamp(),
        status: "upcoming"
      });

      alert("Event created successfully!");
      navigate("/admin");

    } catch (error) {
      console.error(error);
      alert("Error creating event");
    }

    setLoading(false);
  };

  return (
    <AdminLayout>
      <h2>Create Event</h2>

      <form onSubmit={handleCreateEvent} style={{ maxWidth: "500px" }}>

        <input type="text" placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        /><br /><br />

        <input type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        /><br /><br />

        <input type="text" placeholder="Venue"
          value={venue}
          onChange={(e) => setVenue(e.target.value)}
          required
        /><br /><br />

        <textarea placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        /><br /><br />

        <label>Poster:</label><br />
        <input type="file"
          accept="image/*"
          onChange={(e) => setPoster(e.target.files[0])}
        /><br /><br />

        <label>Ticket Template:</label><br />
        <input type="file"
          accept="image/*"
          onChange={(e) => setTicketTemplate(e.target.files[0])}
        /><br /><br />

        <label>QR X Position:</label>
        <input type="number"
          value={qrX}
          onChange={(e) => setQrX(Number(e.target.value))}
        /><br /><br />

        <label>QR Y Position:</label>
        <input type="number"
          value={qrY}
          onChange={(e) => setQrY(Number(e.target.value))}
        /><br /><br />

        <label>QR Size:</label>
        <input type="number"
          value={qrSize}
          onChange={(e) => setQrSize(Number(e.target.value))}
        /><br /><br />

        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Event"}
        </button>

      </form>
    </AdminLayout>
  );
}

export default AdminCreateEvent;