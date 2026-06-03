import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FiLogOut } from 'react-icons/fi';
import logo from '../assets/logo.png';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const roleColors = {
    donor:     '#16a34a',
    ngo:       '#2563eb',
    volunteer: '#d97706',
    admin:     '#dc2626'
  };

  return (
    <nav style={{
      background: '#ffffff',
      borderBottom: '1px solid #e2e8f0',
      padding: '0 2rem',
      height: '65px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
    }}>

      {/* LOGO */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <img
          src={logo}
          alt="FoodBridge"
          style={{ height: '46px', objectFit: 'contain' }}
        />
      </div>

      {/* RIGHT SIDE */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{
          background: roleColors[user?.role] + '15',
          color: roleColors[user?.role],
          padding: '4px 12px',
          borderRadius: '20px',
          fontSize: '0.8rem',
          fontWeight: '600',
          textTransform: 'capitalize'
        }}>
          {user?.role}
        </div>

        <span style={{ color: '#475569', fontSize: '0.9rem', fontWeight: '500' }}>
          {user?.name}
        </span>

        <button
          onClick={handleLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: '#fee2e2',
            color: '#ef4444',
            border: 'none',
            padding: '8px 14px',
            borderRadius: '8px',
            fontSize: '0.85rem',
            fontWeight: '600',
            cursor: 'pointer'
          }}>
          <FiLogOut size={15} />
          Logout
        </button>
      </div>

    </nav>
  );
};

export default Navbar;