import React from 'react';

const Offline: React.FC = () => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        textAlign: 'center',
        padding: '1rem',
        backgroundColor: '#f8f8f8',
        color: '#333',
      }}
    >
      <div>
        <h1>You&apos;re Offline</h1>
        <p>Please check your internet connection and try again.</p>
      </div>
    </div>
  );
};

export default Offline;
