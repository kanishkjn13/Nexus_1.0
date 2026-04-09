from rest_framework import serializers
from .models import StudySession


class StudySessionSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = StudySession
        "total_questions", "time_limit",
        "time_taken", "timed_out", "created_at"
        fields = [
            "id",
            "user",
            "topic",
            "score",
            "total_questions",
            "time_limit",
            "time_taken",
            "timed_out",
            "created_at",
        ]
        read_only_fields = ["id", "user", "created_at"]

    def validate(self, data):
        if data["score"] > data["total_questions"]:
            raise serializers.ValidationError("Score cannot exceed total_questions.")
        return data
