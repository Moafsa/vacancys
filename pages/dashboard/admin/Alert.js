export default function Alert({ children, variant, className }) {
  const bg = variant === 'destructive' ? '#fee2e2' : '#f3f4f6';
  const color = variant === 'destructive' ? '#b91c1c' : '#374151';
  return (
    <div style={{ background: bg, color, borderRadius: 8, padding: 16, marginBottom: 8 }} className={className}>
      {children}
    </div>
  );
}

export function AlertDescription({ children }) {
  return <div>{children}</div>;
} 