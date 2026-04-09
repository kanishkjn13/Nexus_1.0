from django.db import models
from django.conf import settings


class StudySession(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="sessions"
    )
    topic = models.CharField(max_length=255)
    score = models.IntegerField()
    total_questions = models.IntegerField()
    time_limit = models.IntegerField(help_text="Time limit in seconds")
    time_taken = models.IntegerField(help_text="Actual time taken in seconds")
    timed_out = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.user} | {self.topic} | {self.score}/{self.total_questions}"
