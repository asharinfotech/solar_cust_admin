import React from 'react';
import { useNavigate } from 'react-router-dom';

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin-login');
  };

  return (
    <button
      onClick={handleLogout}
      style={{
        background: 'linear-gradient(45deg, #dc2626, #b91c1c)',
        color: 'white',
        padding: '12px 20px',
        border: 'none',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        boxShadow: '0 2px 8px rgba(220, 38, 38, 0.3)',
        transition: 'all 0.2s ease',
        outline: 'none'
      }}
      onMouseEnter={(e) => {
        e.target.style.background = 'linear-gradient(45deg, #b91c1c, #991b1b)';
        e.target.style.transform = 'translateY(-1px)';
        e.target.style.boxShadow = '0 4px 12px rgba(220, 38, 38, 0.4)';
      }}
      onMouseLeave={(e) => {
        e.target.style.background = 'linear-gradient(45deg, #dc2626, #b91c1c)';
        e.target.style.transform = 'translateY(0)';
        e.target.style.boxShadow = '0 2px 8px rgba(220, 38, 38, 0.3)';
      }}
      onMouseDown={(e) => {
        e.target.style.transform = 'translateY(0)';
        e.target.style.boxShadow = '0 1px 4px rgba(220, 38, 38, 0.4)';
      }}
      onMouseUp={(e) => {
        e.target.style.transform = 'translateY(-1px)';
        e.target.style.boxShadow = '0 4px 12px rgba(220, 38, 38, 0.4)';
      }}
    >
      {/* Power/Logout Icon */}
      <svg 
        width="18" 
        height="18" 
        fill="currentColor" 
        viewBox="0 0 24 24"
      >
        <path d="M16 17v-3H9v-4h7V7l5 5-5 5M14 2a2 2 0 012 2v2h-2V4H4v16h10v-2h2v2a2 2 0 01-2 2H4a2 2 0 01-2-2V4a2 2 0 012-2h10z" />
      </svg>
      Log Out
    </button>
  );
};

export default LogoutButton;