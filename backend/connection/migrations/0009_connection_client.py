# Generated by Django 5.1.5 on 2025-01-31 13:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('connection', '0008_alter_connection_connection_name_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='connection',
            name='client',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
    ]
