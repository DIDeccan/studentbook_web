from studentbookfrontend.models import*
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.token_blacklist.models import OutstandingToken, BlacklistedToken
from rest_framework.exceptions import AuthenticationFailed,APIException
from django.contrib.auth import authenticate
import re
from django.utils import timezone
from rest_framework import status
from django.contrib.auth.models import update_last_login


class CustomAPIException(APIException):
    status_code = 400

    def __init__(self, message, message_type="error", data=None):
        if data is None:
            data = {}
            self.detail = {
                "message": message,
                "message_type": message_type,
            }
        else:
            self.detail = {
                "message": message,
                "message_type": message_type,
                "data": data
            }


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['first_name'] = user.first_name
        # token['main_package'] = list(user.main_package.values_list('id','name', flat=True))
        # ...

        return token
    
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Include user type in the token response
        token['user_type'] = user.user_type

        return token

    def validate(self, attrs):
        

        # data = super().validate(attrs)
        username = attrs.get("phone_number")
        password = attrs.get("password")
        # user = authenticate(request=self.context.get('request'), email=username, password=password)
        user = Student.objects.filter(phone_number=username).first()
        
        if user is None:
            # raise AuthenticationFailed("Invalid credentials.")
            raise CustomAPIException(
                message= "User Not Found.",
                message_type= "error",
                data= None
            )
        user = authenticate(request=self.context.get('request'), email=username, password=password)
        
        if user is None:
            # raise AuthenticationFailed("Invalid credentials.")
            raise CustomAPIException(
                message= "Invalid credentials.",
                message_type= "error",
                data= None
            )
        
        #         # Delete everything in BlacklistedToken
        # BlacklistedToken.objects.all().delete()

        # # Delete everything in OutstandingToken
        # OutstandingToken.objects.all().delete()
    
        
        if user.user_type == 'student':
            if not StudentPackage.objects.filter(student=user).exists():
                raise CustomAPIException(
                    message= "Please subscribe to a package to login.",
                    message_type= "error",
                    # status_code = status.HTTP_403_FORBIDDEN,
                )
            now = timezone.now()
            active_tokens = OutstandingToken.objects.filter(user=user,expires_at__gt=now 
                                                            ).exclude(
                id__in=BlacklistedToken.objects.values_list('token_id', flat=True)
            )

            if active_tokens.exists():
                # raise AuthenticationFailed("User already logged in on another device.")
                print("Active tokens found:", active_tokens)
                raise CustomAPIException(
                    message= "User already logged in on another device",
                    message_type= "error",
                    data= None
                )
                
            
  

        # Add custom claims
        data = super().validate(attrs)
        update_last_login(None, self.user)
        data['user_type'] = self.user.user_type
        data['is_active'] = self.user.is_active
        data['message_type'] = "success"
        if user.user_type == 'student':
            data['student_id'] = user.student.id if hasattr(user, 'student') else None
            data['class_id'] = user.student.student_class.id if hasattr(user, 'student') and user.student.student_class else None
            data['is_paid'] = StudentPackage.objects.filter(student=user).exists()

        return data


class ClassSerializer(serializers.ModelSerializer):
    class Meta:
        model = Class
        fields = ['id', 'name','amount']

class SchoolSerializer(serializers.ModelSerializer):
    class Meta:
        model = School
        fields = ['id', 'name']

class StudentPackageSerializer(serializers.ModelSerializer):
    # course = ClassSerializer(read_only=True)  # nested course info
    class_id = serializers.IntegerField(source='course.id', read_only=True)
    student_package_id = serializers.IntegerField(source='id', read_only=True)

    class Meta:
        model = StudentPackage
        fields = ['student_package_id', 'class_id', 'price', 'subscription_taken_from', 'subscription_valid_till']

class StudentSerializer(serializers.ModelSerializer):
    student_packages = StudentPackageSerializer(many=True, read_only=True)
    class_id = serializers.IntegerField(source='student_class.id', read_only=True)
    student_id = serializers.IntegerField(source='id', read_only=True)
    class Meta:
        model = Student
        fields = ['student_id', 'email', 'first_name', 'last_name', 'phone_number','profile_image',"address", "city", "state",'user_type','class_id','student_packages']
        read_only_fields = ['user_type','class_id', 'student_packages']

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

    def validate_phone_number(self, value):
        if not re.match(r'^[6-9]\d{9}$', value):
            raise serializers.ValidationError("Enter a valid 10-digit Indian mobile number.")
        return value
    



class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True, write_only=True)
    new_password = serializers.CharField(required=True, write_only=True)

    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            # raise serializers.ValidationError("Old password is incorrect.")
            raise CustomAPIException(
                message= "Old password is incorrect.",
                message_type= "error",
                data= None
            )
        return value