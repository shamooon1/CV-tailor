"use client";

import { useEffect, useState } from 'react';
import { fetchJobApplication } from '@/lib/api';
import { useParams } from 'next/navigation';

export default function ApplicationViewer() {
  const params = useParams();
  const [appData, setAppData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchJobApplication(params.id as string)
        .then(setAppData)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [params.id]);

  if (loading) return <div className="animate-enter" style={{ textAlign: 'center', marginTop: '4rem' }}>Loading application data...</div>;
  if (!appData) return <div className="animate-enter" style={{ textAlign: 'center', marginTop: '4rem' }}>Application not found.</div>;

  const hasAsset = !!appData.tailored_asset;
  let tailoredJson = null;
  if (hasAsset) {
    try {
      tailoredJson = JSON.parse(appData.tailored_asset.tailored_resume_json);
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div className="animate-enter">
      <header style={{ marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '1px solid var(--glass-border)' }}>
        <h1>{appData.role} at {appData.company_name}</h1>
        <p>Status: <strong style={{ color: 'var(--primary-color)' }}>{appData.status}</strong></p>
      </header>

      {!hasAsset ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '3rem' }}>
          <h3>Asset Generation Pending</h3>
          <p>The AI is still processing, or generation failed.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) minmax(300px, 1fr)', gap: '2rem' }}>
          {/* Tailored Resume Panel */}
          <div className="glass-panel">
            <h2 style={{ marginBottom: '1.5rem', color: 'var(--primary-color)' }}>Tailored Resume Data</h2>
            
            {tailoredJson ? (
              <>
                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ color: 'var(--text-secondary)' }}>Rewritten Summary</h4>
                  <p style={{ color: 'var(--text-primary)' }}>{tailoredJson.rewritten_summary}</p>
                </div>
                
                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ color: 'var(--text-secondary)' }}>Top Experience Bullets</h4>
                  <ul style={{ paddingLeft: '1.5rem', color: 'var(--text-primary)' }}>
                    {tailoredJson.rewritten_top_bullets?.map((bull: string, i: number) => (
                      <li key={i} style={{ marginBottom: '0.5rem' }}>{bull}</li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 style={{ color: 'var(--text-secondary)' }}>Newly Injected Keywords</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
                    {tailoredJson.missing_keywords?.map((kw: string, i: number) => (
                      <span key={i} style={{ background: 'rgba(59, 130, 246, 0.2)', padding: '4px 10px', borderRadius: '4px', fontSize: '0.85rem', color: 'var(--primary-color)' }}>
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <p>Error parsing JSON data.</p>
            )}
          </div>

          {/* Cover Letter Panel */}
          <div className="glass-panel">
            <h2 style={{ marginBottom: '1.5rem', color: 'var(--accent-color)' }}>Cover Letter</h2>
            <div style={{ whiteSpace: 'pre-wrap', color: 'var(--text-primary)', background: 'rgba(15, 23, 42, 0.4)', padding: '1.5rem', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
              {appData.tailored_asset.cover_letter_text}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
