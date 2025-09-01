# views.py
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
    def get(self,request):
      
        data = []
        content_data = {
            'name' : 'My Subjects',
            'image' : 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Ym9va3xlbnwwfHwwfHx8MA%3D%3D%27'
        }

        data.append(content_data)

        general_contents = GeneralContent.objects.all()
        for content in general_contents:
            content_data = {
                'name': content.title,
                'image': (content.image.url) if content.image else None
            }
            
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
    def get(self, request, class_id):
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