# views.py
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status,permissions
from rest_framework import generics
from studentbookfrontend.models import *
from studentbookfrontend.serializers.course_management_serilizers import *
from studentbookfrontend.helper.api_response import api_response
from django.db.models import Sum, F, ExpressionWrapper, DurationField
from django.db.models.functions import Cast

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
                'id': content.id,
                'name': content.title,
                'image': (content.icon.url) if content.icon else None,
                'description': content.description if content.description else None,
                'sub_title': content.sub_title if content.sub_title else None,
                'tagColor': tagColors.get(content.title, "primary"),
                 
            }
            if content.title == "My Subjects":
                # content_data['class_id'] = student_class.id
                content_data['sub_title'] = student_class.name
                
                data.insert(0, content_data)  # Insert at the beginning
                # data.append
            else:
                data.append(content_data)
        # data['class'] = student_class.name
        responce = {
            'class': student_class.name,
            'content': data
        }
        
        return api_response(
                message="Content data fetched successfully",
                message_type="success",
                status_code=status.HTTP_200_OK,
                data = responce
            )


# class SubjectList(APIView):
#     # permission_classes = [permissions.IsAuthenticated]
#     def get(self, request,student_id,class_id):
#         student_class = get_object_or_404(Class, id=class_id)
#         if not student_class:
#             return api_response(
#                 message="Class not found",
#                 message_type="error",
#                 status_code=status.HTTP_404_NOT_FOUND
#                         )
#         try:
#             student = Student.objects.get(id=student_id, student_class=class_id)
#         except Student.DoesNotExist:
#             student = None
#         if not student:
#             return api_response(
#                 message="Student not found",
#                 message_type="error",
#                 status_code=status.HTTP_404_NOT_FOUND
#                         )
#         try:
#             subjects = Subject.objects.filter(course_id=class_id).order_by('id')
#             # serializer = SubjectSerializer(subjects, many=True)
#             # return api_response(
#             #     message="Subjects fetched successfully",
#             #     message_type="success",
#             #     status_code=status.HTTP_200_OK,
#             #     data = serializer.data
#             # )

#             data = []
#             for subject in subjects:

#                 total_hours = (
#                         VideoTrackingLog.objects.filter(
#                             student=student,
#                             subchapter__chapter__subject=subject
#                         ).aggregate(total=Sum("watched_duration"))["total"]
#                         or timedelta(0)
#                     )
#                 total_seconds = int(total_hours.total_seconds()) if total_hours else 0


#                 watched_time = (
#                         VideoTrackingLog.objects.filter(
#                             student=student,
#                             subchapter__chapter__subject=subject
#                         ).aggregate(total=Sum("watched_duration"))["total"]
#                         or timedelta(0)
#                     )
#                 # total_video_time = (
#                 #             Subchapter.objects.filter(
#                 #                 subject=subject
#                 #             ).aggregate(total=Sum("vedio_duration"))["total"]
#                 #             or timedelta(0)
#                 #         )
#                 # total video time (all subchapters)
#                 total_video_time = Subchapter.objects.aggregate(
#                     total=Sum("vedio_duration")
#                 )["total"] or timedelta(0)

#                 completion_percentage = (watched_time.total_seconds() / total_video_time.total_seconds() * 100) if total_video_time.total_seconds() > 0 else 0
                                
#                 if total_video_time.total_seconds() > 0:
#                     percentage = (watched_time.total_seconds() / total_video_time.total_seconds()) * 100
#                 else:
#                     percentage = 0

#                 data.append({
#                     "id": subject.id,
#                     "name": subject.name,   # if your model field is subject_name
#                     "class_id": student_class.id,
#                     "class_name": student_class.name,
#                     "icon": request.build_absolute_uri(subject.icon.url) if subject.icon else None,
#                     "total_hours": str(timedelta(seconds=total_seconds)),
#                     "progress_percentage": round(completion_percentage, 2)
#                 })
#             return api_response(
#                 message="Subjects fetched successfully",
#                 message_type="success",
#                 status_code=status.HTTP_200_OK,
#                 data = data
#             )
#         except Class.DoesNotExist:
#             return api_response(
#                 message="Class not found",
#                 message_type="error",
#                 status_code=status.HTTP_404_NOT_FOUND
#             )

# class SubjectList(APIView):
#     # permission_classes = [permissions.IsAuthenticated]
#     def get(self, request, student_id, class_id):
#         student_class = get_object_or_404(Class, id=class_id)
#         if not student_class:
#             return api_response(
#                 message="Class not found",
#                 message_type="error",
#                 status_code=status.HTTP_404_NOT_FOUND
#             )

#         try:
#             student = Student.objects.get(id=student_id, student_class=class_id)
#         except Student.DoesNotExist:
#             return api_response(
#                 message="Student not found",
#                 message_type="error",
#                 status_code=status.HTTP_404_NOT_FOUND
#             )

#         try:
#             subjects = Subject.objects.filter(course_id=class_id).order_by("id")
#             data = []

#             for subject in subjects:
#                 # ✅ Total watched time for this subject
#                 watched_time = (
#                     VideoTrackingLog.objects.filter(
#                         student=student,
#                         subchapter__chapter__subject=subject
#                     ).aggregate(total=Sum("watched_duration"))["total"]
#                     or timedelta(0)
#                 )
#                 subchapters = Subchapter.objects.filter(subject=subject).values_list("vedio_duration", flat=True)

#                 total_video_time = sum(
#                     (parse_duration(d) for d in subchapters if d), 
#                     timedelta(0)
#                 )

#                 watched_seconds = watched_time.total_seconds() if watched_time else 0
#                 total_seconds = total_video_time.total_seconds() if total_video_time else 0

#                 # ✅ Completion percentage
#                 completion_percentage = (
#                     (watched_seconds / total_seconds) * 100 if total_seconds > 0 else 0
#                 )

#                 data.append({
#                     "id": subject.id,
#                     "name": subject.name,
#                     "class_id": student_class.id,
#                     "class_name": student_class.name,
#                     "icon": request.build_absolute_uri(subject.icon.url) if subject.icon else None,
#                     "total_hours": str(timedelta(seconds=int(watched_seconds))),
#                     "progress_percentage": round(completion_percentage, 2),
#                 })

#             return api_response(
#                 message="Subjects fetched successfully",
#                 message_type="success",
#                 status_code=status.HTTP_200_OK,
#                 data=data,
#             )
#         except Class.DoesNotExist:
#             return api_response(
#                 message="Class not found",
#                 message_type="error",
#                 status_code=status.HTTP_404_NOT_FOUND
#             )
 


class SubjectList(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def get(self, request,student_id,class_id):
        student_class = get_object_or_404(Class, id=class_id)
        try:
            student = Student.objects.get(id=student_id, student_class=class_id)
        except Student.DoesNotExist:
            return api_response(
                message="Student not found",
                message_type="error",
                status_code=status.HTTP_404_NOT_FOUND
            )

        # 1️⃣ Fetch all subjects for the class in one query
        subjects = Subject.objects.filter(course_id=class_id).order_by("id")

        # 2️⃣ Aggregate watched duration for all subjects in one query
        watched_durations = (
            VideoTrackingLog.objects.filter(student=student)
            .values("subchapter__chapter__subject_id")
            .annotate(total_watched=Sum("watched_duration"))
        )
        watched_map = {
            wd["subchapter__chapter__subject_id"]: wd["total_watched"]
            for wd in watched_durations
        }

        # 3️⃣ Aggregate total video durations for all subchapters in one query
        subchapter_durations = (
            Subchapter.objects.filter(subject__in=subjects)
            .values("subject_id")
            .annotate(
                total_duration=Sum(
                    ExpressionWrapper(
                        Cast("vedio_duration", DurationField()), DurationField()
                    )
                )
            )
        )
        total_map = {
            sd["subject_id"]: sd["total_duration"] for sd in subchapter_durations
        }

        # 4️⃣ Static extras (can also be added in Subject model)
        extras = {
            "Mathematics": {
                "content": "Algebra, Geometry, Calculus and more",
                "icon": "calculator",
                "color": "#FF6B6B"
            },
            "English": {
                "content": "Grammar, Literature, Writing skills",
                "icon": "book",
                "color": "#4ECDC4"
            },
            "Telugu": {
                "content": "Language, Poetry, Literature",
                "icon": "language",
                "color": "#FFD166"
            },
            "General Science": {
                "content": "Physics, Chemistry, Biology",
                "icon": "flask",
                "color": "#06D6A0"
            },
            "Social Studies": {
                "content": "Ancient, Medieval, Modern history",
                "icon": "hourglass",
                "color": "#118AB2"
            },
            "Hindi": {
                "content": "Grammar, Literature, Writing",
                "icon": "pen",
                "color": "#073B4C"
            },
        }

        # 5️⃣ Final response
        data = []
        for subject in subjects:
            watched_time = watched_map.get(subject.id, timedelta(0)) or timedelta(0)
            total_time = total_map.get(subject.id, timedelta(0)) or timedelta(0)

            watched_seconds = watched_time.total_seconds()
            total_seconds = total_time.total_seconds()

            completion_percentage = (
                (watched_seconds / total_seconds) * 100 if total_seconds > 0 else 0
            )

            subject_extra = extras.get(subject.name, {
                "content": "",
                "icon": "book",
                "color": "#000000"
            })

            data.append({
                "id": subject.id,
                "name": subject.name,
                "content": subject.content,
                "image": request.build_absolute_uri(subject.image.url) if subject.image else None,
                "class": student_class.id,
                "icon": subject.icon,
                "progressPercentage": round(completion_percentage, 2),
                "color": subject_extra["color"],
            })

        return api_response(
            message="Subjects fetched successfully",
            message_type="success",
            status_code=status.HTTP_200_OK,
            data=data,
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