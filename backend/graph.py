import json
from langgraph.graph import StateGraph, START, END
from state import ResearchState

from agents.planning_agent import planning_node
from agents.bull_agent import bull_node
from agents.bear_agent import bear_node
from agents.news_agent import news_node
from agents.comps_agent import comps_node
from agents.filing_agent import filing_node
from agents.red_team_agent import red_team_node
from agents.scorer_agent import scorer_node
from agents.memo_agent import memo_node

def should_reflect(state: ResearchState) -> str:
    score = state.get("investment_score", 100)
    try:
        critique_data = json.loads(state.get("red_team_critique", "{}"))
        flags = critique_data.get("flags", 0)
    except:
        flags = 0
        
    iteration = state.get("iteration_count", 0)
    
    if (score < 50 or flags > 2) and iteration < 2:
        return "reflect"
    return "done"

def reflection_node(state: ResearchState) -> dict:
    iters = state.get("iteration_count", 0) + 1
    stream_msg = json.dumps({
        "agent": "reflection", 
        "status": f"Low confidence detected. Re-running analysis (iteration {iters})..."
    })
    return {
        "iteration_count": iters,
        "stream_updates": [stream_msg]
    }

def build_graph():
    builder = StateGraph(ResearchState)
    
    builder.add_node("planner", planning_node)
    
    builder.add_node("bull", bull_node)
    builder.add_node("bear", bear_node)
    builder.add_node("news", news_node)
    builder.add_node("comps", comps_node)
    builder.add_node("filing", filing_node)
    
    def gather_initial(state: ResearchState):
        return {}
        
    builder.add_node("gather_initial", gather_initial)
    builder.add_node("critic", red_team_node)
    builder.add_node("scorer", scorer_node)
    builder.add_node("reflection", reflection_node)
    builder.add_node("memo", memo_node)
    
    builder.add_edge(START, "planner")
    
    builder.add_edge("planner", "news")
    builder.add_edge("planner", "comps")
    builder.add_edge("planner", "filing")
    
    builder.add_edge(["news", "comps", "filing"], "gather_initial")
    
    builder.add_edge("gather_initial", "bull")
    builder.add_edge("gather_initial", "bear")
    
    builder.add_edge(["bull", "bear"], "critic")
    
    builder.add_edge("critic", "scorer")
    
    builder.add_conditional_edges(
        "scorer",
        should_reflect,
        {
            "reflect": "reflection",
            "done": "memo"
        }
    )
    
    builder.add_edge("reflection", "bull")
    builder.add_edge("reflection", "bear")
    
    builder.add_edge("memo", END)
    
    return builder.compile()
