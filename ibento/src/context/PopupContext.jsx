import React, { createContext, useContext, useState } from "react";

const PopupContext = createContext();

export const PopupProvider = ({ children }) => {
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  const [modal, setModal] = useState({ show: false, title: "", message: "", onConfirm: null });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3000);
  };

  const confirmAction = (title, message, onConfirm) => {
    setModal({ show: true, title, message, onConfirm });
  };

  const hideModal = () => setModal({ show: false, title: "", message: "", onConfirm: null });

  return (
    <PopupContext.Provider value={{ showToast, confirmAction }}>
      {children}

      {/* GLOBAL TOAST UI */}
      {toast.show && (
        <div style={{
          position: "fixed", top: "20px", right: "20px", padding: "15px 25px",
          backgroundColor: toast.type === "success" ? "#28a745" : "#dc3545",
          color: "white", borderRadius: "8px", boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          zIndex: 9999, animation: "fadeIn 0.3s"
        }}>
          {toast.message}
        </div>
      )}

      {/* GLOBAL MODAL UI */}
      {modal.show && (
        <div style={{
          position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
          backgroundColor: "rgba(0,0,0,0.6)", display: "flex", justifyContent: "center",
          alignItems: "center", zIndex: 9998
        }}>
          <div style={{ background: "white", padding: "30px", borderRadius: "15px", width: "90%", maxWidth: "400px", textAlign: "center" }}>
            <h3 style={{ marginTop: 0 }}>{modal.title}</h3>
            <p>{modal.message}</p>
            <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginTop: "25px" }}>
              <button onClick={hideModal} style={{ padding: "10px 20px", border: "1px solid #ddd", background: "none", borderRadius: "8px", cursor: "pointer" }}>Cancel</button>
              <button onClick={() => { modal.onConfirm(); hideModal(); }} style={{ padding: "10px 20px", background: "#dc3545", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" }}>Confirm</button>
            </div>
          </div>
        </div>
      )}
    </PopupContext.Provider>
  );
};

export const usePopup = () => useContext(PopupContext);