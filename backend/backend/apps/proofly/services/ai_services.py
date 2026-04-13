import os
import json
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))
MODEL = "llama-3.3-70b-versatile"


# ──────────────────────────────────────────────
# 1. QUESTION GENERATION  (existing, unchanged)
# ──────────────────────────────────────────────


def get_difficulty(study_seconds: int) -> str:
    if study_seconds < 1800:
        return "easy"
    elif study_seconds < 7200:
        return "medium"
    else:
        return "hard"


def build_question_prompt(topic: str, number_of_questions: int, difficulty: str) -> str:
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
    prompt = build_question_prompt(topic, number_of_questions, difficulty)

    response = client.chat.completions.create(
        model=MODEL,
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


# ──────────────────────────────────────────────
# 2. AI FEEDBACK  (new)
# ──────────────────────────────────────────────


def build_feedback_prompt(topic_stats: list[dict]) -> str:
    lines = [
        f"- Topic: {s['topic']} | Accuracy: {s['accuracy']}% | Sessions: {s['sessions']}"
        for s in topic_stats
    ]
    stats_block = "\n".join(lines)

    return f"""You are a smart learning mentor helping a student improve at Data Structures and Algorithms.

Here is the student's performance data across topics:
{stats_block}

Analyze their performance and respond ONLY with this exact JSON format — no markdown, no extra text:
{{
  "weak_topics": ["topic1", "topic2"],
  "strong_topics": ["topic3"],
  "feedback": "2-3 sentence personalized analysis of their overall performance",
  "next_steps": ["Specific action 1", "Specific action 2", "Specific action 3"]
}}

Rules:
- weak_topics: topics with accuracy below 60%
- strong_topics: topics with accuracy above 75%
- feedback: motivating, honest, specific to their data
- next_steps: concrete and actionable, not generic advice
""".strip()


def get_ai_feedback(topic_stats: list[dict]) -> dict:
    """
    Takes aggregated topic stats and returns Groq-powered personalized feedback.
    Falls back to rule-based feedback if Groq fails.
    """
    if not topic_stats:
        return None

    try:
        response = client.chat.completions.create(
            model=MODEL,
            messages=[
                {
                    "role": "system",
                    "content": "You are a learning mentor. Always respond with valid JSON only.",
                },
                {"role": "user", "content": build_feedback_prompt(topic_stats)},
            ],
            temperature=0.6,
            max_tokens=600,
        )

        raw = response.choices[0].message.content.strip()
        raw = (
            raw.removeprefix("```json").removeprefix("```").removesuffix("```").strip()
        )
        return json.loads(raw)

    except Exception:
        return _fallback_feedback(topic_stats)


def _fallback_feedback(topic_stats: list[dict]) -> dict:
    """Rule-based fallback if Groq is unavailable."""
    sorted_stats = sorted(topic_stats, key=lambda x: x["accuracy"])
    weak = [s["topic"] for s in sorted_stats if s["accuracy"] < 60]
    strong = [s["topic"] for s in sorted_stats if s["accuracy"] >= 75]

    return {
        "weak_topics": weak,
        "strong_topics": strong,
        "feedback": (
            f"You're struggling with {', '.join(weak)}. Focus there first."
            if weak
            else "You're performing well overall. Keep pushing for consistency."
        ),
        "next_steps": [
            (
                f"Revisit core concepts in {weak[0]}"
                if weak
                else "Challenge yourself with harder problems"
            ),
            "Aim for 80%+ accuracy before moving to a new topic",
            "Practice at least one session per day to build consistency",
        ],
    }
