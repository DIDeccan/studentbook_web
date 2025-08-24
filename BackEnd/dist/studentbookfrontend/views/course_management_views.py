# views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import generics
from studentbookfrontend.models import *
from studentbookfrontend.serializers.course_management_serilizers import *

# List all subjects OR create new subject
class SubjectListCreateView(generics.ListCreateAPIView):
    serializer_class = SubjectSerializer
    def get_queryset(self):
        queryset = Subject.objects.all()
        user = self.request.user
        custom_package = StudentPackage.objects.get(student = user)
        course_id = custom_package.course
        if course_id:
            queryset = queryset.filter(course_id=course_id)
        return queryset

# Retrieve, update, or delete a single subject
class SubjectDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Subject.objects.all()
    serializer_class = SubjectSerializer