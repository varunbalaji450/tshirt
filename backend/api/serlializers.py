from django.db.models import fields
from rest_framework import serializers

from .models import *


class LoadTimeSerializers(serializers.ModelSerializer):
    class Meta:
        model = load_time
        fields = '__all__'

class ValuesSerializers(serializers.ModelSerializer):
    class Meta:
        model = values
        fields = '__all__'

class ProjectEffortsSerializers(serializers.ModelSerializer):
    class Meta:
        model = project_efforts
        fields = '__all__'

class ProjectSerializers(serializers.ModelSerializer):
    class Meta:
        model = projects
        fields = '__all__'

