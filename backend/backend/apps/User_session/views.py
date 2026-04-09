from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.db.models import Sum, Count

from .models import StudySession
from .serializers import StudySessionSerializer

WEAK_THRESHOLD = 50
STRONG_THRESHOLD = 70


class StudySessionListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        sessions = StudySession.objects.filter(user=request.user)
        serializer = StudySessionSerializer(sessions, many=True)
        return Response(serializer.data)

    def post(self, request):
        time_limit = request.data.get("time_limit")
        time_taken = request.data.get("time_taken")

        # Validate time fields
        try:
            time_limit = int(time_limit)
            time_taken = int(time_taken)
        except (ValueError, TypeError):
            return Response(
                {"error": "time_limit and time_taken must be valid integers."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Timer enforcement — backend decides timed_out
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

        topic_stats = sessions.values("topic").annotate(
            total_questions=Sum("total_questions"),
            total_correct=Sum("score"),
        )

        topics_data = {
            stat["topic"]: (
                round((stat["total_correct"] / stat["total_questions"]) * 100, 2)
                if stat["total_questions"] > 0
                else 0
            )
            for stat in topic_stats
        }

        return Response({"overall": overall_data, "topics": topics_data})


class RecommendationView(APIView):
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

        weak_topics = []
        strong_topics = []

        for stat in topic_stats:
            if stat["total_questions"] == 0:
                continue
            accuracy = (stat["total_correct"] / stat["total_questions"]) * 100
            if accuracy < WEAK_THRESHOLD:
                weak_topics.append(stat["topic"])
            elif accuracy > STRONG_THRESHOLD:
                strong_topics.append(stat["topic"])

        return Response(
            {
                "weak_topics": weak_topics,
                "strong_topics": strong_topics,
                "message": build_message(weak_topics, strong_topics),
            }
        )


def build_message(weak: list, strong: list) -> str:
    parts = []
    if weak:
        parts.append(
            f"You are weak in {', '.join(t.upper() for t in weak)}. Practice more problems."
        )
    if strong:
        parts.append(
            f"You are strong in {', '.join(t.upper() for t in strong)}. Keep it up!"
        )
    if not parts:
        return "You are performing at a moderate level. Push for accuracy above 70%."
    return " ".join(parts)
