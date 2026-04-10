from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .services.ai_services import generate_questions

QUIZ_TIME_LIMIT = 10 * 60  # 10 minutes fixed for every quiz


class GenerateQuestionsView(APIView):
    permission_classes = []

    def post(self, request):
        topic = request.data.get("topic", "").strip()
        number_of_questions = request.data.get("number_of_questions", 5)
        study_time = request.data.get("study_time")  # how long they studied

        # Validate topic
        if not topic:
            return Response(
                {"error": "topic is required."}, status=status.HTTP_400_BAD_REQUEST
            )

        # Validate number_of_questions
        try:
            number_of_questions = int(number_of_questions)
            if not (1 <= number_of_questions <= 20):
                raise ValueError
        except (ValueError, TypeError):
            return Response(
                {"error": "number_of_questions must be an integer between 1 and 20."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Validate study_time (in seconds)
        try:
            study_seconds = int(study_time)
            if study_seconds <= 0:
                raise ValueError
        except (ValueError, TypeError):
            return Response(
                {
                    "error": "study_time is required and must be a positive integer (seconds)."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Call Groq with difficulty based on study time
        try:
            questions = generate_questions(topic, number_of_questions, study_seconds)
        except ValueError as e:
            return Response(
                {"error": "AI returned an invalid response.", "detail": str(e)},
                status=status.HTTP_502_BAD_GATEWAY,
            )
        except Exception as e:
            return Response(
                {
                    "error": "Failed to generate questions. Please try again.",
                    "detail": str(e),
                },
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

        from .services.ai_services import get_difficulty

        difficulty = get_difficulty(study_seconds)

        return Response(
            {
                "topic": topic,
                "difficulty": difficulty,  # ← tells frontend what level
                "time_limit": QUIZ_TIME_LIMIT,  # ← fixed 10 min quiz timer
                "number_of_questions": number_of_questions,
                "questions": questions,
            },
            status=status.HTTP_200_OK,
        )
