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
from datetime import timedelta
from studentbookfrontend.helper.api_response import parse_duration,parse_duration_mmss
from django.db.models import Prefetch
import logging
logger = logging.getLogger(__name__)

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
        tagColors = {
            "My Subjects": "primary",
            "Yoga Tips": "success",
            "Current Affairs": "warning",
            "Healthy Living": "danger",
            "Music": "info",
            "Sports": "secondary",
            }
        data = []
        content_data = {
                'id': 0,
                'name': 'My Subjects',
                'image': 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Ym9va3xlbnwwfHwwfHx8MA%3D%3D%27',
                'description': "My Subjects lists all the courses or subjects you are enrolled in, helping you easily access study materials, track progress, and stay organized for each class.",
                'sub_title': student_class.name,
                'tagColor':"primary",
                 
            }
        
        data.append(content_data)



        general_contents = MainContent.objects.all()

        for content in general_contents:
            content_data = {
                'id': content.id,
                'name': content.title,
                'image': (content.icon.url) if content.icon else None,
                'description': content.description if content.description else None,
                'sub_title': content.sub_title if content.sub_title else None,
                'tagColor': tagColors.get(content.title, "primary"),
                 
            }

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


class SubjectList(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def get(self, request,student_id,class_id):
        student_class = Class.objects.get(id=class_id)
        if not student_class:   
            return api_response(
                message="Class not found",
                message_type="error",
                status_code=status.HTTP_404_NOT_FOUND
                        )
        try:
            student = Student.objects.get(id=student_id, student_class=class_id)
        except Student.DoesNotExist:
            return api_response(
                message="Student not found",
                message_type="error",
                status_code=status.HTTP_404_NOT_FOUND
            )

        # 1️⃣ Fetch all subjects for the class in one query
        subjects = Subject.objects.filter(course_id=class_id, board=student.board).order_by("id")

        # 2️⃣ Fetch subchapters for all subjects (avoid N+1 queries)
        subchapters = Subchapter.objects.filter(subject__in=subjects).select_related(
            "subject"
        )

        # 3️⃣ Aggregate total video durations per subject
        total_map = {}
        for sc in subchapters:
            total_map[sc.subject.id] = total_map.get(sc.subject.id, timedelta(0)) + parse_duration_mmss(sc.vedio_duration)
        
        # for subject_id, total in total_map.items(): 
        #     print(f"Subject ID: {subject_id}, Total Video Duration: {total}")

        # 4️⃣ Fetch all video logs for student (avoid N+1)
        video_logs = VideoTrackingLog.objects.filter(
            student=student,
            subchapter__subject__in=subjects
        ).select_related("subchapter", "subchapter__subject")

      

        watched_durations = (
            VideoTrackingLog.objects.filter(student=student)
            .values("subchapter__chapter__subject_id")
            .annotate(total_watched=Sum("watched_duration"))
        )
        watched_map = {
            wd["subchapter__chapter__subject_id"]: wd["total_watched"]
            for wd in watched_durations
        }
        
        # 6️⃣ Static extras
        extras = {
            "Mathematics": {"content": "Algebra, Geometry, Calculus and more", "icon": "calculator", "color": "#FF6B6B"},
            "English": {"content": "Grammar, Literature, Writing skills", "icon": "book", "color": "#4ECDC4"},
            "Telugu": {"content": "Language, Poetry, Literature", "icon": "language", "color": "#FFD166"},
            "General Science": {"content": "Physics, Chemistry, Biology", "icon": "flask", "color": "#06D6A0"},
            "Social Studies": {"content": "Ancient, Medieval, Modern history", "icon": "hourglass", "color": "#118AB2"},
            "Hindi": {"content": "Grammar, Literature, Writing", "icon": "pen", "color": "#073B4C"},
        }

        # 7️⃣ Build response
        data = []
        for subject in subjects:
            total_time = total_map.get(subject.id, timedelta(0))
            watched_time = watched_map.get(subject.id, timedelta(0))

            total_seconds = total_time.total_seconds()
            watched_seconds = watched_time.total_seconds()

            completion_percentage = (watched_seconds / total_seconds * 100) if total_seconds > 0 else 0

            subject_extra = extras.get(subject.name, {"content": "", "icon": "book", "color": "#000000"})

            data.append({
                "id": subject.id,
                "name": subject.name,
                "content": subject.content,
                "image": request.build_absolute_uri(subject.image.url) if subject.image else None,
                "class_id": student_class.id,
                "class_name": student_class.name,
                "icon": subject.icon or subject_extra["icon"],
                "progressPercentage": round(completion_percentage, 2),
                "color": subject_extra["color"],
            })

            # Logging for production debug
            logger.debug(f"Subject: {subject.name}, Watched: {watched_seconds}s, Total: {total_seconds}s, Completion: {completion_percentage:.2f}%")

        return api_response(
            message="Subjects fetched successfully",
            message_type="success",
            status_code=status.HTTP_200_OK,
            data=data,
        )



class VideoTrackingView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, student_id, class_id):
        """
        Store or update the watched duration for a video (subchapter).
        """

        # --- Validate class ---
        try:
            student_class = Class.objects.get(id=class_id)
        except Class.DoesNotExist:
            return api_response(message="Class not found", message_type="error", status_code=status.HTTP_404_NOT_FOUND)

        # --- Validate student ---
        try:
            student = Student.objects.get(id=student_id, student_class=student_class)
        except Student.DoesNotExist:
            return api_response(message="Student not found",message_type= "error", status_code=status.HTTP_404_NOT_FOUND)

        # --- Validate input ---
        subchapter_id = request.data.get("subchapter_id")
        watched_seconds = request.data.get("watched_seconds", 0)
        is_favourate = request.data.get("is_favourate")

        if not subchapter_id:
            return api_response(message="subchapter_id is required",message_type= "error", status_code=status.HTTP_400_BAD_REQUEST)

        try:
            watched_seconds = int(watched_seconds)
            if watched_seconds < 0 or watched_seconds > 36000:  # Limit to 10 hours
                return api_response(message="Invalid watched duration", message_type="error", status_code=status.HTTP_400_BAD_REQUEST)
        except (ValueError, TypeError):
            return api_response(message="watched_seconds must be an integer", message_type= "error", status_code=status.HTTP_400_BAD_REQUEST)

        # --- Validate subchapter ---
        try:
            subchapter = Subchapter.objects.get(id=subchapter_id, course=student_class)
        except Subchapter.DoesNotExist:
            return api_response(message="Subchapter not found", message_type="error", status_code=status.HTTP_404_NOT_FOUND)

        watched_duration = timedelta(seconds=watched_seconds)

        # --- Update or create safely inside transaction ---
        with transaction.atomic():
            tracking_log, created = VideoTrackingLog.objects.select_for_update().get_or_create(
                student=student,
                subchapter=subchapter,
                defaults={"watched_duration": watched_duration, "completed": False},
            )

                # update only if student watched more than before
            if watched_duration > tracking_log.watched_duration:
                today = timezone.now().date()

                session_log, is_created = VideoWatchSession.objects.update_or_create(
                    student=student,
                    subchapter=subchapter,
                    started_at__date=today,
                    defaults={"watched_duration": watched_duration},  
                )

                # if session_log exists, update only if new progress > old
                if not is_created and watched_duration > session_log.watched_duration:
                    session_log.watched_duration = watched_duration - session_log.watched_duration
                    session_log.save(update_fields=["watched_duration"])
                print('session_log',session_log.watched_duration)
            
            

            if not created:
                tracking_log.watched_duration = max(tracking_log.watched_duration, watched_duration)

            video_duration = parse_duration(subchapter.vedio_duration)  
            if video_duration:
                tracking_log.watched_duration = min(tracking_log.watched_duration, video_duration)

                tracking_log.completed = tracking_log.watched_duration >= video_duration
            else:
                tracking_log.completed = False
            if is_favourate is not None:
                tracking_log.is_favourate = is_favourate

            tracking_log.save()

        # --- Response ---
        data = {
                "message": "Video tracking updated successfully",
                "student": student.id,
                "class": student_class.id,
                "subchapter": subchapter.id,
                "video_duration": str(video_duration) if video_duration else "0:00:00",  # 👈 keep backward compatibility
                "watched_duration": str(tracking_log.watched_duration),
                "completed": tracking_log.completed,
                "is_favourate": tracking_log.is_favourate,
            }
        return api_response(
            message="Video tracking updated successfully",
            message_type="success",
            status_code=status.HTTP_200_OK,
            data=data
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


 
 
class SubjectVediosView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def get(self, request, student_id, class_id, subject_id):
        # ✅ Query 1: Validate class existence
        student_class = Class.objects.filter(id=class_id).first()
        if not student_class:
            return api_response(
                message="Class not found",
                message_type="error",
                status_code=status.HTTP_404_NOT_FOUND
            )

        # ✅ Query 2: Validate student existence
        student = Student.objects.filter(id=student_id, student_class=class_id).first()
        if not student:
            return api_response(
                message="Student not found",
                message_type="error",
                status_code=status.HTTP_404_NOT_FOUND
            )

        # ✅ Query 3: Chapters + Subchapters + Logs (prefetch)
        chapters = (
            Chapter.objects.filter(course_id=class_id, subject_id=subject_id)
            .order_by("chapter_number")
            .prefetch_related(
                Prefetch(
                    "subchapter_set",
                    queryset=Subchapter.objects.order_by("subchapter"),
                    to_attr="prefetched_subchapters"
                )
            )
        )

        # ✅ Preload logs in one query (filtered for all needed subchapters)
        all_subchapter_ids = [
            sub.id for chap in chapters for sub in chap.prefetched_subchapters
        ]
        logs = VideoTrackingLog.objects.filter(
            student=student, subchapter_id__in=all_subchapter_ids
        ).select_related("subchapter")

        # Map logs {subchapter_id: log}
        log_map = {log.subchapter_id: log for log in logs}

        # ✅ Build response
        data = []
        for chapter in chapters:
            subchapter_data = []
            for sub in chapter.prefetched_subchapters:
                log = log_map.get(sub.id)
                video_duration = parse_duration(sub.vedio_duration) if sub.vedio_duration else None
                watched_duration = log.watched_duration if log else timedelta(seconds=0)

                # # Cap watched time at video duration
                # if video_duration and watched_duration > video_duration:
                #     watched_duration = video_duration

                percentage_completed = (
                    (watched_duration.total_seconds() / video_duration.total_seconds()) * 100
                    if log and video_duration and video_duration.total_seconds() > 0
                    else 0
                )

                subchapter_data.append({
                    "id": sub.id,
                    "subchapter": sub.subchapter,
                    "video_name": sub.video_name,
                    "video_url": sub.video_url,
                    "video_duration": str(video_duration) if video_duration else "0:00:00",
                    "watched_duration": str(watched_duration),
                    "completed": log.completed if log else False,
                    "percentage_completed": round(percentage_completed, 2),
                    "is_favourate": log.is_favourate if log else False,
                    "created_at": sub.created_at,
                    "image": sub.tumbnail_image.url if sub.tumbnail_image else None,
                })

            data.append({
                "chapter_id": chapter.id,
                "chapter_name": chapter.chapter_name,
                "chapter_number": chapter.chapter_number,
                "subject": chapter.subject.name,
                "subject_id": chapter.subject.id,
                "class": chapter.course.name,
                "subchapters": subchapter_data,
            })

        return api_response(
            message="Chapters and subchapters fetched successfully",
            message_type="success",
            status_code=status.HTTP_200_OK,
            data=data
        )



#general content vedios view
class GeneralVediosView(APIView):

    def get(self, request, student_id, general_content_id):
        # ✅ Validate student
        student = Student.objects.filter(id=student_id).first()
        if not student:
            return api_response(
                message="Student not found",
                message_type="error",
                status_code=status.HTTP_404_NOT_FOUND
            )

        # ✅ Validate general content
        main_content = MainContent.objects.filter(id=general_content_id).first()
        if not main_content:
            return api_response(
                message="Content not found",
                message_type="error",
                status_code=status.HTTP_404_NOT_FOUND
            )

        # ✅ Get all videos for this general content
        general_content_videos = GeneralContentVideo.objects.filter(main_content=general_content_id)

        # ✅ Preload tracking logs to avoid N+1 query
        video_ids = [video.id for video in general_content_videos]
        tracking_logs = GeneralContentVideoTrackingLog.objects.filter(
            student=student,
            general_content_video_id__in=video_ids
        )
        log_map = {log.general_content_video_id: log for log in tracking_logs}

        # ✅ Build response
        data = []
        
        for video in general_content_videos:
            video_duration = parse_duration(video.vedio_duration) if video.vedio_duration else None
            tracking_log = log_map.get(video.id)
            watched_duration = tracking_log.watched_duration if tracking_log else timedelta(seconds=0)

            # Percentage completed
            percentage_completed = (
                (watched_duration.total_seconds() / video_duration.total_seconds()) * 100
                if tracking_log and video_duration and video_duration.total_seconds() > 0
                else 0
            )

            data.append({
                "id": video.id,
                "video_name": video.video_name,
                "video_url": video.video_url,
                "video_duration": str(video_duration) if video_duration else "0:00:00",
                "watched_duration": str(watched_duration),
                "completed": tracking_log.completed if tracking_log else False,
                "percentage_completed": round(percentage_completed, 2),
                "is_favourate": tracking_log.is_favourate if tracking_log else False,
                "created_at": video.created_at,
                "image": video.tumbnail_image.url if video.tumbnail_image else None,
            })
        response_data = {
            "general_content": main_content.title,
            "videos": data
        }

        return api_response(
            message="General content videos fetched successfully",
            message_type="success",
            status_code=status.HTTP_200_OK,
            data=response_data
        )


class GeneralVideoTrackingView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, student_id, general_content_id):
        """
        Store or update the watched duration for a video (subchapter).
        """

        # --- Validate class ---
        try:
            general_content = MainContent.objects.get(id=general_content_id)
        except MainContent.DoesNotExist:
            return api_response(message="General Content not found",message_type= "error", status_code=status.HTTP_404_NOT_FOUND)

        # --- Validate student ---
        try:
            student = Student.objects.get(id=student_id)
        except Student.DoesNotExist:
            return api_response("Student not found", "error", status.HTTP_404_NOT_FOUND)

        # --- Validate input ---
        general_vedio_id = request.data.get("general_vedio_id")
        watched_seconds = request.data.get("watched_seconds", 0)
        is_favourate = request.data.get("is_favourate")

        if not general_vedio_id:
            return api_response(message="general_vedio_id is required",message_type= "error",status_code= status.HTTP_400_BAD_REQUEST)

        try:
            watched_seconds = int(watched_seconds)
            if watched_seconds < 0 or watched_seconds > 36000:  # Limit to 10 hours
                return api_response(message="Invalid watched duration", message_type="error", status_code=status.HTTP_400_BAD_REQUEST)
        except (ValueError, TypeError):
            return api_response("watched_seconds must be an integer", "error" ,status.HTTP_400_BAD_REQUEST)

        # --- Validate subchapter ---
        try:
            general_content_vedio = GeneralContentVideo.objects.get(id=general_vedio_id, main_content=general_content)
        except GeneralContentVideo.DoesNotExist:
            return api_response(message="GeneralContentVideo not found",message_type= "error", status_code=status.HTTP_404_NOT_FOUND)

        watched_duration = timedelta(seconds=watched_seconds)

        # --- Update or create safely inside transaction ---
        with transaction.atomic():
            tracking_log, created = GeneralContentVideoTrackingLog.objects.select_for_update().get_or_create(
                student=student,
                general_content_video=general_content_vedio,
                defaults={"watched_duration": watched_duration, "completed": False},
            )

                # update only if student watched more than before
            if watched_duration > tracking_log.watched_duration:
                today = timezone.now().date()

                session_log, is_created = GeneralContentVideoWatchSession.objects.update_or_create(
                    student=student,
                    general_content_video=general_content_vedio,
                    started_at__date=today,
                    defaults={"watched_duration": watched_duration},  
                )

                # if session_log exists, update only if new progress > old
                if not is_created and watched_duration > session_log.watched_duration:
                    session_log.watched_duration = watched_duration - session_log.watched_duration
                    session_log.save(update_fields=["watched_duration"])
                print('session_log',session_log.watched_duration)
            
            

            if not created:
                tracking_log.watched_duration = max(tracking_log.watched_duration, watched_duration)

            video_duration = parse_duration(general_content_vedio.vedio_duration)  
            if video_duration:
                tracking_log.watched_duration = min(tracking_log.watched_duration, video_duration)

                tracking_log.completed = tracking_log.watched_duration >= video_duration
            else:
                tracking_log.completed = False
            if is_favourate is not None:
                tracking_log.is_favourate = is_favourate

            tracking_log.save()

        data = {
            "message": "Video tracking updated successfully",
                "student": student.id,
                "general_content_vedio_id": general_content_vedio.id,
                "video_duration": str(video_duration) if video_duration else "0:00:00",  # 👈 keep backward compatibility
                "watched_duration": str(tracking_log.watched_duration),
                "completed": tracking_log.completed,
                "is_favourate": tracking_log.is_favourate,
        }

        # --- Response ---
        return api_response(
            message="Video tracking updated successfully",
            message_type="success",
            status_code=status.HTTP_200_OK,
            data=data
        )

