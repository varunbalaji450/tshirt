# Generated by Django 5.1.5 on 2025-02-21 05:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0004_delete_temp_efforts_projects_table_name'),
    ]

    operations = [
        migrations.AddField(
            model_name='projects',
            name='live',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='projects',
            name='realize',
            field=models.IntegerField(blank=True, null=True),
        ),
    ]
