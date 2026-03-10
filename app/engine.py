import os
from google import genai
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

# This defines exactly what we want Gemini to send back
class AIResponse(BaseModel):
    sql: str
    chart_type: str
    insight: str

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

# Your Database Schema (Keep this updated as your DB grows)
DB_SCHEMA = """
Table: users (id, username, email)
Table: saved_queries (id, prompt, sql_generated, chart_type, owner_id)
"""

def generate_business_insight(user_prompt: str):
    sys_instruct = f"""
    You are a Senior Data Analyst for SynapseBI.
    Given the following schema: {DB_SCHEMA}
    Translate the user's request into a SQL query.
    Also, suggest a chart type: 'bar', 'line', 'pie', or 'kpi'.
    Provide a 1-sentence business insight.
    Return ONLY JSON.
    """

    response = client.models.generate_content(
        model="gemini-2.0-flash",
        contents=user_prompt,
        config={
            'system_instruction': sys_instruct,
            'response_mime_type': 'application/json',
            'response_schema': AIResponse,
        }
    )
    return response.parsed