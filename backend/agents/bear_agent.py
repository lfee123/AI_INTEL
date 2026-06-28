import json
from state import ResearchState
from agents.utils import get_gemini_model

def bear_node(state: ResearchState) -> dict:
    model = get_gemini_model()
    
    prompt = f"""
    You are an elite Institutional Short-Seller and Equity Research Critic writing a comprehensive, high-conviction BEARISH thesis.
    Company: {state['company']} ({state['ticker']})
    
    Financial & News Context:
    - Market & Financial Metrics: {json.dumps(state['market_data'])}
    - Recent News Headlines: {json.dumps(state['news_headlines'])}
    - SEC Filing Insights (10-K/10-Q excerpts): {state['filing_text'][:3000]}
    
    Write a rigorous, professional Bear Thesis (500-750 words) that reads like an institutional research note warning clients of downside risks.
    
    Your thesis must cover the following sections:
    1. EXECUTIVE SUMMARY: Clear downside recommendation and primary warning signals.
    2. STRUCTURAL RISKS & RED FLAGS: Highlight 2-3 operational, regulatory, or business risks. Cite relevant filing sections.
    3. VALUATION STRETCH: Analyze multiples (P/E, forward P/E, relative peers) and explain why the current price might be overvalued.
    4. COMPETITIVE THREATS: Identify how competitors, industry disruption, or low-cost alternatives are eroding margins or market share.
    5. MACRO HEADWINDS: Address interest rates, supply chain issues, consumer spend contraction, or sector-specific challenges.
    
    Guidelines:
    - Reference specific numbers/data points from the context (e.g., current price, ratios, news facts, filing excerpts).
    - Avoid high-level generic statements. Provide granular, company-specific logic.
    - Format with professional markdown headers, lists, and bold key metrics.
    """
    
    if state.get("iteration_count", 0) > 0 and state.get("red_team_critique"):
        prompt += f"\nAddress this critique from the red team: {state['red_team_critique']}"
        
    try:
        response = model.generate_content(prompt)
        thesis = response.text
    except Exception as e:
        thesis = f"Error generating bear thesis: {e}"
        
    stream_msg = json.dumps({"agent": "bear", "status": "Building bear case...", "content": thesis})
    
    return {
        "bear_thesis": thesis,
        "stream_updates": [stream_msg]
    }
