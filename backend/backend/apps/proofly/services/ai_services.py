import os
import json
from groq import Groq

client = Groq(api_key=os.getenv("GROQ_API_KEY"))


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


def generate_questions(topic: str, number_of_questions: int) -> list:
    prompt = build_prompt(topic, number_of_questions)

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",  # free & fast
        messages=[
            {
                "role": "system",
                "content": "You are a quiz generator. Always respond with valid JSON only. No markdown, no explanation.",
            },
            {"role": "user", "content": prompt},
        ],
        temperature=0.7,
    )

    raw = response.choices[0].message.content.strip()

    # Strip markdown fences if model wraps response
    if raw.startswith("```"):
        raw = raw.split("```")[1]
        if raw.startswith("json"):
            raw = raw[4:]
        raw = raw.strip()

    try:
        return json.loads(raw)
    except json.JSONDecodeError:
        raise ValueError(f"Groq returned invalid JSON: {raw[:200]}")
