import json
from state import ResearchState
from agents.utils import get_gemini_json_model

def red_team_node(state: ResearchState) -> dict:
    model = get_gemini_json_model()
    
    prompt = f"""
    You are the Red Team Critic for an investment committee.
    Company: {state['company']}
    
    Review the Bull and Bear theses below:
    BULL THESIS: {state.get('bull_thesis')}
    BEAR THESIS: {state.get('bear_thesis')}
    
    Also consider:
    Sentiment Score: {state.get('sentiment_score')}
    Filing Insights: {state.get('filing_insights')[:500]}
    
    Challenge weak logic in both cases. Check for cherry-picked data, missing context, recency bias, and confirmation bias.
    Write a 200-word critique. Count the number of severe logical gaps or unaddressed risks (integer).
    
    Return EXACTLY this JSON:
    {{
        "critique": "...",
        "flags": <int>
    }}
    """
    
    try:
        response = model.generate_content(prompt)
        result = json.loads(response.text)
        critique = result.get("critique", "")
        flags = result.get("flags", 0)
    except Exception as e:
        critique = f"Error generating critique: {e}"
        flags = 0
        
    stream_msg = json.dumps({"agent": "critic", "critique": critique, "flags": flags})
    
    return {
        "red_team_critique": json.dumps({"critique": critique, "flags": flags}),
        "stream_updates": [stream_msg]
    }
