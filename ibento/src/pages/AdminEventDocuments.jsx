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

  // --- NEW UI STATES ---
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

  // Helper to show custom toast
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
    if (!file || !selectedEventId) return showToast("Please select a file and event!", "error");
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

      showToast(`${docType} Uploaded Successfully!`);
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
      showToast("Document removed from vault.");
    } catch (e) {
      showToast("Failed to delete.", "error");
    } finally {
      setConfirmModal({ show: false, doc: null });
    }
  };

  return (
    <AdminLayout>
      <div style={{ padding: "20px", position: "relative" }}>
        
        {/* --- CUSTOM TOAST NOTIFICATION --- */}
        {toast.show && (
          <div style={{
            position: "fixed", top: "20px", right: "20px", padding: "15px 25px",
            backgroundColor: toast.type === "success" ? "#28a745" : "#dc3545",
            color: "white", borderRadius: "8px", boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            zIndex: 1000, animation: "fadeIn 0.3s"
          }}>
            {toast.message}
          </div>
        )}

        {/* --- CUSTOM CONFIRMATION MODAL --- */}
        {confirmModal.show && (
          <div style={{
            position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center",
            alignItems: "center", zIndex: 1001
          }}>
            <div style={{ background: "white", padding: "30px", borderRadius: "12px", width: "90%", maxWidth: "400px", textAlign: "center" }}>
              <h3>Confirm Delete</h3>
              <p>Are you sure you want to remove <b>{confirmModal.doc?.name}</b>?</p>
              <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginTop: "20px" }}>
                <button onClick={() => setConfirmModal({ show: false, doc: null })} style={{ padding: "10px 20px", border: "1px solid #ddd", background: "none", borderRadius: "6px", cursor: "pointer" }}>Cancel</button>
                <button onClick={executeDelete} style={{ padding: "10px 20px", background: "#dc3545", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" }}>Delete</button>
              </div>
            </div>
          </div>
        )}

        <h2>Event Document Vault 📁</h2>
        
        <select 
          onChange={(e) => setSelectedEventId(e.target.value)} 
          style={{ padding: "10px", width: "100%", maxWidth: "400px", margin: "10px 0", borderRadius: "6px" }}
        >
          <option value="">-- Select Event --</option>
          {events.map(ev => <option key={ev.id} value={ev.id}>{ev.title}</option>)}
        </select>

        {selectedEventId && (
          <div style={{ background: "#fff", padding: "20px", border: "1px solid #ddd", borderRadius: "12px", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}>
            <h3>Manage: {selectedEventData?.title}</h3>
            
            <div style={{ margin: "20px 0", display: "flex", gap: "10px", flexWrap: "wrap", background: "#f8f9fa", padding: "15px", borderRadius: "10px" }}>
              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: "bold", color: "#666" }}>CATEGORY</label>
                <select onChange={(e) => setDocType(e.target.value)} style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}>
                  <option>Permission Letter</option>
                  <option>Geotag Photo</option>
                  <option>Event Photo</option>
                  <option>Other Documents</option>
                </select>
              </div>

              <div style={{ flex: 1 }}>
                <label style={{ display: "block", fontSize: "11px", fontWeight: "bold", color: "#666" }}>FILE</label>
                <input type="file" onChange={(e) => setFile(e.target.files[0])} style={{ padding: "5px" }} />
              </div>

              <button 
                onClick={handleUpload} 
                disabled={uploading} 
                style={{ alignSelf: "flex-end", padding: "10px 25px", background: "#007bff", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}
              >
                {uploading ? "Uploading..." : "Upload File"}
              </button>
            </div>

            <hr style={{ border: "0", borderTop: "1px solid #eee" }} />

            <div style={{ marginTop: "20px" }}>
              <h4 style={{ color: "#555" }}>Stored Files</h4>
              {selectedEventData?.documents?.map((d, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "15px", borderBottom: "1px solid #f1f1f1", alignItems: "center" }}>
                  <span>
                    <span style={{ fontSize: "11px", background: "#e9ecef", padding: "3px 8px", borderRadius: "12px", marginRight: "10px", color: "#495057" }}>{d.type}</span>
                    {d.name}
                  </span>
                  <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
                    <button onClick={() => handleFileAction(d.url, 'view')} style={{ color: "#007bff", background: "none", border: "none", cursor: "pointer", fontWeight: "600" }}>View</button>
                    <button onClick={() => handleFileAction(d.url, 'download')} style={{ color: "#6c757d", background: "none", border: "none", cursor: "pointer" }}>Download</button>
                    <button 
                      onClick={() => setConfirmModal({ show: true, doc: d })} 
                      style={{ background: "none", border: "none", cursor: "pointer", padding: "5px" }}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default AdminEventDocuments;