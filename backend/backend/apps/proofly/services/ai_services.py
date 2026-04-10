import os
import json
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))


def get_difficulty(study_seconds: int) -> str:
    if study_seconds < 1800:  # < 30 mins → easy
        return "easy"
    elif study_seconds < 7200:  # 30 mins – 2 hours → medium
        return "medium"
    else:  # > 2 hours → hard
        return "hard"


def build_prompt(topic: str, number_of_questions: int, difficulty: str) -> str:
    return f"""
You are a quiz generator for computer science topics.

Generate exactly {number_of_questions} multiple choice questions on the topic: "{topic}".
Difficulty level: {difficulty.upper()}

Difficulty guidelines:
- EASY: Basic definitions, simple concepts, recall questions
- MEDIUM: Application of concepts, moderate problem solving
- HARD: Deep understanding, complex problem solving, edge cases

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


def generate_questions(
    topic: str, number_of_questions: int, study_seconds: int
) -> list:
    difficulty = get_difficulty(study_seconds)
    prompt = build_prompt(topic, number_of_questions, difficulty)

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
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

    if raw.startswith("```"):
        raw = raw.split("```")[1]
        if raw.startswith("json"):
            raw = raw[4:]
        raw = raw.strip()

    try:
        return json.loads(raw)
    except json.JSONDecodeError:
        raise ValueError(f"Groq returned invalid JSON: {raw[:200]}")
