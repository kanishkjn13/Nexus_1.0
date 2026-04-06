from django.db import models


class Question(models.Model):

    class Difficulty(models.TextChoices):
        EASY = "easy", "Easy"
        MEDIUM = "medium", "Medium"
        HARD = "hard", "Hard"

    text = models.TextField()
    topic = models.CharField(max_length=100, db_index=True)
    difficulty = models.CharField(
        max_length=10,
        choices=Difficulty.choices,
        default=Difficulty.MEDIUM,
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["topic", "difficulty"]

    def __str__(self):
        return f"[{self.topic}] {self.text[:60]}"


class Option(models.Model):
    question = models.ForeignKey(
        Question, on_delete=models.CASCADE, related_name="options"
    )
    text = models.CharField(max_length=300)
    is_correct = models.BooleanField(default=False)

    def __str__(self):
        marker = "✓" if self.is_correct else "✗"
        return f"{marker} {self.text[:60]}"