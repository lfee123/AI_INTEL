import json
from state import ResearchState
from agents.utils import get_gemini_model

def bull_node(state: ResearchState) -> dict:
    model = get_gemini_model()
    
    prompt = f"""
    You are an elite Institutional Equity Research Director (e.g., Goldman Sachs, Morgan Stanley) writing a comprehensive, high-conviction BULLISH thesis.
    Company: {state['company']} ({state['ticker']})
    
    Financial & News Context:
    - Market & Financial Metrics: {json.dumps(state['market_data'])}
    - Recent News Headlines: {json.dumps(state['news_headlines'])}
    - SEC Filing Insights (10-K/10-Q excerpts): {state['filing_text'][:3000]}
    
    Write a rigorous, professional Bull Thesis (500-750 words) that reads like an institutional investment memo.
    
    Your thesis must cover the following sections:
    1. EXECUTIVE SUMMARY: Clear investment recommendation and key drivers.
    2. GROWTH CATALYSTS: Detail 2-3 specific, near-to-mid-term growth engines (e.g., product cycles, geographic expansion, pricing power). Cite relevant SEC filing details.
    3. COMPETITIVE MOAT: Analyze barriers to entry (network effects, switching costs, cost advantages, brand equity, proprietary tech).
    4. EARNINGS MOMENTUM & MARGIN EXPANSION: Discuss financial performance, analyzing current price, P/E, EPS, debt, or margins from the market data.
    5. MARKET OPPORTUNITY (TAM/SAM): Quantify or qualitatively describe the long-term runway.
    
    Guidelines:
    - You must reference specific numbers/data points from the context (e.g., current price, ratios, news facts, filing excerpts).
    - Avoid high-level generic statements. Provide granular, company-specific logic.
    - Format with professional markdown headers, lists, and bold key metrics.
    """
    
    if state.get("iteration_count", 0) > 0 and state.get("red_team_critique"):
        prompt += f"\nAddress this critique from the red team: {state['red_team_critique']}"
        
    try:
        response = model.generate_content(prompt)
        thesis = response.text
    except Exception as e:
        thesis = f"Error generating bull thesis: {e}"
        
    stream_msg = json.dumps({"agent": "bull", "status": "Building bull case...", "content": thesis})
    
    return {
        "bull_thesis": thesis,
        "stream_updates": [stream_msg]
    }
