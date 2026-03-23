from google import genai
from google.genai import types
import json
import re
from core.config import settings
from schemas.api_models import AIResumeRewrite

client = genai.Client(api_key=settings.gemini_api_key)

def extract_json(text: str) -> str:
    # Sometimes LLMs wrap json in markdown block
    match = re.search(r'```(?:json)?(.*?)```', text, re.DOTALL)
    if match:
        return match.group(1).strip()
    return text.strip()

def generate_tailored_resume_data(base_resume_text: str, jd_text: str) -> AIResumeRewrite:
    if not settings.gemini_api_key:
        raise ValueError("GEMINI_API_KEY is missing from your .env file.")

    system_instruction = (
        "You are an expert resume writer. Given a base resume and a job description, "
        "your task is to extract missing keywords from the JD that the resume lacks, "
        "and rewrite the professional summary and the top 3 bullet points to better align "
        "with the job description while maintaining truthfulness.\n\n"
        "You MUST respond ONLY with a valid JSON object with the following schema:\n"
        "{\n"
        '  "missing_keywords": ["list of strings"],\n'
        '  "rewritten_summary": "string",\n'
        '  "rewritten_top_bullets": ["list of strings"]\n'
        "}"
    )
    
    prompt = f"Base Resume:\n{base_resume_text}\n\nJob Description:\n{jd_text}"

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt,
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            system_instruction=system_instruction
        )
    )
    
    clean_json = extract_json(response.text)
    data = json.loads(clean_json)
    return AIResumeRewrite(**data)

def generate_cover_letter(base_resume_text: str, jd_text: str, company_name: str, role: str) -> str:
    if not settings.gemini_api_key:
        raise ValueError("GEMINI_API_KEY is missing from your .env file.")

    system_instruction = (
        "You are an expert cover letter writer. Write a tailored, 3-paragraph cover letter "
        "for the provided role and company. Make it engaging, professional, and highlight "
        "how the candidate's experience in their resume aligns with the job description."
    )
    
    prompt = (
        f"Company: {company_name}\nRole: {role}\n\n"
        f"Base Resume:\n{base_resume_text}\n\nJob Description:\n{jd_text}"
    )

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt,
        config=types.GenerateContentConfig(
            system_instruction=system_instruction
        )
    )
    
    return response.text
