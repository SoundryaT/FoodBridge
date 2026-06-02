import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loginUser } from '../utils/api';

import {
  FiHeart,
  FiEye,
  FiEyeOff,
  FiCheckCircle,
  FiHome,
  FiTruck
} from 'react-icons/fi';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
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

      const res = await loginUser(formData);

      login(res.data.user, res.data.token);

      const role = res.data.user.role;

      if (role === 'admin') {
        navigate('/admin');
      } else if (role === 'donor') {
        navigate('/donor');
      } else if (role === 'ngo') {
        navigate('/ngo');
      } else if (role === 'volunteer') {
        navigate('/volunteer');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Invalid email or password'
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
      {/* Background Effects */}

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
          gridTemplateColumns: '1fr 1fr',
          borderRadius: '30px',
          overflow: 'hidden',
          background:
            'rgba(255,255,255,0.08)',
          backdropFilter: 'blur(15px)',
          boxShadow:
            '0 25px 60px rgba(0,0,0,0.35)'
        }}
      >
        {/* LEFT SIDE */}

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
              fontWeight: '800',
              marginBottom: '15px'
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
            Welcome Back
          </h2>

          <p
            style={{
              color:
                'rgba(255,255,255,0.8)',
              lineHeight: '1.8'
            }}
          >
            Continue your mission to
            reduce food waste and help
            communities by connecting
            donors, NGOs and volunteers.
          </p>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '15px',
              marginTop: '30px'
            }}
          >
            <div>
              <FiCheckCircle /> Secure Login
            </div>

            <div>
              <FiCheckCircle /> Real-Time Tracking
            </div>

            <div>
              <FiCheckCircle /> Community Impact
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
              <FiHeart size={22} />
              <h3>1200+</h3>
              <small>Meals</small>
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
              <FiHome size={22} />
              <h3>100+</h3>
              <small>NGOs</small>
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
              <FiTruck size={22} />
              <h3>250+</h3>
              <small>Deliveries</small>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}

        <div
          style={{
            background:
              'rgba(255,255,255,0.95)',
            padding: '50px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}
        >
          <h1
            style={{
              color: '#0f172a',
              marginBottom: '10px'
            }}
          >
            Login
          </h1>

          <p
            style={{
              color: '#64748b',
              marginBottom: '25px'
            }}
          >
            Sign in to your account
          </p>

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
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
              style={inputStyle}
            />

            <div
              style={{
                position: 'relative'
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
                value={formData.password}
                onChange={handleChange}
                required
                style={{
                  ...inputStyle,
                  marginBottom: '20px'
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
                  top: '18px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                {showPassword ? (
                  <FiEyeOff />
                ) : (
                  <FiEye />
                )}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '16px',
                border: 'none',
                borderRadius: '14px',
                color: 'white',
                fontWeight: '700',
                cursor: 'pointer',
                background:
                  'linear-gradient(135deg,#38bdf8,#0284c7)',
                boxShadow:
                  '0 15px 30px rgba(14,165,233,0.35)'
              }}
            >
              {loading
                ? 'Signing In...'
                : 'Login'}
            </button>
          </form>

          <div
            style={{
              textAlign: 'center',
              marginTop: '25px'
            }}
          >
            <p
              style={{
                color: '#64748b'
              }}
            >
              Don't have an account?
            </p>

            <Link
              to="/register"
              style={{
                color: '#0284c7',
                textDecoration: 'none',
                fontWeight: '700'
              }}
            >
              Create Account →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

const inputStyle = {
  width: '100%',
  padding: '14px',
  border: '1px solid #cbd5e1',
  borderRadius: '14px',
  marginBottom: '18px',
  fontSize: '15px',
  outline: 'none',
  boxSizing: 'border-box'
};

export default Login;