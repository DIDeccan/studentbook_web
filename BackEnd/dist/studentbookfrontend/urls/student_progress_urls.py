from django.urls import path
from studentbookfrontend.views.student_progress_views import *


urlpatterns = [
    path("recent_watched_videos/<int:student_id>/<int:class_id>", StudentRecentWatchedVediosView.as_view()),
]
