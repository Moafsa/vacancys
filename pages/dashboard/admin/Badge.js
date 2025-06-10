export default function Badge({ children, variant }) {
  const color = variant === 'default' ? '#10b981' : '#d1d5db';
  const textColor = variant === 'default' ? '#fff' : '#374151';
  return (
    <span style={{ background: color, color: textColor, borderRadius: 12, padding: '2px 12px', fontSize: 12, fontWeight: 500 }}>
      {children}
    </span>
  );
} 