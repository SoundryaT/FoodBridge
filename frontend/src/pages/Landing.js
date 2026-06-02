import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiHeart, FiPackage, FiUsers, FiTruck,
  FiCheckCircle, FiArrowRight, FiZap,
  FiStar, FiGlobe, FiAward
} from 'react-icons/fi';

const Landing = () => {
  const navigate = useNavigate();
  const [count, setCount] = useState({ meals: 0, donors: 0, ngos: 0, volunteers: 0 });

  useEffect(() => {
    const targets = { meals: 500, donors: 50, ngos: 30, volunteers: 20 };
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      setCount({
        meals: Math.floor(targets.meals * progress),
        donors: Math.floor(targets.donors * progress),
        ngos: Math.floor(targets.ngos * progress),
        volunteers: Math.floor(targets.volunteers * progress),
      });
      if (step >= steps) clearInterval(timer);
    }, interval);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#f0f9ff', color: '#0f172a', fontFamily: 'Inter, sans-serif' }}>

      {/* Navbar */}
      <nav style={{
        padding: '0 2rem', height: '70px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid #bae6fd',
        position: 'sticky', top: 0, zIndex: 100,
        boxShadow: '0 4px 20px rgba(14,165,233,0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #0ea5e9, #38bdf8)',
            borderRadius: '12px', width: '40px', height: '40px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 15px rgba(14,165,233,0.4)'
          }}>
            <FiHeart color="white" size={18} />
          </div>
          <span style={{ fontWeight: '800', fontSize: '1.2rem', color: '#0369a1' }}>FoodBridge</span>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button onClick={() => navigate('/login')} style={{
            padding: '9px 24px', borderRadius: '8px',
            border: '1.5px solid #bae6fd', background: 'transparent',
            color: '#0369a1', fontWeight: '600', cursor: 'pointer', fontSize: '0.9rem'
          }}>Login</button>
          <button onClick={() => navigate('/register')} style={{
            padding: '9px 24px', borderRadius: '8px', border: 'none',
            background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
            color: 'white', fontWeight: '700', cursor: 'pointer', fontSize: '0.9rem',
            boxShadow: '0 4px 15px rgba(14,165,233,0.4)'
          }}>Get Started →</button>
        </div>
      </nav>

      {/* Hero */}
      <div style={{
        padding: '100px 2rem 80px', textAlign: 'center',
        background: 'linear-gradient(180deg, #e0f2fe 0%, #f0f9ff 100%)',
        position: 'relative', overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden', pointerEvents: 'none' }}>
          {[...Array(6)].map((_, i) => (
            <div key={i} style={{
              position: 'absolute',
              width: `${[300,200,250,180,220,160][i]}px`,
              height: `${[300,200,250,180,220,160][i]}px`,
              borderRadius: '50%',
              background: `radial-gradient(circle, ${['#bae6fd40','#7dd3fc30','#38bdf820','#0ea5e915','#bae6fd25','#e0f2fe40'][i]}, transparent)`,
              top: `${['-10%','60%','30%','-5%','70%','20%'][i]}`,
              left: `${['-5%','-8%','80%','85%','75%','40%'][i]}`,
              filter: 'blur(40px)'
            }} />
          ))}
        </div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'linear-gradient(135deg, #e0f2fe, #bae6fd)',
            border: '1px solid #7dd3fc', color: '#0369a1',
            padding: '8px 20px', borderRadius: '20px',
            fontSize: '0.85rem', fontWeight: '700', marginBottom: '32px',
            boxShadow: '0 2px 10px rgba(14,165,233,0.2)'
          }}>
            <FiZap size={14} color="#0ea5e9" /> 🌱 Reducing Food Waste, Fighting Hunger
          </div>

          <h1 style={{
            fontSize: 'clamp(2.5rem, 5vw, 4.2rem)', fontWeight: '900',
            lineHeight: '1.15', marginBottom: '24px', maxWidth: '850px', margin: '0 auto 24px'
          }}>
            Bridge the Gap Between{' '}
            <span style={{
              background: 'linear-gradient(135deg, #0ea5e9, #38bdf8, #7dd3fc)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
            }}>Food Surplus</span>
            {' '}and{' '}
            <span style={{
              background: 'linear-gradient(135deg, #0284c7, #0369a1)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
            }}>Human Need</span>
          </h1>

          <p style={{
            fontSize: '1.15rem', color: '#475569', maxWidth: '600px',
            margin: '0 auto 48px', lineHeight: '1.8'
          }}>
            Connect restaurants, hotels, and canteens with NGOs and volunteers
            to redistribute surplus food before it goes to waste.
          </p>

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '60px' }}>
            <button onClick={() => navigate('/register')} style={{
              padding: '16px 36px', borderRadius: '12px', border: 'none',
              background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
              color: 'white', fontWeight: '700', fontSize: '1rem', cursor: 'pointer',
              boxShadow: '0 8px 25px rgba(14,165,233,0.4)',
              display: 'flex', alignItems: 'center', gap: '8px'
            }}>
              Start Donating Food <FiArrowRight size={18} />
            </button>
            <button onClick={() => navigate('/login')} style={{
              padding: '16px 36px', borderRadius: '12px',
              border: '1.5px solid #bae6fd', background: 'white',
              color: '#0369a1', fontWeight: '700', fontSize: '1rem', cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(14,165,233,0.1)'
            }}>
              Find Food Nearby
            </button>
          </div>

          {/* Floating Cards */}
          <div style={{
            display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap'
          }}>
            {[
              { icon: '🍱', text: '50 Meal Packets Available', sub: 'Chennai · 2 mins ago' },
              { icon: '🏪', text: 'Hotel Crown donated food', sub: 'Mumbai · Just now' },
              { icon: '✅', text: 'NGO Hope received 30 meals', sub: 'Delhi · 5 mins ago' },
            ].map((card, i) => (
              <div key={i} style={{
                background: 'white', borderRadius: '14px', padding: '14px 20px',
                border: '1px solid #e0f2fe', boxShadow: '0 4px 20px rgba(14,165,233,0.1)',
                display: 'flex', alignItems: 'center', gap: '12px', minWidth: '240px'
              }}>
                <span style={{ fontSize: '1.5rem' }}>{card.icon}</span>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontWeight: '600', fontSize: '0.85rem', color: '#0f172a' }}>{card.text}</div>
                  <div style={{ color: '#94a3b8', fontSize: '0.75rem', marginTop: '2px' }}>{card.sub}</div>
                </div>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e', flexShrink: 0 }} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{
        background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
        padding: '48px 2rem'
      }}>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '32px', maxWidth: '900px', margin: '0 auto', textAlign: 'center'
        }}>
          {[
            { num: count.meals + '+', label: 'Meals Saved', icon: '🍱' },
            { num: count.donors + '+', label: 'Active Donors', icon: '🏪' },
            { num: count.ngos + '+', label: 'NGOs Helped', icon: '🏠' },
            { num: count.volunteers + '+', label: 'Volunteers', icon: '🙋' },
          ].map((s, i) => (
            <div key={i} style={{ color: 'white' }}>
              <div style={{ fontSize: '1.8rem', marginBottom: '6px' }}>{s.icon}</div>
              <div style={{ fontSize: '2.5rem', fontWeight: '900' }}>{s.num}</div>
              <div style={{ opacity: 0.85, fontWeight: '500', fontSize: '0.9rem', marginTop: '4px' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* How It Works */}
      <div style={{ padding: '80px 2rem', background: '#f0f9ff' }}>
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <div style={{
            display: 'inline-block', background: '#e0f2fe', color: '#0369a1',
            padding: '6px 16px', borderRadius: '20px', fontSize: '0.82rem',
            fontWeight: '700', marginBottom: '16px', border: '1px solid #bae6fd'
          }}>Simple Process</div>
          <h2 style={{ fontSize: '2.4rem', fontWeight: '900', color: '#0f172a' }}>How It Works</h2>
          <p style={{ color: '#64748b', marginTop: '12px', fontSize: '1rem' }}>Four simple steps to redistribute food</p>
        </div>

        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '24px', maxWidth: '1100px', margin: '0 auto'
        }}>
          {[
            { icon: <FiPackage size={24} />, title: 'Donor Posts Food', desc: 'Restaurants post surplus food with quantity, location and expiry time', color: '#0ea5e9', step: '01', bg: '#e0f2fe' },
            { icon: <FiUsers size={24} />, title: 'NGO Claims It', desc: 'Nearby NGOs browse available food and claim what they need', color: '#0284c7', step: '02', bg: '#dbeafe' },
            { icon: <FiTruck size={24} />, title: 'Volunteer Delivers', desc: 'Volunteers pick up and deliver food to beneficiaries', color: '#0369a1', step: '03', bg: '#e0f2fe' },
            { icon: <FiHeart size={24} />, title: 'Impact Tracked', desc: 'Every meal saved is counted and celebrated on the platform', color: '#0ea5e9', step: '04', bg: '#dbeafe' },
          ].map((step, i) => (
            <div key={i} style={{
              background: 'white', borderRadius: '20px', padding: '32px',
              border: '1px solid #e0f2fe', position: 'relative', overflow: 'hidden',
              boxShadow: '0 4px 20px rgba(14,165,233,0.08)',
              transition: 'transform 0.2s'
            }}>
              <div style={{
                position: 'absolute', top: '12px', right: '16px',
                fontSize: '4rem', fontWeight: '900', color: '#f0f9ff'
              }}>{step.step}</div>
              <div style={{
                width: '56px', height: '56px', borderRadius: '16px',
                background: step.bg, color: step.color,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '20px', border: '1px solid #bae6fd'
              }}>{step.icon}</div>
              <h3 style={{ fontWeight: '700', marginBottom: '10px', color: '#0f172a', fontSize: '1.05rem' }}>
                {step.title}
              </h3>
              <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: '1.7' }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Who Uses It */}
      <div style={{ padding: '80px 2rem', background: 'linear-gradient(180deg, #e0f2fe, #f0f9ff)' }}>
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <h2 style={{ fontSize: '2.4rem', fontWeight: '900', color: '#0f172a' }}>Who Uses FoodBridge?</h2>
          <p style={{ color: '#64748b', marginTop: '12px' }}>Built for everyone in the food redistribution chain</p>
        </div>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '24px', maxWidth: '1100px', margin: '0 auto'
        }}>
          {[
            { emoji: '🏪', title: 'Food Donors', items: ['Restaurants', 'Hotels', 'Marriage Halls', 'College Hostels', 'Corporate Cafeterias'], color: '#0ea5e9' },
            { emoji: '🏠', title: 'NGOs', items: ['Orphanages', 'Old Age Homes', 'Charity Organizations', 'Shelters', 'Community Centers'], color: '#0284c7' },
            { emoji: '🙋', title: 'Volunteers', items: ['Pickup & Delivery', 'Track Donations', 'Mark Completion', 'Help Communities', 'Make Impact'], color: '#0369a1' },
            { emoji: '🛡️', title: 'Admins', items: ['Manage Users', 'Monitor Activity', 'View Statistics', 'Generate Reports', 'Platform Control'], color: '#0ea5e9' },
          ].map((role, i) => (
            <div key={i} style={{
              background: 'white', borderRadius: '20px', padding: '28px',
              border: '1px solid #bae6fd', boxShadow: '0 4px 20px rgba(14,165,233,0.08)'
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>{role.emoji}</div>
              <h3 style={{ color: '#0f172a', fontWeight: '700', marginBottom: '16px', fontSize: '1.1rem' }}>{role.title}</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {role.items.map((item, j) => (
                  <div key={j} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475569', fontSize: '0.88rem' }}>
                    <FiCheckCircle size={13} color={role.color} /> {item}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials */}
      <div style={{ padding: '80px 2rem', background: '#f0f9ff' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2 style={{ fontSize: '2.2rem', fontWeight: '900', color: '#0f172a' }}>What People Say</h2>
        </div>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px', maxWidth: '900px', margin: '0 auto'
        }}>
          {[
            { name: 'Ramesh Kumar', role: 'Restaurant Owner, Chennai', text: 'FoodBridge helped us donate 200+ meals last month. It\'s so easy to use!', avatar: 'R' },
            { name: 'Priya NGO', role: 'Director, Hope Foundation', text: 'We now get fresh food donations daily. This platform changed everything for us.', avatar: 'P' },
            { name: 'Arun V', role: 'Volunteer, Mumbai', text: 'I deliver food every weekend. The app makes it super easy to track everything.', avatar: 'A' },
          ].map((t, i) => (
            <div key={i} style={{
              background: 'white', borderRadius: '20px', padding: '28px',
              border: '1px solid #e0f2fe', boxShadow: '0 4px 20px rgba(14,165,233,0.08)'
            }}>
              <div style={{ display: 'flex', gap: '4px', marginBottom: '16px' }}>
                {[...Array(5)].map((_, j) => <FiStar key={j} size={14} color="#f59e0b" fill="#f59e0b" />)}
              </div>
              <p style={{ color: '#475569', fontSize: '0.9rem', lineHeight: '1.7', marginBottom: '20px' }}>
                "{t.text}"
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '40px', height: '40px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white', fontWeight: '700', fontSize: '1rem'
                }}>{t.avatar}</div>
                <div>
                  <div style={{ fontWeight: '700', color: '#0f172a', fontSize: '0.9rem' }}>{t.name}</div>
                  <div style={{ color: '#94a3b8', fontSize: '0.78rem' }}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ padding: '80px 2rem', background: 'linear-gradient(135deg, #0ea5e9, #0284c7, #0369a1)', textAlign: 'center' }}>
        <FiGlobe size={40} color="rgba(255,255,255,0.9)" style={{ marginBottom: '20px' }} />
        <h2 style={{ fontSize: '2.4rem', fontWeight: '900', color: 'white', marginBottom: '16px' }}>
          Ready to Make a Difference?
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.05rem', marginBottom: '40px', maxWidth: '500px', margin: '0 auto 40px' }}>
          Join hundreds of donors, NGOs, and volunteers already using FoodBridge.
        </p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={() => navigate('/register')} style={{
            padding: '16px 36px', borderRadius: '12px', border: 'none',
            background: 'white', color: '#0284c7',
            fontWeight: '800', fontSize: '1rem', cursor: 'pointer',
            boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
            display: 'flex', alignItems: 'center', gap: '8px'
          }}>
            <FiAward size={18} /> Join Now — It's Free
          </button>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        background: '#0f172a', padding: '32px 2rem', textAlign: 'center',
        borderTop: '1px solid #1e293b'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '12px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #0ea5e9, #38bdf8)',
            borderRadius: '8px', width: '28px', height: '28px',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <FiHeart color="white" size={13} />
          </div>
          <span style={{ color: 'white', fontWeight: '700' }}>FoodBridge</span>
        </div>
        <p style={{ color: '#475569', fontSize: '0.88rem' }}>
          © 2026 FoodBridge — Built to reduce food waste and fight hunger
        </p>
      </div>
    </div>
  );
};

export default Landing;