import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { registerUser } from '../utils/api';

import {
  FiHeart,
  FiEye,
  FiEyeOff,
  FiUsers,
  FiTruck,
  FiHome,
  FiCheckCircle
} from 'react-icons/fi';

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'donor',
    phone: '',
    address: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] =
    useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await registerUser(formData);

      login(res.data.user, res.data.token);

      const role = res.data.user.role;

      if (role === 'donor')
        navigate('/donor');
      else if (role === 'ngo')
        navigate('/ngo');
      else if (role === 'volunteer')
        navigate('/volunteer');
      else navigate('/');

    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Registration failed'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background:
          'linear-gradient(135deg,#020617,#0f172a,#1e3a8a,#0284c7)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '30px',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Floating Circle */}

      <div
        style={{
          position: 'absolute',
          width: '350px',
          height: '350px',
          borderRadius: '50%',
          background:
            'rgba(14,165,233,0.18)',
          top: '-120px',
          right: '-120px',
          filter: 'blur(20px)'
        }}
      />

      <div
        style={{
          position: 'absolute',
          width: '250px',
          height: '250px',
          borderRadius: '50%',
          background:
            'rgba(255,255,255,0.08)',
          bottom: '-80px',
          left: '-80px',
          filter: 'blur(20px)'
        }}
      />

      <div
        style={{
          width: '100%',
          maxWidth: '1200px',
          minHeight: '700px',
          display: 'grid',
          gridTemplateColumns:
            '1fr 1fr',
          borderRadius: '30px',
          overflow: 'hidden',
          boxShadow:
            '0 25px 60px rgba(0,0,0,0.35)',
          background:
            'rgba(255,255,255,0.08)',
          backdropFilter: 'blur(15px)'
        }}
      >
        {/* LEFT PANEL */}

        <div
          style={{
            padding: '60px',
            color: 'white',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}
        >
          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '20px',
              background:
                'linear-gradient(135deg,#38bdf8,#0284c7)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: '25px'
            }}
          >
            <FiHeart
              size={35}
              color="white"
            />
          </div>

          <h1
            style={{
              fontSize: '3rem',
              marginBottom: '15px',
              fontWeight: '800'
            }}
          >
            FoodBridge
          </h1>

          <h2
            style={{
              fontSize: '2rem',
              lineHeight: '1.3',
              marginBottom: '20px'
            }}
          >
            Turning Surplus Food
            <br />
            Into Hope
          </h2>

          <p
            style={{
              color:
                'rgba(255,255,255,0.8)',
              lineHeight: '1.8',
              fontSize: '16px',
              marginBottom: '35px'
            }}
          >
            Connect food donors,
            NGOs and volunteers
            through a unified
            platform that reduces
            food waste and serves
            communities in need.
          </p>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '15px'
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}
            >
              <FiCheckCircle />
              Real-Time Donation Tracking
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}
            >
              <FiCheckCircle />
              NGO & Volunteer Network
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}
            >
              <FiCheckCircle />
              Sustainable Food Distribution
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns:
                'repeat(3,1fr)',
              gap: '15px',
              marginTop: '50px'
            }}
          >
            <div
              style={{
                background:
                  'rgba(255,255,255,0.12)',
                padding: '18px',
                borderRadius: '18px',
                textAlign: 'center'
              }}
            >
              <FiHeart size={24} />
              <h3>1200+</h3>
              <small>
                Meals Shared
              </small>
            </div>

            <div
              style={{
                background:
                  'rgba(255,255,255,0.12)',
                padding: '18px',
                borderRadius: '18px',
                textAlign: 'center'
              }}
            >
              <FiHome size={24} />
              <h3>100+</h3>
              <small>
                NGOs
              </small>
            </div>

            <div
              style={{
                background:
                  'rgba(255,255,255,0.12)',
                padding: '18px',
                borderRadius: '18px',
                textAlign: 'center'
              }}
            >
              <FiTruck size={24} />
              <h3>250+</h3>
              <small>
                Deliveries
              </small>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}

        <div
          style={{
            background:
              'rgba(255,255,255,0.95)',
            padding: '50px'
          }}
        >
          <div
            style={{
              marginBottom: '25px'
            }}
          >
            <h1
              style={{
                color: '#0f172a',
                marginBottom: '8px'
              }}
            >
              Create Account
            </h1>

            <p
              style={{
                color: '#64748b'
              }}
            >
              Join FoodBridge today
            </p>
          </div>

          {error && (
            <div
              style={{
                background: '#fee2e2',
                color: '#dc2626',
                padding: '12px',
                borderRadius: '10px',
                marginBottom: '20px'
              }}
            >
              {error}
            </div>
          )}
                    <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              required
              value={formData.name}
              onChange={handleChange}
              style={inputStyle}
            />

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              required
              value={formData.email}
              onChange={handleChange}
              style={inputStyle}
            />

            <div
              style={{
                position: 'relative',
                marginBottom: '18px'
              }}
            >
              <input
                type={
                  showPassword
                    ? 'text'
                    : 'password'
                }
                name="password"
                placeholder="Password"
                required
                value={formData.password}
                onChange={handleChange}
                style={{
                  ...inputStyle,
                  marginBottom: 0,
                  paddingRight: '55px'
                }}
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
                style={{
                  position: 'absolute',
                  right: '15px',
                  top: '50%',
                  transform:
                    'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#64748b'
                }}
              >
                {showPassword ? (
                  <FiEyeOff size={20} />
                ) : (
                  <FiEye size={20} />
                )}
              </button>
            </div>

            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              style={inputStyle}
            >
              <option value="donor">
                🍱 Donor
              </option>

              <option value="ngo">
                🏢 NGO
              </option>

              <option value="volunteer">
                🚚 Volunteer
              </option>
            </select>

            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              style={inputStyle}
            />

            <input
              type="text"
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleChange}
              style={inputStyle}
            />

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '16px',
                border: 'none',
                borderRadius: '14px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '700',
                color: 'white',
                background:
                  'linear-gradient(135deg,#38bdf8,#0284c7)',
                boxShadow:
                  '0 15px 30px rgba(14,165,233,0.35)',
                transition:
                  'all 0.3s ease'
              }}
            >
              {loading
                ? 'Creating Account...'
                : 'Create Account'}
            </button>
          </form>

          <div
            style={{
              marginTop: '25px',
              textAlign: 'center'
            }}
          >
            <p
              style={{
                color: '#64748b'
              }}
            >
              Already have an account?
            </p>

            <Link
              to="/login"
              style={{
                color: '#0284c7',
                fontWeight: '700',
                textDecoration: 'none'
              }}
            >
              Login Here →
            </Link>
          </div>

          <div
            style={{
              marginTop: '35px',
              padding: '20px',
              borderRadius: '16px',
              background: '#f8fafc',
              border:
                '1px solid #e2e8f0'
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '10px'
              }}
            >
              <FiUsers
                color="#0284c7"
              />

              <strong>
                Trusted Community
              </strong>
            </div>

            <p
              style={{
                margin: 0,
                color: '#64748b',
                fontSize: '14px'
              }}
            >
              Join thousands of
              donors, NGOs and
              volunteers working
              together to reduce
              food waste and
              support communities.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const inputStyle = {
  width: '100%',
  padding: '14px',
  marginBottom: '18px',
  border: '1px solid #cbd5e1',
  borderRadius: '14px',
  fontSize: '15px',
  outline: 'none',
  boxSizing: 'border-box',
  background: '#ffffff',
  transition: 'all 0.3s ease'
};

export default Register;