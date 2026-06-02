import React, { useState, useEffect } from 'react';
import { createDonation, getMyDonations } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const DonorDashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState('');
  const [donations, setDonations] = useState([]);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    quantity: '',
    expiryTime: '',
    pickupAddress: '',
    foodType: 'veg',
    coordinates: { lat: '', lng: '' }
  });

  const fetchDonations = async () => {
    try {
      const res = await getMyDonations();
      setDonations(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'lat' || name === 'lng') {
      setFormData({
        ...formData,
        coordinates: { ...formData.coordinates, [name]: parseFloat(value) }
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createDonation(formData);
      setMessage('✅ Donation created successfully');
      setFormData({
        title: '',
        description: '',
        quantity: '',
        expiryTime: '',
        pickupAddress: '',
        foodType: 'veg',
        coordinates: { lat: '', lng: '' }
      });
      setShowForm(false);
      fetchDonations();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(error.response?.data?.message || '❌ Failed to create donation');
    }
  };

  const totalDonations = donations.length;
  const pendingPickups = donations.filter(d => d.status === 'available').length;
  const mealsShared = donations.filter(d => d.status === 'delivered').length;

const statusColors = {
  available: { bg: '#dbeafe', color: '#2563eb' },
  requested: { bg: '#bfdbfe', color: '#1d4ed8' },
  pickedup: { bg: '#e0f2fe', color: '#0284c7' },
  delivered: { bg: '#e0e7ff', color: '#3730a3' },
  expired: { bg: '#fee2e2', color: '#dc2626' }
};
  return (
   <div style={{
  minHeight: '100vh',
  background: 'linear-gradient(135deg,#eff6ff,#ffffff)',
  padding: '30px'
}}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <div>
          <h1 style={{ color: '#2563eb', margin: 0 }}>🍱 Donor Dashboard</h1>
          <p style={{ color: '#64748b', marginTop: '4px' }}>Welcome to FoodBridge. Manage your food donations here.</p>
        </div>
        <button onClick={handleLogout} style={{
          background: '#ef4444', color: 'white', border: 'none',
          padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600'
        }}>Logout</button>
      </div>

      {/* Stats */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))',
        gap: '20px', marginTop: '30px'
      }}>
        {[
      [
  { label: 'Total Donations', value: totalDonations, color: '#2563eb' },
  { label: 'Meals Shared', value: mealsShared, color: '#1d4ed8' },
  { label: 'Pending Pickups', value: pendingPickups, color: '#3b82f6' }
]
        ].map((s, i) => (
          <div key={i} style={cardStyle}>
            <h3 style={{ color: '#64748b', fontWeight: '500', fontSize: '0.9rem', margin: '0 0 8px' }}>{s.label}</h3>
            <h2 style={{ color: s.color, fontSize: '2rem', margin: 0 }}>{s.value}</h2>
          </div>
        ))}
      </div>

      {/* Message */}
      {message && (
        <div style={{
          marginTop: '20px', padding: '15px', borderRadius: '10px',
          background: message.includes('✅') ? '#dcfce7' : '#fee2e2',
          color: message.includes('✅') ? '#166534' : '#dc2626',
          fontWeight: '600'
        }}>{message}</div>
      )}

      {/* Create Donation */}
      <div style={{
        background: 'white', marginTop: '30px', padding: '25px',
        borderRadius: '15px', boxShadow: '0 4px 10px rgba(0,0,0,0.08)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ margin: 0, color: '#0f172a' }}>Create Donation</h2>
          <button onClick={() => setShowForm(!showForm)} style={{
            background: 'linear-gradient(135deg,#2563eb,#1d4ed8)', color: 'white', border: 'none',
            padding: '12px 24px', borderRadius: '10px', cursor: 'pointer',
            fontWeight: '600', fontSize: '0.95rem'
          }}>
            {showForm ? '✕ Cancel' : '+ Add New Donation'}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '15px', marginTop: '10px' }}>

            <input
              type="text" name="title" placeholder="Food Title (e.g. Rice and Curry)"
              value={formData.title} onChange={handleChange} required style={inputStyle}
            />

            <textarea
              name="description" placeholder="Description (optional)"
              value={formData.description} onChange={handleChange}
              style={{ ...inputStyle, resize: 'none' }} rows={2}
            />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <input
                type="text" name="quantity" placeholder="Quantity (e.g. 50 packets)"
                value={formData.quantity} onChange={handleChange} required style={inputStyle}
              />
              <select name="foodType" value={formData.foodType} onChange={handleChange} style={inputStyle}>
                <option value="veg">🥗 Vegetarian</option>
                <option value="nonveg">🍗 Non-Vegetarian</option>
                <option value="both">🍱 Both</option>
              </select>
            </div>

            <input
              type="datetime-local" name="expiryTime"
              value={formData.expiryTime} onChange={handleChange} required style={inputStyle}
            />

            <input
              type="text" name="pickupAddress" placeholder="Full Pickup Address"
              value={formData.pickupAddress} onChange={handleChange} required style={inputStyle}
            />

            {/* Coordinates for Map */}
            <div style={{
              background: '#f0fdf4', padding: '16px', borderRadius: '10px',
              border: '1px solid #86efac'
            }}>
              <p style={{ margin: '0 0 10px', fontWeight: '600', color: '#16a34a', fontSize: '0.9rem' }}>
                📍 Map Coordinates (optional — makes donation appear on map)
              </p>
              <p style={{ margin: '0 0 10px', fontSize: '0.8rem', color: '#64748b' }}>
                Go to maps.google.com → search your location → right click → copy the lat, lng numbers
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <input
                  type="number" name="lat" placeholder="Latitude (e.g. 11.0168)"
                  value={formData.coordinates.lat} onChange={handleChange}
                  step="any" style={inputStyle}
                />
                <input
                  type="number" name="lng" placeholder="Longitude (e.g. 76.9558)"
                  value={formData.coordinates.lng} onChange={handleChange}
                  step="any" style={inputStyle}
                />
              </div>
            </div>

            <button type="submit" style={{
              background: 'linear-gradient(135deg, #16a34a, #15803d)',
              color: 'white', border: 'none', padding: '14px',
              borderRadius: '10px', cursor: 'pointer',
              fontWeight: '700', fontSize: '1rem',
              boxShadow: '0 4px 15px rgba(22,163,74,0.3)'
            }}>
              Save Donation
            </button>
          </form>
        )}
      </div>

      {/* My Donations */}
      <div style={{
        background: 'white', marginTop: '30px', padding: '25px',
        borderRadius: '15px', boxShadow: '0 4px 10px rgba(0,0,0,0.08)'
      }}>
        <h2 style={{ margin: '0 0 20px', color: '#0f172a' }}>
          My Donations ({donations.length})
        </h2>

        {donations.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
            <p style={{ fontSize: '1rem' }}>No donations yet. Click "Add New Donation" to start!</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px,1fr))', gap: '16px' }}>
            {donations.map(donation => (
              <div key={donation._id} style={{
                border: '1px solid #e5e7eb', padding: '20px',
                borderRadius: '12px', background: '#fafafa'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <h3 style={{ margin: 0, color: '#0f172a', fontSize: '1rem' }}>{donation.title}</h3>
                  <span style={{
                    padding: '3px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '600',
                    background: statusColors[donation.status]?.bg,
                    color: statusColors[donation.status]?.color,
                    marginLeft: '8px', whiteSpace: 'nowrap'
                  }}>{donation.status}</span>
                </div>

                {donation.description && (
                  <p style={{ color: '#64748b', fontSize: '0.85rem', margin: '0 0 8px' }}>{donation.description}</p>
                )}

                <p style={{ margin: '4px 0', fontSize: '0.85rem', color: '#475569' }}>
                  📦 <strong>Quantity:</strong> {donation.quantity}
                </p>
                <p style={{ margin: '4px 0', fontSize: '0.85rem', color: '#475569' }}>
                  🥗 <strong>Food Type:</strong> {donation.foodType}
                </p>
                <p style={{ margin: '4px 0', fontSize: '0.85rem', color: '#475569' }}>
                  📍 <strong>Address:</strong> {donation.pickupAddress}
                </p>
                {donation.coordinates?.lat && (
                  <p style={{ margin: '4px 0', fontSize: '0.8rem', color: '#16a34a' }}>
                    🗺️ On map: {donation.coordinates.lat}, {donation.coordinates.lng}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const cardStyle = {
  background: 'white', padding: '20px', borderRadius: '15px',
  boxShadow: '0 4px 10px rgba(0,0,0,0.08)'
};

const inputStyle = {
  width: '100%', padding: '12px', borderRadius: '10px',
  border: '1px solid #d1d5db', boxSizing: 'border-box',
  fontSize: '0.9rem', fontFamily: 'inherit'
};

export default DonorDashboard;