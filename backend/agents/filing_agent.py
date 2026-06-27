import json
from state import ResearchState
from agents.utils import get_gemini_json_model

def filing_node(state: ResearchState) -> dict:
    model = get_gemini_json_model()
    
    prompt = f"""
    Analyze these excerpts from recent SEC filings (10-K/10-Q) for {state['company']}.
    
    Filings Text:
    {state['filing_text'][:3000]}
    
    Extract:
    1. Management tone (optimistic, cautious, pessimistic)
    2. Key risks disclosed
    3. Revenue guidance/outlook
    4. Capital allocation decisions (buybacks, dividends, M&A)
    
    Also provide a 300-word summary.
    
    Return EXACTLY this JSON structure:
    {{
        "tone": "...",
        "risks": ["...", "..."],
        "guidance": "...",
        "capital_allocation": "...",
        "summary": "..."
    }}
    """
    
    try:
        response = model.generate_content(prompt)
        result = json.loads(response.text)
        insights = result.get("summary", "")
    except Exception as e:
        result = {"summary": f"Error: {e}"}
        insights = result["summary"]
        
    stream_msg = json.dumps({"agent": "filing", "status": "Extracted 10-K insights...", "summary": insights[:100] + "..."})
    
    return {
        "filing_insights": json.dumps(result),
        "stream_updates": [stream_msg]
    }
