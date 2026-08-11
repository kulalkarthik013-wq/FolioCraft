import json
import time
from typing import List, Optional
from pydantic import BaseModel, Field
from google import genai
from google.genai import types
from google.genai.errors import APIError

from app.config import GEMINI_API_KEY

client = genai.Client(api_key=GEMINI_API_KEY)

# Add robust fallbacks including current active models to handle 404 or rate-limit issues
MODELS = ["gemini-2.5-flash", "gemini-2.5-flash-lite", "gemini-3.6-flash"]

# Define Pydantic schema for guaranteed structured output
class ProjectSchema(BaseModel):
    title: str = Field(default="")
    description: str = Field(default="")

class ExperienceSchema(BaseModel):
    company: str = Field(default="")
    role: str = Field(default="")
    duration: str = Field(default="")

class EducationSchema(BaseModel):
    institution: str = Field(default="")
    degree: str = Field(default="")
    year: str = Field(default="")

class CertificationSchema(BaseModel):
    title: str = Field(default="")

class ResumeResponseSchema(BaseModel):
    name: str = Field(default="")
    title: str = Field(default="")
    email: str = Field(default="")
    phone: str = Field(default="")
    linkedin: str = Field(default="")
    github: str = Field(default="")
    portfolio: str = Field(default="")
    summary: str = Field(default="")
    skills: List[str] = Field(default_factory=list)
    projects: List[ProjectSchema] = Field(default_factory=list)
    experiences: List[ExperienceSchema] = Field(default_factory=list)
    education: List[EducationSchema] = Field(default_factory=list)
    certifications: List[CertificationSchema] = Field(default_factory=list)


def analyze_resume(resume_text: str) -> dict:
    prompt = f"""
You are an expert resume parser. Extract information accurately from the provided resume text.
Pay special attention to finding the candidate's exact full name and mapping it to the "name" field.

Resume Text:
{resume_text}
"""

    last_error = None

    for model_name in MODELS:
        for attempt in range(2):
            try:
                response = client.models.generate_content(
                    model=model_name,
                    contents=prompt,
                    config=types.GenerateContentConfig(
                        response_mime_type="application/json",
                        response_schema=ResumeResponseSchema,
                        temperature=0.1,
                    )
                )
                
                # Guaranteed valid JSON matching the schema
                data = json.loads(response.text)
                
                # Normalize mapping so frontend can read either 'name' or 'fullName' seamlessly
                if data and "name" in data and not data.get("fullName"):
                    data["fullName"] = data["name"]
                    
                return data

            except APIError as e:
                last_error = e
                if e.code == 429:
                    wait_seconds = 6 * (attempt + 1)
                    print(f"⚠️ Quota limit on {model_name}. Retrying in {wait_seconds}s...")
                    time.sleep(wait_seconds)
                else:
                    print(f"⚠️ API Error on {model_name} ({e.code}): {e.message}. Switching model...")
                    break

            except Exception as e:
                last_error = e
                print(f"❌ Error on {model_name}: {str(e)}")
                break

    raise last_error or Exception("All Gemini model parsing attempts failed.")