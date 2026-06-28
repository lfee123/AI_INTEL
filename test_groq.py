import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), 'backend', '.env'))

client = Groq(api_key=os.environ.get("GROQ_API_KEY"))
try:
    res = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": "hi"}],
        max_tokens=4096
    )
    print("SUCCESS 4096")
except Exception as e:
    print(f"ERROR 4096: {e}")

try:
    res = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": "hi"}],
        max_tokens=1024
    )
    print("SUCCESS 1024")
except Exception as e:
    print(f"ERROR 1024: {e}")
