from fastapi import FastAPI, Depends, Request
from fastapi.responses import StreamingResponse, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict
import json
import asyncio

from graph import build_graph
from memory import init_db, get_db, ThesisHistory
from pdf_generator import generate_pdf_from_html
from state import ResearchState

app = FastAPI(title="AlphaIntel Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    init_db()

class ResearchRequest(BaseModel):
    company: str

@app.post("/api/research")
async def research_company(req: ResearchRequest, db = Depends(get_db)):
    graph = build_graph()
    
    async def sse_generator():
        initial_state = {
            "company": req.company,
            "iteration_count": 0,
            "stream_updates": []
        }
        
        # We use astream to yield updates
        async for output in graph.astream(initial_state):
            # output is a dict: {node_name: state_delta}
            for node_name, state_delta in output.items():
                if "stream_updates" in state_delta and state_delta["stream_updates"]:
                    for msg in state_delta["stream_updates"]:
                        yield f"data: {msg}\n\n"
        
        # After completion, we can fetch final state and save to DB
        # To get final state, we can run graph.invoke if astream doesn't yield full state,
        # but astream modifies state in place in some setups or we just accumulate.
        # Wait, astream returns delta. To be safe, we should invoke or accumulate.
        pass

    # A better way to get full state and stream is using `astream` and tracking the full state locally.
    async def robust_sse_generator():
        state = {
            "company": req.company,
            "iteration_count": 0,
            "stream_updates": []
        }
        try:
            async for event in graph.astream(state, stream_mode="values"):
                if "stream_updates" in event and event["stream_updates"]:
                    # In stream_mode="values", event is the whole state after each step
                    updates = event["stream_updates"]
                    # We only want to yield new updates. We'll clear them or just yield the last one if we manage it.
                    # Since stream_updates is a list that appends, we should track index.
                    pass
        except Exception as e:
            yield f"data: {json.dumps({'type': 'error', 'agent': 'system', 'status': str(e)})}\n\n"
            
    # Let's use standard astream which returns node outputs
    async def simple_sse_generator():
        initial_state = {
            "company": req.company,
            "iteration_count": 0,
            "stream_updates": []
        }
        
        final_state = {}
        try:
            async for node, delta in graph.astream(initial_state, stream_mode="updates"):
                if "stream_updates" in delta and delta["stream_updates"]:
                    for msg in delta["stream_updates"]:
                        # Convert the msg to proper SSE format if it doesn't have type
                        msg_dict = json.loads(msg)
                        msg_dict["type"] = "agent_update"
                        yield f"data: {json.dumps(msg_dict)}\n\n"
                
                # accumulate state for DB
                final_state.update(delta)
            
            # Save to DB
            if "ticker" in final_state:
                history = ThesisHistory(
                    ticker=final_state.get("ticker"),
                    company_name=final_state.get("company", req.company),
                    investment_score=final_state.get("investment_score", 0),
                    verdict=final_state.get("verdict", ""),
                    bull_thesis=final_state.get("bull_thesis", ""),
                    bear_thesis=final_state.get("bear_thesis", ""),
                    memo_html=final_state.get("memo", "")
                )
                db.add(history)
                db.commit()
                
            # Final message
            yield f"data: {json.dumps({'type': 'complete', 'state': final_state})}\n\n"
            
        except Exception as e:
            yield f"data: {json.dumps({'type': 'error', 'agent': 'system', 'status': str(e)})}\n\n"

    return StreamingResponse(simple_sse_generator(), media_type="text/event-stream")

@app.get("/api/memo/{company_slug}")
async def get_memo(company_slug: str, db = Depends(get_db)):
    record = db.query(ThesisHistory).filter(ThesisHistory.ticker == company_slug.upper()).order_by(ThesisHistory.created_at.desc()).first()
    if not record:
        return Response(content="Not found", status_code=404)
        
    pdf_buffer = generate_pdf_from_html(record.memo_html)
    return Response(content=pdf_buffer.getvalue(), media_type="application/pdf")

class TournamentRequest(BaseModel):
    companies: List[str]

@app.post("/api/tournament")
async def run_tournament(req: TournamentRequest):
    # Tournament logic
    return {"message": "Tournament mode initiated."}

@app.get("/api/history/{ticker}")
async def get_history(ticker: str, db = Depends(get_db)):
    records = db.query(ThesisHistory).filter(ThesisHistory.ticker == ticker.upper()).order_by(ThesisHistory.created_at.desc()).all()
    return [{"id": r.id, "date": r.created_at, "score": r.investment_score, "verdict": r.verdict} for r in records]

class BatchRequest(BaseModel):
    companies: List[str]
    portfolio_weights: Dict[str, float]

@app.post("/api/research/batch")
async def run_batch(req: BatchRequest):
    return {"message": "Batch mode initiated."}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
