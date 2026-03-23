from jinja2 import Environment, FileSystemLoader
import os
import json

# Determine the templates directory
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TEMPLATES_DIR = os.path.join(BASE_DIR, "templates")

env = Environment(loader=FileSystemLoader(TEMPLATES_DIR))

def render_tailored_resume(base_resume_name: str, base_resume_skills: str, tailored_data_json: str) -> str:
    template = env.get_template("tailored_resume.html")
    
    # Parse the tailored data
    tailored_data = json.loads(tailored_data_json)
    
    # Render with both base resume info and tailored rewrites
    return template.render(
        name=base_resume_name,
        skills=base_resume_skills,
        tailored_data=tailored_data
    )

def render_cover_letter(cover_letter_text: str) -> str:
    template = env.get_template("cover_letter.html")
    return template.render(cover_letter_text=cover_letter_text)
