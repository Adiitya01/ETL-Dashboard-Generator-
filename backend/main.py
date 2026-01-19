from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import sqlite3
import pandas as pd
import google.generativeai as genai
import os
from dotenv import load_dotenv
from pydantic import BaseModel
from typing import List, Dict

load_dotenv()

app = FastAPI(title="Result Driven ETL Dashboard API")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

DB_PATH = os.path.join(os.getcwd(), "..", "data", "business_data.db")

# Models
class KPI(BaseModel):
    label: str
    value: str
    trend: float

class InsightRequest(BaseModel):
    context: str

# Helper to get DB connection
def get_db_conn():
    return sqlite3.connect(DB_PATH)

@app.get("/api/kpis")
def get_kpis():
    conn = get_db_conn()
    df_sales = pd.read_sql("SELECT * FROM daily_sales", conn)
    product_stats = pd.read_sql("SELECT * FROM product_analytics", conn)
    
    total_rev = df_sales['total_amount'].sum()
    avg_rating = product_stats['avg_rating'].mean()
    total_orders = pd.read_sql("SELECT count(*) as count FROM raw_sales", conn).iloc[0]['count']
    
    conn.close()
    
    return [
        {"label": "Total Revenue", "value": f"${total_rev:,.2f}", "trend": 12.5},
        {"label": "Total Orders", "value": str(total_orders), "trend": 8.2},
        {"label": "Avg Customer Rating", "value": f"{avg_rating:.2f}/5", "trend": -2.1},
        {"label": "Active Products", "value": str(len(product_stats)), "trend": 0.0}
    ]

@app.get("/api/charts/daily-sales")
def get_daily_sales():
    conn = get_db_conn()
    df = pd.read_sql("SELECT * FROM daily_sales ORDER BY date ASC", conn)
    conn.close()
    return df.to_dict(orient="records")

@app.get("/api/charts/category-sales")
def get_category_sales():
    conn = get_db_conn()
    df = pd.read_sql("SELECT * FROM category_sales", conn)
    conn.close()
    return df.to_dict(orient="records")

@app.get("/api/ai/insights")
def get_ai_insights():
    # Fetch summarized data to feed to Gemini
    conn = get_db_conn()
    product_stats = pd.read_sql("SELECT * FROM product_analytics", conn).to_string()
    category_stats = pd.read_sql("SELECT * FROM category_sales", conn).to_string()
    conn.close()
    
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        return {
            "summary": "Please provide a GEMINI_API_KEY in the .env file to see AI insights.",
            "recommendations": ["Configure API Key", "Restart Backend"]
        }
    
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel('gemini-1.5-flash')
    
    prompt = f"""
    You are a business consultant. Analyze the following business data and provide:
    1. A brief executive summary.
    2. 3-4 actionable business recommendations.
    
    PRODUCT STATS:
    {product_stats}
    
    CATEGORY STATS:
    {category_stats}
    
    Format the response as JSON with keys 'summary' (string) and 'recommendations' (list of strings).
    """
    
    try:
        response = model.generate_content(prompt)
        # Expecting JSON-like response, but we'll parse safely
        import json
        import re
        
        # Clean the response if it contains markdown code blocks
        text = response.text
        json_match = re.search(r'\{.*\}', text, re.DOTALL)
        if json_match:
            data = json.loads(json_match.group())
            return data
        else:
            return {"summary": text, "recommendations": []}
            
    except Exception as e:
        return {"summary": f"Error calling GenAI: {str(e)}", "recommendations": []}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
