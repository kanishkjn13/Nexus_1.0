import os
import json
import google.generativeai as genai

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

model = genai.GenerativeModel("gemini-1.5-flash-latest")


def build_prompt(topic: str, number_of_questions: int) -> str:
    return f"""
You are a quiz generator for computer science topics.

Generate exactly {number_of_questions} multiple choice questions on the topic: "{topic}".

Return ONLY a valid JSON array. No explanation, no markdown, no code blocks.

Format:
[
  {{
    "question": "What is ...?",
    "options": ["A. ...", "B. ...", "C. ...", "D. ..."],
    "correct_answer": "A. ..."
  }}
]

Rules:
- Each question must have exactly 4 options
- correct_answer must exactly match one of the options
- Return raw JSON only, no extra text
""".strip()


def clean_response(raw: str) -> str:
    """Remove markdown/code fences if present"""
    raw = raw.strip()

    if raw.startswith("```"):
        parts = raw.split("```")
        if len(parts) > 1:
            raw = parts[1]
        if raw.startswith("json"):
            raw = raw[4:]
        raw = raw.strip()

    return raw


def generate_questions(topic: str, number_of_questions: int) -> list:
    prompt = build_prompt(topic, number_of_questions)

    response = model.generate_content(
        prompt, generation_config={"temperature": 0.2}  # 🔥 more consistent JSON
    )

    raw = clean_response(response.text)

    try:
        return json.loads(raw)
    except json.JSONDecodeError:
        raise ValueError(f"Invalid JSON returned:\n{raw[:300]}")
