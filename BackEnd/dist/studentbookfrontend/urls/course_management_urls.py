from django.urls import path
from studentbookfrontend.views.course_management_views import *


urlpatterns = [
    path("subject-list", SubjectListCreateView.as_view()),
    path("subject-detail/<int:pk>", SubjectDetailView.as_view()),
]
