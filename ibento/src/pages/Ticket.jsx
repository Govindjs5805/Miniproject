import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { useParams,useNavigate} from "react-router-dom";
import { db } from "../firebase";
import { QRCodeCanvas } from "qrcode.react";
import "./Ticket.css";

function Ticket() {
  const navigate = useNavigate();

  const { registrationId } = useParams();
  const [registration, setRegistration] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const snap = await getDoc(doc(db, "registrations", registrationId));
        if (snap.exists()) {
          setRegistration({ id: snap.id, ...snap.data() });
        } else {
          console.error("Registration not found");
        }
      } catch (error) {
        console.error("Error fetching ticket:", error);
      } finally {
        setLoading(false);
      }
    };

    if (registrationId) {
      fetchTicket();
    }
  }, [registrationId]);

  if (loading) {
    return <div className="ticket-loading">Loading ticket...</div>;
  }

  if (!registration) {
    return <div className="ticket-loading">Ticket not found.</div>;
  }

  return (
    <div className="ticket-page-wrapper">
      <button className="ticket-back" onClick={() => navigate(-1)}>
       Back
      </button>
      <div className="ticket-container">
        <h2 className="ticket-event-name">{registration.eventTitle}</h2>
        
        <div className="ticket-info">
          <p><strong>Name:</strong> {registration.userName}</p>
          <p><strong>Email:</strong> {registration.userEmail}</p>
        </div>

        {/* This container adds the white quiet zone and purple border */}
        <div className="qr-border-frame">
          <div className="qr-white-background">
            <QRCodeCanvas value={registration.id} size={220} level="H" />
          </div>
        </div>

        <p className="ticket-footer">Show this QR code at entry.</p>
      </div>
    </div>
  );
}

export default Ticket;