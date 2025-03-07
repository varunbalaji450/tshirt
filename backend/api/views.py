from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .serlializers import *
import pandas as pd
from .models import *
from django.db import connection
import io 
from django.http import HttpResponse
from django.db import connection
from django.db import connections, transaction

from django.http import JsonResponse
import math
import json

@api_view(['GET'])
def home(request):

    df = pd.read_excel(r"C:\Users\varunbalaji.gada\Downloads\new.xls",engine="xlrd",na_filter=False)
    print(df)

    for ind,i in df.iterrows():
        # print(i[0])
        val = {
            "transformation_complexity" : i.iloc[0],
            "load_complexity":i.iloc[1],
            "source_complexity":i.iloc[2],
            "object_development":i.iloc[3],
            "iteration_1_data_loading":i.iloc[4],
            "iteration_1_defects":i.iloc[5],
            "iteration_2_data_loading":i.iloc[6],
            "iteration_2_defects":i.iloc[7],
            "iteration_3_data_loading":i.iloc[8],
            "iteration_3_defects":i.iloc[9],
            "production_data_loads":i.iloc[10],
            "total":i.iloc[11]
        }

        print("Hello")
        serializer = ValuesSerializers(data=val)
        if serializer.is_valid():
            print("Hii")
            serializer.save()
    # print(serializer.error_messages)



    return Response("Hello new App is configured successfully")


@api_view(['GET'])
def estimated_time(request,tc,lc,sc):
    print("Hello called estimated_time")
    value = values.objects.filter(transformation_complexity=tc,load_complexity=lc,source_complexity=sc)
    if value:
        serialize = ValuesSerializers(value,many=True)
        return Response(serialize.data)
    else:
        return Response(status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
def demo(request):

    df = pd.read_excel(r"C:\Users\varunbalaji.gada\Downloads\new_project_1.xls",engine="xlrd",na_filter=False,sheet_name="Sheet2")
    # print(df)

    for ind,i in df.iterrows():
        # print(i[0])
        # print(i)
        value = values.objects.get(transformation_complexity=i.iloc[3],load_complexity=i.iloc[4],source_complexity=i.iloc[5])
        # print("Hello : ",value)
        val = {
                "object" : i.iloc[0],
                "module" : i.iloc[1],
                "data_object_type" :i.iloc[2],
                "transformation_complexity" :i.iloc[3],
                "load_complexity" :i.iloc[4],
                "source_complexity" :i.iloc[5],
                "scope" :"Inscope",
                "transformation_complexity":value.transformation_complexity,
                "load_complexity" : value.load_complexity,
                "source_complexity":value.source_complexity,
                "object_development":value.object_development,
                "iteration_1_data_loading":value.iteration_1_data_loading,
                "iteration_1_defects":value.iteration_1_defects,
                "iteration_2_data_loading":value.iteration_2_data_loading,
                "iteration_2_defects":value.iteration_2_defects,
                "iteration_3_data_loading":value.iteration_3_data_loading,
                "iteration_3_defects":value.iteration_3_defects,
                "production_data_loads":value.production_data_loads,
                "total":value.total
                }
        # print("Hello")
        serializer = LoadTimeSerializers(data=val)
        if serializer.is_valid():
            print("Hii")
            serializer.save()
        else:
            print(serializer.error_messages)
    return Response("Hello World")


@api_view(['GET'])
def load_data(request):

    ld_data = load_time.objects.all()
    serz = LoadTimeSerializers(ld_data,many=True)
    return Response(serz.data)

# @api_view(['POST'])
# def temp_save(request):

#     temp_efforts.objects.all().delete()
#     data = request.data
#     print(data)
#     temp = TempSerializers(data=data,many=True)
#     if temp.is_valid():
#         temp.save()
#         return Response(temp.data)
#     else:
#         print(temp.errors)
#         return Response(status=status.HTTP_400_BAD_REQUEST)


# @api_view(['GET'])
# def sqllite3_to_excel(request):


#     queryset = temp_efforts.objects.all()

#     data = list(queryset.values())
   
    

#     # data = request.data  # Assuming request.data is a list of dictionaries

#     # print(data)

#     # if not data:  # Handle empty request data
#     #     return HttpResponse("No data provided in the request.", status=400) # Bad Request

#     df = pd.DataFrame.from_records(data)

#     print(df)

#     model_name  = "load_time"

#     output = io.BytesIO()
#     with pd.ExcelWriter(output, engine='openpyxl') as writer: #Using openpyxl engine
#         df.to_excel(writer, index=False, sheet_name="data")  # Add sheet name

#     output.seek(0)  # Rewind to the beginning of the file

#     # Create the HTTP response with appropriate headers
#     response = HttpResponse(
#         content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
#     )
#     response['Content-Disposition'] = f'attachment; filename="{model_name}.xlsx"'
#     response.write(output.getvalue()) #Write the file to response

#     # return Response("Hello")
#     return response


@api_view(['POST'])  # Changed to POST
def sqllite3_to_excel(request):

    try:
        data = request.data  # Assuming request.data is a list of dictionaries

    # print(data)

        if not data:  # Handle empty request data
            return HttpResponse("No data provided in the request.", status=400) # Bad Request

        df = pd.DataFrame.from_records(data)
        print("Hello")

        # queryset = temp_efforts.objects.all() # Or filter if needed
        # data = list(queryset.values())
        # df = pd.DataFrame.from_records(data)

        # pro = temp_efforts.objects.all()
        # if pro:
        #     total_efforts=0
        #     for obj in pro:
        #         # print(obj.total)
        #         if obj.total:
        #             total_efforts += obj.total
        # print("Total Efforts : ",total_efforts)

        print("Hii")

        if 'total' in df.columns:  # Check if the 'total' column exists (important!)
            total_efforts = df['total'].sum()

        print(total_efforts)

        total_row = pd.DataFrame([{'total': total_efforts}])  # Create a DataFrame for the new row

        # # Append the total row to the main DataFrame
        df = pd.concat([df, total_row], ignore_index=True) 


        if 'id' in df.columns:
            df = df.drop(columns=['id'])
        if 'project_name' in df.columns:
            df = df.drop(columns=['project_name']) 

        column_mapping = {
            'object': 'object',
            'module': 'module',
            'data_object_type': 'data_object_type',
            'transformation_complexity': 'transformation_complexity',
            'load_complexity': 'load_complexity',
            'source_complexity': 'source_complexity',
            'object_development': 'object_development(In Days)',
            'iteration_1_data_loading': 'iteration_1_data_loading(In Days)',
            'iteration_1_defects': 'iteration_1_defects(In Days)',
            'iteration_2_data_loading': 'iteration_2_data_loading(In Days)',
            'iteration_2_defects': 'iteration_2_defects(In Days)',
            'iteration_3_data_loading': 'iteration_3_data_loading(In Days)',
            'iteration_3_defects': 'iteration_3_defects(In Days)',
            'production_data_loads': 'production_data_loads(In Days)',
            'total': 'Total Efforts(In Days)'
        }
        df = df.rename(columns=column_mapping)


        model_name ="_Effort&Estimate"  # More descriptive
        print(model_name)

        output = io.BytesIO()
        with pd.ExcelWriter(output, engine='openpyxl') as writer:
            df.to_excel(writer, index=False, sheet_name="data")

        output.seek(0)

        response = HttpResponse(
            output.getvalue(),  # Directly pass the file content
            content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        )
        response['Content-Disposition'] = f'attachment; filename="{model_name}.xlsx"'

        return response

    except Exception as e:
        print(f"An error occurred: {e}") # Log the error for debugging
        return HttpResponse(f"An error occurred: {e}", status=500)  # Return error response
    



@api_view(['GET'])
def home_to_excel(request,pname):
    queryset = project_efforts.objects.filter(project_name=pname)

    data = list(queryset.values())

    if not data:
        return Response(status=status.HTTP_400_BAD_REQUEST)
   

    df = pd.DataFrame.from_records(data)

    # print(df)

    total_efforts = 0

    if 'total' in df.columns:  # Check if the 'total' column exists (important!)
            total_efforts = df['total'].sum()


    total_row = pd.DataFrame([{'total': total_efforts}])  # Create a DataFrame for the new row

        # # Append the total row to the main DataFrame
    df = pd.concat([df, total_row], ignore_index=True) 


    if 'id' in df.columns:
        df = df.drop(columns=['id'])
    if 'project_name' in df.columns:
        df = df.drop(columns=['project_name']) 
    if 'project_name_id' in df.columns:
        df = df.drop(columns=['project_name_id']) 

    column_mapping = {
        'object': 'object',
        'module': 'module',
        'data_object_type': 'data_object_type',
        'transformation_complexity': 'transformation_complexity',
        'load_complexity': 'load_complexity',
        'source_complexity': 'source_complexity',
        'object_development': 'object_development(In Days)',
        'iteration_1_data_loading': 'iteration_1_data_loading(In Days)',
        'iteration_1_defects': 'iteration_1_defects(In Days)',
        'iteration_2_data_loading': 'iteration_2_data_loading(In Days)',
        'iteration_2_defects': 'iteration_2_defects(In Days)',
        'iteration_3_data_loading': 'iteration_3_data_loading(In Days)',
        'iteration_3_defects': 'iteration_3_defects(In Days)',
        'production_data_loads': 'production_data_loads(In Days)',
        'total': 'Total Efforts(In Days)'
    }
    df = df.rename(columns=column_mapping)


    model_name  = "load_time"

    output = io.BytesIO()
    with pd.ExcelWriter(output, engine='openpyxl') as writer: #Using openpyxl engine
        df.to_excel(writer, index=False, sheet_name="data")  # Add sheet name

    output.seek(0)  # Rewind to the beginning of the file

    # Create the HTTP response with appropriate headers
    response = HttpResponse(
        content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    )
    response['Content-Disposition'] = f'attachment; filename="{model_name}.xlsx"'
    response.write(output.getvalue()) #Write the file to response

    # return Response("Hello")
    return response


@api_view(['POST'])  # Changed to POST
def report_to_excel(request):

    try:
        data = request.data  # Assuming request.data is a list of dictionaries

    # print(data)

        if not data:  # Handle empty request data
            return HttpResponse("No data provided in the request.", status=400) # Bad Request

        df = pd.DataFrame.from_records(data)
        print("Hello")

        total_efforts = 0

        if 'Total_Days' in df.columns:  # Check if the 'total' column exists (important!)
            total_efforts = df['Total_Days'].sum()
        if 'Total_Hours' in df.columns:  # Check if the 'total' column exists (important!)
            total_hours = df['Total_Hours'].sum()

        # print(total_efforts)

        total_row = pd.DataFrame([{'Total_Days': total_efforts,'Total_Hours': total_hours}])  # Create a DataFrame for the new row

        # # Append the total row to the main DataFrame
        df = pd.concat([df, total_row], ignore_index=True) 



        if 'id' in df.columns:
            df = df.drop(columns=['id'])
        if 'project_name' in df.columns:
            df = df.drop(columns=['project_name']) 
        if 'key' in df.columns:
            df = df.drop(columns=['key']) 

        # column_mapping = {
        #     'object': 'object',
        #     'module': 'module',
        #     'data_object_type': 'data_object_type',
        #     'transformation_complexity': 'transformation_complexity',
        #     'load_complexity': 'load_complexity',
        #     'source_complexity': 'source_complexity',
        #     'object_development': 'object_development(In Days)',
        #     'iteration_1_data_loading': 'iteration_1_data_loading(In Days)',
        #     'iteration_1_defects': 'iteration_1_defects(In Days)',
        #     'iteration_2_data_loading': 'iteration_2_data_loading(In Days)',
        #     'iteration_2_defects': 'iteration_2_defects(In Days)',
        #     'iteration_3_data_loading': 'iteration_3_data_loading(In Days)',
        #     'iteration_3_defects': 'iteration_3_defects(In Days)',
        #     'production_data_loads': 'production_data_loads(In Days)',
        #     'total': 'Total Efforts(In Days)'
        # }
        # df = df.rename(columns=column_mapping)


        model_name ="_Effort&Estimate"  # More descriptive
        print(model_name)

        output = io.BytesIO()
        with pd.ExcelWriter(output, engine='openpyxl') as writer:
            df.to_excel(writer, index=False, sheet_name="data")

        output.seek(0)

        response = HttpResponse(
            output.getvalue(),  # Directly pass the file content
            content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        )
        response['Content-Disposition'] = f'attachment; filename="{model_name}.xlsx"'

        return response

    except Exception as e:
        print(f"An error occurred: {e}") # Log the error for debugging
        return HttpResponse(f"An error occurred: {e}", status=500)  # Return error response




@api_view(['POST'])
def project_data_save(request,pname):


    data = request.data
    for d in data:
        d['project_name'] = pname

    # print(data)
    # print(data)

    
    if project_efforts.objects.filter(project_name=pname):

        for d in data:
            proj = project_efforts.objects.filter(project_name=pname,object=d['object'])
            if proj:
                project = project_efforts.objects.get(project_name=pname,object=d['object'])
                data = ProjectEffortsSerializers(instance=project, data=d)
                # print(data)
                if data.is_valid():
                    data.save()
                else:
                    print(data.errors)
                    return Response(status=status.HTTP_406_NOT_ACCEPTABLE)
            else:
                project = ProjectEffortsSerializers(data=d)
                if project.is_valid():
                    project.save()
                else:
                    return Response(status=status.HTTP_409_CONFLICT)
            
        return Response(status=status.HTTP_200_OK)
    else:
        project = ProjectEffortsSerializers(data=data,many=True)
        if project.is_valid():
            project.save()
            return Response(project.data)
        else:
            return Response(status=status.HTTP_409_CONFLICT)



@api_view(['GET'])
def project_data_get(request,pname):
    project = project_efforts.objects.filter(project_name=pname)
    
    if project:    
        serializer = ProjectEffortsSerializers(project, many=True)
        return Response(serializer.data)
    else:
        return Response(status=status.HTTP_404_NOT_FOUND)
    

@api_view(['GET'])
def calc_total_time(request,pname):

    project = project_efforts.objects.filter(project_name=pname)
    
    total_time = 0
    if project:
        for p in project:
            total_time = total_time + p.total
        return Response(total_time)
    else:
        return Response(status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
def project_create(request):

    pname = request.data['project_name']
    val = {
        "project_name" : pname,
        "objects_count" : 0,
        "total_efforts" : 0,
        "table_name" : '',
        "user_name"  : "yash"
    }
    data = projects.objects.filter(project_name=pname)
    if data:
        return Response(status=status.HTTP_406_NOT_ACCEPTABLE)
    else:
        proj = ProjectSerializers(data=val)
        if proj.is_valid():
            proj.save()
            return Response(proj.data)
        else:
            return Response(status=status.HTTP_409_CONFLICT)



@api_view(['GET'])
def project_get(request):
    proj = projects.objects.all()

    if proj:
        for p in proj:
            pro = project_efforts.objects.filter(project_name=p.project_name)
            if pro:
                obj_count = pro.count() 
                total_efforts=0

                for obj in pro:
                    # print(obj.total)
                    if obj.total:
                        total_efforts += obj.total

                # print(total_efforts)
                # Update the projects instance directly:
                p.objects_count = obj_count
                p.total_efforts = total_efforts
                p.save() 
            else: # if there are no project efforts, set to zero.
                p.objects_count = 0
                p.total_efforts = 0
                p.save()

        project = projects.objects.all()
        serializer = ProjectSerializers(project, many=True)
        return Response(serializer.data)
    else:
        return Response(status=status.HTTP_404_NOT_FOUND)






# @api_view(['GET'])  # This function is for dynamically creating tables and you have to pass
def create_table(table_name,columns):
    # table_name = "bala7"
 
    # columns = [
    #     # ("id", "INTEGER PRIMARY KEY AUTOINCREMENT"),
    #     ("productname", "TEXT")
    #     # ("price", "REAL"),
    #     # ("description", "TEXT"),
    #     # ("is_active", "BOOLEAN"),
    #     # ("created_at", "DATETIME"),
    # ]
 
    # data_to_insert = [
    #     {
    #         "productname": "varun A"
    #         # "price": 10.99,
    #         # "description": "Product A description",
    #         # "is_active": True,
    #         # "created_at": "2024-10-29 17:00:00",
    #     },
    #     {
    #         "productname": "Product B"
    #         # "price": 20.00,
    #         # "description": "Product B description",
    #         # "is_active": False,
    #         # "created_at": "2024-10-29 18:00:00",
    #     },
    # ]
 
    # print("Taableeeeeeeeeeeeeeeeeeeeeee")
    # print(table_name)
    # print(columns)
 
    try:
        with connection.cursor() as cursor:
                # 1. Check if the table exists
                cursor.execute(f"SELECT name FROM sqlite_master WHERE type='table' AND name='{table_name}';")
                table_exists = cursor.fetchone() is not None
 
                if not table_exists:
                    create_table_sql = f"CREATE TABLE {table_name} ("
                    for col_name, col_type in columns:
                        create_table_sql += f"{col_name} {col_type},"
                    create_table_sql = create_table_sql[:-1] + ")"
                    # print(create_table_sql)
                    with transaction.atomic(using='default'):  
                        cursor.execute(create_table_sql)
                    print(f"Table '{table_name}' created.")
 
    except Exception as e:
        print(f"Error creating/inserting data: {e}")
        connection.rollback()
        # return Response(f"Error creating/inserting data: {e}", status=500)
 
 
def insert_data_from_dataframe(dataframe, table_name, database_name='default'):
    try:
        with connections[database_name].cursor() as cursor:
            for index, row in dataframe.iterrows():
                # Construct the INSERT INTO statement
                column_names = ', '.join(dataframe.columns)
                placeholders = ', '.join(['%s'] * len(dataframe.columns))
                insert_sql = f"INSERT INTO {table_name} ({column_names}) VALUES ({placeholders});"
                print(insert_sql)
                # Execute the INSERT statement with data from the row
                cursor.execute(insert_sql, tuple(row))
 
            # Commit the changes within a transaction
            with transaction.atomic(using=database_name):
                cursor.execute("COMMIT;")
 
        print(f"Data inserted successfully into '{table_name}' in {database_name} database.")
       
 
    except Exception as e:
        print(f"Error inserting data: {e}")
 
 
@api_view(['GET'])
def viewDynamic(request):
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
            tables = [row[0] for row in cursor.fetchall()]  # Extract table names
            return Response(tables)
 
 
        #     table_name = "bala7"
        #     cursor.execute(f"SELECT * FROM {table_name}")
        #     rows = cursor.fetchall()
 
        # # Print the data (or process it as needed)
        # ans = []
        # for row in rows:
        #     ans.append(row)
        # return Response(ans)
 
 
 
            # table_name = "bala5"
            #   # Method 1: Using PRAGMA table_info (recommended)
            # cursor.execute(f"PRAGMA table_info({table_name});")
            # columns_info = cursor.fetchall()
            # for column in columns_info:
            #     print(column)  # Print all column details
            #     print(f"Column Name: {column[1]}")
            # return Response("Hello")
 
    except Exception as e:
        print(f"Error creating/checking table: {e}")  # Print the error to the console
        connection.rollback()  # Rollback any partial changes on error
        return Response(f"Error creating/checking table: {e}", status=500)
   

def deleteSqlLiteTable(table_name):
 
    # table_name = "demo"
 
    try:
            with connection.cursor() as cursor:
                # Use parameterized query to prevent SQL injection
                cursor.execute(f"DROP TABLE IF EXISTS  {table_name}") # Correct: parameterized query
                # or cursor.execute(f"DROP TABLE IF EXISTS {table_name}") # Less secure way
                print(f"Table '{table_name}' dropped (IF EXISTS).")
    except Exception as e:
            print(f"Error dropping table '{table_name}': {e}")
   

def delete_sqllite_table_data(table_name):

    try:
        with connection.cursor() as cursor:

            sql = f"DELETE FROM {table_name}"  # No WHERE clause for DELETE ALL
            cursor.execute(sql)  # No parameters needed

            connection.commit()

            print("All data deleted successfully.")

    except Exception as e:
        connection.rollback()
        print(f"Error deleting all data: {e}")


@api_view(['GET'])
def report_estimation(request,pname):

    prj = projects.objects.get(project_name=pname)

    if prj:
        if prj.table_name == '':
            return Response(status=status.HTTP_406_NOT_ACCEPTABLE)
        else:
            pass
    else:
        return Response(status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
def report_creation(request):

    # deleteSqlLiteTable("yash_report")
    
    pname = request.data['project_name']
    weeks = request.data['weeks']
    realize = request.data['realize']
    live = request.data['live']

    prj = projects.objects.get(project_name=pname)

    if prj:
        print("In Project")
        if prj.table_name is not None:
            deleteSqlLiteTable(prj.table_name)

        print("In table")
        columns = []
        col = []
        col.append("Yash_Consultant")
        col.append("TEXT")
        columns.append(col)
        col = []

        col.append("Role")
        col.append("TEXT")
        columns.append(col)
        col = []
        
        col.append("Location")
        col.append("TEXT")
        columns.append(col)
        col = []
        
        for i in range(weeks):
            w = "W"+str(i + 1)
            col.append(w)
            col.append("INTEGER")
            columns.append(col)
            col=[]

        col.append("Total_Days")
        col.append("Integer")
        columns.append(col)
        col = []

        col.append("Total_Hours")
        col.append("Integer")
        columns.append(col)
        col = []

        table_name = pname + str("_report")
        create_table(table_name,columns)
        prj.table_name = table_name
        prj.realize = realize
        prj.live = live
        prj.save()
        report_insert(pname,weeks,realize,live)



        try:
            with connection.cursor() as cursor:
                sql = f"SELECT * FROM {table_name}"
                cursor.execute(sql)

                columns = [col[0] for col in cursor.description] #get the column names dynamically

                rows = cursor.fetchall()
                table_data = [dict(zip(columns, row)) for row in rows] #convert rows into list of dictionaries with column names as keys

            table_data.append({"realize": realize})  # Dictionary with string key and integer value
            table_data.append({"live": live}) 
            return JsonResponse(table_data, safe=False)

        except Exception as e:
            print(f"Error fetching data: {e}")
            return JsonResponse({"error": str(e)}, status=500)



    else:
        return Response(status=status.HTTP_404_NOT_FOUND)
    # print(table_name)

    return Response("Hello done")



# @api_view(['POST'])
def report_insert(pname,weeks,realize,live):

    prj = projects.objects.filter(project_name=pname)
    if prj:
        prj = projects.objects.get(project_name=pname)
        if prj.table_name is not None:
            total_effort = prj.total_efforts
            print(total_effort)
            resources = total_effort/(weeks*5)

            if resources % 1 > 0.6:  
                resources = math.ceil(resources) 
            else:
                resources =  math.floor(resources)  

            insert_data = []

            temp_consultants = []
            if 1 <= resources <= 4:
                for i in range(resources):
                    if i == 0:
                        temp_consultants.append("Lead - Data Migration Consultant")
                    # elif i == 1:
                    #     temp_consultants.append("Sr Data Migration Consultant")
                    else:
                        temp_consultants.append("Data Migration Consultant")
            elif 4 <= resources <= 6:
                for i in range(resources):
                    if i == 0:
                        temp_consultants.append("Lead - Data Migration Consultant")
                    elif i == 1 or i == 2:
                        temp_consultants.append("Sr Data Migration Consultant")
                    else:
                        temp_consultants.append("Data Migration Consultant")
            elif resources > 6:
                for i in range(resources):
                    if i == 0:
                        temp_consultants.append("Lead - Data Migration Consultant")
                    elif i == 1 or i == 2:
                        temp_consultants.append("Sr Data Migration Consultant")
                    else:
                        temp_consultants.append("Data Migration Consultant")



            g_t_d = 0
            g_t_h = 0
            for r in range(resources):
                data = {
                        "Yash_Consultant": temp_consultants[r],  # Example values
                        "Role": "Technical",
                        "Location": "Offshore",
                        "Total_Days": 0,  # Initialize to 0, will be calculated later
                        "Total_Hours": 0   # Initialize to 0, will be calculated later
                    }

                w_columns = []
                t_d = 0
                t_h = 0
                for i in range(weeks):
                    if data["Yash_Consultant"] == "Lead - Data Migration Consultant":
                            w = f"W{i + 1}"  # Use f-string for cleaner formatting
                            data[w] = 5  # Or any other default value for the weeks
                            t_d += data[w]
                            t_h = t_d * 8
                    else:
                        if (i+1) < realize or (i+1) >= live:
                            w = f"W{i + 1}"  # Use f-string for cleaner formatting
                            data[w] = 0  # Or any other default value for the weeks
                            # t_d += data[w]
                            # t_h = t_d * 8
                        else:
                            w = f"W{i + 1}"  # Use f-string for cleaner formatting
                            data[w] = 5  # Or any other default value for the weeks
                            t_d += data[w]
                            t_h = t_d * 8
                    # w_columns.append(w)
                g_t_d += t_d
                g_t_h += t_h
                data['Total_Days'] = t_d
                data['Total_Hours'] = t_h
                insert_data.append(data)
            

            data = {
                        "Location": "Total",
                        "Total_Days": 0,  # Initialize to 0, will be calculated later
                        "Total_Hours": 0   # Initialize to 0, will be calculated later
                    }
            print(g_t_d)
            print(g_t_h)

            data['Total_Days'] = g_t_d
            data['Total_Hours'] = g_t_h
            insert_data.append(data)
            
            df = pd.DataFrame(insert_data)  # Convert the list of dictionaries to a DataFrame

            # print(df)
    
            insert_data_from_dataframe(df,prj.table_name)

            return Response(resources)
        else:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
    else:
        return Response(status=status.HTTP_404_NOT_FOUND)
        

@api_view(['GET'])
def report_get(request,pname):

    print("called Report get")
    realize = 0 
    live = 0
    prj = projects.objects.filter(project_name=pname)
    if prj:
        prj = projects.objects.get(project_name=pname)
        if prj.table_name is not None:
            table_name = prj.table_name
            realize = prj.realize
            live = prj.live
        else:
            return Response(status=status.HTTP_404_NOT_FOUND)
    else:
        return Response(status=status.HTTP_400_BAD_REQUEST)


    try:
        with connection.cursor() as cursor:
            sql = f"SELECT * FROM {table_name}"
            cursor.execute(sql)

            columns = [col[0] for col in cursor.description] #get the column names dynamically

            rows = cursor.fetchall()
            table_data = [dict(zip(columns, row)) for row in rows] #convert rows into list of dictionaries with column names as keys

        table_data.append({"realize": realize})  # Dictionary with string key and integer value
        table_data.append({"live": live})  
        return JsonResponse(table_data, safe=False)

    except Exception as e:
        print(f"Error fetching data: {e}")
        return JsonResponse({"error": str(e)}, status=500)


@api_view(['PUT'])
def report_update(request,pname):

    prj = projects.objects.filter(project_name=pname)
    if prj:
        prj = projects.objects.get(project_name=pname)
        table_name = prj.table_name
        delete_sqllite_table_data(table_name)

        df = pd.DataFrame(request.data)  # Convert the list of dictionaries to a DataFrame

            # print(df)
    
        insert_data_from_dataframe(df,prj.table_name)



        return Response("Done")
    else:
        return Response(status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
def user_create(request):

    data = user.objects.filter(user_name=request.data['user_name'])
    # print("Recieved Data :" ,request.data)
    if data:
        return Response(status=status.HTTP_406_NOT_ACCEPTABLE)
    else:
        users = UserSerializers(data=request.data)
        # print("Modified Data :" ,users)   
        if users.is_valid():
            users.save()
            return Response(users.data)
        else:
            return Response(status=status.HTTP_404_NOT_FOUND)
    
@api_view(['POST'])
def user_login(request):
    print(request.body)
    data = json.loads(request.body.decode('utf-8'))
    print(data)
    email, password = data.get('email'), data.get('password')
    allUsers = user.objects.all()
    
    serializer = UserSerializers(allUsers, many = True)
    # print(serializer.data)
    allData = serializer.data
    print(allUsers)
    for data in allData:
        print(data['email'])
        if data['email'] == email and data['password'] == password:
            return Response(data, status = 200)
    else:
        return Response(" Ivalid credentials ", status = 404)
 
    # return Response(" bhoom", status=404)

@api_view(['PUT'])
def user_update(request,uname):

    users = user.objects.filter(user_name = uname)
    if users:
        users = user.objects.get(user_name = uname)
        data = UserSerializers(instance=users, data=request.data)

        if data.is_valid():
            data.save()
            return Response(data.data)
        else:
            return Response(status=status.HTTP_403_FORBIDDEN)
    else:
        return Response(status=status.HTTP_404_NOT_FOUND)
    

@api_view(['DELETE'])
def user_delete(request,uname):
    users = user.objects.filter(user_name = uname)

    if users:
        users = user.objects.get(user_name = uname)
        serializer = UserSerializers(users)
        users.delete()
        return Response(serializer.data,status=status.HTTP_200_OK)
    else:
        return Response(status=status.HTTP_404_NOT_FOUND)

