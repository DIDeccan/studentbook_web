from datetime import timedelta
from django.utils import timezone
from django.db.models import Sum, Avg
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from studentbookfrontend.helper.api_response import api_response
from studentbookfrontend.models import *
from django.db.models import Sum, F, ExpressionWrapper, DurationField
import calendar
from django.utils.timezone import now, timedelta

class DashboardAPIView(APIView):
    permission_classes = [IsAuthenticated]  # optional, but recommended

    def get(self, request, student_id, class_id):
        try:
            user = Student.objects.get(id=student_id)
            class_obj = Class.objects.get(id=class_id)
        except (Student.DoesNotExist, Class.DoesNotExist):
            return api_response(
                message="User or Class not found",
                message_type="error",
                status_code=404
            )

        # #  Total Hours (sum of watched_duration)
        total_hours = VideoTrackingLog.objects.filter(student=user).aggregate(
            total=Sum("watched_duration")
        )["total"] or timedelta(0)

        total_seconds = int(total_hours.total_seconds()) if total_hours else 0
        # weekly_seconds = int(weekly_hours.total_seconds()) if weekly_hours else 0

        #  Average Score from Assessments
        # average_score = AssessmentResult.objects.filter(user=user).aggregate(
        #     avg=Avg("score")
        # )["avg"] or 0 
        average_score = 0

        # Videos Completed
        videos_completed = VideoTrackingLog.objects.filter(student=user, completed=True).count()

        #  Weekly Hours (last 7 days)
        one_week_ago = timezone.now() - timedelta(days=7)
        weekly_hours = VideoTrackingLog.objects.filter(
            student=user, created_at__gte=one_week_ago
        ).aggregate(total=Sum("watched_duration"))["total"] or timedelta(0)

        weekly_seconds = int(weekly_hours.total_seconds()) if weekly_hours else 0

        # #  Assignments (attended & pending)
        # attended_assignments = AssignmentLog.objects.filter(
        #     user=user, status="attended"
        # ).count()

        # pending_assignments = AssignmentLog.objects.filter(
        #     user=user, status="pending"
        # ).count()
        attended_assignments = 0
        pending_assignments = 0
        response = {
            "user": {
                "user_id": user.id,
                "class_id": class_obj.id,
                "name": user.first_name,
                "class": class_obj.name,
            },
            "stats": {
                "totalHours": str(timedelta(seconds=total_seconds)),
                "averageScore": round(average_score, 2),
                "videosCompleted": videos_completed,
                "weeklyHours": str(timedelta(seconds=weekly_seconds)),
                "attendedAssignments": attended_assignments,
                "pendingAssignments": pending_assignments,
            },
        }

        # return Response(response)
        return api_response(
            message="Dashboard data fetched successfully",
            message_type="success",
            status_code=200,
            data=response
        )

class TopicInterestChartAPIView(APIView):
    def get(self, request, student_id, class_id):
        # Aggregate watched duration per subject

        try:
            user = Student.objects.get(id=student_id)
            class_obj = Class.objects.get(id=class_id)
        except (Student.DoesNotExist, Class.DoesNotExist):
            return api_response(
                message="User or Class not found",
                message_type="error",
                status_code=404
            )
        
        subject_durations = (
            VideoTrackingLog.objects
            .filter(student=user)
            .values("subchapter__subject__name")
            .annotate(
                total_duration=Sum(
                    ExpressionWrapper(F("watched_duration"), output_field=DurationField())
                )
            )
        )

        # Total duration across all subjects
        total_seconds = sum(
            sd["total_duration"].total_seconds() for sd in subject_durations if sd["total_duration"]
        )

        subjects = []
        for sd in subject_durations:
            if not sd["total_duration"]:
                continue
            subject_name = sd["subchapter__subject__name"]
            duration_seconds = sd["total_duration"].total_seconds()
            percentage = (duration_seconds / total_seconds * 100) if total_seconds > 0 else 0

            subjects.append({
                "name": subject_name,
                "percentage": round(percentage, 2)
            })

        # return Response({"subjects": subjects})
        return api_response(
            message="Topic interest data fetched successfully",
            message_type="success",
            status_code=200,
            data={"subjects": subjects}
        )
    
class WeeklyLearningTrendsAPI(APIView):
    def get(self, request, student_id, class_id):

        try:
            user = Student.objects.get(id=student_id)
            class_obj = Class.objects.get(id=class_id)
        except (Student.DoesNotExist, Class.DoesNotExist):
            return api_response(
                message="User or Class not found",
                message_type="error",
                status_code=404
            )
        # ✅ Step 1: Get all subjects in this class
        today = now().date()
        start_of_week = today - timedelta(days=today.weekday())  # Monday start
        end_of_week = start_of_week + timedelta(days=6)
        all_subjects = list(
            Subject.objects.filter(course=class_obj).values_list("name", flat=True).order_by("id")
        )
        week_days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

        # ✅ Step 2: Initialize result with all subjects = 0
        days_data = {day: {sub: 0 for sub in all_subjects} for day in week_days}

        # ✅ Step 3: Fetch logs
        logs = (
            VideoTrackingLog.objects
            .filter(student=user, subchapter__course__id=class_id,created_at__date__range=[start_of_week, end_of_week])
            .values(
                "subchapter__chapter__subject__name",
                "created_at__week_day"   # 1=Sunday, 7=Saturday
            )
            .annotate(
                total_duration=Sum(
                    ExpressionWrapper(F("watched_duration"), output_field=DurationField())
                )
            )
        )

        # ✅ Step 4: Fill in actual values (minutes)
        for log in logs:
            subject = log["subchapter__chapter__subject__name"]
            weekday_index = log["created_at__week_day"]  # 1=Sunday
            day_name = week_days[weekday_index - 1]

            if log["total_duration"]:
                minutes = int(log["total_duration"].total_seconds() // 60)
                days_data[day_name][subject] += minutes

        # ✅ Step 5: Convert minutes → percentages
        percentage_data = {}
        for day, subjects in days_data.items():
            total_minutes = sum(subjects.values())
            if total_minutes > 0:
                percentage_data[day] = {
                    sub: round((minutes / total_minutes) * 100, 2) for sub, minutes in subjects.items()
                }
            else:
                percentage_data[day] = {sub: 0 for sub in subjects}

        return api_response(
            message="Weekly learning trends fetched successfully",
            message_type="success",
            status_code=200,
            data={"days": percentage_data}
        )

# class WeeklyLearningTrendsAPI(APIView):
#     def get(self, request, student_id, class_id):

#         try:
#             user = Student.objects.get(id=student_id)
#             class_obj = Class.objects.get(id=class_id)
#         except (Student.DoesNotExist, Class.DoesNotExist):
#             return api_response(
#                 message="User or Class not found",
#                 message_type="error",
#                 status_code=404
#             )
#         # ✅ Step 1: Get all subjects in this class

#         all_subjects = list(
#             Subject.objects.filter(course=class_obj).values_list("name", flat=True).order_by("id")
#         )
#         week_days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

#         # ✅ Step 2: Initialize result with all subjects = 0
#         days_data = {day: {sub: 0 for sub in all_subjects} for day in week_days}

#         # ✅ Step 3: Fetch logs
#         logs = (
#             VideoTrackingLog.objects
#             .filter(student=user, subchapter__course__id=class_id)
#             .values(
#                 "subchapter__chapter__subject__name",
#                 "created_at__week_day"   # 1=Sunday, 7=Saturday
#             )
#             .annotate(
#                 total_duration=Sum(
#                     ExpressionWrapper(F("watched_duration"), output_field=DurationField())
#                 )
#             )
#         )

#         # ✅ Step 4: Fill in actual values
#         for log in logs:
#             subject = log["subchapter__chapter__subject__name"]
#             weekday_index = log["created_at__week_day"]  # 1=Sunday
#             day_name = week_days[weekday_index - 1]

#             if log["total_duration"]:
#                 minutes = int(log["total_duration"].total_seconds() // 60)
#                 days_data[day_name][subject] += minutes

#         # return Response({"days": days_data})
#         return api_response(
#             message="Weekly learning trends fetched successfully",
#             message_type="success",
#             status_code=200,
#             data={"days": days_data}
#         )



