from django.urls import path
from studentbookfrontend.views.course_management_views import *


urlpatterns = [
    path("maincontent/<int:student_id>/<int:class_id>", MainContentView.as_view()),
    path("class_subject_list/<int:student_id>/<int:class_id>", SubjectList.as_view()),
    path("classes_with_subjects/<int:student_id>/<int:class_id>", ClassWIthSubjectsView.as_view()),
    
]
