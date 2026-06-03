import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { getDonations, requestDonation } from '../utils/api';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import {
  FiMapPin, FiPackage, FiClock,
  FiList, FiMap, FiTrendingUp,
  FiHeart, FiUsers
} from 'react-icons/fi';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png'
});

const NGODashboard = () => {
  const [donations, setDonations] = useState([]);
  const [stats, setStats] = useState({
    available: 0,
    total: 0,
    claimed: 0,
    delivered: 0
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [view, setView] = useState('list');
  const [requesting, setRequesting] = useState(null);

  useEffect(() => {
    fetchDonations();
    fetchStats();
  }, []);

  // Fetches available donations (what NGO can claim)
  const fetchDonations = async () => {
    try {
      const res = await getDonations();
      setDonations(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetches stats from the stats endpoint
  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/stats`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      const data = await res.json();
      setStats({
        available: data.availableDonations || 0,
        total:     data.totalDonations    || 0,
        claimed:   data.requestedDonations || 0,
        delivered: data.deliveredDonations || 0
      });
    } catch (err) {
      console.log('Stats fetch error:', err);
    }
  };

  const handleRequest = async (id) => {
    setRequesting(id);
    try {
      await requestDonation(id);
      setMessage('Donation claimed successfully!');
      fetchDonations();
      fetchStats(); // refresh stats after claiming
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error claiming donation');
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setRequesting(null);
    }
  };

  const statusColors = {
    available: { bg: '#e0f2fe', color: '#0284c7' },
    requested: { bg: '#dbeafe', color: '#2563eb' },
    pickedup:  { bg: '#e0e7ff', color: '#4338ca' },
    delivered: { bg: '#dbeafe', color: '#1d4ed8' }
  };

  const mapCenter = [11.0168, 76.9558];
  const donationsWithCoords = donations.filter(
    d => d.coordinates && d.coordinates.lat && d.coordinates.lng
  );

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg,#f0f9ff,#ffffff)' }}>
      <Navbar />

      <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '32px 24px' }}>

        {/* HERO */}
        <div style={{
          background: 'linear-gradient(135deg,#0369a1,#0284c7)',
          borderRadius: '28px', padding: '35px', color: 'white',
          marginBottom: '28px', boxShadow: '0 20px 40px rgba(14,165,233,0.25)'
        }}>
          <h1 style={{ fontSize: '2.4rem', fontWeight: '800', marginBottom: '10px' }}>
            🏢 NGO Dashboard
          </h1>
          <p style={{ opacity: 0.95, fontSize: '1rem', marginBottom: '25px' }}>
            Helping communities through smart food redistribution and sustainable food rescue.
          </p>
          <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
            {['🌍 Community Impact', '🍱 Food Rescue', '🚚 Volunteer Network'].map(tag => (
              <div key={tag} style={{ background: 'rgba(255,255,255,0.15)', padding: '10px 18px', borderRadius: '30px' }}>
                {tag}
              </div>
            ))}
          </div>
        </div>

        {/* MESSAGE */}
        {message && (
          <div style={{
            padding: '14px 20px', borderRadius: '12px', marginBottom: '22px',
            background: message.includes('success') ? '#dbeafe' : '#fee2e2',
            color: message.includes('success') ? '#2563eb' : '#dc2626',
            fontWeight: '600', border: '1px solid #bfdbfe'
          }}>
            {message}
          </div>
        )}

        {/* STATS — now uses real data from /api/stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(250px,1fr))',
          gap: '20px', marginBottom: '30px'
        }}>
          {[
            { icon: <FiHeart />,      label: 'Available Donations', value: stats.available, color: '#0284c7' },
            { icon: <FiPackage />,    label: 'Total Donations',      value: stats.total,     color: '#2563eb' },
            { icon: <FiUsers />,      label: 'Claimed Donations',    value: stats.claimed,   color: '#1d4ed8' },
            { icon: <FiTrendingUp />, label: 'Delivered',            value: stats.delivered, color: '#0369a1' }
          ].map((s, i) => (
            <div key={i} style={{
              background: '#ffffff', border: '1px solid #bae6fd',
              borderRadius: '22px', padding: '24px',
              boxShadow: '0 10px 25px rgba(14,165,233,0.08)'
            }}>
              <div style={{ fontSize: '24px', color: s.color, marginBottom: '12px' }}>{s.icon}</div>
              <h2 style={{ color: s.color, margin: 0, fontSize: '2rem' }}>{s.value}</h2>
              <p style={{ color: '#64748b', marginTop: '6px' }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* VIEW TOGGLE */}
        <div style={{
          display: 'flex', gap: '8px', marginBottom: '24px',
          background: '#ffffff', padding: '8px', borderRadius: '16px',
          border: '1px solid #bae6fd', width: 'fit-content',
          boxShadow: '0 4px 12px rgba(14,165,233,0.08)'
        }}>
          {['list', 'map'].map(v => (
            <button key={v} onClick={() => setView(v)} style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '10px 22px', borderRadius: '12px', border: 'none',
              background: view === v ? 'linear-gradient(135deg,#0ea5e9,#0284c7)' : 'transparent',
              color: view === v ? 'white' : '#64748b',
              fontWeight: '700', cursor: 'pointer'
            }}>
              {v === 'list' ? <FiList size={16} /> : <FiMap size={16} />}
              {v === 'list' ? 'List View' : 'Map View'}
            </button>
          ))}
        </div>

        {/* MAP VIEW */}
        {view === 'map' && (
          <div style={{
            borderRadius: '24px', overflow: 'hidden',
            border: '1px solid #bae6fd', marginBottom: '30px',
            background: '#ffffff', boxShadow: '0 10px 25px rgba(14,165,233,0.08)'
          }}>
            <div style={{ background: 'linear-gradient(135deg,#0369a1,#0284c7)', padding: '18px 24px', color: 'white' }}>
              <h3 style={{ margin: 0, fontWeight: '700' }}>🗺️ Live Donation Map</h3>
              <p style={{ marginTop: '6px', opacity: 0.9 }}>{donationsWithCoords.length} active donation locations available</p>
            </div>
            <MapContainer center={mapCenter} zoom={5} style={{ height: '520px', width: '100%' }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap" />
              {donationsWithCoords.map(d => (
                <Marker key={d._id} position={[d.coordinates.lat, d.coordinates.lng]}>
                  <Popup>
                    <div style={{ minWidth: '220px' }}>
                      <h4 style={{ color: '#0f172a' }}>{d.title}</h4>
                      <p>📦 {d.quantity}</p>
                      <p>📍 {d.pickupAddress}</p>
                      <p>⏰ {new Date(d.expiryTime).toLocaleString()}</p>
                      {d.status === 'available' && (
                        <button onClick={() => handleRequest(d._id)} style={{
                          width: '100%', border: 'none', padding: '10px',
                          borderRadius: '8px', cursor: 'pointer', color: 'white',
                          fontWeight: '700', background: 'linear-gradient(135deg,#0ea5e9,#0284c7)'
                        }}>
                          Claim Donation
                        </button>
                      )}
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
            {donationsWithCoords.length === 0 && (
              <div style={{ padding: '24px', textAlign: 'center', color: '#64748b' }}>
                📍 No donation coordinates available yet.
              </div>
            )}
          </div>
        )}

        {/* LIST VIEW */}
        {view === 'list' && (
          <div>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '80px', color: '#64748b' }}>
                Loading donations...
              </div>
            ) : donations.length === 0 ? (
              <div style={{
                textAlign: 'center', padding: '80px', background: '#ffffff',
                borderRadius: '24px', border: '1px solid #bae6fd',
                boxShadow: '0 10px 25px rgba(14,165,233,0.08)'
              }}>
                <FiPackage size={60} color="#0ea5e9" style={{ marginBottom: '15px' }} />
                <h3 style={{ color: '#0f172a' }}>No Donations Available</h3>
                <p style={{ color: '#64748b' }}>No donations have been posted yet.</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(340px,1fr))', gap: '22px' }}>
                {donations.map(d => (
                  <div key={d._id} style={{
                    background: '#ffffff', borderRadius: '24px', padding: '24px',
                    border: '1px solid #bae6fd', borderLeft: '6px solid #0ea5e9',
                    boxShadow: '0 10px 25px rgba(14,165,233,0.08)', transition: 'all 0.3s ease'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                      <h3 style={{ margin: 0, color: '#0f172a', fontWeight: '700' }}>{d.title}</h3>
                      <span style={{
                        padding: '6px 12px', borderRadius: '20px',
                        fontSize: '0.75rem', fontWeight: '700',
                        background: statusColors[d.status]?.bg,
                        color: statusColors[d.status]?.color
                      }}>
                        {d.status}
                      </span>
                    </div>

                    {d.description && <p style={{ color: '#64748b', lineHeight: '1.6' }}>{d.description}</p>}

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '15px', marginBottom: '18px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475569' }}>
                        <FiPackage color="#0284c7" /> {d.quantity}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475569' }}>
                        <FiMapPin color="#0284c7" /> {d.pickupAddress}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475569' }}>
                        <FiClock color="#0284c7" /> {new Date(d.expiryTime).toLocaleString()}
                      </div>
                      {d.donorId && (
                        <div style={{ color: '#475569' }}>👤 {d.donorId.name}</div>
                      )}
                    </div>

                    {d.status === 'available' && (
                      <button onClick={() => handleRequest(d._id)} disabled={requesting === d._id} style={{
                        width: '100%', padding: '12px', border: 'none', borderRadius: '12px',
                        cursor: 'pointer', fontWeight: '700', color: 'white',
                        background: requesting === d._id ? '#93c5fd' : 'linear-gradient(135deg,#0ea5e9,#0284c7)',
                        boxShadow: '0 8px 20px rgba(14,165,233,0.25)'
                      }}>
                        {requesting === d._id ? 'Claiming...' : 'Claim This Donation'}
                      </button>
                    )}

                    {d.status === 'requested' && (
                      <div style={{
                        textAlign: 'center', padding: '12px', borderRadius: '12px',
                        background: '#dbeafe', color: '#2563eb', fontWeight: '700'
                      }}>
                        ✓ Already Claimed
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NGODashboard;