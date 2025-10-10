from django.urls import path
from studentbookfrontend.views.course_management_views import *


urlpatterns = [
    path("maincontent/<int:student_id>/<int:class_id>", MainContentView.as_view()),
    path("class_subject_list/<int:student_id>/<int:class_id>", SubjectList.as_view()),
    # path("classes_with_subjects/<int:student_id>/<int:class_id>", ClassWIthSubjectsView.as_view()),
    path("subject_videos/<int:student_id>/<int:class_id>/<int:subject_id>",SubjectVediosView.as_view()),
    path("vedios_tracking/<int:student_id>/<int:class_id>", VideoTrackingView.as_view()), 

    path("general_content_vedios/<int:student_id>/<int:general_content_id>", GeneralVediosView.as_view()),
    path("general_vedios_tracking/<int:student_id>/<int:general_content_id>", GeneralVideoTrackingView.as_view()),
]
