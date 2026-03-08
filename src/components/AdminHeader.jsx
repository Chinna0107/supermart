import { useNavigate } from 'react-router-dom';
import './AdminHeader.css';

const AdminHeader = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <header className="admin-header-bar">
      <div className="admin-header-logo">
        <img src="https://res.cloudinary.com/dgyykbmt6/image/upload/v1772460868/cm3_zvfuyu.jpg" alt="CM Mart" />
        <h1>CM Super Mart - Admin Panel</h1>
      </div>
      <div className="admin-header-actions">
        <span className="admin-user">Welcome, {user.email || 'Admin'}</span>
        <button className="admin-btn-header" onClick={() => navigate('/admin/products')}>
          Manage Products
        </button>
        <button className="admin-btn-header" onClick={() => navigate('/admin/sliders')}>
          Manage Sliders
        </button>
        <button className="admin-btn-header" onClick={() => navigate('/')}>
          View Store
        </button>
        <button className="admin-btn-header logout" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </header>
  );
};

export default AdminHeader;
