import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  doc,
  getDoc
} from "firebase/firestore";
import { db } from "../firebase";
import QRCode from "react-qr-code";
import html2canvas from "html2canvas";

function TicketView() {
  const { registrationId } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    const loadTicket = async () => {
      const regSnap = await getDoc(doc(db, "registrations", registrationId));

      if (regSnap.exists()) {
        const regData = regSnap.data();

        const eventSnap = await getDoc(
          doc(db, "events", regData.eventId)
        );

        if (eventSnap.exists()) {
          setData({
            registration: regData,
            event: eventSnap.data()
          });
        }
      }
    };

    loadTicket();
  }, [registrationId]);

  const downloadTicket = async () => {
    const element = document.getElementById("ticket-container");
    const canvas = await html2canvas(element);
    const link = document.createElement("a");
    link.download = "ticket.png";
    link.href = canvas.toDataURL();
    link.click();
  };

  if (!data) return <p>Loading ticket...</p>;

  return (
    <div style={{ padding: "30px" }}>
      <h2>{data.event.title} Ticket</h2>

      <div
        id="ticket-container"
        style={{
          position: "relative",
          width: "400px",
          marginTop: "20px"
        }}
      >
        <img
          src={data.event.ticketTemplateURL}
          alt="Ticket"
          style={{ width: "100%" }}
        />

        <div
          style={{
            position: "absolute",
            top: data.event.qrPositionY,
            left: data.event.qrPositionX
          }}
        >
          <QRCode
            value={registrationId}
            size={data.event.qrSize || 100}
          />
        </div>
      </div>

      <br />

      <button onClick={downloadTicket}>
        Download Ticket
      </button>
    </div>
  );
}

export default TicketView;