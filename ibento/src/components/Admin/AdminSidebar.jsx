import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import "./AdminLayout.css";

function AdminSidebar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <div className="admin-sidebar">
      <h2 className="admin-logo">Admin Panel</h2>

      <ul className="admin-menu">
        <li>
          <Link to="/admin/registrations">Registrations</Link>
        </li>
        <li>
          <Link to="/admin/report">Reports</Link>
        </li>
        <li>
        <Link to="/admin/create-event">Create Event</Link>
</li>


      </ul>

      <button className="admin-logout" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}

export default AdminSidebar;
