import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getStats, getDonations } from '../utils/api';

import {
  FiGrid,
  FiPackage,
  FiUsers,
  FiTruck,
  FiLogOut,
  FiBell,
  FiSearch,
  FiTrendingUp,
  FiHeart,
  FiHome,
  FiActivity,
  FiBarChart2
} from 'react-icons/fi';

function AdminDashboard() {
  const [stats, setStats] = useState({});
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const [statsRes, donationsRes] = await Promise.all([
        getStats(),
        getDonations()
      ]);

      setStats(statsRes.data);
      setDonations(donationsRes.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const statCards = [
    {
      title: 'Total Donations',
      value: stats.totalDonations || 0,
      icon: <FiPackage size={22} />,
      color: '#0ea5e9'
    },
    {
      title: 'Delivered',
      value: stats.deliveredDonations || 0,
      icon: <FiTruck size={22} />,
      color: '#22c55e'
    },
    {
      title: 'Donors',
      value: stats.totalDonors || 0,
      icon: <FiHeart size={22} />,
      color: '#ef4444'
    },
    {
      title: 'NGOs',
      value: stats.totalNGOs || 0,
      icon: <FiHome size={22} />,
      color: '#8b5cf6'
    },
    {
      title: 'Volunteers',
      value: stats.totalVolunteers || 0,
      icon: <FiUsers size={22} />,
      color: '#f59e0b'
    },
    {
      title: 'Impact Score',
      value: stats.deliveredDonations || 0,
      icon: <FiTrendingUp size={22} />,
      color: '#10b981'
    }
  ];

  if (loading) {
    return (
      <div
        style={{
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: '20px',
          fontWeight: '600'
        }}
      >
        Loading Dashboard...
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#f0f9ff',
        display: 'flex',
        fontFamily: 'Inter, sans-serif'
      }}
    >
      {/* SIDEBAR */}

      <div
        style={{
          width: '270px',
          background:
            'linear-gradient(180deg,#0369a1,#075985)',
          color: 'white',
          display: 'flex',
          flexDirection: 'column',
          padding: '25px'
        }}
      >
        <h2
          style={{
            marginBottom: '40px',
            fontWeight: '800'
          }}
        >
          🍱 FoodBridge
        </h2>

        <button
          onClick={() => setActiveTab('overview')}
          style={{
            padding: '14px',
            marginBottom: '10px',
            border: 'none',
            borderRadius: '12px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background:
              activeTab === 'overview'
                ? 'rgba(255,255,255,0.2)'
                : 'transparent',
            color: 'white'
          }}
        >
          <FiGrid />
          Overview
        </button>

        <button
          onClick={() => setActiveTab('donations')}
          style={{
            padding: '14px',
            marginBottom: '10px',
            border: 'none',
            borderRadius: '12px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background:
              activeTab === 'donations'
                ? 'rgba(255,255,255,0.2)'
                : 'transparent',
            color: 'white'
          }}
        >
          <FiPackage />
          Donations
        </button>

        <div style={{ marginTop: 'auto' }}>
          <div
            style={{
              background:
                'rgba(255,255,255,0.12)',
              padding: '15px',
              borderRadius: '15px',
              marginBottom: '15px'
            }}
          >
            <h4 style={{ margin: 0 }}>
              {user?.name}
            </h4>

            <p
              style={{
                margin: '5px 0 0',
                opacity: 0.8
              }}
            >
              Administrator
            </p>
          </div>

          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '12px',
              border: 'none',
              cursor: 'pointer',
              background: '#ef4444',
              color: 'white',
              fontWeight: '600'
            }}
          >
            <FiLogOut /> Logout
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}

      <div
        style={{
          flex: 1,
          padding: '30px'
        }}
      >
        {/* TOP BAR */}

        <div
          style={{
            background: 'white',
            padding: '20px 25px',
            borderRadius: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '30px',
            boxShadow:
              '0 10px 25px rgba(0,0,0,0.05)'
          }}
        >
          <div>
            <h2
              style={{
                margin: 0,
                color: '#0369a1'
              }}
            >
              Admin Dashboard
            </h2>

            <p
              style={{
                marginTop: '5px',
                color: '#64748b'
              }}
            >
              Monitor FoodBridge activity
            </p>
          </div>

          <div
            style={{
              display: 'flex',
              gap: '15px'
            }}
          >
            <FiSearch size={22} />
            <FiBell size={22} />
          </div>
        </div>

        {/* HERO */}

        <div
          style={{
            background:
              'linear-gradient(135deg,#0ea5e9,#0284c7)',
            color: 'white',
            padding: '35px',
            borderRadius: '25px',
            marginBottom: '30px'
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: '36px'
            }}
          >
            🛡️ Admin Control Center
          </h1>

          <p
            style={{
              marginTop: '12px',
              opacity: 0.9
            }}
          >
            Monitor donations, NGOs,
            volunteers and platform impact
            in real time.
          </p>
        </div>

        {/* KPI CARDS */}

        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(auto-fit,minmax(220px,1fr))',
            gap: '20px',
            marginBottom: '30px'
          }}
        >
          {statCards.map((card, index) => (
            <div
              key={index}
              style={{
                background: 'white',
                borderRadius: '22px',
                padding: '24px',
                boxShadow:
                  '0 10px 25px rgba(14,165,233,0.08)'
              }}
            >
              <div
                style={{
                  width: '55px',
                  height: '55px',
                  borderRadius: '14px',
                  background: card.color,
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {card.icon}
              </div>

              <h1
                style={{
                  marginTop: '15px',
                  marginBottom: '5px',
                  color: '#0f172a'
                }}
              >
                {card.value}
              </h1>

              <p
                style={{
                  color: '#64748b'
                }}
              >
                {card.title}
              </p>
            </div>
          ))}
        </div>
                {/* QUICK ACTIONS */}

        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(auto-fit,minmax(220px,1fr))',
            gap: '20px',
            marginBottom: '30px'
          }}
        >
          {[
            {
              title: 'Manage Donations',
              icon: <FiPackage />,
              color: '#0ea5e9'
            },
            {
              title: 'User Analytics',
              icon: <FiUsers />,
              color: '#22c55e'
            },
            {
              title: 'Platform Activity',
              icon: <FiActivity />,
              color: '#f59e0b'
            },
            {
              title: 'Reports',
              icon: <FiBarChart2 />,
              color: '#8b5cf6'
            }
          ].map((item, index) => (
            <div
              key={index}
              style={{
                background: 'white',
                padding: '24px',
                borderRadius: '20px',
                cursor: 'pointer',
                boxShadow:
                  '0 10px 25px rgba(0,0,0,0.05)'
              }}
            >
              <div
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '12px',
                  background: item.color,
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '15px'
                }}
              >
                {item.icon}
              </div>

              <h3
                style={{
                  margin: 0,
                  color: '#0f172a'
                }}
              >
                {item.title}
              </h3>
            </div>
          ))}
        </div>

        {activeTab === 'overview' && (
          <>
            {/* IMPACT SECTION */}

            <div
              style={{
                display: 'grid',
                gridTemplateColumns:
                  'repeat(auto-fit,minmax(250px,1fr))',
                gap: '20px',
                marginBottom: '30px'
              }}
            >
              {[
                {
                  title: 'Meals Saved',
                  value:
                    stats.deliveredDonations || 0,
                  color: '#22c55e'
                },
                {
                  title: 'People Served',
                  value:
                    (stats.deliveredDonations || 0) *
                    10,
                  color: '#0ea5e9'
                },
                {
                  title: 'Food Waste Reduced',
                  value:
                    (stats.deliveredDonations || 0) *
                    5 + ' Kg',
                  color: '#f59e0b'
                },
                {
                  title: 'Success Rate',
                  value: '95%',
                  color: '#8b5cf6'
                }
              ].map((item, index) => (
                <div
                  key={index}
                  style={{
                    background: 'white',
                    padding: '24px',
                    borderRadius: '22px',
                    boxShadow:
                      '0 10px 25px rgba(0,0,0,0.05)'
                  }}
                >
                  <h1
                    style={{
                      color: item.color,
                      marginBottom: '10px'
                    }}
                  >
                    {item.value}
                  </h1>

                  <p
                    style={{
                      color: '#64748b'
                    }}
                  >
                    {item.title}
                  </p>
                </div>
              ))}
            </div>

            {/* RECENT DONATIONS */}

            <div
              style={{
                background: 'white',
                borderRadius: '24px',
                padding: '25px',
                boxShadow:
                  '0 10px 25px rgba(0,0,0,0.05)'
              }}
            >
              <h2
                style={{
                  color: '#0369a1',
                  marginBottom: '20px'
                }}
              >
                Recent Donations
              </h2>

              {donations.length === 0 ? (
                <p>No donations found.</p>
              ) : (
                donations
                  .slice(0, 5)
                  .map((donation) => (
                    <div
                      key={donation._id}
                      style={{
                        padding: '15px',
                        borderBottom:
                          '1px solid #e2e8f0',
                        display: 'flex',
                        justifyContent:
                          'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <div>
                        <strong>
                          {donation.title}
                        </strong>

                        <div
                          style={{
                            color: '#64748b',
                            fontSize: '14px'
                          }}
                        >
                          {donation.pickupAddress}
                        </div>
                      </div>

                      <span
                        style={{
                          background: '#dbeafe',
                          color: '#1d4ed8',
                          padding:
                            '6px 12px',
                          borderRadius:
                            '20px'
                        }}
                      >
                        {donation.status}
                      </span>
                    </div>
                  ))
              )}
            </div>
          </>
        )}

        {activeTab === 'donations' && (
          <div
            style={{
              background: 'white',
              borderRadius: '24px',
              padding: '25px',
              boxShadow:
                '0 10px 25px rgba(0,0,0,0.05)'
            }}
          >
            <h2
              style={{
                color: '#0369a1',
                marginBottom: '20px'
              }}
            >
              All Donations
            </h2>

            <div
              style={{
                overflowX: 'auto'
              }}
            >
              <table
                style={{
                  width: '100%',
                  borderCollapse:
                    'collapse'
                }}
              >
                <thead>
                  <tr
                    style={{
                      background:
                        '#f0f9ff'
                    }}
                  >
                    <th
                      style={{
                        padding: '12px',
                        textAlign:
                          'left'
                      }}
                    >
                      Title
                    </th>

                    <th
                      style={{
                        padding: '12px'
                      }}
                    >
                      Quantity
                    </th>

                    <th
                      style={{
                        padding: '12px'
                      }}
                    >
                      Status
                    </th>

                    <th
                      style={{
                        padding: '12px'
                      }}
                    >
                      Address
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {donations.map(
                    (donation) => (
                      <tr
                        key={
                          donation._id
                        }
                      >
                        <td
                          style={{
                            padding:
                              '12px'
                          }}
                        >
                          {
                            donation.title
                          }
                        </td>

                        <td
                          style={{
                            padding:
                              '12px'
                          }}
                        >
                          {
                            donation.quantity
                          }
                        </td>

                        <td
                          style={{
                            padding:
                              '12px'
                          }}
                        >
                          {
                            donation.status
                          }
                        </td>

                        <td
                          style={{
                            padding:
                              '12px'
                          }}
                        >
                          {
                            donation.pickupAddress
                          }
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* FOOTER */}

        <div
          style={{
            textAlign: 'center',
            marginTop: '40px',
            color: '#64748b'
          }}
        >
          FoodBridge Admin Console •
          System Online 🚀
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;