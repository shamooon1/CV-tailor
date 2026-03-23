export default function AILoader({ message }: { message: string }) {
  return (
    <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
      <div style={{
        display: 'inline-block',
        width: '50px',
        height: '50px',
        border: '4px solid var(--glass-border)',
        borderTopColor: 'var(--primary-color)',
        borderRadius: '50%',
        animation: 'spin 1s ease-in-out infinite',
        marginBottom: '1.5rem'
      }}></div>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
      <h3 style={{ background: 'linear-gradient(to right, var(--primary-color), var(--accent-color))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '0.5rem' }}>
        {message}
      </h3>
      <p>This may take up to 60 seconds.</p>
    </div>
  );
}
