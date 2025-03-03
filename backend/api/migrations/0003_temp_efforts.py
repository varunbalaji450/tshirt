# Generated by Django 5.1.5 on 2025-02-18 14:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_alter_projects_total_efforts'),
    ]

    operations = [
        migrations.CreateModel(
            name='temp_efforts',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('object', models.CharField(max_length=255)),
                ('module', models.CharField(blank=True, max_length=255, null=True)),
                ('data_object_type', models.CharField(blank=True, max_length=255, null=True)),
                ('transformation_complexity', models.CharField(blank=True, max_length=255, null=True)),
                ('load_complexity', models.CharField(blank=True, max_length=255, null=True)),
                ('source_complexity', models.CharField(blank=True, max_length=255, null=True)),
                ('scope', models.CharField(blank=True, max_length=255, null=True)),
                ('object_development', models.FloatField(blank=True, null=True)),
                ('iteration_1_data_loading', models.FloatField(blank=True, null=True)),
                ('iteration_1_defects', models.FloatField(blank=True, null=True)),
                ('iteration_2_data_loading', models.FloatField(blank=True, null=True)),
                ('iteration_2_defects', models.FloatField(blank=True, null=True)),
                ('iteration_3_data_loading', models.FloatField(blank=True, null=True)),
                ('iteration_3_defects', models.FloatField(blank=True, null=True)),
                ('production_data_loads', models.FloatField(blank=True, null=True)),
                ('total', models.FloatField(blank=True, null=True)),
            ],
        ),
    ]
