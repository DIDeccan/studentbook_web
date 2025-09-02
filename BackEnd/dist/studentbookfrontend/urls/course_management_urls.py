from django.urls import path
from studentbookfrontend.views.course_management_views import *


urlpatterns = [
    path("contentdata", MainContentView.as_view()),
    path("subject-list/<int:student_id>/<int:class_id>", SubjectList.as_view()),
]
