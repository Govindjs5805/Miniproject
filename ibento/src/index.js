import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import "./index.css"; // Ensure your global styles are imported

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    {/* 1. BrowserRouter: Provides the routing context for the entire app */}
    <BrowserRouter>
      {/* 2. AuthProvider: Manages Firebase user session & roles like 'student' or 'clubLead' */}
      <AuthProvider>
        {/* 3. App: The main component containing your routes and layout */}
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);