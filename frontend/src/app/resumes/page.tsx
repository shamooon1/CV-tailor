"use client";

import { useEffect, useState } from 'react';
import { fetchBaseResumes } from '@/lib/api';
import BaseResumeForm from '@/components/BaseResumeForm';

export default function ResumesPage() {
  const [resumes, setResumes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadResumes = () => {
    setLoading(true);
    fetchBaseResumes()
      .then(setResumes)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadResumes();
  }, []);

  return (
    <div className="animate-enter" style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 400px', gap: '2rem', alignItems: 'start' }}>
      <div>
        <h1 style={{ marginBottom: '1.5rem' }}>Master Resumes</h1>
        
        {loading ? (
          <div>Loading resumes...</div>
        ) : resumes.length === 0 ? (
          <div className="glass-panel">
            <p>No base resumes found. Add one to get started.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {resumes.map(r => (
              <div key={r.id} className="glass-panel">
                <h3>{r.name}</h3>
                <p style={{ color: 'var(--primary-color)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>{r.skills}</p>
                <p style={{ fontSize: '0.85rem', whiteSpace: 'pre-wrap', maxHeight: '100px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {r.experience_text.substring(0, 150)}...
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ position: 'sticky', top: '2rem' }}>
        <BaseResumeForm onSuccess={loadResumes} />
      </div>
    </div>
  );
}
