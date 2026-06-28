import os
from groq import Groq

# We will initialize the client dynamically to ensure it picks up env vars
def get_groq_client():
    return Groq(api_key=os.environ.get("GROQ_API_KEY"))

import time

def call_llm(prompt: str, system: str = "", temperature: float = 0.7, is_json: bool = False, max_tokens: int = 2048) -> str:
    # Add 2 second delay between calls to stay under 30K TPM
    time.sleep(2)
    
    client = get_groq_client()
    messages = []
    if system:
        messages.append({"role": "system", "content": system})
        
    # LLaMA 3.3 has an 8192 token context window.
    # We must leave room for the output (max_tokens).
    if len(prompt) > 16000:
        prompt = prompt[:16000] + "\n...[TRUNCATED to fit context window]"
        
    messages.append({"role": "user", "content": prompt})
    
    params = {
        "model": "llama-3.3-70b-versatile",
        "messages": messages,
        "temperature": temperature,
        "max_completion_tokens": max_tokens,
    }
    
    if is_json:
        params["response_format"] = {"type": "json_object"}
        
    try:
        response = client.chat.completions.create(**params)
    except Exception as e:
        err_msg = str(e).lower()
        if "429" in err_msg or "rate limit" in err_msg or "rate_limit" in err_msg:
            # Fallback to llama-3.1-8b-instant because mixtral was decommissioned
            print(f"RATE LIMIT HIT FOR {params['model']}! Falling back to llama-3.1-8b-instant...")
            params["model"] = "llama-3.1-8b-instant"
            response = client.chat.completions.create(**params)
        else:
            raise e
            
    return response.choices[0].message.content

# --- Backward compatibility adapters for existing agents ---
class DummyResponse:
    def __init__(self, text):
        self.text = text

class GroqAdapter:
    def __init__(self, is_json=False, max_tokens=2048):
        self.is_json = is_json
        self.max_tokens = max_tokens
        
    def generate_content(self, prompt, *args, **kwargs):
        # We simply pass the prompt to the call_llm function
        text = call_llm(prompt, is_json=self.is_json, max_tokens=self.max_tokens)
        return DummyResponse(text)

def get_gemini_model():
    return GroqAdapter(is_json=False)

def get_gemini_json_model():
    return GroqAdapter(is_json=True)

