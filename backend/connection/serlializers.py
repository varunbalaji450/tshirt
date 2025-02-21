from django.db.models import fields
from rest_framework import serializers
from .models import Connection , Project , dd02l_desc , objects , fields , segments , SaveRule , Rule

class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = '__all__'


class ConnectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Connection
        # fields = '__all__'
        fields = [
            'id',  # Include the 'id' field (usually automatically added by Django)
            'project_id',
            'connection_name',
            'connection_type',
            'username',
            'password',
            'host',
            'client',
            'sysnr',
            'port',
            'database',
            'status',
        ]



class DD02LSerializer(serializers.ModelSerializer):
    class Meta:
        model = dd02l_desc
        fields = '__all__'



class ObjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = objects
        fields = '__all__'


class SegementSerializer(serializers.ModelSerializer):
    class Meta:
        model = segments
        fields = '__all__'


class FieldSerializer(serializers.ModelSerializer):
    class Meta:
        model = fields
        fields = '__all__'


class SaveRuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = SaveRule
        fields = '__all__'

class RuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rule
        fields = '__all__'
