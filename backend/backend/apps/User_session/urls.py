from django.urls import path
from .views import StudySessionListCreateView, ProgressView, RecommendationView

urlpatterns = [
    path("sessions/", StudySessionListCreateView.as_view(), name="study-sessions"),
    path("progress/", ProgressView.as_view(), name="user-progress"),
    path("recommendation/", RecommendationView.as_view(), name="recommendation"),
]
