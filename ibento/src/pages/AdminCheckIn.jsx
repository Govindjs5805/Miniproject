import { useEffect, useState, useRef } from "react";
import { collection, query, where, getDocs, doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { Html5Qrcode } from "html5-qrcode";
import AdminLayout from "../components/Admin/AdminLayout";
import { color } from "chart.js/helpers";

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
      // Ensure the 'reader' element exists before starting
      const element = document.getElementById("reader");
      if (!element) return;

      if (scannerRef.current) {
        try { await scannerRef.current.stop(); } catch (e) {}
      }

      const scanner = new Html5Qrcode("reader");
      scannerRef.current = scanner;

      scanner.start(
{ facingMode: "environment" }, 
  { 
    fps: 60, // Increase to 60 for smoother motion capture
    qrbox: { width: 250, height: 250 },
    aspectRatio: 1.0,
    // Add these experimental settings for speed
    experimentalFeatures: {
      useBarCodeDetectorIfSupported: true 
    },
    // This helps prevent the camera from "searching" too long
    rememberLastUsedCamera: true
  },
        async (decodedText) => {
          if (processingRef.current) return;
          
          // Lock the scanner immediately
          processingRef.current = true;
          
          const cleanId = decodedText.trim();
          setScannerStatus(`Processing Ticket: ${cleanId}`);

          try {
            const regRef = doc(db, "registrations", cleanId);
            const regSnap = await getDoc(regRef);

            if (!regSnap.exists()) {
              setScannerStatus("❌ Ticket Not Found");
              setDebugLog(`DB Check: ID ${cleanId} does not exist in registrations.`);
            } else {
              const data = regSnap.data();

              if (data.eventId !== selectedEvent) {
                setScannerStatus("❌ Wrong Event Ticket");
              } else if (data.checkInStatus === true) {
                setScannerStatus("⚠️ Already Checked In");
              } else {
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
            // Wait 3 seconds to show status before allowing next scan
            setTimeout(() => {
              processingRef.current = false;
              setScannerStatus("Ready for next scan...");
            }, 3000);
          }
        }
      ).catch(err => setDebugLog("Camera Error: " + err));
    };

    const timer = setTimeout(startScanner, 600);
    return () => {
      clearTimeout(timer);
      if (scannerRef.current) {
        scannerRef.current.stop().catch(() => {
            console.log("Scanner stopped on cleanup");
        });
      }
    };
  }, [selectedEvent]);

  return (
    <AdminLayout>
      <div style={{ padding: "20px", textAlign: "center", color: "#fff", background : "#080909", minHeight: "80vh" }}>
        <h2 style={{ background: "linear-gradient(90deg, #783be2, #ffffff)", fontSize: "2.5rem", margin: "20px 40px", fontWeight: "bold", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Laptop Attendance Scanner</h2>
        
        <select 
          value={selectedEvent} 
          onChange={(e) => setSelectedEvent(e.target.value)} 
          style={{ 
            padding: "12px", 
            width: "100%", 
            maxWidth: "400px", 
            borderRadius: "8px",
            background: "#1e293b",
            color: "white",
            border: "1px solid #334155"
          }}
        >
          <option value="">-- Select Event --</option>
          {events.map(e => <option key={e.id} value={e.id}>{e.title}</option>)}
        </select>

        {selectedEvent && (
          <div style={{ marginTop: "20px" }}>
            <div style={{ 
              background: scannerStatus.includes("✅") ? "#059669" : "#8b5cf6", 
              padding: "15px", 
              borderRadius: "8px", 
              marginBottom: "15px",
              fontWeight: "bold",
              transition: "0.3s ease"
            }}>
              {scannerStatus}
            </div>
            
            <div id="reader" style={{ 
                width: "100%", 
                maxWidth: "500px", 
                margin: "0 auto", 
                border: "4px solid #334155",
                borderRadius: "12px",
                overflow: "hidden"
            }}></div>
            
            <p style={{ marginTop: "15px", color: "#94a3b8", fontSize: "14px" }}>
              💡 <b>Tip:</b> If it's not scanning, lower the brightness on the student's phone and hold it steady.
            </p>

            {debugLog && (
              <div style={{ background: "#991b1b", padding: "10px", marginTop: "20px", fontSize: "12px", borderRadius: "5px" }}>
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