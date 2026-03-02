import { useEffect, useState, useRef } from "react";
import { collection, query, where, getDocs, doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { Html5Qrcode } from "html5-qrcode";
import AdminLayout from "../components/Admin/AdminLayout";

function AdminCheckIn() {
  const { clubId } = useAuth();
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [scannerStatus, setScannerStatus] = useState("Step 1: Select Event");
  const [debugLog, setDebugLog] = useState(""); 
  const scannerRef = useRef(null);
  const processingRef = useRef(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const q = query(collection(db, "events"), where("clubId", "==", clubId));
        const snap = await getDocs(q);
        setEvents(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (err) { setDebugLog("Event Load Error: " + err.message); }
    };
    if (clubId) fetchEvents();
  }, [clubId]);

  useEffect(() => {
    if (!selectedEvent) return;

    const startScanner = async () => {
      if (scannerRef.current) {
        try { await scannerRef.current.stop(); } catch (e) {}
      }

      const scanner = new Html5Qrcode("reader");
      scannerRef.current = scanner;

      scanner.start(
        { facingMode: "user" }, // Correct for Laptop Front Camera
        { 
          fps: 30, // Higher FPS for laptop webcams
          qrbox: { width: 300, height: 300 },
          aspectRatio: 1.0 
        },
        async (decodedText) => {
          if (processingRef.current) return;
          processingRef.current = true;
          
          const cleanId = decodedText.trim();
          setScannerStatus(`🔍 Detected ID: ${cleanId}`);

          try {
            const regRef = doc(db, "registrations", cleanId);
            const regSnap = await getDoc(regRef);

            if (!regSnap.exists()) {
              setScannerStatus("Ticket Not Found ❌");
              setDebugLog(`DB Check: No record for ${cleanId}`);
            } else {
              const data = regSnap.data();

              if (data.eventId !== selectedEvent) {
                setScannerStatus("Wrong Event ❌");
              } else if (data.checkInStatus === true) {
                setScannerStatus("Already In ⚠️");
              } else {
                // Update Firebase
                await updateDoc(regRef, {
                  checkInStatus: true,
                  checkInTime: serverTimestamp()
                });
                setScannerStatus(`✅ Verified: ${data.userName}`);
              }
            }
          } catch (error) {
            setDebugLog("Firebase Error: " + error.message);
          } finally {
            setTimeout(() => {
              processingRef.current = false;
              setScannerStatus("Ready for next scan...");
            }, 3000);
          }
        }
      ).catch(err => setDebugLog("Camera Error: " + err));
    };

    const timer = setTimeout(startScanner, 500);
    return () => {
      clearTimeout(timer);
      if (scannerRef.current) scannerRef.current.stop().catch(() => {});
    };
  }, [selectedEvent]);

  return (
    <AdminLayout>
      <div style={{ padding: "20px", textAlign: "center", color: "#fff", background: "#111" }}>
        <h2>Laptop Attendance Scanner</h2>
        
        <select value={selectedEvent} onChange={(e) => setSelectedEvent(e.target.value)} style={{ padding: "10px", width: "100%", maxWidth: "400px" }}>
          <option value="">-- Select Event --</option>
          {events.map(e => <option key={e.id} value={e.id}>{e.title}</option>)}
        </select>

        {selectedEvent && (
          <div style={{ marginTop: "20px" }}>
            <div style={{ background: "#8b5cf6", padding: "15px", borderRadius: "8px", marginBottom: "10px" }}>
              {scannerStatus}
            </div>
            
            <div id="reader" style={{ width: "100%", maxWidth: "500px", margin: "0 auto", border: "2px solid white" }}></div>
            
            {debugLog && (
              <div style={{ background: "#ff4444", padding: "10px", marginTop: "20px", fontSize: "12px" }}>
                <strong>System Log:</strong> {debugLog}
              </div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default AdminCheckIn;