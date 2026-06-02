import React, { useEffect, useState } from 'react';
import { getDonations, pickupDonation, deliverDonation } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function VolunteerDashboard() {
  const [donations, setDonations] = useState([]);
  const [message, setMessage] = useState('');
  const { logout } = useAuth();
  const navigate = useNavigate();

  const fetchDonations = async () => {
    try {
      const res = await getDonations();
      setDonations(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, []);

  const handlePickup = async (id) => {
    try {
      await pickupDonation(id);
      setMessage('Donation picked up successfully');
      fetchDonations();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Pickup failed');
    }
  };

  const handleDeliver = async (id) => {
    try {
      await deliverDonation(id);
      setMessage('Donation delivered successfully');
      fetchDonations();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Delivery failed');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#f8fbff',
        padding: '30px'
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px'
        }}
      >
        <div>
          <h1
            style={{
              color: '#1e40af',
              marginBottom: '5px'
            }}
          >
            Volunteer Dashboard
          </h1>
          <p style={{ color: '#64748b' }}>
            Manage pickups and deliveries.
          </p>
        </div>

        <button
          onClick={handleLogout}
          style={{
            background: '#1e40af',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '10px',
            cursor: 'pointer',
            fontWeight: '600',
            transition: '0.3s'
          }}
        >
          Logout
        </button>
      </div>

      {/* Statistics Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(250px,1fr))',
          gap: '20px',
          marginTop: '30px'
        }}
      >
        <div
          style={{
            background: 'white',
            padding: '20px',
            borderRadius: '16px',
            border: '1px solid #dbeafe',
            boxShadow: '0 4px 12px rgba(37,99,235,0.08)'
          }}
        >
          <h3 style={{ color: '#2563eb', marginBottom: '10px' }}>
            Requested
          </h3>
          <h2 style={{ color: '#1e3a8a' }}>
            {donations.filter((d) => d.status === 'requested').length}
          </h2>
        </div>

        <div
          style={{
            background: 'white',
            padding: '20px',
            borderRadius: '16px',
            border: '1px solid #dbeafe',
            boxShadow: '0 4px 12px rgba(37,99,235,0.08)'
          }}
        >
          <h3 style={{ color: '#2563eb', marginBottom: '10px' }}>
            Picked Up
          </h3>
          <h2 style={{ color: '#1e3a8a' }}>
            {donations.filter((d) => d.status === 'pickedup').length}
          </h2>
        </div>

        <div
          style={{
            background: 'white',
            padding: '20px',
            borderRadius: '16px',
            border: '1px solid #dbeafe',
            boxShadow: '0 4px 12px rgba(37,99,235,0.08)'
          }}
        >
          <h3 style={{ color: '#2563eb', marginBottom: '10px' }}>
            Delivered
          </h3>
          <h2 style={{ color: '#1e3a8a' }}>
            {donations.filter((d) => d.status === 'delivered').length}
          </h2>
        </div>
      </div>

      {/* Success Message */}
      {message && (
        <div
          style={{
            background: '#dbeafe',
            color: '#1e40af',
            padding: '15px',
            borderRadius: '12px',
            marginTop: '20px',
            border: '1px solid #93c5fd'
          }}
        >
          {message}
        </div>
      )}

      {/* Donation Cards */}
      <div
        style={{
          marginTop: '30px',
          display: 'grid',
          gap: '20px'
        }}
      >
        {donations.length === 0 ? (
          <div
            style={{
              background: 'white',
              padding: '20px',
              borderRadius: '16px',
              border: '1px solid #dbeafe',
              boxShadow: '0 4px 12px rgba(37,99,235,0.08)'
            }}
          >
            No donations available.
          </div>
        ) : (
          donations.map((donation) => (
            <div
              key={donation._id}
              style={{
                background: 'white',
                padding: '24px',
                borderRadius: '16px',
                border: '1px solid #dbeafe',
                boxShadow: '0 4px 12px rgba(37,99,235,0.08)'
              }}
            >
              <h2
                style={{
                  color: '#1e3a8a',
                  marginBottom: '10px'
                }}
              >
                {donation.title}
              </h2>

              <p style={{ color: '#475569' }}>
                {donation.description}
              </p>

              <p>
                <strong style={{ color: '#1e40af' }}>Quantity:</strong>{' '}
                {donation.quantity}
              </p>

              <p>
                <strong style={{ color: '#1e40af' }}>Food Type:</strong>{' '}
                {donation.foodType}
              </p>

              <p>
                <strong style={{ color: '#1e40af' }}>
                  Pickup Address:
                </strong>{' '}
                {donation.pickupAddress}
              </p>

              <p>
                <strong style={{ color: '#1e40af' }}>Status:</strong>{' '}
                {donation.status}
              </p>

              {donation.status === 'requested' && (
                <button
                  onClick={() => handlePickup(donation._id)}
                  style={{
                    marginTop: '15px',
                    width: '100%',
                    background: '#2563eb',
                    color: 'white',
                    border: 'none',
                    padding: '12px',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontWeight: '600'
                  }}
                >
                  Mark Picked Up
                </button>
              )}

              {donation.status === 'pickedup' && (
                <button
                  onClick={() => handleDeliver(donation._id)}
                  style={{
                    marginTop: '15px',
                    width: '100%',
                    background: '#1d4ed8',
                    color: 'white',
                    border: 'none',
                    padding: '12px',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontWeight: '600'
                  }}
                >
                  Mark Delivered
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default VolunteerDashboard;