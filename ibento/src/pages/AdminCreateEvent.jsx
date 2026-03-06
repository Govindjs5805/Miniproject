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
  const [showSuccess, setShowSuccess] = useState(false); // Success Toast State

  // Step 1 State: Basic Details
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [venue, setVenue] = useState("");
  const [description, setDescription] = useState("");
  const [seatLimit, setSeatLimit] = useState("");
  const [posterFile, setPosterFile] = useState(null);
  const [isPaid, setIsPaid] = useState(false);
  const [price, setPrice] = useState(0);

  // Step 2 & 3 States
  const [registrationFields, setRegistrationFields] = useState([
    { id: Date.now(), label: "Full Name", type: "text", required: true, options: [] }
  ]);
  const [feedbackFields, setFeedbackFields] = useState([
    { id: Date.now(), label: "How would you rate the event overall?", type: "rating", required: true, options: [] }
  ]);

  // Helpers
  const addField = () => setRegistrationFields([...registrationFields, { id: Date.now(), label: "", type: "text", required: true, options: [] }]);
  const removeField = (id) => setRegistrationFields(registrationFields.filter(f => f.id !== id));
  const updateField = (id, key, value) => setRegistrationFields(registrationFields.map(f => f.id === id ? { ...f, [key]: value } : f));
  
  const addFeedbackField = () => setFeedbackFields([...feedbackFields, { id: Date.now(), label: "", type: "text", required: true, options: [] }]);
  const removeFeedbackField = (id) => setFeedbackFields(feedbackFields.filter(f => f.id !== id));
  const updateFeedbackField = (id, key, value) => setFeedbackFields(feedbackFields.map(f => f.id === id ? { ...f, [key]: value } : f));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!clubId) return;

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

      // Show Toast instead of Alert
      setShowSuccess(true);
      
      // Redirect or Reset after 2 seconds
      setTimeout(() => {
        window.location.href = "/admin/dashboard"; 
      }, 2000);

    } catch (error) {
      alert(error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="create-event-wrapper">
        
        {/* SUCCESS TOAST */}
        {showSuccess && (
          <div className="success-toast-container">
            <div className="success-toast-content">
              <span className="toast-icon"></span>
              <p>Event Published Successfully!</p>
            </div>
          </div>
        )}

        <div className="step-indicator">
          <div className={`step-dot ${step === 1 ? 'active' : ''}`}>1. Details</div>
          <div className={`step-line ${step >= 2 ? 'active' : ''}`}></div>
          <div className={`step-dot ${step === 2 ? 'active' : ''}`}>2. Registration</div>
          <div className={`step-line ${step >= 3 ? 'active' : ''}`}></div>
          <div className={`step-dot ${step === 3 ? 'active' : ''}`}>3. Feedback</div>
        </div>

        <form onSubmit={handleSubmit} className="admin-form">
          {step === 1 && (
            <div className="form-section animate-in">
              <h2 className="section-title">Basic Details</h2>
              <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
              <input type="text" placeholder="Venue" value={venue} onChange={(e) => setVenue(e.target.value)} required />
              <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} rows="4" />
              <input type="number" placeholder="Seat Limit" value={seatLimit} onChange={(e) => setSeatLimit(e.target.value)} required />
              
              <div className="file-input-group">
                <label className="ticket-type-label">Event Poster:</label>
                <input type="file" accept="image/*" onChange={(e) => setPosterFile(e.target.files[0])} />
              </div>

              <div className="ticket-type-container">
                <label className="ticket-type-label">Ticket Type:</label>
                <div className="ticket-options-group">
                  <button type="button" className={`ticket-option ${!isPaid ? "active" : ""}`} onClick={() => setIsPaid(false)}>Free</button>
                  <button type="button" className={`ticket-option ${isPaid ? "active" : ""}`} onClick={() => setIsPaid(true)}>Paid</button>
                </div>
              </div>

              {isPaid && <input type="number" placeholder="Ticket Price (INR)" value={price} onChange={(e) => setPrice(e.target.value)} required className="price-animate-in" />}
              <button type="button" className="nav-btn next" onClick={() => setStep(2)}>Next →</button>
            </div>
          )}

          {step === 2 && (
            <div className="form-section animate-in">
              <h2 className="section-title">Registration Form</h2>
              {registrationFields.map((field, index) => (
                <div key={field.id} className="dynamic-field-card">
                  <div className="field-header">
                    <span>Question #{index + 1}</span>
                    {index !== 0 && <button type="button" className="remove-btn" onClick={() => removeField(field.id)}>✕</button>}
                  </div>
                  <input type="text" placeholder="Question Label" value={field.label} onChange={(e) => updateField(field.id, "label", e.target.value)} required />
                  <select className="field-select" value={field.type} onChange={(e) => updateField(field.id, "type", e.target.value)}>
                    <option value="text">Short Answer</option>
                    <option value="number">Number</option>
                    <option value="select">Dropdown</option>
                  </select>
                </div>
              ))}
              <button type="button" className="add-field-btn" onClick={addField}>+ Add Field</button>
              <div className="button-group">
                <button type="button" className="nav-btn-back" onClick={() => setStep(1)}>Back</button>
                <button type="button" className="nav-btn next" onClick={() => setStep(3)}>Next →</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="form-section animate-in">
              <h2 className="section-title">Feedback Form</h2>
              {feedbackFields.map((field, index) => (
                <div key={field.id} className="dynamic-field-card">
                  <div className="field-header">
                    <span>Feedback Question #{index + 1}</span>
                    {index !== 0 && <button type="button" className="remove-btn" onClick={() => removeFeedbackField(field.id)}>✕</button>}
                  </div>
                  <input type="text" placeholder="Question Label" value={field.label} onChange={(e) => updateFeedbackField(field.id, "label", e.target.value)} required />
                  <select className="field-select" value={field.type} onChange={(e) => updateFeedbackField(field.id, "type", e.target.value)}>
                    <option value="rating">Star Rating</option>
                    <option value="text">Detailed Comment</option>
                    <option value="select">Multiple Choice</option>
                  </select>
                </div>
              ))}
              <button type="button" className="add-field-btn" onClick={addFeedbackField}>+ Add Question</button>
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