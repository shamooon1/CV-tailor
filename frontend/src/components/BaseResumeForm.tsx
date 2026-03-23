"use client";

import { useState } from 'react';
import { createBaseResume } from '@/lib/api';

export default function BaseResumeForm({ onSuccess }: { onSuccess: () => void }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', skills: '', experience_text: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createBaseResume(formData);
      setFormData({ name: '', skills: '', experience_text: '' });
      onSuccess();
    } catch (err) {
      console.error(err);
      alert('Failed to save resume.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="glass-panel" style={{ marginTop: '2rem' }}>
      <h3 style={{ marginBottom: '1.5rem' }}>Add New Base Resume</h3>
      <div className="form-group">
        <label className="form-label">Resume Name</label>
        <input 
          type="text" 
          className="input-base" 
          required 
          value={formData.name}
          onChange={e => setFormData({...formData, name: e.target.value})}
          placeholder="e.g. Software Engineer 2024"
        />
      </div>
      <div className="form-group">
        <label className="form-label">Key Skills (Comma separated)</label>
        <input 
          type="text" 
          className="input-base" 
          required 
          value={formData.skills}
          onChange={e => setFormData({...formData, skills: e.target.value})}
          placeholder="Python, React, FastApi"
        />
      </div>
      <div className="form-group">
        <label className="form-label">Experience / Content</label>
        <textarea 
          className="input-base" 
          required 
          rows={6}
          value={formData.experience_text}
          onChange={e => setFormData({...formData, experience_text: e.target.value})}
          placeholder="Paste your full resume text here..."
        />
      </div>
      <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%' }}>
        {loading ? 'Saving...' : 'Save Base Resume'}
      </button>
    </form>
  );
}
