from rest_framework import serializers
from studentbookfrontend.models import *

class SubjectSerializer(serializers.ModelSerializer):
    class_name = serializers.CharField(source="course.name", read_only=True)  # To show class name instead of just id
    class_id = serializers.IntegerField(source="course.id", read_only=True)  # To show class id
    icon = serializers.SerializerMethodField()  # To return full URL of icon

    class Meta:
        model = Subject
        fields = ["id", "name", "icon", "class_id", "class_name"]

    def get_icon(self, obj):
        request = self.context.get("request")
        if obj.icon and request:
            return request.build_absolute_uri(obj.icon.url)
        elif obj.icon:
            return obj.icon.url
        return None

class ChapterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Chapter
        fields = ["chapter_name", "chapter_number", "description", "course", "subject", "semester"]

class SubchapterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subchapter
        fields = ["subchapter", "video_name", "video_url", "vedio_duration"]

class ChapterWithSubchaptersSerializer(serializers.ModelSerializer):
    subchapters = SubchapterSerializer(many=True)

    class Meta:
        model = Chapter
        fields = ["chapter_name", "chapter_number", "description", "course", "subject", "semester", "subchapters"]

    def create(self, validated_data):
        subchapters_data = validated_data.pop("subchapters")
        chapter = Chapter.objects.create(**validated_data)

        for sub in subchapters_data:
            Subchapter.objects.create(chapter=chapter, **sub)

        return chapter
