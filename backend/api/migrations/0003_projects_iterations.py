# Generated by Django 5.1.5 on 2025-03-12 13:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_remove_projects_user_name_delete_user'),
    ]

    operations = [
        migrations.AddField(
            model_name='projects',
            name='iterations',
            field=models.IntegerField(blank=True, null=True),
        ),
    ]
