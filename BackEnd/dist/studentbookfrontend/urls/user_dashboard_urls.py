from django.urls import path
from studentbookfrontend.views.user_dashboard_views import *


urlpatterns = [
    path("<int:student_id>/<int:class_id>", DashboardAPIView.as_view()),
    path("<int:student_id>/<int:class_id>/topic-interest", TopicInterestChartAPIView.as_view()),
    path("<int:student_id>/<int:class_id>/weekly-trends", WeeklyLearningTrendsAPI.as_view()),
    # path("subject-list/<int:student_id>/<int:class_id>", SubjectList.as_view()),
]
