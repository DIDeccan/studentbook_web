# views.py
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status,permissions
from rest_framework import generics
from studentbookfrontend.models import *
from studentbookfrontend.serializers.course_management_serilizers import *
from studentbookfrontend.helper.api_response import api_response

#Main Content View

class MainContentView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def get(self,request,student_id,class_id):

        student_class = get_object_or_404(Class, id=class_id)
        if not student_class:
            return api_response(
                message="Class not found",
                message_type="error",
                status_code=status.HTTP_404_NOT_FOUND
                        )
        try:
            student = Student.objects.get(id=student_id, student_class=class_id)
        except Student.DoesNotExist:
            student = None
        if not student:
            return api_response(
                message="Student not found",
                message_type="error",
                status_code=status.HTTP_404_NOT_FOUND
                        )
      
        data = []
        general_contents = GeneralContent.objects.all()

        for content in general_contents:
            content_data = {
                'name': content.title,
                'image': (content.image.url) if content.image else None
            }
            if content.title == "My Subjects":
                data.insert(0, content_data)  # Insert at the beginning
            else:
                data.append(content_data)
        # return Response(data, status=status.HTTP_200_OK)
        return api_response(
                message="Content data fetched successfully",
                message_type="success",
                status_code=status.HTTP_200_OK,
                data = data
            )


class SubjectList(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def get(self, request,student_id,class_id):
        student_class = get_object_or_404(Class, id=class_id)
        if not student_class:
            return api_response(
                message="Class not found",
                message_type="error",
                status_code=status.HTTP_404_NOT_FOUND
                        )
        try:
            student = Student.objects.get(id=student_id, student_class=class_id)
        except Student.DoesNotExist:
            student = None
        if not student:
            return api_response(
                message="Student not found",
                message_type="error",
                status_code=status.HTTP_404_NOT_FOUND
                        )
        try:
            subjects = Subject.objects.filter(course_id=class_id)
            serializer = SubjectSerializer(subjects, many=True)
            return api_response(
                message="Subjects fetched successfully",
                message_type="success",
                status_code=status.HTTP_200_OK,
                data = serializer.data
            )
        except Class.DoesNotExist:
            return api_response(
                message="Class not found",
                message_type="error",
                status_code=status.HTTP_404_NOT_FOUND
            )
    

class ClassWIthSubjectsView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def get(self, request, student_id,class_id):
        classes = Class.objects.all().order_by('id')
        data = []
        for cls in classes:
            subjects = Subject.objects.filter(course=cls.id).order_by('id')
            subject_data = []
            for subject in subjects:
                subject_data.append({
                    'subject_id': subject.id,
                    'subject_name': subject.name,
                    # 'subject_image': subject.image.url if subject.image else None
                })
            # subject_serializer = SubjectSerializer(subjects, many=True)

            class_data = {
                'class_id': cls.id,
                'class_name': cls.name,
                'subjects': subject_data
            }
            data.append(class_data)
        
        return api_response(
            message="Classes with subjects fetched successfully",
            message_type="success",
            status_code=status.HTTP_200_OK,
            data=data
        )





# List all subjects OR create new subject
# class SubjectListCreateView(generics.ListCreateAPIView):
#     permission_classes = [permissions.IsAuthenticated]
#     serializer_class = SubjectSerializer
#     def get_queryset(self):
#         queryset = Subject.objects.all()
#         user = self.request.user
#         custom_package = StudentPackage.objects.get(student = user)
#         course_id = custom_package.course
#         if course_id:
#             queryset = queryset.filter(course_id=course_id)
#         return queryset

# # Retrieve, update, or delete a single subject
# class SubjectDetailView(generics.RetrieveUpdateDestroyAPIView):
#     queryset = Subject.objects.all()
#     serializer_class = SubjectSerializer