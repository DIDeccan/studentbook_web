from django.db import models
from django.contrib.auth.models import BaseUserManager, AbstractBaseUser
from django.utils import timezone
from datetime import timedelta
from smart_selects.db_fields import ChainedForeignKey
import datetime
from storages.backends.s3boto3 import S3Boto3Storage
from django.db import transaction
from django.db import IntegrityError

# from moviepy.editor import VideoFileClip
# Create your models here.

def generate_transaction_id():
    today = datetime.date.today().strftime("%Y%m%d")
    prefix = f"TXN{today}"

    with transaction.atomic():
        last_order = (
            SubscriptionOrder.objects
            .select_for_update()   # 🔒 locks matching rows
            .filter(transaction_id__startswith=prefix)
            .order_by("id")
            .last()
        )

        if last_order and last_order.transaction_id:
            last_number = int(last_order.transaction_id[-4:])
            new_number = last_number + 1
        else:
            new_number = 1

        return f"{prefix}{new_number:04d}"


#User models

class School(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name

class Class(models.Model):
    name = models.CharField(max_length=100)
    amount = models.DecimalField(max_digits=10, decimal_places=2, default=2000)
    discount_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=0)  # e.g. 10.00 for 10%
    final_price = models.DecimalField(max_digits=10, decimal_places=2, editable=False)
    created_at = models.DateField(auto_now_add=True,null=True,blank=True)
    updated_at = models.DateField(auto_now=True,null=True,blank=True)
    description = models.TextField(blank=True, null=True)
    def __str__(self):
        return self.name
    
class StudentPackage(models.Model):
    student = models.ForeignKey("Student", on_delete=models.CASCADE, related_name="student_packages")
    course = models.ForeignKey("Class", on_delete=models.CASCADE)
    price = models.IntegerField()
    subscription_taken_from = models.DateField(default=timezone.now)
    subscription_valid_till = models.DateField()

    def save(self, *args, **kwargs):
        if not self.subscription_valid_till:
            self.subscription_valid_till = self.subscription_taken_from + timedelta(days=365)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.student.email} - {self.course.name}"


class UserManager(BaseUserManager):
    def create_user(self, phone_number, password=None):
        """
        Creates and saves a User with the given email, date of
        birth and password.
        """
        if not phone_number:
            raise ValueError("Users must have an email address")

        user = self.model(
            phone_number=self.normalize_email(phone_number),
        )

        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, phone_number, password=None):
        """
        Creates and saves a superuser with the given email, date of
        birth and password.
        """
        user = self.create_user(
            phone_number,
            password=password,
        )
        user.is_superuser = True
        user.save(using=self._db)
        return user


class User(AbstractBaseUser):
    USER_TYPE_CHOICES = [  
        ('student', 'Student'),
        ('instructor', 'Instructor'),
        ('admin', 'Admin')
    ]

    email = models.EmailField(
       
        max_length=255,
        null=True,
        blank=True
        
    )
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    profile_image = models.ImageField(upload_to="profile",blank=True, null=True)
    is_superuser = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=True)
    is_active = models.BooleanField(default=True)
    phone_number = models.CharField(max_length=50,unique=True, verbose_name="phone number",)
    address=models.CharField(max_length=300,null=True,blank=True)
    city = models.CharField(max_length=200,null=True,blank=True)
    state = models.CharField(max_length=200,null=True,blank=True)
    zip_code = models.CharField(max_length=50,null=True,blank=True)
    otp = models.CharField(max_length=50,null=True,blank=True)
    user_type = models.CharField(max_length=20, null=True,choices=USER_TYPE_CHOICES)
    login_time = models.DateTimeField(null=True)
    logout_time = models.DateTimeField(null=True)
    otp_verified = models.BooleanField(default=False)
    registered_date = models.DateTimeField(auto_now_add=True)
    objects = UserManager()

    USERNAME_FIELD = "phone_number"
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.phone_number
    def update_login_time(self):
        self.login_time = timezone.now()
        self.save()

    def save(self, *args, **kwargs):
        if self.is_superuser and not self.user_type:
            self.user_type = 'admin'
        super().save(*args, **kwargs)



    def has_perm(self, perm, obj=None):
        "Does the user have a specific permission?"
        # Simplest possible answer: Yes, always
        return True

    def has_module_perms(self, app_label):
        "Does the user have permissions to view the app `app_label`?"
        # Simplest possible answer: Yes, always
        return True

    @property
    def is_staff(self):
        "Is the user a member of staff?"
        # Simplest possible answer: All admins are staff
        return self.is_superuser


class Student(User):
    # registration_id = models.CharField(max_length=20, unique=True, editable=False)
    # school = models.ForeignKey(School, on_delete=models.CASCADE, related_name="students", null=True,blank=True)
    school = models.CharField(max_length=255, null=True, blank=True)
    student_class = models.ForeignKey(Class, on_delete=models.CASCADE, related_name="main_students")


    def save(self, *args, **kwargs):

        super().save(*args, **kwargs)

    def __str__(self):
        return self.phone_number
    

#Payment Status Model

class SubscriptionOrder(models.Model):
    """
    Represents a subscription order placed by a student for a specific course.
    Handles payment status and subscription validity dates.
    """

    PAYMENT_STATUS = [  
        ("pending", "Pending"),
        ("completed", "Completed"),
        ("failed", "Failed"),
    ]

    student = models.ForeignKey(
        "Student",
        on_delete=models.CASCADE,
        related_name="subscription_orders"
    )
    course = models.ForeignKey(
        "Class",
        on_delete=models.CASCADE,
        related_name="subscription_orders"
    )
    price = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)

    payment_status = models.CharField(max_length=20,choices=PAYMENT_STATUS,default="pending")
    transaction_id = models.CharField(max_length=50, unique=True, null=True, blank=True)
    payment_mode = models.CharField(max_length=50, null=True, blank=True)

    subscription_start = models.DateField(default=timezone.now)
    subscription_end = models.DateField(blank=True, null=True)

    def save(self, *args, **kwargs):
        """
        Automatically set subscription_end to 1 year (365 days) after
        subscription_start if not provided manually.
        """
        if not self.transaction_id:
            for _ in range(3):  # retry max 3 times
                try:
                    self.transaction_id = generate_transaction_id()
                    super().save(*args, **kwargs)
                    return
                except IntegrityError:
                    self.transaction_id = None  # reset and retry
            raise
        if not self.subscription_end:
            self.subscription_end = self.subscription_start + timedelta(days=365)
        super().save(*args, **kwargs)

    @property
    def is_paid(self) -> bool:
        """
        Returns True if the order has been paid successfully.
        Helps in quick checks for access control or subscription validation.
        """
        return self.payment_status == "completed"

    def __str__(self):
        """Readable representation for admin panel & debugging."""
        return self.student.phone_number

#Course Models

class Subject(models.Model):

    """
    Represents a subject under a school class.
    Stores subject name, optional icon, and the related class.
    """
    name = models.CharField(max_length=100)
    content = models.TextField(null=True, blank=True)
    image = models.ImageField(upload_to='images/subject_icons/', blank=True, null=True,storage=S3Boto3Storage())
    course = models.ForeignKey(Class, on_delete=models.CASCADE, related_name='subjects')
    icon = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return self.name
    


class Semester(models.Model):

    """
    Represents a Semester or chapter within a specific subject and class.
    Stores Semester name, the related subject, and the class it belongs to.
    """
    
    semester_name = models.CharField(max_length=100)
    semester_number = models.IntegerField(null=True, blank=True)
    # course = models.ForeignKey(Class, on_delete=models.CASCADE, related_name='semester')
    # subject = ChainedForeignKey(Subject, chained_field="course",
    #     chained_model_field="course" ,on_delete=models.CASCADE, related_name="semester")
    

    def __str__(self):
        return self.semester_name



class Chapter(models.Model):
    """
    Represents a chapter within a specific unit, subject, and class.
    Stores chapter name, optional description and icon, and links to its unit, subject, and class.
    """
    chapter_name = models.CharField(max_length=255)
    chapter_number = models.IntegerField(null=True, blank=True)
    description = models.CharField(max_length=255, blank=True, null=True)
    chapter_icon = models.ImageField(upload_to='images/chapter_icons/', blank=True, null=True)
    course = models.ForeignKey(Class, on_delete=models.CASCADE, related_name='chapters')
    subject = ChainedForeignKey(Subject, chained_field="course",chained_model_field="course" ,on_delete=models.CASCADE, related_name="chapters")
    # semester = ChainedForeignKey(Semester,chained_field="subject",chained_model_field="subject", on_delete=models.CASCADE, related_name='chapters',null=True, blank=True)
    semester = models.ForeignKey(Semester, on_delete=models.CASCADE, related_name='chapters')

    
    

    def __str__(self):
        return self.chapter_name


class Subchapter(models.Model):
    subchapter = models.CharField(max_length=20)
    parent_subchapter = models.CharField(max_length=50, blank=True)
    description = models.TextField(blank=True, null=True)
    tumbnail_image = models.FileField(upload_to='images/subchapter_thumbnails/',blank=True, null=True,storage = S3Boto3Storage )
    course = models.ForeignKey(Class, on_delete=models.CASCADE, related_name='subchapter')
    subject = ChainedForeignKey(Subject, chained_field="course",chained_model_field="course" ,on_delete=models.CASCADE, related_name="subchapter")
    semester = models.ForeignKey(Semester, on_delete=models.CASCADE, related_name='subchapter')
    chapter = models.ForeignKey(Chapter, on_delete=models.CASCADE, null=True, blank=True)
    video_name = models.CharField(max_length=255)
    video_url = models.URLField()   # final S3/CloudFront URL
    vedio_duration = models.CharField(max_length=50, blank=True, null=True)  # e.g. "15:30"
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


    class Meta:
        indexes = [
            models.Index(fields=["course", "subject", "semester", "chapter", "subchapter"]),
        ]

    def save(self, *args, **kwargs):
        """
        Automatically set parent_subchapter:
        - If subchapter = "5.1.1" → parent = "5.1"
        - If subchapter = "5.1"   → parent = "5.1" (itself, since top-level)
        """
        if "." in self.subchapter:
            self.parent_subchapter = ".".join(self.subchapter.split(".")[:-1])
        else:
            self.parent_subchapter = self.subchapter
        super().save(*args, **kwargs)

    def __str__(self):
        # return f"{self.video_name} (Class {self.course}, Subject {self.subject})"
        return f" {self.course} - {self.subject} - {self.subchapter}"

        
class MainContent(models.Model):
    """
    Represents general content that can be associated with a Yoga, Sports, GK etc.
    Stores content title, description, optional file attachment, and links to its related entities.
    """
    title = models.CharField(max_length=255)
    sub_title = models.CharField(max_length=255, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    icon = models.FileField(upload_to='images/general_content_files/', blank=True, null=True, storage=S3Boto3Storage())
    


    def __str__(self):
        return self.title
    

class GeneralContentVideo(models.Model):
    "General videos linked to MainContent (e.g., Yoga, Sports, GK)"
    video_name = models.CharField(max_length=255)
    subtitle = models.CharField(max_length=255, blank=True, null=True)
    main_content = models.ForeignKey(
        MainContent,
        on_delete=models.CASCADE,
        related_name="videos",
        # limit_choices_to=~models.Q(title__iexact="My Subjects")  # exclude My Subjects
    )
    discription = models.TextField(blank=True, null=True)
    tumbnail_image = models.FileField(upload_to='images/general_content_video_thumbnails/',blank=True, null=True,storage = S3Boto3Storage )
    video_url = models.URLField()
    vedio_duration = models.CharField(max_length=50, blank=True, null=True)  # e.g. "15:30"
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.video_name} - {self.main_content.title}"


# tracking models
class VideoTrackingLog(models.Model):
    student = models.ForeignKey("Student", on_delete=models.CASCADE, related_name="videotracking_log")
    subchapter = models.ForeignKey(Subchapter, on_delete=models.CASCADE, related_name="videotracking_log")
    watched_duration = models.DurationField(default=0)  # actual time user watched
    completed = models.BooleanField(default=False)
    is_favourate = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    def __str__(self):
        return f"{self.student} - {self.subchapter} ({self.watched_duration})"
    
    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['student', 'subchapter'], name='unique_student_subchapter')
        ]


# class AssessmentResult(models.Model):
#     user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="assessments")
#     subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
#     score = models.IntegerField()
#     created_at = models.DateTimeField(auto_now_add=True)

# class AssignmentLog(models.Model):
#     user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="assignments")
#     subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
#     status = models.CharField(max_length=20, choices=[("attended", "Attended"), ("pending", "Pending")])
#     created_at = models.DateTimeField(auto_now_add=True)

# class ActivityLog(models.Model):
#     user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="activities")
#     subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
#     duration = models.DurationField()  # time spent on this activity
#     created_at = models.DateTimeField(auto_now_add=True)


# #price calculation models
# class ClassPriceCalculation(models.Model):
#     course = models.ForeignKey(Class, on_delete=models.CASCADE, related_name="price_calculations")
#     base_price = models.DecimalField(max_digits=10, decimal_places=2)
#     discount_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=0)  # e.g. 10.00 for 10%
#     final_price = models.DecimalField(max_digits=10, decimal_places=2, editable=False)
#     created_at = models.DateField(auto_now_add=True)
#     updated_at = models.DateField(auto_now=True)
#     def __str__(self):
#         return self.course.name
    