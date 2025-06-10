import React from 'react';

export default function TestComponent({ children }) {
  return (
    <div style={{ border: '2px solid red', padding: 20 }}>
      <h2>TestComponent Rendered</h2>
      {children}
    </div>
  );
} 