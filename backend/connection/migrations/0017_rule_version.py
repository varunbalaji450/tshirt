# Generated by Django 5.1.5 on 2025-02-06 10:17

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('connection', '0016_rule'),
    ]

    operations = [
        migrations.AddField(
            model_name='rule',
            name='version',
            field=models.IntegerField(default=1),
        ),
    ]
