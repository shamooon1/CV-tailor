"use client";

import { useEffect, useState } from 'react';
import { fetchBaseResumes, generateApplication } from '@/lib/api';
import { useRouter } from 'next/navigation';
import AILoader from '@/components/AILoader';

export default function GeneratePage() {
  const router = useRouter();
  const [resumes, setResumes] = useState<any[]>([]);
  const [loadingResumes, setLoadingResumes] = useState(true);
  
  const [generating, setGenerating] = useState(false);
  const [formData, setFormData] = useState({
    base_resume_id: '',
    company_name: '',
    role: '',
    jd_text: ''
  });

  useEffect(() => {
    fetchBaseResumes()
      .then(setResumes)
      .catch(console.error)
      .finally(() => setLoadingResumes(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.base_resume_id) return alert("Please select a base resume");
    
    setGenerating(true);
    try {
      const result = await generateApplication({
        ...formData,
        base_resume_id: parseInt(formData.base_resume_id)
      });
      router.push(`/applications/${result.id}`);
    } catch (err) {
      console.error(err);
      alert('Generation failed. Ensure the FastAPI backend is running and GEMINI_API_KEY is valid.');
      setGenerating(false);
    }
  };

  if (generating) {
    return (
      <div className="animate-enter" style={{ maxWidth: '600px', margin: '4rem auto' }}>
        <AILoader message="Analyzing Job Description & Rewriting Resume..." />
      </div>
    );
  }

  return (
    <div className="animate-enter" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '0.5rem' }}>Tailor New Application</h1>
      <p style={{ textAlign: 'center', marginBottom: '2rem' }}>Provide the job details to generate a highly targeted resume and cover letter.</p>
      
      <form onSubmit={handleSubmit} className="glass-panel">
        <div className="form-group">
          <label className="form-label">Select Base Resume</label>
          {loadingResumes ? (
            <p>Loading...</p>
          ) : (
            <select 
              className="input-base" 
              required
              value={formData.base_resume_id}
              onChange={e => setFormData({...formData, base_resume_id: e.target.value})}
            >
              <option value="">-- Choose a Resume --</option>
              {resumes.map(r => (
                <option key={r.id} value={r.id}>{r.name} ({r.skills})</option>
              ))}
            </select>
          )}
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div className="form-group">
            <label className="form-label">Company Name</label>
            <input 
              type="text" 
              className="input-base" 
              required 
              value={formData.company_name}
              onChange={e => setFormData({...formData, company_name: e.target.value})}
              placeholder="e.g. Google"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Target Role</label>
            <input 
              type="text" 
              className="input-base" 
              required 
              value={formData.role}
              onChange={e => setFormData({...formData, role: e.target.value})}
              placeholder="e.g. Senior Frontend Engineer"
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Job Description (JD)</label>
          <textarea 
            className="input-base" 
            required 
            rows={10}
            value={formData.jd_text}
            onChange={e => setFormData({...formData, jd_text: e.target.value})}
            placeholder="Paste the full job description here..."
          />
        </div>

        <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '14px', fontSize: '1.1rem', marginTop: '1rem' }}>
          ✨ Generate Tailored Assets ✨
        </button>
      </form>
    </div>
  );
}
