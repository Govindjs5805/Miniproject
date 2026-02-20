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
  const [loading, setLoading] = useState(false);

  if (role !== "clubLead") {
    return (
      <AdminLayout>
        <h2 className="text-red-600 text-xl">Access Denied</h2>
      </AdminLayout>
    );
  }

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let posterURL = "";

      // 🔥 Upload to Cloudinary
      if (poster) {
        const formData = new FormData();
        formData.append("file", poster);
        formData.append("upload_preset", "ibento_unsigned");

        const response = await fetch(
          "https://api.cloudinary.com/v1_1/dzx6f9qjz/image/upload",
          {
            method: "POST",
            body: formData,
          }
        );

        const data = await response.json();

        if (!data.secure_url) {
          throw new Error("Image upload failed");
        }

        posterURL = data.secure_url;
      }

      // 🔥 Save event to Firestore
      await addDoc(collection(db, "events"), {
        title,
        date,
        venue,
        description,
        posterURL,
        clubId: clubId,
        createdBy: user.uid,
        createdAt: serverTimestamp(),
        status: "upcoming",
      });

      alert("Event created successfully!");
      navigate("/admin");

    } catch (error) {
      console.error(error);
      alert(error.message);
    }

    setLoading(false);
  };

  return (
    <AdminLayout>
      <div className="max-w-lg">
        <h1 className="text-2xl font-bold mb-6">Create Event</h1>

        <form onSubmit={handleCreateEvent} className="space-y-4">

          <input
            type="text"
            placeholder="Event Title"
            className="w-full p-2 border rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <input
            type="date"
            className="w-full p-2 border rounded"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Venue"
            className="w-full p-2 border rounded"
            value={venue}
            onChange={(e) => setVenue(e.target.value)}
            required
          />

          <textarea
            placeholder="Event Description"
            rows="4"
            className="w-full p-2 border rounded"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setPoster(e.target.files[0])}
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-accent px-4 py-2 rounded font-semibold"
          >
            {loading ? "Uploading..." : "Create Event"}
          </button>

        </form>
      </div>
    </AdminLayout>
  );
}

export default AdminCreateEvent;