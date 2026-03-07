import React, { useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import AdminLayout from "../components/Admin/AdminLayout";
import "./AdminAbout.css";

function AdminAbout() {
  const { clubId } = useAuth();
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // --- TOAST STATES ---
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [toastType, setToastType] = useState("success"); // 'success' or 'error'

  useEffect(() => {
    const fetchCurrentAbout = async () => {
      if (!clubId) return;
      setLoading(true);
      try {
        const docRef = doc(db, "clubs", clubId.toLowerCase());
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setDescription(docSnap.data().description || "");
        }
      } catch (err) {
        console.error("Error fetching about:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCurrentAbout();
  }, [clubId]);

  // --- TOAST TRIGGER ---
  const triggerToast = (msg, type = "success") => {
    setToastMsg(msg);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const docRef = doc(db, "clubs", clubId.toLowerCase());
      await setDoc(docRef, { 
        description: description,
        lastUpdated: new Date()
      }, { merge: true });
      
      // Replaced alert with custom toast
      triggerToast("Forum 'About' section updated successfully!");
      
    } catch (err) {
      triggerToast("Error saving: " + err.message, "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      {/* --- CUSTOM TOAST --- */}
      {showToast && (
        <div className={`about-toast ${toastType}`}>
          <span className="toast-icon">{toastType === "success" ? "✓" : "✕"}</span>
          <span className="toast-text">{toastMsg}</span>
        </div>
      )}

      <div className="admin-about-editor">
        <h2>Edit Forum About</h2>
        <p className="hint">This text will appear in the "Information" tab of your community page.</p>
        
        {loading ? <p className="loading-text">Loading current info...</p> : (
          <form onSubmit={handleSave}>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your forum, its mission, and goals..."
              rows="10"
              required
            />
            <button type="submit" className="submit-btn" disabled={saving}>
              {saving ? "Saving Changes..." : "Update About Section"}
            </button>
          </form>
        )}
      </div>
    </AdminLayout>
  );
}

export default AdminAbout;