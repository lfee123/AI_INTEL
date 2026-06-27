import json
from state import ResearchState
from agents.utils import get_gemini_json_model

def news_node(state: ResearchState) -> dict:
    model = get_gemini_json_model()
    
    gdelt_score = state.get("sentiment_score", 50.0) # baseline
    
    prompt = f"""
    Analyze the following recent news headlines for {state['company']}.
    Headlines: {json.dumps(state['news_headlines'])}
    
    Classify each as positive, negative, or neutral. 
    Compute a weighted sentiment score (0-100, where 100 is extremely positive, 50 is neutral, 0 is extremely negative).
    Identify the top 3 positive and top 3 negative narratives/themes from these headlines.
    
    Return a JSON object with the following structure exactly:
    {{
      "sentiment_score": <int>,
      "top_positive": [<string>, <string>, <string>],
      "top_negative": [<string>, <string>, <string>]
    }}
    """
    
    try:
        response = model.generate_content(prompt)
        result = json.loads(response.text)
        final_score = (result.get("sentiment_score", 50) + gdelt_score) / 2
        top_pos = result.get("top_positive", [])
        top_neg = result.get("top_negative", [])
    except Exception as e:
        final_score = gdelt_score
        top_pos = []
        top_neg = []
        
    stream_msg = json.dumps({
        "agent": "news", 
        "sentiment_score": final_score, 
        "top_positive": top_pos, 
        "top_negative": top_neg
    })
    
    return {
        "sentiment_score": final_score,
        "stream_updates": [stream_msg]
    }
