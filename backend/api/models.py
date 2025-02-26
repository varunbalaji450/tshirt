from django.db import models

# Create your models here.

class load_time(models.Model):
    object = models.CharField(max_length=255,primary_key=True,null=False,blank=False)
    module = models.CharField(max_length=255,null=True,blank=True)
    data_object_type = models.CharField(max_length=255,null=True,blank=True)
    transformation_complexity = models.CharField(max_length=255,null=True,blank=True)
    load_complexity = models.CharField(max_length=255,null=True,blank=True)
    source_complexity = models.CharField(max_length=255,null=True,blank=True)
    scope = models.CharField(max_length=255,null=True,blank=True)
    object_development = models.FloatField(null=True, blank=True)
    iteration_1_data_loading = models.FloatField(null=True, blank=True)
    iteration_1_defects = models.FloatField(null=True, blank=True)
    iteration_2_data_loading = models.FloatField(null=True, blank=True)
    iteration_2_defects = models.FloatField(null=True, blank=True)
    iteration_3_data_loading = models.FloatField(null=True, blank=True)
    iteration_3_defects = models.FloatField(null=True, blank=True)
    production_data_loads = models.FloatField(null=True, blank=True)
    total = models.FloatField(null=True, blank=True)


class values(models.Model):
    transformation_complexity = models.CharField(max_length=255,null=True,blank=True)
    load_complexity = models.CharField(max_length=255,null=True,blank=True)
    source_complexity = models.CharField(max_length=255,null=True,blank=True)
    object_development = models.FloatField(null=True, blank=True)
    iteration_1_data_loading = models.FloatField(null=True, blank=True)
    iteration_1_defects = models.FloatField(null=True, blank=True)
    iteration_2_data_loading = models.FloatField(null=True, blank=True)
    iteration_2_defects = models.FloatField(null=True, blank=True)
    iteration_3_data_loading = models.FloatField(null=True, blank=True)
    iteration_3_defects = models.FloatField(null=True, blank=True)
    production_data_loads = models.FloatField(null=True, blank=True)
    total = models.FloatField(null=True, blank=True)

    class Meta:
        unique_together = ('transformation_complexity', 'load_complexity','source_complexity')


class projects(models.Model):
    project_name = models.CharField(primary_key=True,max_length=255)
    objects_count = models.BigIntegerField(null=True , blank=True ,default=0)
    total_efforts = models.FloatField(null=True,blank=True,default=0)
    table_name = models.CharField(max_length=255,null=True,blank=True)
    realize = models.IntegerField(null=True,blank=True)
    live = models.IntegerField(null=True,blank=True)
    
    


class project_efforts(models.Model):
    project_name = models.ForeignKey(
        projects, 
        on_delete=models.CASCADE, 
        related_name='proj_name'  # Helpful for reverse lookups
    )
    object = models.CharField(max_length=255,null=False,blank=False)
    module = models.CharField(max_length=255,null=True,blank=True)
    data_object_type = models.CharField(max_length=255,null=True,blank=True)
    transformation_complexity = models.CharField(max_length=255,null=True,blank=True)
    load_complexity = models.CharField(max_length=255,null=True,blank=True)
    source_complexity = models.CharField(max_length=255,null=True,blank=True)
    scope = models.CharField(max_length=255,null=True,blank=True)
    object_development = models.FloatField(null=True, blank=True)
    iteration_1_data_loading = models.FloatField(null=True, blank=True)
    iteration_1_defects = models.FloatField(null=True, blank=True)
    iteration_2_data_loading = models.FloatField(null=True, blank=True)
    iteration_2_defects = models.FloatField(null=True, blank=True)
    iteration_3_data_loading = models.FloatField(null=True, blank=True)
    iteration_3_defects = models.FloatField(null=True, blank=True)
    production_data_loads = models.FloatField(null=True, blank=True)
    total = models.FloatField(null=True, blank=True)

    class Meta:
        unique_together = ('project_name', 'object')
    
    def __str__(self):
        return f"{self.project_name}{self.object}"
    

# class temp_efforts(models.Model):
#     object = models.CharField(max_length=255,null=False,blank=False)
#     module = models.CharField(max_length=255,null=True,blank=True)
#     data_object_type = models.CharField(max_length=255,null=True,blank=True)
#     transformation_complexity = models.CharField(max_length=255,null=True,blank=True)
#     load_complexity = models.CharField(max_length=255,null=True,blank=True)
#     source_complexity = models.CharField(max_length=255,null=True,blank=True)
#     scope = models.CharField(max_length=255,null=True,blank=True)
#     object_development = models.FloatField(null=True, blank=True)
#     iteration_1_data_loading = models.FloatField(null=True, blank=True)
#     iteration_1_defects = models.FloatField(null=True, blank=True)
#     iteration_2_data_loading = models.FloatField(null=True, blank=True)
#     iteration_2_defects = models.FloatField(null=True, blank=True)
#     iteration_3_data_loading = models.FloatField(null=True, blank=True)
#     iteration_3_defects = models.FloatField(null=True, blank=True)
#     production_data_loads = models.FloatField(null=True, blank=True)
#     total = models.FloatField(null=True, blank=True)
    
#     def __str__(self):
#         return f"{self.object}"
    

