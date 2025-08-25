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
from studentbookfrontend.notifications.message_service import *
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import smtplib
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from studentbookbackend.settings import EMAIL_HOST_USER,EMAIL_HOST,EMAIL_HOST_PASSWORD
from django.core.validators import validate_email
from django.core.exceptions import ValidationError

from rest_framework import status

from django.shortcuts import get_object_or_404

from django.contrib.auth.backends import ModelBackend
from django.contrib.auth import get_user_model
from studentbookfrontend.helper.api_response import api_response
import random
from studentbookfrontend.models import *
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.token_blacklist.models import OutstandingToken, BlacklistedToken
from rest_framework.exceptions import ValidationError

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

class ClassListAPIView(generics.ListAPIView):
    # permission_classes = [IsAuthenticated]
    queryset = Class.objects.all()
    serializer_class = ClassSerializer
    permission_classes = [AllowAny]



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
#     def get(self, request, pk, format=None):
#         student = get_object_or_404(Student, pk=pk)
#         serializer = StudentSerializer(student)
#         return Response(serializer.data)

#     def put(self, request, pk, format=None):
#         student = get_object_or_404(Student, pk=pk)
#         serializer = StudentSerializer(student, data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#     def delete(self, request, pk, format=None):
#         student = get_object_or_404(Student, pk=pk)
#         student.delete()
#         return Response(status=status.HTTP_204_NO_CONTENT)


class StudentDetailAPI(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request, format=None):
        student = get_object_or_404(Student, phone_number=request.user)
        serializer = StudentSerializer(student)
        return Response(serializer.data)

    def put(self, request, format=None):
        student = get_object_or_404(Student,phone_number=request.user)
        serializer = StudentSerializer(student, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, format=None):
        student = get_object_or_404(Student, phone_number=request.user)
        student.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class LogoutView(APIView):
    
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        
        refresh_token = request.data.get("refresh")
        if not refresh_token:
            # return Response({"error": "Refresh token is required."}, status=status.HTTP_400_BAD_REQUEST)
            return api_response(
                message="Refresh token is required.",
                message_type="error",
                status_code=status.HTTP_400_BAD_REQUEST
                        )
        try:
            token = RefreshToken(refresh_token)
            token.blacklist()

            # return Response({"message": "Logged out successfully."}, status=status.HTTP_205_RESET_CONTENT)
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

            send_otp_email(user,'Password Reset OTP')
            send_otp_phone_number(user, 'Password Reset OTP')
            
            return api_response(
                message="For resetting the password an OTP sent to your email.",
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

        otp = json_data.get("otp")
        print(otp)
        new_password = json_data.get("new_password")
        confirm_new_password = json_data.get("confirm_new_password")

        if otp and new_password and confirm_new_password:
            if not all([user_name, otp, new_password, confirm_new_password]):
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
            if user.otp == otp:
                user.set_password(new_password)
                user.otp = None
                user.otp_verified = True 
                user.save()
                # return Response({"message": "Password reset successfully."}, status=status.HTTP_200_OK)
                return api_response(
                message="Password reset successfully.",
                message_type="success",
                status_code=status.HTTP_200_OK
                        )

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
                send_otp_phone_number(user,'Registration OTP')
                return api_response(
                    message="User already registered but not verified. We sent a new OTP.",
                    message_type="warning",
                    status_code=status.HTTP_200_OK
                )
            elif not StudentPackage.objects.filter(student = user):
                return api_response(
                    message="User already registered but Not taken any Course.",
                    message_type="warning",
                    status_code=status.HTTP_200_OK
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
                                message="For registering on School Book  an OTP sent to your email.",
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
        user = Student.objects.get(phone_number=json_data['phone_number'])

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
        
        print('user.otp',user.otp)
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
                                    "access": access_token
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
            user.set_password(new_password)  # hashing automatically handled
            user.save()
            return api_response(
                message="Password updated successfully.",
                message_type="success",
                status_code=status.HTTP_200_OK
                        )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class ChangePasswordAPIView(APIView):
    permission_classes = [IsAuthenticated]  # user must be logged in

    def post(self, request, *args, **kwargs):
        serializer = ChangePasswordSerializer(data=request.data, context={'request': request})

        if serializer.is_valid():
            user = request.user
            new_password = serializer.validated_data['new_password']
            user.set_password(new_password)  # hashing automatically handled
            user.save()
            return api_response(
                message="Password updated successfully.",
                message_type="success",
                status_code=status.HTTP_200_OK
                        )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

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

