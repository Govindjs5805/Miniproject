import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import AdminLayout from "../components/Admin/AdminLayout";
import "./AdminCreateEvent.css"; // Ensure you create this for the new UI

function AdminCreateEvent() {
  const { clubId } = useAuth();

  // Step Control
  const [step, setStep] = useState(1);

  // Step 1: Basic Details
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [venue, setVenue] = useState("");
  const [description, setDescription] = useState("");
  const [seatLimit, setSeatLimit] = useState("");
  const [posterFile, setPosterFile] = useState(null);
  
  // Paid vs Free Logic
  const [isPaid, setIsPaid] = useState(false);
  const [price, setPrice] = useState(0);

  // Step 2: Dynamic Registration Fields
  const [registrationFields, setRegistrationFields] = useState([
    { id: Date.now(), label: "Full Name", type: "text", required: true, options: [] }
  ]);

  const [uploading, setUploading] = useState(false);

  // --- Dynamic Form Helpers ---
  const addField = () => {
    setRegistrationFields([
      ...registrationFields,
      { id: Date.now(), label: "", type: "text", required: true, options: [] }
    ]);
  };

  const removeField = (id) => {
    setRegistrationFields(registrationFields.filter(f => f.id !== id));
  };

  const updateField = (id, key, value) => {
    setRegistrationFields(registrationFields.map(f => 
      f.id === id ? { ...f, [key]: value } : f
    ));
  };

  // --- Submit Logic ---
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!clubId) {
      alert("Club ID not found. Please login again.");
      return;
    }

    try {
      setUploading(true);
      let uploadedPosterURL = "";

      if (posterFile) {
        const formData = new FormData();
        formData.append("file", posterFile);
        formData.append("upload_preset", "ibento_unsigned");

        const res = await fetch(
          "https://api.cloudinary.com/v1_1/dzx6f9qjz/image/upload",
          { method: "POST", body: formData }
        );

        const data = await res.json();
        if (!data.secure_url) throw new Error("Cloudinary upload failed");
        uploadedPosterURL = data.secure_url;
      }

      // Save to Firestore with Registration Schema
      await addDoc(collection(db, "events"), {
        title,
        date,
        venue,
        description,
        seatLimit: Number(seatLimit),
        clubId,
        posterURL: uploadedPosterURL || "",
        isPaid,
        price: isPaid ? Number(price) : 0,
        registrationSchema: registrationFields, // The dynamic form questions
        status: "upcoming",
        createdAt: serverTimestamp(),
      });

      alert("Event Created Successfully with Custom Registration Form!");
      window.location.reload(); // Quick reset
    } catch (error) {
      console.error("Error:", error);
      alert(error.message);
      setUploading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="create-event-wrapper">
        <div className="step-indicator">
          <div className={`step-dot ${step === 1 ? 'active' : ''}`}>1. Details</div>
          <div className={`step-line ${step === 2 ? 'active' : ''}`}></div>
          <div className={`step-dot ${step === 2 ? 'active' : ''}`}>2. Form Builder</div>
        </div>

        <form onSubmit={handleSubmit} className="admin-form">
          {step === 1 ? (
            <div className="form-section">
              <h2>Basic Event Details</h2>
              <input type="text" placeholder="Event Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
              <input type="text" placeholder="Venue" value={venue} onChange={(e) => setVenue(e.target.value)} required />
              <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} rows="4" />
              <input type="number" placeholder="Seat Limit" value={seatLimit} onChange={(e) => setSeatLimit(e.target.value)} required />
              
              <div className="payment-toggle">
                <label>Ticket Type:</label>
                <div className="toggle-btns">
                  <button type="button" className={!isPaid ? "active" : ""} onClick={() => setIsPaid(false)}>Free</button>
                  <button type="button" className={isPaid ? "active" : ""} onClick={() => setIsPaid(true)}>Paid</button>
                </div>
              </div>

              {isPaid && (
                <input type="number" placeholder="Ticket Price (INR)" value={price} onChange={(e) => setPrice(e.target.value)} required />
              )}

              <div className="file-input">
                <label>Event Poster:</label>
                <input type="file" accept="image/*" onChange={(e) => setPosterFile(e.target.files[0])} />
              </div>

              <button type="button" className="nav-btn next" onClick={() => setStep(2)}>Next: Setup Registration →</button>
            </div>
          ) : (
            <div className="form-section">
              <h2>Registration Form Builder</h2>
              <p className="hint">Define the questions students must answer to register.</p>

              {registrationFields.map((field, index) => (
                <div key={field.id} className="dynamic-field-card">
                  <div className="field-header">
                    <span>Question #{index + 1}</span>
                    {index !== 0 && <button type="button" className="remove-btn" onClick={() => removeField(field.id)}>✕</button>}
                  </div>
                  
                  <input 
                    type="text" 
                    placeholder="Field Label (e.g. Select your Gender)" 
                    value={field.label}
                    onChange={(e) => updateField(field.id, "label", e.target.value)}
                    required
                  />

                  <select 
                    value={field.type} 
                    onChange={(e) => updateField(field.id, "type", e.target.value)}
                  >
                    <option value="text">Short Answer</option>
                    <option value="number">Number</option>
                    <option value="select">Dropdown (Options)</option>
                    <option value="radio">Multiple Choice</option>
                  </select>

                  {(field.type === "select" || field.type === "radio") && (
                    <input 
                      type="text" 
                      placeholder="Options (comma separated: Male, Female, Other)" 
                      onChange={(e) => updateField(field.id, "options", e.target.value.split(","))}
                      className="options-input"
                    />
                  )}
                </div>
              ))}

              <button type="button" className="add-field-btn" onClick={addField}>+ Add Question</button>

              <div className="button-group">
                <button type="button" className="nav-btn" onClick={() => setStep(1)}>← Back</button>
                <button type="submit" className="submit-btn" disabled={uploading}>
                  {uploading ? "Publishing..." : "Publish Event 🚀"}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </AdminLayout>
  );
}

export default AdminCreateEvent;