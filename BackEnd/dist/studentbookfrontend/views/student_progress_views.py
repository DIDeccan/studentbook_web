from studentbookfrontend.models import *
from rest_framework.views import APIView
from studentbookfrontend.helper.api_response import api_response
from rest_framework import status,permissions





class StudentRecentWatchedVediosView(APIView):
    def get(self, request, student_id, class_id):
        try:
            # Merge validation into one query
            student = Student.objects.filter(id=student_id, student_class_id=class_id).first()
            if not student:
                return api_response("Student or Class not found", "error", 404)

            # Use select_related to avoid N+1 queries
            recent_videos = (
                VideoTrackingLog.objects
                .filter(student=student, subchapter__course_id=class_id)
                .select_related("subchapter")
                .order_by("-updated_at")[:5]
            )

            video_data = [
                {
                    "id": video.subchapter.id,
                    "subchapter": video.subchapter.subchapter,  # rename this field in model for clarity
                    "video_name": video.subchapter.video_name,
                    "video_url": video.subchapter.video_url,
                    "is_favourate": video.is_favourate,
                    "watched_duration": str(video.watched_duration),
                    "image": video.subchapter.tumbnail_image.url if video.subchapter.tumbnail_image else None,
                }
                for video in recent_videos
            ]

            return api_response(
                message="Recent watched videos fetched successfully",
                message_type="success",
                status_code=status.HTTP_200_OK,
                data=video_data
            )

        except Exception as e:
            return api_response(
                message=str(e),
                message_type="error",
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
