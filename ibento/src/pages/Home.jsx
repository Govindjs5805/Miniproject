import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardMedia,
  CardContent
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import Hero from "../components/Home/Hero";
import LightRays from "../components/LightRays";

function Home() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const snap = await getDocs(collection(db, "events"));

      const eventList = snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Sort by date (ascending)
      eventList.sort((a, b) => new Date(a.date) - new Date(b.date));

      // Take first 3 upcoming events
      setEvents(eventList.slice(0, 3));
    };

    fetchEvents();
  }, []);

  return (
    <>
      {/* HERO */}
      <Hero />

      {/* UPCOMING EVENTS */}
      <Container sx={{ py: 5 }}>
        <Typography variant="h4" gutterBottom>
          Upcoming Events
        </Typography>

        <Grid container spacing={4}>
          {events.length === 0 ? (
            <Typography>No events available</Typography>
          ) : (
            events.map(event => (
              <Grid item xs={12} md={4} key={event.id}>
                <Card
                  sx={{ cursor: "pointer" }}
                  onClick={() => navigate(`/events/${event.id}`)}
                >
                  {event.posterURL && (
                    <CardMedia
                      component="img"
                      image={event.posterURL}
                      alt={event.title}
                    />
                  )}

                  <CardContent>
                    <Typography variant="h6">
                      {event.title}
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                      {event.date}
                    </Typography>

                    <Typography variant="body2" sx={{ mt: 1 }}>
                      {event.description?.slice(0, 80)}...
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      </Container>

      {/* CTA */}
      <div
        style={{
          background: "#111827",
          color: "white",
          textAlign: "center",
          padding: "80px 20px"
        }}
      >
        <Typography variant="h4">
          Ready to Explore Campus Events?
        </Typography>

        <Button
          variant="contained"
          sx={{ mt: 3 }}
          onClick={() => navigate("/register")}
        >
          Join Now
        </Button>
      </div>
    </>
  );
}

export default Home;