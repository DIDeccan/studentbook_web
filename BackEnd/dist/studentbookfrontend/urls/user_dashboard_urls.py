from django.urls import path
from studentbookfrontend.views.user_dashboard_views import *


urlpatterns = [
    path("<int:student_id>/<int:class_id>", DashboardAPIView.as_view()),
    path("topic_interest/<int:student_id>/<int:class_id>", TopicInterestChartAPIView.as_view()),
    path("weekly_trends/<int:student_id>/<int:class_id>", WeeklyLearningTrendsAPI.as_view()),
    # path("subject-list/<int:student_id>/<int:class_id>", SubjectList.as_view()),
]
