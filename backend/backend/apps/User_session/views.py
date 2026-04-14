from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.db.models import Sum, Count, Max

from .models import StudySession
from .serializers import StudySessionSerializer
from apps.proofly.services.ai_services import get_ai_feedback

WEAK_THRESHOLD = 60
STRONG_THRESHOLD = 75


class StudySessionListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        sessions = StudySession.objects.filter(user=request.user)
        serializer = StudySessionSerializer(sessions, many=True)
        return Response(serializer.data)

    def post(self, request):
        try:
            time_limit = int(request.data.get("time_limit"))
            time_taken = int(request.data.get("time_taken"))
        except (ValueError, TypeError):
            return Response(
                {"error": "time_limit and time_taken must be valid integers."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        timed_out = time_taken > time_limit

        data = request.data.copy()
        if timed_out:
            data["score"] = 0  # Force zero on timeout

        serializer = StudySessionSerializer(data=data)
        if serializer.is_valid():
            serializer.save(user=request.user, timed_out=timed_out)
            response_data = serializer.data
            if timed_out:
                response_data["message"] = "Time limit exceeded. Score recorded as 0."
            return Response(response_data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ProgressView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        sessions = StudySession.objects.filter(user=request.user)

        overall = sessions.aggregate(
            total_sessions=Count("id"),
            total_questions_attempted=Sum("total_questions"),
            total_correct_answers=Sum("score"),
        )

        attempted = overall["total_questions_attempted"] or 0
        correct = overall["total_correct_answers"] or 0

        overall_data = {
            "total_sessions": overall["total_sessions"],
            "total_questions_attempted": attempted,
            "total_correct_answers": correct,
            "accuracy": round((correct / attempted) * 100, 2) if attempted > 0 else 0,
        }

        topic_rows = sessions.values("topic").annotate(
            total_questions=Sum("total_questions"),
            total_correct=Sum("score"),
            sessions=Count("id"),
            latest_session=Max("created_at"),
        ).order_by("latest_session")

        topics_data = {}
        for stat in topic_rows:
            acc = (
                round((stat["total_correct"] / stat["total_questions"]) * 100, 2)
                if stat["total_questions"] > 0
                else 0
            )
            topics_data[stat["topic"]] = {
                "accuracy": acc,
                "sessions": stat["sessions"],
                "total_questions": stat["total_questions"],
                "total_correct": stat["total_correct"],
            }

        return Response({"overall": overall_data, "topics": topics_data})


class AIFeedbackView(APIView):
    """
    GET /api/ai-feedback/
    Calls Groq to analyze the user's topic performance and return
    personalized feedback, weak/strong topics, and next steps.
    """

    permission_classes = [IsAuthenticated]

    def get(self, request):
        topic_rows = (
            StudySession.objects.filter(user=request.user)
            .values("topic")
            .annotate(
                total_questions=Sum("total_questions"),
                total_correct=Sum("score"),
                sessions=Count("id"),
            )
        )

        if not topic_rows.exists():
            return Response(
                {
                    "message": "No sessions yet. Complete a quiz to get AI feedback.",
                    "feedback": None,
                },
                status=status.HTTP_200_OK,
            )

        # Build topic stats list for AI
        topic_stats = [
            {
                "topic": row["topic"],
                "accuracy": (
                    round((row["total_correct"] / row["total_questions"]) * 100, 1)
                    if row["total_questions"] > 0
                    else 0
                ),
                "sessions": row["sessions"],
            }
            for row in topic_rows
        ]

        feedback = get_ai_feedback(topic_stats)

        return Response({"topic_stats": topic_stats, "feedback": feedback})


class RecommendationView(APIView):
    """
    GET /api/recommendation/
    Simple rule-based weak/strong topic classification (fast, no AI call).
    """

    permission_classes = [IsAuthenticated]

    def get(self, request):
        topic_stats = (
            StudySession.objects.filter(user=request.user)
            .values("topic")
            .annotate(
                total_questions=Sum("total_questions"),
                total_correct=Sum("score"),
            )
        )

        if not topic_stats.exists():
            return Response(
                {
                    "weak_topics": [],
                    "strong_topics": [],
                    "message": "No data available. Start practicing.",
                }
            )

        weak_topics, strong_topics = [], []
        for stat in topic_stats:
            if stat["total_questions"] == 0:
                continue
            accuracy = (stat["total_correct"] / stat["total_questions"]) * 100
            if accuracy < WEAK_THRESHOLD:
                weak_topics.append(stat["topic"])
            elif accuracy >= STRONG_THRESHOLD:
                strong_topics.append(stat["topic"])

        return Response(
            {
                "weak_topics": weak_topics,
                "strong_topics": strong_topics,
                "message": _build_message(weak_topics, strong_topics),
            }
        )


def _build_message(weak: list, strong: list) -> str:
    parts = []
    if weak:
        parts.append(
            f"You are weak in {', '.join(t.upper() for t in weak)}. Practice more."
        )
    if strong:
        parts.append(
            f"You are strong in {', '.join(t.upper() for t in strong)}. Keep it up!"
        )
    if not parts:
        return "You are performing at a moderate level. Push for accuracy above 75%."
    return " ".join(parts)
