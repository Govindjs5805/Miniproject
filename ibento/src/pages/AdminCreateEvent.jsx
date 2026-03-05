import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import AdminLayout from "../components/Admin/AdminLayout";
import "./AdminCreateEvent.css";

function AdminCreateEvent() {
  const { clubId } = useAuth();
  const [step, setStep] = useState(1);
  const [uploading, setUploading] = useState(false);

  // Step 1 State: Basic Details
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [venue, setVenue] = useState("");
  const [description, setDescription] = useState("");
  const [seatLimit, setSeatLimit] = useState("");
  const [posterFile, setPosterFile] = useState(null);
  const [isPaid, setIsPaid] = useState(false);
  const [price, setPrice] = useState(0);

  // Step 2 State: Registration Fields
  const [registrationFields, setRegistrationFields] = useState([
    { id: Date.now(), label: "Full Name", type: "text", required: true, options: [] }
  ]);

  // Step 3 State: Feedback Fields
  const [feedbackFields, setFeedbackFields] = useState([
    { id: Date.now(), label: "How would you rate the event overall?", type: "rating", required: true, options: [] }
  ]);

  // --- Helpers for Step 2 (Registration) ---
  const addField = () => setRegistrationFields([...registrationFields, { id: Date.now(), label: "", type: "text", required: true, options: [] }]);
  const removeField = (id) => setRegistrationFields(registrationFields.filter(f => f.id !== id));
  const updateField = (id, key, value) => setRegistrationFields(registrationFields.map(f => f.id === id ? { ...f, [key]: value } : f));

  // --- Helpers for Step 3 (Feedback) ---
  const addFeedbackField = () => setFeedbackFields([...feedbackFields, { id: Date.now(), label: "", type: "text", required: true, options: [] }]);
  const removeFeedbackField = (id) => setFeedbackFields(feedbackFields.filter(f => f.id !== id));
  const updateFeedbackField = (id, key, value) => setFeedbackFields(feedbackFields.map(f => f.id === id ? { ...f, [key]: value } : f));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!clubId) return alert("Club ID not found.");

    try {
      setUploading(true);
      let uploadedPosterURL = "";

      if (posterFile) {
        const formData = new FormData();
        formData.append("file", posterFile);
        formData.append("upload_preset", "ibento_unsigned");
        const res = await fetch("https://api.cloudinary.com/v1_1/dzx6f9qjz/image/upload", { method: "POST", body: formData });
        const data = await res.json();
        uploadedPosterURL = data.secure_url;
      }

      await addDoc(collection(db, "events"), {
        title, date, venue, description,
        seatLimit: Number(seatLimit),
        clubId,
        posterURL: uploadedPosterURL || "",
        isPaid,
        price: isPaid ? Number(price) : 0,
        registrationSchema: registrationFields,
        feedbackSchema: feedbackFields,
        status: "upcoming",
        createdAt: serverTimestamp(),
      });

      alert("Event Created Successfully!");
      window.location.reload();
    } catch (error) {
      alert(error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="create-event-wrapper">
        <div className="step-indicator">
          <div className={`step-dot ${step === 1 ? 'active' : ''}`}>1. Details</div>
          <div className={`step-line ${step >= 2 ? 'active' : ''}`}></div>
          <div className={`step-dot ${step === 2 ? 'active' : ''}`}>2. Registration</div>
          <div className={`step-line ${step >= 3 ? 'active' : ''}`}></div>
          <div className={`step-dot ${step === 3 ? 'active' : ''}`}>3. Feedback</div>
        </div>

        <form onSubmit={handleSubmit} className="admin-form">
          {/* STEP 1: BASIC DETAILS */}
          {step === 1 && (
            <div className="form-section">
              <h2 style={{color: "#a78bfa", marginBottom: "20px"}}>Basic Details</h2>
              <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
              <input type="text" placeholder="Venue" value={venue} onChange={(e) => setVenue(e.target.value)} required />
              <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} rows="4" />
              <input type="number" placeholder="Seat Limit" value={seatLimit} onChange={(e) => setSeatLimit(e.target.value)} required />
              
              <div className="file-input-group">
                <label className="section-label" style={{display: 'block', color: '#a78bfa', marginBottom: '10px'}}>Event Poster:</label>
                <input type="file" accept="image/*" onChange={(e) => setPosterFile(e.target.files[0])} />
              </div>

              <div className="payment-toggle">
                <label style={{marginBottom: '10px', display: 'block'}}>Ticket Type:</label>
                <div className="toggle-btns">
                  <button type="button" className={!isPaid ? "active" : ""} onClick={() => setIsPaid(false)}>Free</button>
                  <button type="button" className={isPaid ? "active" : ""} onClick={() => setIsPaid(true)}>Paid</button>
                </div>
              </div>

              {isPaid && <input type="number" placeholder="Ticket Price (INR)" value={price} onChange={(e) => setPrice(e.target.value)} required />}
              <button type="button" className="nav-btn next" onClick={() => setStep(2)}>Next →</button>
            </div>
          )}

          {/* STEP 2: REGISTRATION BUILDER */}
          {step === 2 && (
            <div className="form-section">
              <h2 style={{color: "#a78bfa", marginBottom: "20px"}}>Registration Form</h2>
              {registrationFields.map((field, index) => (
                <div key={field.id} className="dynamic-field-card">
                  <div className="field-header">
                    <span>Question #{index + 1}</span>
                    {index !== 0 && <button type="button" className="remove-btn" onClick={() => removeField(field.id)}>✕</button>}
                  </div>
                  <input type="text" placeholder="Question Label" value={field.label} onChange={(e) => updateField(field.id, "label", e.target.value)} required />
                  <select value={field.type} onChange={(e) => updateField(field.id, "type", e.target.value)}>
                    <option value="text">Short Answer</option>
                    <option value="number">Number</option>
                    <option value="select">Dropdown</option>
                  </select>
                  {field.type === "select" && (
                    <input 
                      type="text" 
                      placeholder="Options (comma separated: Yes, No, Maybe)" 
                      value={field.options.join(", ")}
                      onChange={(e) => updateField(field.id, "options", e.target.value.split(",").map(s => s.trim()))}
                      className="options-input"
                    />
                  )}
                </div>
              ))}
              <button type="button" className="add-field-btn" onClick={addField}>+ Add Field</button>
              <div className="button-group">
                <button type="button" className="nav-btn-back" onClick={() => setStep(1)}>Back</button>
                <button type="button" className="nav-btn next" onClick={() => setStep(3)}>Next: Feedback →</button>
              </div>
            </div>
          )}

          {/* STEP 3: FEEDBACK BUILDER (FIXED) */}
          {step === 3 && (
            <div className="form-section">
              <h2 style={{color: "#a78bfa", marginBottom: "20px"}}>Feedback Form</h2>
              {feedbackFields.map((field, index) => (
                <div key={field.id} className="dynamic-field-card">
                  <div className="field-header">
                    <span>Feedback Question #{index + 1}</span>
                    {index !== 0 && <button type="button" className="remove-btn" onClick={() => removeFeedbackField(field.id)}>✕</button>}
                  </div>
                  <input type="text" placeholder="Question Label" value={field.label} onChange={(e) => updateFeedbackField(field.id, "label", e.target.value)} required />
                  <select value={field.type} onChange={(e) => updateFeedbackField(field.id, "type", e.target.value)}>
                    <option value="rating">Star Rating</option>
                    <option value="text">Detailed Comment</option>
                    <option value="select">Multiple Choice</option>
                  </select>

                  {/* FIX: Show options input when 'Multiple Choice' (select) is picked */}
                  {field.type === "select" && (
                    <input 
                      type="text" 
                      placeholder="Choices (comma separated: Poor, Average, Good, Excellent)" 
                      value={field.options.join(", ")}
                      onChange={(e) => updateFeedbackField(field.id, "options", e.target.value.split(",").map(s => s.trim()))}
                      className="options-input"
                    />
                  )}
                </div>
              ))}
              <button type="button" className="add-field-btn" onClick={addFeedbackField}>+ Add Feedback Question</button>
              <div className="button-group">
                <button type="button" className="nav-btn-back" onClick={() => setStep(2)}>Back</button>
                <button type="submit" className="submit-btn" disabled={uploading}>
                  {uploading ? "Publishing..." : "Publish Event"}
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