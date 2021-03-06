from rest_framework import serializers

from backend.accomplishment.models import Accomplishment
from backend.projects.models import Project


class AccomplishmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Accomplishment
        fields = ['id', 'accomplishment']


class ProjectSerializer(serializers.ModelSerializer):
    accomplishments = AccomplishmentSerializer(read_only=True, many=True)

    class Meta:
        model = Project
        fields = '__all__'
