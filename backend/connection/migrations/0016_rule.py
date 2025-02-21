# Generated by Django 5.1.5 on 2025-02-06 09:37

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('connection', '0015_rename_template_name_segments_table_name'),
    ]

    operations = [
        migrations.CreateModel(
            name='Rule',
            fields=[
                ('Rule_id', models.AutoField(primary_key=True, serialize=False)),
                ('Source_Table', models.CharField(blank=True, max_length=255, null=True)),
                ('Source_Field_Name', models.CharField(blank=True, max_length=255, null=True)),
                ('Data_Mapping_Rules', models.CharField(blank=True, max_length=255, null=True)),
                ('Target_SAP_Table', models.CharField(blank=True, max_length=255, null=True)),
                ('Target_SAP_Field', models.CharField(blank=True, max_length=255, null=True)),
                ('Text_Description', models.CharField(blank=True, max_length=255, null=True)),
                ('Lookup_Table', models.CharField(blank=True, max_length=255, null=True)),
                ('Look_Up_Required', models.BooleanField(default=False)),
                ('Last_Updated_By', models.CharField(blank=True, max_length=255, null=True)),
                ('Last_Updated_On', models.DateTimeField(auto_now_add=True)),
                ('Rule_Status', models.CharField(blank=True, max_length=255, null=True)),
                ('Check_Box', models.CharField(blank=True, max_length=255, null=True)),
            ],
        ),
    ]
