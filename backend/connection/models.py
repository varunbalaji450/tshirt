from django.db import models
from django.core.validators import RegexValidator

class Project(models.Model):
    project_id = models.AutoField(primary_key=True)
    project_name = models.CharField(
        max_length=255,
        unique=True
    )
    description = models.CharField(max_length=255,blank=True, null=True)
    created_by = models.CharField(max_length=255,blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.project_id}{self.project_name}"  
    

class Connection(models.Model):
    project_id = models.ForeignKey(
        Project, 
        on_delete=models.CASCADE, 
        related_name='connections'  # Helpful for reverse lookups
    )
    connection_name = models.CharField(max_length=255, blank=True, null=True)
    connection_type = models.CharField(max_length=255, blank=True, null=True)
    username = models.CharField(max_length=255, blank=True, null=True)
    password = models.CharField(max_length=255, blank=True, null=True)  
    host = models.CharField(max_length=255, blank=True, null=True)
    client =  models.CharField(max_length=255, blank=True, null=True)
    sysnr = models.CharField(max_length=255, blank=True, null=True)  
    port = models.CharField(max_length=255, blank=True, null=True)
    database = models.CharField(max_length=255, blank=True, null=True)
    status = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        unique_together = ('project_id', 'connection_name')

    def __str__(self):
        return self.connection_name    



class dd02l_desc(models.Model): 
    table = models.CharField(max_length=50, blank=False, null=False)
    description = models.CharField(max_length=255, blank=True, null=True)

    def __str__ (self):
        return self.table




class objects(models.Model):
    obj_id = models.AutoField(primary_key=True)
    obj_name = models.CharField(
        max_length=255,
        blank = True,
        null=True
    )
    project_id = models.ForeignKey(
        Project, 
        on_delete=models.CASCADE, 
        related_name='objects_project'  # Helpful for reverse lookups
    )
    template_name = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        unique_together = ('project_id', 'obj_name')

    def __str__ (self):
        return f"{self.obj_id}{self.obj_name}" 
    




class segments(models.Model):
    segment_id = models.AutoField(primary_key=True)
    project_id = models.ForeignKey(
        Project, 
        on_delete=models.CASCADE, 
        related_name='segement_projid'  # Helpful for reverse lookups
    )
    obj_id = models.ForeignKey(
        objects, 
        on_delete=models.CASCADE, 
        related_name='segement_objid'  # Helpful for reverse lookups
    )
    segement_name = models.CharField(max_length=255, blank=True, null=True)  
    table_name = models.CharField(max_length=255, blank=True, null=True)

    def __str__ (self):
        return f"{self.segment_id}{self.segement_name}"


class fields(models.Model):
    field_id = models.AutoField(primary_key=True)
    project_id = models.ForeignKey(
        Project, 
        on_delete=models.CASCADE, 
        related_name='fields_projid'  # Helpful for reverse lookups
    )
    obj_id = models.ForeignKey(
        objects, 
        on_delete=models.CASCADE, 
        related_name='fields_objid'  # Helpful for reverse lookups
    )
    segement_id = models.ForeignKey(
        segments, 
        on_delete=models.CASCADE, 
        related_name='fields_segementid'  # Helpful for reverse lookups
    )
    sap_structure = models.CharField(max_length=255,blank=True,null=True)
    fields = models.CharField(max_length=255, blank=True, null=True)  
    description = models.CharField(max_length=255, blank=True, null=True)
    isMandatory = models.CharField(max_length=255, blank=True, null=True)

    def __str__ (self):
        return f"{self.field_id}{self.fields}"
    

class SaveRule(models.Model):
    rule_no = models.AutoField(primary_key=True)
    project_id = models.ForeignKey(Project, on_delete=models.CASCADE)
    object_id = models.ForeignKey(objects, on_delete=models.CASCADE)
    segment_id = models.ForeignKey(segments, on_delete=models.CASCADE)
    field_id = models.ForeignKey(fields,on_delete=models.CASCADE)
    source_table = models.CharField(max_length=255,blank=True, null=True)
    source_field_name = models.CharField(max_length=255,blank=True, null=True)
    data_mapping_type = models.CharField(max_length=255,blank=True,null=True)
    data_mapping_rules = models.CharField(max_length=500,blank=True, null=True)
    target_sap_table = models.CharField(max_length=255,blank=True, null=True)
    target_sap_field = models.CharField(max_length=255,blank=True, null=True)
    text_description = models.TextField(blank=True, null=True)
    lookup_table = models.CharField(max_length=255, blank=True, null=True)
    # lookup_required = models.BooleanField(default=False,blank=True, null=True)
    last_updated_by = models.CharField(max_length=255, blank=True, null=True)
    last_updated_on = models.DateTimeField(auto_now=True)
    rule_status = models.CharField(max_length=255,blank=True, null=True)
    check_box = models.BooleanField(default=False)
    isMandatory = models.CharField(max_length=255, blank=True, null=True)
   
    def __str__(self):
        return f"Rule No: {self.rule_no}"
 
 
 
 
class Rule(models.Model):
    rule_no = models.AutoField(primary_key=True)
    project_id = models.ForeignKey(Project, on_delete=models.CASCADE)
    object_id = models.ForeignKey(objects, on_delete=models.CASCADE)
    segment_id = models.ForeignKey(segments, on_delete=models.CASCADE)
    field_id = models.ForeignKey(fields, on_delete=models.SET_DEFAULT,default=1)
    version_id = models.IntegerField()  
    source_table = models.CharField(max_length=255,blank=True, null=True)
    source_field_name = models.CharField(max_length=255,blank=True, null=True)
    data_mapping_type = models.CharField(max_length=255,blank=True,null=True)
    data_mapping_rules = models.CharField(max_length=500,blank=True, null=True)
    target_sap_table = models.CharField(max_length=255,blank=True, null=True)
    target_sap_field = models.CharField(max_length=255,blank=True, null=True)
    text_description = models.TextField(blank=True, null=True)
    lookup_table = models.CharField(max_length=255, blank=True, null=True)
    # lookup_required = models.BooleanField(default=False,blank=True, null=True)
    last_updated_by = models.CharField(max_length=255, blank=True, null=True)
    last_updated_on = models.DateTimeField(auto_now=True)
    rule_status = models.CharField(max_length=255,blank=True, null=True)
    check_box = models.BooleanField(default=False)
    isMandatory = models.CharField(max_length=255, blank=True, null=True)
   
    def __str__(self):
        return f"Rule No: {self.rule_no}"    