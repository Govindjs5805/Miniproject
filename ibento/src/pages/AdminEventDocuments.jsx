import { useEffect, useState } from "react";
import { collection, query, where, getDocs, doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import AdminLayout from "../components/Admin/AdminLayout";

function AdminEventDocuments() {
  const { clubId } = useAuth();
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState("");
  const [selectedEventData, setSelectedEventData] = useState(null);
  const [file, setFile] = useState(null);
  const [docType, setDocType] = useState("Permission Letter");
  const [uploading, setUploading] = useState(false);

  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  const [confirmModal, setConfirmModal] = useState({ show: false, doc: null });

  useEffect(() => {
    const fetchEvents = async () => {
      const q = query(collection(db, "events"), where("clubId", "==", clubId));
      const snap = await getDocs(q);
      setEvents(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    if (clubId) fetchEvents();
  }, [clubId]);

  useEffect(() => {
    const ev = events.find(e => e.id === selectedEventId);
    setSelectedEventData(ev || null);
  }, [selectedEventId, events]);

  const showToast = (msg, type = "success") => {
    setToast({ show: true, message: msg, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3000);
  };

  const handleFileAction = async (url, action = 'view') => {
    if (!url) return;
    try {
      if (action === 'download') {
        const response = await fetch(url);
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = "document"; 
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        window.open(url, "_blank");
      }
    } catch (e) {
      window.open(url, "_blank");
    }
  };

  const handleUpload = async () => {
    if (!file || !selectedEventId) return showToast("Select a file and event!", "error");
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "ibento_unsigned"); 

      const res = await fetch("https://api.cloudinary.com/v1_1/dzx6f9qjz/auto/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      const eventRef = doc(db, "events", selectedEventId);
      const newDoc = {
        name: file.name,
        url: data.secure_url,
        type: docType,
        uploadedAt: new Date().toISOString(),
      };

      await updateDoc(eventRef, { documents: arrayUnion(newDoc) });
      setSelectedEventData(prev => ({
        ...prev,
        documents: prev.documents ? [...prev.documents, newDoc] : [newDoc]
      }));

      showToast(`${docType} Uploaded!`);
      setFile(null);
    } catch (error) {
      showToast("Upload failed.", "error");
    } finally {
      setUploading(false);
    }
  };

  const executeDelete = async () => {
    const docToDelete = confirmModal.doc;
    try {
      const eventRef = doc(db, "events", selectedEventId);
      await updateDoc(eventRef, { documents: arrayRemove(docToDelete) });
      
      setSelectedEventData(prev => ({
        ...prev,
        documents: prev.documents.filter(d => d.url !== docToDelete.url)
      }));
      showToast("Document removed.");
    } catch (e) {
      showToast("Delete failed.", "error");
    } finally {
      setConfirmModal({ show: false, doc: null });
    }
  };

  return (
    <AdminLayout>
      <div className="vault-container">
        {/* Toast Notification */}
        {toast.show && (
          <div className={`vault-toast ${toast.type}`}>
            {toast.message}
          </div>
        )}

        {/* Delete Modal */}
        {confirmModal.show && (
          <div className="vault-modal-overlay">
            <div className="vault-modal-card">
              <h3>Confirm Delete</h3>
              <p>Remove <b>{confirmModal.doc?.name}</b>?</p>
              <div className="vault-modal-actions">
                <button onClick={() => setConfirmModal({ show: false, doc: null })} className="v-btn-secondary">Cancel</button>
                <button onClick={executeDelete} className="v-btn-danger">Delete</button>
              </div>
            </div>
          </div>
        )}

        <h2 className="welcome-text">Event Document Vault</h2>
        
        <select 
          className="vault-main-select"
          onChange={(e) => setSelectedEventId(e.target.value)} 
        >
          <option value="">-- Select Event --</option>
          {events.map(ev => <option key={ev.id} value={ev.id}>{ev.title}</option>)}
        </select>

        {selectedEventId && (
          <div className="vault-glass-card">
            <h3 className="vault-card-title">Manage: {selectedEventData?.title}</h3>
            
            <div className="vault-upload-section">
              <div className="vault-input-group">
                <label>CATEGORY</label>
                <select onChange={(e) => setDocType(e.target.value)} className="vault-select-dark">
                  <option>Permission Letter</option>
                  <option>Geotag Photo</option>
                  <option>Event Photo</option>
                  <option>Other Documents</option>
                </select>
              </div>

              <div className="vault-input-group flex-1">
                <label>FILE</label>
                <input type="file" onChange={(e) => setFile(e.target.files[0])} className="vault-file-input" />
              </div>

              <button 
                onClick={handleUpload} 
                disabled={uploading} 
                className="vault-primary-btn"
              >
                {uploading ? "Uploading..." : "Upload File"}
              </button>
            </div>

            <div className="vault-divider"></div>

            <div className="vault-file-list">
              <h4 className="vault-subtitle">Stored Files</h4>
              {selectedEventData?.documents?.map((d, i) => (
                <div key={i} className="vault-file-row">
                  <div className="vault-file-info">
                    <span className="vault-badge">{d.type}</span>
                    <span className="vault-filename">{d.name}</span>
                  </div>
                  <div className="vault-row-actions">
                    <button onClick={() => handleFileAction(d.url, 'view')} className="v-link-view">View</button>
                    <button onClick={() => handleFileAction(d.url, 'download')} className="v-link-dl">Download</button>
                    <button 
                      onClick={() => setConfirmModal({ show: true, doc: d })} 
                      className="v-btn-icon"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
              {(!selectedEventData?.documents || selectedEventData.documents.length === 0) && (
                <p className="vault-empty-msg">No documents found for this event.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default AdminEventDocuments;