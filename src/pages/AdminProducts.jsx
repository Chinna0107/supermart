import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import config from '../config';
import AdminHeader from '../components/AdminHeader';
import './AdminProducts.css';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    grams: [],
    prices: {},
    description: '',
    images: ['', '', '']
  });
  const [showWeightDropdown, setShowWeightDropdown] = useState(false);
  const weightOptions = ['250g', '500g', '1kg', '2kg', '5kg', '500ml', '1L', '2L', '1pc', '6pc', '12pc'];
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
      const response = await axios.get(`${config.API_URL}/api/users/verify`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        fetchProducts();
      } else {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      }
    } catch (error) {
      console.error('Token verification failed:', error);
      // If verify endpoint doesn't exist (404), proceed anyway
      if (error.response?.status === 404) {
        fetchProducts();
      } else {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      }
    }
  };

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${config.API_URL}/api/products`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setProducts(response.data.products);
      } else if (Array.isArray(response.data)) {
        setProducts(response.data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      const numericPrices = {};
      Object.keys(formData.prices).forEach(key => {
        numericPrices[key] = Number(formData.prices[key]);
      });
      
      const productData = {
        ...formData,
        prices: numericPrices,
        price: Object.values(numericPrices)[0] || 0
      };
      
      if (editingProduct) {
        await axios.put(`${config.API_URL}/api/products/${editingProduct.id}`, productData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Product updated successfully!', { autoClose: 1500 });
      } else {
        await axios.post(`${config.API_URL}/api/products`, productData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Product added successfully!', { autoClose: 1500 });
      }
      fetchProducts();
      resetForm();
    } catch (error) {
      console.error('Error saving product:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      } else {
        toast.error('Error saving product: ' + (error.response?.data?.message || error.message), { autoClose: 1500 });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${config.API_URL}/api/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Product deleted successfully!', { autoClose: 1500 });
        fetchProducts();
      } catch (error) {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/login');
        } else {
          toast.error('Error deleting product: ' + error.message, { autoClose: 1500 });
        }
      }
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      grams: product.grams || [],
      prices: product.prices || {},
      description: product.description,
      images: product.images
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      grams: [],
      prices: {},
      description: '',
      images: ['', '', '']
    });
    setEditingProduct(null);
    setShowForm(false);
  };

  const handleWeightToggle = (weight) => {
    setFormData(prev => {
      const newGrams = prev.grams.includes(weight)
        ? prev.grams.filter(w => w !== weight)
        : [...prev.grams, weight];
      
      const newPrices = { ...prev.prices };
      if (!newGrams.includes(weight)) {
        delete newPrices[weight];
      }
      
      return { ...prev, grams: newGrams, prices: newPrices };
    });
  };

  const handlePriceChange = (weight, price) => {
    setFormData(prev => ({
      ...prev,
      prices: { ...prev.prices, [weight]: price }
    }));
  };

  const handleImageChange = (index, value) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData({ ...formData, images: newImages });
  };

  return (
    <>
      <AdminHeader />
      <ToastContainer position="top-right" autoClose={1500} />
      <div className="admin-page">
        <div className="admin-content">
        <div className="admin-actions-bar">
          <button className="admin-btn" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : '+ Add Product'}
          </button>
        </div>

        <div className="admin-stats">
          <div className="stat-card">
            <h3>{products.length}</h3>
            <p>Total Products</p>
          </div>
          <div className="stat-card">
            <h3>{new Set(products.map(p => p.category)).size}</h3>
            <p>Categories</p>
          </div>
          <div className="stat-card">
            <h3>₹{products.reduce((sum, p) => {
              if (p.prices && typeof p.prices === 'object') {
                return sum + Object.values(p.prices).reduce((s, price) => s + Number(price), 0);
              }
              return sum + (p.price || 0);
            }, 0)}</h3>
            <p>Total Inventory Value</p>
          </div>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="product-form">
            <div className="form-field">
              <label>Product Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="form-field">
              <label>Category *</label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
              />
            </div>
            <div className="form-field">
              <label>Weight/Quantity *</label>
              <div className="custom-dropdown">
                <div 
                  className="dropdown-header" 
                  onClick={() => setShowWeightDropdown(!showWeightDropdown)}
                >
                  {formData.grams.length > 0 ? formData.grams.join(', ') : 'Select weights'}
                </div>
                {showWeightDropdown && (
                  <div className="dropdown-list">
                    {weightOptions.map(weight => (
                      <label key={weight} className="dropdown-item">
                        <input
                          type="checkbox"
                          checked={formData.grams.includes(weight)}
                          onChange={() => handleWeightToggle(weight)}
                        />
                        {weight}
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="form-field">
              <label>Prices (₹) *</label>
              <div className="price-inputs">
                {formData.grams.map(weight => (
                  <div key={weight} className="price-input-row">
                    <span>{weight}:</span>
                    <input
                      type="number"
                      value={formData.prices[weight] || ''}
                      onChange={(e) => handlePriceChange(weight, e.target.value)}
                      placeholder="Price"
                      required
                    />
                  </div>
                ))}
                {formData.grams.length === 0 && <p style={{color: '#999', margin: 0}}>Select weights first</p>}
              </div>
            </div>
            <div className="form-field full-width">
              <label>Description *</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </div>
            <div className="form-field full-width">
              <label>Product Images (URLs) *</label>
              <div className="image-inputs">
                <input
                  type="url"
                  value={formData.images[0]}
                  onChange={(e) => handleImageChange(0, e.target.value)}
                  placeholder="Image 1 URL"
                  required
                />
                <input
                  type="url"
                  value={formData.images[1]}
                  onChange={(e) => handleImageChange(1, e.target.value)}
                  placeholder="Image 2 URL"
                  required
                />
                <input
                  type="url"
                  value={formData.images[2]}
                  onChange={(e) => handleImageChange(2, e.target.value)}
                  placeholder="Image 3 URL"
                  required
                />
              </div>
            </div>
            <div className="form-actions">
              <button type="button" className="admin-btn cancel-btn" onClick={resetForm}>
                Cancel
              </button>
              <button type="submit" className="admin-btn" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    {editingProduct ? 'Updating...' : 'Adding...'}
                  </>
                ) : (editingProduct ? 'Update Product' : 'Add Product')}
              </button>
            </div>
          </form>
        )}

        <table className="products-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Weight</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id}>
                <td><img src={product.images[0]} alt={product.name} /></td>
                <td>{product.name}</td>
                <td>{product.category}</td>
                <td>{Array.isArray(product.grams) ? product.grams.join(', ') : product.grams}</td>
                <td>
                  {product.prices && typeof product.prices === 'object' 
                    ? Object.entries(product.prices).map(([weight, price]) => (
                        <div key={weight}>{weight}: ₹{price}</div>
                      ))
                    : `₹${product.price || 0}`
                  }
                </td>
                <td>
                  <div className="action-btns">
                    <button className="edit-btn" onClick={() => handleEdit(product)}>Edit</button>
                    <button className="delete-btn" onClick={() => handleDelete(product.id)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </>
  );
};

export default AdminProducts;
