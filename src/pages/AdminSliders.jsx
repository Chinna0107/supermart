import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdminHeader from '../components/AdminHeader';
import './AdminSliders.css';

const AdminSliders = () => {
  const [sliders, setSliders] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingSlider, setEditingSlider] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    imageUrl: '',
    order: 1
  });
  const navigate = useNavigate();

  useEffect(() => {
    verifyToken();
  }, [navigate]);

  const verifyToken = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const response = await axios.get('http://localhost:3000/api/users/verify', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        fetchSliders();
      } else {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      }
    } catch (error) {
      console.error('Token verification failed:', error);
      // If verify endpoint doesn't exist (404), proceed anyway
      if (error.response?.status === 404) {
        fetchSliders();
      } else {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      }
    }
  };

  const fetchSliders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/api/sliders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setSliders(response.data.sliders);
      } else if (Array.isArray(response.data)) {
        setSliders(response.data);
      }
    } catch (error) {
      console.error('Error fetching sliders:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const sliderData = {
        title: formData.title,
        imageUrl: formData.imageUrl,
        order: Number(formData.order)
      };
      
      if (editingSlider) {
        await axios.put(`http://localhost:3000/api/sliders/${editingSlider.id}`, sliderData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert('Slider updated successfully!');
      } else {
        await axios.post('http://localhost:3000/api/sliders', sliderData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert('Slider added successfully!');
      }
      fetchSliders();
      resetForm();
    } catch (error) {
      console.error('Error saving slider:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      } else {
        alert('Error saving slider: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this slider?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:3000/api/sliders/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert('Slider deleted successfully!');
        fetchSliders();
      } catch (error) {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/login');
        } else {
          alert('Error deleting slider: ' + error.message);
        }
      }
    }
  };

  const handleEdit = (slider) => {
    setEditingSlider(slider);
    setFormData({
      title: slider.title,
      imageUrl: slider.imageUrl,
      order: slider.order
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      imageUrl: '',
      order: 1
    });
    setEditingSlider(null);
    setShowForm(false);
  };

  return (
    <>
      <AdminHeader />
      <div className="admin-page">
        <div className="admin-content">
          <div className="admin-actions-bar">
            <button className="admin-btn" onClick={() => setShowForm(!showForm)}>
              {showForm ? 'Cancel' : '+ Add Slider'}
            </button>
          </div>

          <div className="admin-stats">
            <div className="stat-card">
              <h3>{sliders.length}</h3>
              <p>Total Sliders</p>
            </div>
          </div>

          {showForm && (
            <form onSubmit={handleSubmit} className="slider-form">
              <div className="form-field">
                <label>Slider Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div className="form-field">
                <label>Image URL *</label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                  required
                />
              </div>
              <div className="form-field">
                <label>Display Order *</label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                  min="1"
                  required
                />
              </div>
              <div className="form-actions">
                <button type="button" className="admin-btn cancel-btn" onClick={resetForm}>
                  Cancel
                </button>
                <button type="submit" className="admin-btn">
                  {editingSlider ? 'Update Slider' : 'Add Slider'}
                </button>
              </div>
            </form>
          )}

          <div className="sliders-grid">
            {sliders.map(slider => (
              <div key={slider.id} className="slider-card">
                <img src={slider.imageUrl} alt={slider.title} />
                <div className="slider-info">
                  <h3>{slider.title}</h3>
                  <p>Order: {slider.order}</p>
                  <div className="action-btns">
                    <button className="edit-btn" onClick={() => handleEdit(slider)}>Edit</button>
                    <button className="delete-btn" onClick={() => handleDelete(slider.id)}>Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminSliders;
