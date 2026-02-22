import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import AdminLayout from "../components/Admin/AdminLayout";

function AdminCreateEvent() {
  const { clubId } = useAuth();

  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [venue, setVenue] = useState("");
  const [description, setDescription] = useState("");
  const [seatLimit, setSeatLimit] = useState("");
  const [posterFile, setPosterFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!clubId) {
      alert("Club ID not found. Please login again.");
      return;
    }

    try {
      setUploading(true);

      let uploadedPosterURL = "";

      // 🔥 Upload to Cloudinary if file selected
      if (posterFile) {
        const formData = new FormData();
        formData.append("file", posterFile);
        formData.append("upload_preset", "ibento_unsigned"); // MUST match Cloudinary preset

        const res = await fetch(
          "https://api.cloudinary.com/v1_1/dzx6f9qjz/image/upload",
          {
            method: "POST",
            body: formData,
          }
        );

        const data = await res.json();
        console.log("Cloudinary response:", data);

        if (!data.secure_url) {
          throw new Error(data.error?.message || "Cloudinary upload failed");
        }

        uploadedPosterURL = data.secure_url;
      }

      // 🔥 Save event to Firestore
      await addDoc(collection(db, "events"), {
        title,
        date,
        venue,
        description,
        seatLimit: Number(seatLimit),
        clubId,
        posterURL: uploadedPosterURL || "",
        status: "upcoming",
        createdAt: serverTimestamp(),
      });

      alert("Event Created Successfully!");

      // Reset form
      setTitle("");
      setDate("");
      setVenue("");
      setDescription("");
      setSeatLimit("");
      setPosterFile(null);
      setUploading(false);
    } catch (error) {
      console.error("FULL ERROR:", error);
      alert(error.message);
      setUploading(false);
    }
  };

  return (
    <AdminLayout>
      <div style={{ padding: "30px", maxWidth: "600px" }}>
        <h2>Create Event</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Event Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <br /><br />

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />

          <br /><br />

          <input
            type="text"
            placeholder="Venue"
            value={venue}
            onChange={(e) => setVenue(e.target.value)}
            required
          />

          <br /><br />

          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="4"
          />

          <br /><br />

          <input
            type="number"
            placeholder="Seat Limit"
            value={seatLimit}
            onChange={(e) => setSeatLimit(e.target.value)}
            required
          />

          <br /><br />

          {/* 🔥 File Upload */}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setPosterFile(e.target.files[0])}
          />

          <br /><br />

          <button type="submit" disabled={uploading}>
            {uploading ? "Creating Event..." : "Create Event"}
          </button>
        </form>
      </div>
    </AdminLayout>
  );
}

export default AdminCreateEvent;