const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

export async function fetchBaseResumes() {
  const res = await fetch(`${API_URL}/cv/resumes`, { cache: 'no-store' });
  if (!res.ok) throw new Error("Failed to fetch resumes");
  return res.json();
}

export async function createBaseResume(data: { name: string; skills: string; experience_text: string }) {
  const res = await fetch(`${API_URL}/cv/resumes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create resume");
  return res.json();
}

export async function fetchJobApplications() {
  const res = await fetch(`${API_URL}/cv/applications`, { cache: 'no-store' });
  if (!res.ok) throw new Error("Failed to fetch applications");
  return res.json();
}

export async function fetchJobApplication(id: string) {
  const res = await fetch(`${API_URL}/cv/applications/${id}`, { cache: 'no-store' });
  if (!res.ok) throw new Error("Failed to fetch application");
  return res.json();
}

export async function generateApplication(data: { base_resume_id: number; company_name: string; role: string; jd_text: string }) {
  const res = await fetch(`${API_URL}/generation/generate-application`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to generate application");
  return res.json();
}
