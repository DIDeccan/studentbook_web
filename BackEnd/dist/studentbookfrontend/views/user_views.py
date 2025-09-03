from django.shortcuts import render
from studentbookfrontend.serializers.user_serializers import *
from rest_framework.permissions import IsAuthenticated
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import status, permissions
from rest_framework_simplejwt.tokens import RefreshToken, TokenError
from rest_framework_simplejwt.views import TokenRefreshView
from studentbookfrontend.notifications.message_service import *
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import smtplib
from django.core.validators import validate_email
from django.core.exceptions import ValidationError

from django.shortcuts import get_object_or_404
from django.contrib.auth.backends import ModelBackend
from django.contrib.auth import get_user_model
from studentbookfrontend.helper.api_response import api_response
import random
from studentbookfrontend.models import *
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
# from rest_framework.exceptions import ValidationError

# Create your views here.

class EmailOrPhoneBackend(ModelBackend):
    def authenticate(self, request, username=None, password=None, **kwargs):
        UserModel = get_user_model()
        login_id = username or kwargs.get("email") or kwargs.get("phone_number")
        try:
            if login_id and '@' not in login_id:
                user = UserModel.objects.get(phone_number=login_id)
            else:
                user = UserModel.objects.get(email=login_id)
        except UserModel.DoesNotExist:
            user = None

        if user and user.check_password(password):
            user.update_login_time()  #
            return user
        return None

def validate_phone_number(phone_number: str) -> str:
    """
    Validates a phone number string.
    Rules:
    - Must contain only digits (optional '+' at start).
    - Must be between 10 and 15 digits.
    - Returns the cleaned phone number if valid.
    - Raises ValidationError if invalid.
    """

    if not phone_number:
        raise ValidationError("Phone number is required.")

    # Allow '+' at start
    if phone_number.startswith("+"):
        digits = phone_number[1:]
    else:
        digits = phone_number

    if not digits.isdigit():
        raise ValidationError("Phone number must contain digits only.")

    if len(digits) < 10 or len(digits) > 15:
        raise ValidationError("Phone number must be between 10 and 15 digits.")

    return phone_number

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


class CustomTokenRefreshView(TokenRefreshView):
    permission_classes = [permissions.AllowAny]  # refresh usually doesn't require auth

    def post(self, request, *args, **kwargs):
        try:
            response = super().post(request, *args, **kwargs)

            # If refresh token is invalid, let it fall to exception
            if response.status_code != status.HTTP_200_OK:
                return api_response(
                    message="Invalid or expired token.",
                    message_type="error",
                    status_code=response.status_code,
                )

            # On success
            return api_response(
                message="Token refreshed successfully",
                message_type="success",
                status_code=status.HTTP_200_OK,
                data=response.data
            )

        except (InvalidToken, TokenError):
            return api_response(
                message="Invalid or blacklisted token.",
                message_type="error",
                status_code=status.HTTP_401_UNAUTHORIZED,
            )

class ClassListAPIView(APIView):
    # permission_classes = [IsAuthenticated]
    queryset = Class.objects.all()
    def get(self, request, format=None):
        classes = Class.objects.all()
        serializer = ClassSerializer(classes, many=True)    
        return api_response(
            message="Class List Data.",
            message_type="success",
            status_code=status.HTTP_200_OK,
            data=serializer.data
        )

class StudentListAPIView(APIView):
    # permission_classes = [IsAuthenticated]
    def get(self, request, format=None):
        students = Student.objects.all()
        serializer = StudentSerializer(students, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        serializer = StudentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# class StudentDetailAPI(APIView):
#     permission_classes = [IsAuthenticated]
#     def get(self, request, format=None):
#         student = get_object_or_404(Student, phone_number = request.user)
#         serializer = StudentSerializer(student)
#         return api_response(
#                 message="user profile fetched successfully",
#                 message_type="success",
#                 status_code=status.HTTP_200_OK,
#                 data = serializer.data
#                         )

#     def put(self, request, format=None):
#         student = get_object_or_404(Student,phone_number=request.user)
#         serializer = StudentSerializer(student, data=request.data, partial=True)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class StudentDetailAPI(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request,student_id , class_id,format=None):
        student_class = get_object_or_404(Class, id=class_id)
        if not student_class:
            return api_response(
                message="Class not found",
                message_type="error",
                status_code=status.HTTP_404_NOT_FOUND
                        )
        student = Student.objects.get(id= student_id, student_class= student_class)
        if not student:
            return api_response(
                message="Student not found",
                message_type="error",
                status_code=status.HTTP_404_NOT_FOUND
                        )
        serializer = StudentSerializer(student)

        return api_response(
                message="user profile fetched successfully",
                message_type="success",
                status_code=status.HTTP_200_OK,
                data = serializer.data,
                        )

    def put(self, request, student_id, class_id, format=None):
        student_class = Class.objects.get(id=class_id)
        if not student_class:
            return api_response(
                message="Class not found",
                message_type="error",
                status_code=status.HTTP_404_NOT_FOUND
                        )

        student = Student.objects.get(id= student_id, student_class= student_class)
        if not student:
            return api_response(
                message="Student not found",
                message_type="error",
                status_code=status.HTTP_404_NOT_FOUND
                        )

        # Update only allowed fields except phone_number
        allowed_fields = [
            "email", "first_name", "last_name", "school", "profile_image",
            "is_active", "address", "city", "state", "zip_code", "user_type"
        ]
        for field in allowed_fields:
            if field in request.data:
                setattr(student, field, request.data[field])
        student.save()
        if "phone_number" in request.data and request.data["phone_number"] != student.phone_number:
            new_phone = request.data["phone_number"]

            if Student.objects.filter(phone_number=new_phone).exists():
                return api_response(
                    message="Phone number already in use.",
                    message_type="error",
                    status_code=status.HTTP_400_BAD_REQUEST
                )

            # Do NOT update yet — just trigger OTP
            responce = send_otp_newphone_number(student, 'OTP For Phone number change', new_phone)

            # student.save()

            # return api_response(
            #                     message="For Change Phone Number on School Book an OTP sent to your New Phone Number.",
            #                     message_type="success",
            #                     status_code=status.HTTP_200_OK
            #                 )

            return responce

        
        serializer = StudentSerializer(student)
        return api_response(
            message="User profile updated successfully",
            message_type="success",
            status_code=status.HTTP_200_OK,
            data=serializer.data
        )

class LogoutView(APIView):
    
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        
        refresh_token = request.data.get("refresh")
        if not refresh_token:
            return api_response(
                message="Refresh token is required.",
                message_type="error",
                status_code=status.HTTP_400_BAD_REQUEST
                        )
        try:
            # tokens = OutstandingToken.objects.filter(user=request.user)
            # for t in tokens:
                # t.blacklist()
            token = RefreshToken(refresh_token)
            token.blacklist()
            now = timezone.now()
            active_tokens = OutstandingToken.objects.filter(user=request.user,expires_at__gt=now 
                                                            ).exclude(
                id__in=BlacklistedToken.objects.values_list('token_id', flat=True)
            )

            if active_tokens.exists():
                for refresh_token in active_tokens:
                    token = RefreshToken(refresh_token.token)
                    token.blacklist()


            return api_response(
                message="Logged out successfully.",
                message_type="success",
                status_code=status.HTTP_205_RESET_CONTENT
                        )

        except TokenError:
            # return Response({"error": "Invalid or expired token."}, status=status.HTTP_400_BAD_REQUEST)
            return api_response(
                message="Invalid or expired token.",
                message_type="error",
                status_code=status.HTTP_400_BAD_REQUEST
                        )

class ForgotPasswordAPIView(APIView):
    
    def post(self, request, *args, **kwargs):

        json_data = request.data
        user_name = json_data.get("user")

        if not user_name:
            return api_response(
                message="give user data",
                message_type="error",
                status_code=status.HTTP_400_BAD_REQUEST
                        )


        if '@' in user_name:

            user = User.objects.filter(email=user_name).first()
        else:
            user = User.objects.filter(phone_number=user_name).first()


        if user:

            # send_otp_email(user,'Password Reset OTP')
            send_otp_phone_number(user, 'Password Reset OTP')
            
            return api_response(
                message="For resetting the password an OTP sent to your Phone number.",
                message_type="success",
                status_code=status.HTTP_200_OK
                        )
            
        else:
            # return Response({"message": "User not found."}, status=status.HTTP_404_NOT_FOUND)
            return api_response(
                message="User not found.",
                message_type="error",
                status_code=status.HTTP_400_BAD_REQUEST
                        )

    def put(self, request, *args, **kwargs):
        json_data = request.data
        user_name = json_data.get("user")

        if '@' in user_name:

            user = User.objects.filter(email=user_name).first()
        else:
            user = User.objects.filter(phone_number=user_name).first()

        if user is None:
            return api_response(
                message="User not found.",
                message_type="error",
                status_code=status.HTTP_404_NOT_FOUND
                        )

        otp = json_data.get("otp")
        new_password = json_data.get("new_password")
        confirm_new_password = json_data.get("confirm_new_password")
        # Step 1: Verify OTP
        if otp and not new_password and not confirm_new_password:
            if not all([user, otp]):
                return api_response(
                message="User and Otp are required.",
                message_type="error",
                status_code=status.HTTP_400_BAD_REQUEST
                        )


            if user.otp == otp:
                user.otp_verified = True
                return api_response(
                message=" Otp verified successfully.",
                message_type="success",
                status_code=status.HTTP_200_OK
                        )

            else:
                return api_response(
                message="Invalid email or OTP not verified.",
                message_type="error",
                status_code=status.HTTP_400_BAD_REQUEST
                        )


        if  new_password and confirm_new_password:
            if not all([new_password, confirm_new_password]):
                # return Response({"message": "All fields are required."}, status=status.HTTP_400_BAD_REQUEST)
                return api_response(
                message="All fields are required.",
                message_type="error",
                status_code=status.HTTP_400_BAD_REQUEST
                        )

            if new_password != confirm_new_password:
                # return Response({"message": "Passwords do not match."}, status=status.HTTP_400_BAD_REQUEST)
                return api_response(
                message="Passwords do not match.",
                message_type="error",
                status_code=status.HTTP_400_BAD_REQUEST
                        )

            # user = User.objects.filter(email=user_name, otp=otp).first()
            if user and user.otp_verified:
                user.set_password(new_password)
                user.otp_verified = True
                user.otp = None  # Clear OTP after successful password reset
                user.save()


            else:
                # return Response({"message": "Invalid email or OTP not verified."}, status=status.HTTP_400_BAD_REQUEST)
                return api_response(
                message="Invalid email or OTP not verified.",
                message_type="error",
                status_code=status.HTTP_400_BAD_REQUEST
                        )


        else:
            # return Response({"message": "Invalid request."}, status=status.HTTP_400_BAD_REQUEST)
            return api_response(
                message="Invalid request.",
                message_type="error",
                status_code=status.HTTP_400_BAD_REQUEST
                        )


class StudentRegisterAPIView(APIView):


    def post(self, request, *args, **kwargs):
        json_data = request.data

        try:
            validate_email(json_data.get('email'))
        except ValidationError as e:
            return api_response(
                message="Invalid email format.",
                message_type="error",
                status_code=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            phone_number = validate_phone_number(json_data.get('phone_number'))
        except ValidationError as e:
            return api_response(
                message="Invalid phone Number format.",
                message_type="error",
                status_code=status.HTTP_400_BAD_REQUEST
            )


        try:
            user = User.objects.get(phone_number=json_data.get('phone_number'))

        except User.DoesNotExist:
            try:
                user = User.objects.get(email=json_data.get('email'))
            except User.DoesNotExist:
                user = None

        if user:
            if not user.is_active and not user.otp_verified:
                # send_otp_email(user,'Registration OTP')
                response = send_otp_phone_number(user,'Registration OTP')
                return response
            elif not StudentPackage.objects.filter(student = user):
                return api_response(
                    message="User already registered but Not taken any Course.",
                    message_type="warning",
                    status_code=status.HTTP_400_BAD_REQUEST
                )
            else:
                return api_response(
                    message="Email Or Phone number already exists.",
                    message_type="error",
                    status_code=status.HTTP_400_BAD_REQUEST
                )
        else:

            class_name = json_data['student_class']
            try:
                class_obj = Class.objects.get(id=class_name)
            except Class.DoesNotExist:
                return api_response(
                                message="Class not found",
                                message_type="error",
                                status_code=status.HTTP_400_BAD_REQUEST
                            )
            phone_number = json_data.get("phone_number")
            if not phone_number:
                return api_response(
                                message="Phone Number not found",
                                message_type="error",
                                status_code=status.HTTP_400_BAD_REQUEST
                            )
            if request.data.get('password') != request.data.get('confirm_password'):
                return api_response(
                                message="Password and Confirm Password do not match",
                                message_type="error",
                                status_code=status.HTTP_400_BAD_REQUEST
                            )
            customer_register = Student(
                email=json_data.get("email"),   # optional
                first_name=json_data.get("first_name"),
                last_name=json_data.get("last_name"),
                phone_number=phone_number,             # ✅ required
                address=json_data.get("address"),
                zip_code=json_data.get("zip_code"),
                user_type="student",
                student_class=class_obj,
                is_active=False
            )
            customer_register.set_password(json_data['password'])
            customer_register.save()
            

            user = Student.objects.get(phone_number = phone_number)

            if user:
                subject = 'Registration OTP'
                # send_otp_email(user,subject)
                send_otp_phone_number(user,subject)
               
                return api_response(
                                message="For registering on School Book  an OTP sent to your Phone Number.",
                                message_type="success",
                                status_code=status.HTTP_200_OK
                            )
            else:
                # return Response({"message": "User not found."}, status=status.HTTP_404_NOT_FOUND)

                return api_response(
                                message="User not found.",
                                message_type="error",
                                status_code=status.HTTP_404_NOT_FOUND
                            )


class StudentActivationAPIView(APIView):


    def post(self, request, *args, **kwargs):
        json_data = request.data
        otp = json_data.get('otp',None)
        user = Student.objects.filter(phone_number=json_data['phone_number']).first()

        if not user:
            return api_response(
                            message="User Not Fonund",
                            message_type="error",
                            status_code=status.HTTP_400_BAD_REQUEST
                        )
        
        if  otp is None:
            return api_response(
                            message="Provide OTP",
                            message_type="error",
                            status_code=status.HTTP_400_BAD_REQUEST
                        )
        
        if user.otp == json_data['otp']:
           
            # user.set_password(json_data['password'])
            user.is_active=True
            user.otp_verified = True
            
            
            user.save()
            # send_success_email(user)
            send_succes_message_phone_number(user)
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)
            return api_response(
                            message="Your registration completed successfully",
                            message_type="success",
                            status_code=status.HTTP_200_OK,
                            data={
                                    "refresh": str(refresh),
                                    "access": access_token,
                                    "is_paid": StudentPackage.objects.filter(student=user).exists()
                                }
                        )
            
        else:
            return api_response(
                            message="OTP is incorrect",
                            message_type="error",
                            status_code=status.HTTP_400_BAD_REQUEST
                        )


class ChangePasswordAPIView(APIView):
    permission_classes = [IsAuthenticated]  # user must be logged in

    def post(self, request, *args, **kwargs):
        serializer = ChangePasswordSerializer(data=request.data, context={'request': request})

        if serializer.is_valid():
            user = request.user
            new_password = serializer.validated_data['new_password']
            user.set_password(new_password)  
            user.save()
            return api_response(
                message="Password updated successfully.",
                message_type="success",
                status_code=status.HTTP_200_OK
                        )

        return api_response(
                message=serializer.errors,
                message_type="error",
                status_code=status.HTTP_400_BAD_REQUEST
                        )

class ClassListDemoVideosApi(APIView):

    def get(self, request, *args, **kwargs):
        class_list = Class.objects.all()
        data = []

        for class_data in class_list:

            data.append({
                "id": class_data.id,
                "name": class_data.name,
                "cost": class_data.amount,
                'discription' : class_data.description,
                'vedio_url': "hgsvhxgsdvh"
            })

        return api_response(
            message="Class List Sent.",
            message_type="success",
            status_code=status.HTTP_200_OK,
            data=data
        )

class ResendOtpAPIView(APIView):

    def post(self, request, *args, **kwargs):
        json_data = request.data
        phone_number = json_data.get('phone_number',None)
        if phone_number is None:
            return api_response(
                            message="Provide Phone Number",
                            message_type="error",
                            status_code=status.HTTP_400_BAD_REQUEST
                        )
        try:
            user = Student.objects.get(phone_number=phone_number)
        except Student.DoesNotExist:
            user = None

        if not user:
            return api_response(
                            message="User Not Fonund",
                            message_type="error",
                            status_code=status.HTTP_400_BAD_REQUEST
                        )
        
        # send_otp_email(user,'Registration OTP')
        responce = send_otp_phone_number(user,'Registration OTP')

        return responce
    
class OtpVerificationAPIView(APIView):
    permissions_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        json_data = request.data
        student_id = json_data.get('student_id',None)
        if student_id is None:
            return api_response(
                            message="Provide Student ID",
                            message_type="error",
                            status_code=status.HTTP_400_BAD_REQUEST
                        )
        
        otp = json_data.get('otp',None)
        new_phone_number = json_data.get('new_phone_number',None)
        if otp is None:
            return api_response(
                            message="Provide OTP",
                            message_type="error",
                            status_code=status.HTTP_400_BAD_REQUEST
                        )
        if new_phone_number is None:
            try:
                user = Student.objects.get(id=student_id)
            except Student.DoesNotExist:
                user = None

            if not user:
                return api_response(
                                message="User Not Fonund",
                                message_type="error",
                                status_code=status.HTTP_400_BAD_REQUEST
                            )
            
            if user.otp == otp:
                user.otp_verified = True
                user.save()
                return api_response(
                                message="OTP Verified Successfully",
                                message_type="success",
                                status_code=status.HTTP_200_OK
                            )
            else:
                return api_response(
                                message="OTP is incorrect",
                                message_type="error",
                                status_code=status.HTTP_400_BAD_REQUEST
                            )
        else:
            try:
                user = Student.objects.get(id=student_id)
            except Student.DoesNotExist:
                user = None

            if not user:
                return api_response(
                                message="User Not Fonund",
                                message_type="error",
                                status_code=status.HTTP_400_BAD_REQUEST
                            )
            
            if user.otp == otp:
                user.phone_number = new_phone_number
                user.otp_verified = True
                user.save()
                serializer = StudentSerializer(user)
                return api_response(
                    message="User profile updated successfully",
                    message_type="success",
                    status_code=status.HTTP_200_OK,
                    data=serializer.data
                )
            else:
                return api_response(
                                message="OTP is incorrect",
                                message_type="error",
                                status_code=status.HTTP_400_BAD_REQUEST
                            )