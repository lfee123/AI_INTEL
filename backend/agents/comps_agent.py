import json
from state import ResearchState
from agents.utils import get_gemini_model

def comps_node(state: ResearchState) -> dict:
    model = get_gemini_model()
    
    prompt = f"""
    You are a financial analyst comparing {state['company']} ({state['ticker']}) to its peers.
    
    Data Context:
    Market Data: {json.dumps(state['market_data'])}
    Competitor Data: {json.dumps(state['comps_data'])}
    
    Write a 200-word comparative analysis. Identify if the company is trading at a premium or discount to peers, 
    and evaluate its margin profile vs competitors. Use the data provided.
    """
    
    try:
        response = model.generate_content(prompt)
        analysis = response.text
    except Exception as e:
        analysis = f"Error generating comps analysis: {e}"
        
    stream_msg = json.dumps({"agent": "comps", "peers": ["Derived from data"], "analysis": analysis[:100] + "..."})
    
    return {
        "comps_analysis": analysis,
        "stream_updates": [stream_msg]
    }
