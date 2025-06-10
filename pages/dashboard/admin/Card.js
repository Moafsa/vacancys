export default function Card({ children }) {
  return (
    <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, background: '#fff', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', marginBottom: 16 }}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className }) {
  return <div style={{ padding: 16, borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} className={className}>{children}</div>;
}

export function CardContent({ children }) {
  return <div style={{ padding: 16 }}>{children}</div>;
}

export function CardTitle({ children, className }) {
  return <h2 style={{ fontWeight: 600, fontSize: 18 }} className={className}>{children}</h2>;
} 