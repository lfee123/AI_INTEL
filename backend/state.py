import operator
from typing import TypedDict, Annotated, List, Dict, Any

class ResearchState(TypedDict):
    company: str
    ticker: str
    market_data: dict
    news_headlines: list[str]
    filing_text: str
    comps_data: dict
    bull_thesis: str
    bear_thesis: str
    sentiment_score: float
    comps_analysis: str
    filing_insights: str
    red_team_critique: str
    investment_score: int
    sub_scores: dict
    verdict: str
    memo: str
    iteration_count: int
    stream_updates: Annotated[list[str], operator.add]
