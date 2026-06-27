import os
import google.generativeai as genai
from pydantic import BaseModel, Field

def get_gemini_model():
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        print("Warning: GEMINI_API_KEY not set.")
    genai.configure(api_key=api_key)
    # Using a 2.5 Pro model
    return genai.GenerativeModel('gemini-2.5-pro')

def get_gemini_json_model():
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        print("Warning: GEMINI_API_KEY not set.")
    genai.configure(api_key=api_key)
    return genai.GenerativeModel('gemini-2.5-pro', generation_config={"response_mime_type": "application/json"})
