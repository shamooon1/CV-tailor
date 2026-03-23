"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchJobApplications } from '@/lib/api';

export default function Dashboard() {
  const [apps, setApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobApplications()
      .then(setApps)
      .catch((err) => console.error("Failed to load apps:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="animate-enter">
      <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1>Your Job Applications</h1>
        <p>Manage your AI-tailored resumes and cover letters</p>
      </header>
      
      {loading ? (
        <div style={{ textAlign: 'center' }}>Loading...</div>
      ) : apps.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', maxWidth: '500px', margin: '0 auto' }}>
          <h3>No applications yet</h3>
          <p>Get started by generating your first tailored application!</p>
          <Link href="/generate" className="btn btn-primary" style={{ marginTop: '1rem' }}>
            Generate Application
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {apps.map((app) => (
            <div key={app.id} className="glass-panel">
              <h3>{app.role}</h3>
              <p style={{ color: 'var(--primary-color)', fontWeight: '500', marginBottom: '0.5rem' }}>{app.company_name}</p>
              <p style={{ fontSize: '0.9rem' }}>Status: <strong>{app.status}</strong></p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Applied: {new Date(app.date_applied).toLocaleDateString()}
              </p>
              <Link href={`/applications/${app.id}`} className="btn btn-secondary" style={{ width: '100%', marginTop: '1rem' }}>
                View Assets
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
