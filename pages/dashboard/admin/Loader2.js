export default function Loader2({ className }) {
  return (
    <svg className={className} width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ animation: 'spin 1s linear infinite' }}>
      <circle cx="16" cy="16" r="14" stroke="#10b981" strokeWidth="4" strokeDasharray="22 22" />
      <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
    </svg>
  );
} 