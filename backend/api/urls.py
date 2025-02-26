from django.contrib import admin
from django.urls import path,include
from . import views

urlpatterns = [
   path('',views.home,name="HomePage"),
   path('estimated_time/<str:tc>/<str:lc>/<str:sc>/',views.estimated_time,name="estimated_time"),
   path('demo/',views.demo,name="demo"),
   path('load_data/',views.load_data,name="load_data"),
   path('sqllite3_to_excel/',views.sqllite3_to_excel,name="sqllite3_to_excel"),
   path('report_to_excel/',views.report_to_excel,name="report_to_excel"),


   path('project_create/',views.project_create,name="project_create"),
   path('project_get/',views.project_get,name="project_get"),



   path('project_data_save/<str:pname>',views.project_data_save,name="project_data_save"),
   path('project_data_get/<str:pname>',views.project_data_get,name="project_data_get"),
   path('calc_total_time/<str:pname>',views.calc_total_time,name="calc_total_time"),
   path('report_creation/',views.report_creation,name="report_creation"),
   path('report_data_insert/<str:pname>/<int:weeks>/',views.report_insert,name="report_data_insert"),
   path('report_get/<str:pname>/',views.report_get,name="report_get"),
   path('report_update/<str:pname>/',views.report_update,name="report_update"),
   # path('temp_save/',views.temp_save,name="temp_save"),

]