import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase'; 
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import './ProfilePage.css';

const ProfilePage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    class: '',
    department: '',
    linkedInUrl: '',
    email: '',
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setFormData(docSnap.data());
          } else {
            setFormData(prev => ({ ...prev, email: user.email }));
          }
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // 10-Digit Phone Restriction
    if (name === "phone") {
      const onlyNums = value.replace(/[^0-9]/g, ''); 
      if (onlyNums.length <= 10) {
        setFormData(prev => ({ ...prev, [name]: onlyNums }));
      }
      return;
    }
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    try {
      const userRef = doc(db, "users", auth.currentUser.uid);
      await updateDoc(userRef, formData);
      alert("Profile updated successfully! ✓");
      // Optional: reload page to refresh summary section
    } catch (error) {
      alert("Error saving changes.");
    }
  };

  if (loading) return <div className="loading-glass">Loading IBENTO Profile...</div>;

  return (
    <div className="profile-wrapper-glass">
      {/* === TOP SUMMARY SECTION: Read-Only === */}
      <div className="summary-section-glass">
        <div className="avatar-wrapper-glass">
          <div className="avatar-circle-glass">
            {formData.firstName ? formData.firstName[0] : 'U'}
          </div>
        </div>
        
        <div className="summary-info-glass">
          <p className="student-label">STUDENT</p>
          {/* VISIBILITY FIX: The student name color */}
          <h1 className="student-name-glass">{formData.firstName} {formData.lastName}</h1>
          <p className="student-meta">{formData.department} | {formData.class}</p>
          
          <div className="contact-summary">
            <div className="contact-block">
              <span className="info-label">Email</span>
              <span className="info-value">{formData.email}</span>
            </div>
            <div className="contact-block">
              <span className="info-label">Phone</span>
              <span className="info-value">{formData.phone || 'Not provided'}</span>
            </div>
          </div>
        </div>
      </div>

      <hr className="divider-glass" />

      {/* === BOTTOM EDIT SECTION: Form === */}
      <div className="edit-section-glass">
        <h2 className="edit-section-title">Edit Details</h2>
        <form className="profile-main-form" onSubmit={handleSaveChanges}>
          <div className="form-row">
            <div className="input-group">
              <label>FIRST NAME</label>
              <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} />
            </div>
            <div className="input-group">
              <label>LAST NAME</label>
              <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} />
            </div>
          </div>

          <div className="form-row">
            <div className="input-group">
              <label>PHONE (10 Digits)</label>
              <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="Ex: 9876543210" />
            </div>
            <div className="input-group">
              <label>CLASS</label>
              <input type="text" name="class" value={formData.class} onChange={handleInputChange} placeholder="e.g. S6 D" />
            </div>
          </div>

          <div className="input-group full-width">
            <label>DEPARTMENT</label>
            <input type="text" name="department" value={formData.department} onChange={handleInputChange} placeholder="e.g. Computer Engineering" />
          </div>

          <div className="input-group full-width">
            <label>LINKEDIN URL</label>
            <input type="text" name="linkedInUrl" value={formData.linkedInUrl} onChange={handleInputChange} placeholder="linkedin.com/in/username" />
          </div>

          <footer className="profile-footer">
            <button type="submit" className="save-btn-glass">Save Changes ✓</button>
          </footer>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;