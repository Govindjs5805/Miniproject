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

      {/* PREMIUM TOP-RIGHT TOAST */}
      {toast.show && (
        <div className={`vault-toast ${toast.type}`}>
          <div className="toast-content">
            {toast.type === "success" ? "✅" : "❌"} {toast.message}
          </div>
        </div>
      )}

      {/* CENTERED GLASS MODAL */}
      {modal.show && (
        <div className="vault-modal-overlay">
          <div className="vault-modal-card">
            <h3 className="vault-modal-title">{modal.title}</h3>
            <p className="vault-modal-message">{modal.message}</p>
            
            <div className="vault-modal-actions">
              <button onClick={hideModal} className="v-btn-cancel">
                Cancel
              </button>
              <button 
                onClick={() => { modal.onConfirm(); hideModal(); }} 
                className="v-btn-confirm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </PopupContext.Provider>
  );
};

export const usePopup = () => useContext(PopupContext);