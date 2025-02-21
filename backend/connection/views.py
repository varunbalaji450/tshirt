from django.shortcuts import HttpResponse
from rest_framework.decorators import api_view
from .utils import sapnwrfc
from ctypes import *
from rest_framework.response import Response
from rest_framework import status
from hdbcli import dbapi
import sqlite3
from django.db import connections, transaction
from .serlializers import *
from .models import Project,Connection,dd02l_desc,objects,fields,segments,Rule,SaveRule
import json
import pandas as pd
from django.core.serializers import serialize
from django.db.models import Q, Case, When, Value, IntegerField
from django.db import connection
import re,string
from rest_framework import viewsets
from django.utils import timezone
from rest_framework.views import APIView
import matplotlib.pyplot as plt
from django.http import HttpResponse, JsonResponse
from io import BytesIO
# import sapnwrfc


#-Begin-----------------------------------------------------------------

#-Packages--------------------------------------------------------------
from ctypes import *
import platform, os


#-Structures------------------------------------------------------------
class RFC_ERROR_INFO(Structure):
    _fields_ = [("code", c_long),
                ("group", c_long),
                ("key", c_wchar * 128),
                ("message", c_wchar * 512),
                ("abapMsgClass", c_wchar * 21),
                ("abapMsgType", c_wchar * 2),
                ("abapMsgNumber", c_wchar * 4),
                ("abapMsgV1", c_wchar * 51),
                ("abapMsgV2", c_wchar * 51),
                ("abapMsgV3", c_wchar * 51),
                ("abapMsgV4", c_wchar * 51)]

class RFC_CONNECTION_PARAMETER(Structure):
    _fields_ = [("name", c_wchar_p),
                ("value", c_wchar_p)]


def home(request):
    return HttpResponse("home Page")


@api_view(['POST'])
def SAPconn(request):
    class RFC_ERROR_INFO(Structure):
        _fields_ = [("code", c_long),
                    ("group", c_long),
                    ("key", c_wchar * 128),
                    ("message", c_wchar * 512),
                    ("abapMsgClass", c_wchar * 21),
                    ("abapMsgType", c_wchar * 2),
                    ("abapMsgNumber", c_wchar * 4),
                    ("abapMsgV1", c_wchar * 51),
                    ("abapMsgV2", c_wchar * 51),
                    ("abapMsgV3", c_wchar * 51),
                    ("abapMsgV4", c_wchar * 51)]
    class RFC_CONNECTION_PARAMETER(Structure):
        _fields_ = [("name", c_wchar_p),
                    ("value", c_wchar_p)]
    RFC_OK = 0
    RFC_COMMUNICATION_FAILURE = 1
    RFC_LOGON_FAILURE = 2
    RFC_ABAP_RUNTIME_FAILURE = 3
    RFC_ABAP_MESSAGE = 4
    RFC_ABAP_EXCEPTION = 5
    RFC_CLOSED = 6
    RFC_CANCELED = 7
    RFC_TIMEOUT = 8
    RFC_MEMORY_INSUFFICIENT = 9
    RFC_VERSION_MISMATCH = 10
    RFC_INVALID_PROTOCOL = 11
    RFC_SERIALIZATION_FAILURE = 12
    RFC_INVALID_HANDLE = 13
    RFC_RETRY = 14
    RFC_EXTERNAL_FAILURE = 15
    RFC_EXECUTED = 16
    RFC_NOT_FOUND = 17
    RFC_NOT_SUPPORTED = 18
    RFC_ILLEGAL_STATE = 19
    RFC_INVALID_PARAMETER = 20
    RFC_CODEPAGE_CONVERSION_FAILURE = 21
    RFC_CONVERSION_FAILURE = 22
    RFC_BUFFER_TOO_SMALL = 23
    RFC_TABLE_MOVE_BOF = 24
    RFC_TABLE_MOVE_EOF = 25
    RFC_START_SAPGUI_FAILURE = 26
    RFC_ABAP_CLASS_EXCEPTION = 27
    RFC_UNKNOWN_ERROR = 28
    RFC_AUTHORIZATION_FAILURE = 29

    #-RFCTYPE - RFC data types----------------------------------------------
    RFCTYPE_CHAR = 0
    RFCTYPE_DATE = 1
    RFCTYPE_BCD = 2
    RFCTYPE_TIME = 3
    RFCTYPE_BYTE = 4
    RFCTYPE_TABLE = 5
    RFCTYPE_NUM = 6
    RFCTYPE_FLOAT = 7
    RFCTYPE_INT = 8
    RFCTYPE_INT2 = 9
    RFCTYPE_INT1 = 10
    RFCTYPE_NULL = 14
    RFCTYPE_ABAPOBJECT = 16
    RFCTYPE_STRUCTURE = 17
    RFCTYPE_DECF16 = 23
    RFCTYPE_DECF34 = 24
    RFCTYPE_XMLDATA = 28
    RFCTYPE_STRING = 29
    RFCTYPE_XSTRING = 30
    RFCTYPE_BOX = 31
    RFCTYPE_GENERIC_BOX = 32

    #-RFC_UNIT_STATE - Processing status of a background unit---------------
    RFC_UNIT_NOT_FOUND = 0 
    RFC_UNIT_IN_PROCESS = 1 
    RFC_UNIT_COMMITTED = 2 
    RFC_UNIT_ROLLED_BACK = 3 
    RFC_UNIT_CONFIRMED = 4 

    #-RFC_CALL_TYPE - Type of an incoming function call---------------------
    RFC_SYNCHRONOUS = 0 
    RFC_TRANSACTIONAL = 1 
    RFC_QUEUED = 2 
    RFC_BACKGROUND_UNIT = 3 

    #-RFC_DIRECTION - Direction of a function module parameter--------------
    RFC_IMPORT = 1 
    RFC_EXPORT = 2 
    RFC_CHANGING = RFC_IMPORT + RFC_EXPORT 
    RFC_TABLES = 4 + RFC_CHANGING 

    #-RFC_CLASS_ATTRIBUTE_TYPE - Type of an ABAP object attribute-----------
    RFC_CLASS_ATTRIBUTE_INSTANCE = 0 
    RFC_CLASS_ATTRIBUTE_CLASS = 1 
    RFC_CLASS_ATTRIBUTE_CONSTANT = 2 

    #-RFC_METADATA_OBJ_TYPE - Ingroup repository----------------------------
    RFC_METADATA_FUNCTION = 0 
    RFC_METADATA_TYPE = 1 
    RFC_METADATA_CLASS = 2 


    #-Variables-------------------------------------------------------------
    ErrInf = RFC_ERROR_INFO; RfcErrInf = ErrInf()
    ConnParams = RFC_CONNECTION_PARAMETER * 5; RfcConnParams = ConnParams()
    SConParams = RFC_CONNECTION_PARAMETER * 3; RfcSConParams = SConParams()


    SAPNWRFC = "sapnwrfc.dll"
    SAP = windll.LoadLibrary(SAPNWRFC)

    #-Prototypes------------------------------------------------------------
    SAP.RfcAppendNewRow.argtypes = [c_void_p, POINTER(ErrInf)]
    SAP.RfcAppendNewRow.restype = c_void_p

    SAP.RfcCloseConnection.argtypes = [c_void_p, POINTER(ErrInf)]
    SAP.RfcCloseConnection.restype = c_ulong

    SAP.RfcCreateFunction.argtypes = [c_void_p, POINTER(ErrInf)]
    SAP.RfcCreateFunction.restype = c_void_p

    SAP.RfcCreateFunctionDesc.argtypes = [c_wchar_p, POINTER(ErrInf)]
    SAP.RfcCreateFunctionDesc.restype = c_void_p

    SAP.RfcDestroyFunction.argtypes = [c_void_p, POINTER(ErrInf)]
    SAP.RfcDestroyFunction.restype = c_ulong

    SAP.RfcDestroyFunctionDesc.argtypes = [c_void_p, POINTER(ErrInf)]
    SAP.RfcDestroyFunctionDesc.restype = c_ulong

    SAP.RfcGetChars.argtypes = [c_void_p, c_wchar_p, c_void_p, c_ulong, \
    POINTER(ErrInf)]
    SAP.RfcGetChars.restype = c_ulong

    SAP.RfcGetCurrentRow.argtypes = [c_void_p, POINTER(ErrInf)]
    SAP.RfcGetCurrentRow.restype = c_void_p

    SAP.RfcGetFunctionDesc.argtypes = [c_void_p, c_wchar_p, POINTER(ErrInf)]
    SAP.RfcGetFunctionDesc.restype = c_void_p

    SAP.RfcGetRowCount.argtypes = [c_void_p, POINTER(c_ulong), \
    POINTER(ErrInf)]
    SAP.RfcGetRowCount.restype = c_ulong

    SAP.RfcGetStructure.argtypes = [c_void_p, c_wchar_p, \
    POINTER(c_void_p), POINTER(ErrInf)]
    SAP.RfcGetStructure.restype = c_ulong

    SAP.RfcGetTable.argtypes = [c_void_p, c_wchar_p, POINTER(c_void_p), \
    POINTER(ErrInf)]
    SAP.RfcGetTable.restype = c_ulong

    SAP.RfcGetVersion.argtypes = [POINTER(c_ulong), POINTER(c_ulong), \
    POINTER(c_ulong)]
    SAP.RfcGetVersion.restype = c_wchar_p

    SAP.RfcInstallServerFunction.argtypes = [c_wchar_p, c_void_p, \
    c_void_p, POINTER(ErrInf)]
    SAP.RfcInstallServerFunction.restype = c_ulong

    SAP.RfcInvoke.argtypes = [c_void_p, c_void_p, POINTER(ErrInf)]
    SAP.RfcInvoke.restype = c_ulong

    SAP.RfcListenAndDispatch.argtypes = [c_void_p, c_ulong, POINTER(ErrInf)]
    SAP.RfcListenAndDispatch.restype = c_ulong

    SAP.RfcMoveToFirstRow.argtypes = [c_void_p, POINTER(ErrInf)]
    SAP.RfcMoveToFirstRow.restype = c_ulong

    SAP.RfcMoveToNextRow.argtypes = [c_void_p, POINTER(ErrInf)]
    SAP.RfcMoveToNextRow.restype = c_ulong

    SAP.RfcOpenConnection.argtypes = [POINTER(ConnParams), c_ulong, \
    POINTER(ErrInf)]
    SAP.RfcOpenConnection.restype = c_void_p

    SAP.RfcPing.argtypes = [c_void_p, POINTER(ErrInf)]
    SAP.RfcPing.restype = c_ulong

    SAP.RfcRegisterServer.argtypes = [POINTER(SConParams), c_ulong, \
    POINTER(ErrInf)]
    SAP.RfcRegisterServer.restype = c_void_p

    SAP.RfcSetChars.argtypes = [c_void_p, c_wchar_p, c_wchar_p, c_ulong, \
    POINTER(ErrInf)]
    SAP.RfcSetChars.restype = c_ulong

    RfcConnParams[0].name = "ASHOST"; RfcConnParams[0].value = request.data['host']
    RfcConnParams[1].name = "SYSNR" ; RfcConnParams[1].value = request.data['sysnr']            
    RfcConnParams[2].name = "CLIENT"; RfcConnParams[2].value = request.data['client']      
    RfcConnParams[3].name = "USER"  ; RfcConnParams[3].value = request.data['username']     
    RfcConnParams[4].name = "PASSWD"; RfcConnParams[4].value = request.data['password']  


    hRFC = SAP.RfcOpenConnection(RfcConnParams, 5, RfcErrInf)
    # hRFC = ""
    if hRFC != None:
        return Response(status=status.HTTP_200_OK)
    else:
        print(RfcErrInf.message)
    return Response(status=status.HTTP_404_NOT_FOUND)


l=[False,""]

@api_view(['POST'])
def HANAconn(request):
    print("Hana")
    print(request.data)
    try:
        conn = dbapi.connect(
            # address="10.56.7.40",
            address = request.data['host'],
            # port=30015,
            port=int(request.data['port']),
            # user="SURYAC",
            # password="Surya@2727",
            # user="SAMPATHS",
            # password="Sampath@123",
            # user="RUPAM",
            user = request.data['username'],
            password= request.data['password'],
            # password="Mrupa09$",
            encrypt='true',
            sslValidateCertificate='false'
        )
        print(conn.isconnected())
        l[0]=conn
        l[1] = request.data['username']
    #     cursor = conn.cursor()
    #     cursor.execute("SELECT TABLE_NAME FROM SYS.TABLES WHERE SCHEMA_NAME = '"+l[1]+"'")
    #     rows = cursor.fetchall()
    #     rows=list(rows)
    #     tables = [dict(var = str(row[0]).strip()) for row in rows]
 
    #     print(tables)
    #     # return Response(tables)
       
    #     return Response(tables,status=status.HTTP_200_OK)
    except:
        # return Response("failure")  
        return Response(status=status.HTTP_404_NOT_FOUND)
   
    if(conn.isconnected):  
        # return HttpResponse("success")
        return Response(status=status.HTTP_200_OK)
    # return HttpResponse("failure")
    return Response(status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
def HANAtables(request,p_id,c_name):
    connection = Connection.objects.filter(project_id=p_id,connection_name=c_name)
    json_data = serialize('json', list(connection))
    json_data = json.loads(json_data)[0]['fields']
    print(json_data)
    conn = conn = dbapi.connect(
            # address="10.56.7.40",
            address = json_data['host'],
            # port=30015,
            port=int(json_data['port']),
            # user="SURYAC",
            # password="Surya@2727",
            # user="SAMPATHS",
            # password="Sampath@123",
            # user="RUPAM",
            user = json_data['username'],
            password= json_data['password'],
            # password="Mrupa09$",
            encrypt='true',
            sslValidateCertificate='false'
        )
    cursor = conn.cursor()
    cursor.execute("SELECT TABLE_NAME FROM SYS.TABLES WHERE SCHEMA_NAME = '"+json_data['username']+"'")
    rows = cursor.fetchall()
    rows=list(rows)
    tables = [dict(table = str(row[0]).strip(),desc="") for row in rows]
 
    print(tables)
    return Response(tables)  


@api_view(['POST'])
def ProjectCreate(request):
    print("Hello called Post")
    print(request.data)
    project = ProjectSerializer(data=request.data)

    # validating for already existing data
    # print("varun : ",Project.objects.filter(project_name=request.data['project_name']))

    
    if Project.objects.filter(project_name=request.data['project_name']):
        return Response(status=status.HTTP_406_NOT_ACCEPTABLE)

    if project.is_valid():
        project.save()
        # proj = project_details.objects.get(project_name=request.data['project_name'])
        # print("Id : ",proj.proj_id)
        return Response(project.data)
    else:
        return Response(status=status.HTTP_409_CONFLICT)


@api_view(['GET'])
def ProjectGet(request):
    print("Hello called Get Api")
    sorted_objects = Project.objects.order_by('-created_at')
    # projects = Project.objects.all()
    serializer = ProjectSerializer(sorted_objects, many=True)
    return Response(serializer.data)


@api_view(['PUT'])
def projectUpdate(request,pk):
    print("Hello called update")
    print(request.data)
    project = Project.objects.get(project_id=pk)
    data = ProjectSerializer(instance=project, data=request.data)

    

    if data.is_valid():
        data.save()
        print("edjnkfhjrvfh")
        return Response(data.data)
    else:
        return Response(status=status.HTTP_404_NOT_FOUND)

@api_view(['DELETE'])
def project_delete(request,pk):
 
    # pk = request.data['project_name']
    print("Hello called Delete")
    if Project.objects.filter(project_id=pk).exists():
        project = Project.objects.get(project_id=pk)
        if project:
            serializer = ProjectSerializer(project)
            project.delete()
            return Response(serializer.data,status=status.HTTP_202_ACCEPTED)
        else:
            return Response(status=status.HTTP_404_NOT_FOUND)
    else:
        return Response(status=status.HTTP_404_NOT_FOUND)



@api_view(['POST'])
def ConnectionCreate(request):
    # request.data['connection_type']=""
    connection = ConnectionSerializer(data=request.data)
    print("Hello post connection called")
    if Connection.objects.filter(project_id=request.data["project_id"],connection_name = request.data["connection_name"]).exists():
        return Response(status=status.HTTP_406_NOT_ACCEPTABLE)
    if connection.is_valid():
        
        connection.save()
        return Response(connection.data,status=status.HTTP_201_CREATED)
    else:
        return Response(status=status.HTTP_409_CONFLICT)
    
@api_view(['GET'])
def ConnectionGet(request):
    print("hii")
    connections = Connection.objects.all()
    serializer = ConnectionSerializer(connections,many=True)
    return Response(serializer.data) 

@api_view(['PUT'])
def ConnectionUpdate(request,p_id,c_name):
    print(request.data)
    print(p_id,c_name)
    connection = Connection.objects.get(project_id=p_id,connection_name=c_name)
    data = ConnectionSerializer(instance=connection, data=request.data)
    if data.is_valid():
        print("jfnjkjefkjfkjnrkj")
        data.save()
        return Response(data.data,status=status.HTTP_202_ACCEPTED)
    else:
        print("ffffffffffffffffffffffffffffffffffffff")
        return Response(status=status.HTTP_404_NOT_FOUND)
    
@api_view(['DELETE'])
def connectionDelete(request,p_id,c_name):
    if Connection.objects.filter(project_id=p_id,connection_name=c_name).exists():
        connection = Connection.objects.get(project_id=p_id,connection_name=c_name)
        if connection:
            connection.delete()
            print("ssssssuccesssss")
            return Response(c_name,status=status.HTTP_202_ACCEPTED)
        else:
            return Response(status=status.HTTP_404_NOT_FOUND)
    else:
        return Response(status=status.HTTP_404_NOT_FOUND)   


@api_view(['GET'])
def ConnectionGetSingle(request,p_id,c_name):
    if Connection.objects.filter(project_id=p_id,connection_name=c_name).exists():
        connection = Connection.objects.get(project_id=p_id,connection_name=c_name)
        if connection:
            serializer = ConnectionSerializer(connection)
            return Response(serializer.data)
        else:
            return Response(status=status.HTTP_404_NOT_FOUND)
    else:
        return Response(status=status.HTTP_404_NOT_FOUND)   
    
@api_view(['GET'])
def ProjectGetSingle(request,p_id):
    if Project.objects.filter(project_id=p_id).exists():
        project = Project.objects.get(project_id=p_id)
        if project:
            serializer = ProjectSerializer(project)
            return Response(serializer.data)
        else:
            return Response(status=status.HTTP_404_NOT_FOUND)
    else:
        return Response(status=status.HTTP_404_NOT_FOUND)   



@api_view(['GET'])
def Project_Connection(request,p_id):

    connections = Connection.objects.filter(project_id=p_id)
    if connections:
        serializer = ConnectionSerializer(connections,many=True)
        return Response(serializer.data)
    else:
        return Response(status=status.HTTP_404_NOT_FOUND)



@api_view(['PUT'])
def connectionRename(request,re_val,p_id,c_name):
    # print(request.data)
    connection = Connection.objects.get(project_id=p_id,connection_name=c_name)
    data = ConnectionSerializer(instance=connection, data=request.data)
    request.data['connection_name'] = re_val
    data = ConnectionSerializer(instance=connection, data=request.data)
    if data.is_valid():
        try:
            data.save()
            return  Response(c_name,status=status.HTTP_202_ACCEPTED)
        except:
            return Response(re_val,status=status.HTTP_404_NOT_FOUND)
    else:
        return Response(re_val,status=status.HTTP_404_NOT_FOUND)
    

@api_view(['GET'])
def saptables_to_sqlite(request):
    
 
   
    class RFC_ERROR_INFO(Structure):
        _fields_ = [("code", c_ulong),
                    ("group", c_ulong),
                    ("key", c_wchar * 128),
                    ("message", c_wchar * 512),
                    ("abapMsgClass", c_wchar * 21),
                    ("abapMsgType", c_wchar * 2),
                    ("abapMsgNumber", c_wchar * 4),
                    ("abapMsgV1", c_wchar * 51),
                    ("abapMsgV2", c_wchar * 51),
                    ("abapMsgV3", c_wchar * 51),
                    ("abapMsgV4", c_wchar * 51)]
 
    class RFC_CONNECTION_PARAMETER(Structure):
        _fields_ = [("name", c_wchar_p),
                    ("value", c_wchar_p)]
 
 
    #-Constants-------------------------------------------------------------
 
    #-RFC_RC - RFC return codes---------------------------------------------
    RFC_OK = 0
    RFC_COMMUNICATION_FAILURE = 1
    RFC_LOGON_FAILURE = 2
    RFC_ABAP_RUNTIME_FAILURE = 3
    RFC_ABAP_MESSAGE = 4
    RFC_ABAP_EXCEPTION = 5
    RFC_CLOSED = 6
    RFC_CANCELED = 7
    RFC_TIMEOUT = 8
    RFC_MEMORY_INSUFFICIENT = 9
    RFC_VERSION_MISMATCH = 10
    RFC_INVALID_PROTOCOL = 11
    RFC_SERIALIZATION_FAILURE = 12
    RFC_INVALID_HANDLE = 13
    RFC_RETRY = 14
    RFC_EXTERNAL_FAILURE = 15
    RFC_EXECUTED = 16
    RFC_NOT_FOUND = 17
    RFC_NOT_SUPPORTED = 18
    RFC_ILLEGAL_STATE = 19
    RFC_INVALID_PARAMETER = 20
    RFC_CODEPAGE_CONVERSION_FAILURE = 21
    RFC_CONVERSION_FAILURE = 22
    RFC_BUFFER_TOO_SMALL = 23
    RFC_TABLE_MOVE_BOF = 24
    RFC_TABLE_MOVE_EOF = 25
    RFC_START_SAPGUI_FAILURE = 26
    RFC_ABAP_CLASS_EXCEPTION = 27
    RFC_UNKNOWN_ERROR = 28
    RFC_AUTHORIZATION_FAILURE = 29
 
    #-RFCTYPE - RFC data types----------------------------------------------
    RFCTYPE_CHAR = 0
    RFCTYPE_DATE = 1
    RFCTYPE_BCD = 2
    RFCTYPE_TIME = 3
    RFCTYPE_BYTE = 4
    RFCTYPE_TABLE = 5
    RFCTYPE_NUM = 6
    RFCTYPE_FLOAT = 7
    RFCTYPE_INT = 8
    RFCTYPE_INT2 = 9
    RFCTYPE_INT1 = 10
    RFCTYPE_NULL = 14
    RFCTYPE_ABAPOBJECT = 16
    RFCTYPE_STRUCTURE = 17
    RFCTYPE_DECF16 = 23
    RFCTYPE_DECF34 = 24
    RFCTYPE_XMLDATA = 28
    RFCTYPE_STRING = 29
    RFCTYPE_XSTRING = 30
    RFCTYPE_BOX = 31
    RFCTYPE_GENERIC_BOX = 32
 
    #-RFC_UNIT_STATE - Processing status of a background unit---------------
    RFC_UNIT_NOT_FOUND = 0
    RFC_UNIT_IN_PROCESS = 1
    RFC_UNIT_COMMITTED = 2
    RFC_UNIT_ROLLED_BACK = 3
    RFC_UNIT_CONFIRMED = 4
 
    #-RFC_CALL_TYPE - Type of an incoming function call---------------------
    RFC_SYNCHRONOUS = 0
    RFC_TRANSACTIONAL = 1
    RFC_QUEUED = 2
    RFC_BACKGROUND_UNIT = 3
 
    #-RFC_DIRECTION - Direction of a function module parameter--------------
    RFC_IMPORT = 1
    RFC_EXPORT = 2
    RFC_CHANGING = RFC_IMPORT + RFC_EXPORT
    RFC_TABLES = 4 + RFC_CHANGING
 
    #-RFC_CLASS_ATTRIBUTE_TYPE - Type of an ABAP object attribute-----------
    RFC_CLASS_ATTRIBUTE_INSTANCE = 0
    RFC_CLASS_ATTRIBUTE_CLASS = 1
    RFC_CLASS_ATTRIBUTE_CONSTANT = 2
 
    #-RFC_METADATA_OBJ_TYPE - Ingroup repository----------------------------
    RFC_METADATA_FUNCTION = 0
    RFC_METADATA_TYPE = 1
    RFC_METADATA_CLASS = 2
 
 
    #-Variables-------------------------------------------------------------
    ErrInf = RFC_ERROR_INFO; RfcErrInf = ErrInf()
    ConnParams = RFC_CONNECTION_PARAMETER * 5; RfcConnParams = ConnParams()
    SConParams = RFC_CONNECTION_PARAMETER * 3; RfcSConParams = SConParams()
 
 
    #-Library---------------------------------------------------------------
    # if str(platform.architecture()[0]) == "32bit":
    #   os.environ['PATH'] += ";C:\\SAPRFCSDK\\32bit"
    #   SAPNWRFC = "C:\\SAPRFCSDK\\32bit\\sapnwrfc.dll"
    # elif str(platform.architecture()[0]) == "64bit":
    #   os.environ['PATH'] += ";C:\\SAPRFCSDK\\64bit"
    #   SAPNWRFC = "C:\\SAPRFCSDK\\64bit\\sapnwrfc.dll"
 
    SAPNWRFC = "sapnwrfc.dll"
 
    SAP = windll.LoadLibrary(SAPNWRFC)
 
    #-Prototypes------------------------------------------------------------
    SAP.RfcAppendNewRow.argtypes = [c_void_p, POINTER(ErrInf)]
    SAP.RfcAppendNewRow.restype = c_void_p
 
    SAP.RfcCloseConnection.argtypes = [c_void_p, POINTER(ErrInf)]
    SAP.RfcCloseConnection.restype = c_ulong
 
    SAP.RfcCreateFunction.argtypes = [c_void_p, POINTER(ErrInf)]
    SAP.RfcCreateFunction.restype = c_void_p
 
    SAP.RfcSetInt.argtypes = [c_void_p, c_wchar_p, c_ulong, POINTER(ErrInf)]
    SAP.RfcSetInt.restype = c_ulong
 
    SAP.RfcCreateFunctionDesc.argtypes = [c_wchar_p, POINTER(ErrInf)]
    SAP.RfcCreateFunctionDesc.restype = c_void_p
 
    SAP.RfcDestroyFunction.argtypes = [c_void_p, POINTER(ErrInf)]
    SAP.RfcDestroyFunction.restype = c_ulong
 
    SAP.RfcDestroyFunctionDesc.argtypes = [c_void_p, POINTER(ErrInf)]
    SAP.RfcDestroyFunctionDesc.restype = c_ulong
 
    SAP.RfcGetChars.argtypes = [c_void_p, c_wchar_p, c_void_p, c_ulong, \
    POINTER(ErrInf)]
    SAP.RfcGetChars.restype = c_ulong
 
    SAP.RfcGetCurrentRow.argtypes = [c_void_p, POINTER(ErrInf)]
    SAP.RfcGetCurrentRow.restype = c_void_p
 
    SAP.RfcGetFunctionDesc.argtypes = [c_void_p, c_wchar_p, POINTER(ErrInf)]
    SAP.RfcGetFunctionDesc.restype = c_void_p
 
    SAP.RfcCreateTable.argtypes = [c_void_p, POINTER(ErrInf)]
    SAP.RfcCreateTable.restype = c_void_p
 
 
    SAP.RfcGetRowCount.argtypes = [c_void_p, POINTER(c_ulong), \
    POINTER(ErrInf)]
    SAP.RfcGetRowCount.restype = c_ulong
 
    SAP.RfcGetStructure.argtypes = [c_void_p, c_wchar_p, \
    POINTER(c_void_p), POINTER(ErrInf)]
    SAP.RfcGetStructure.restype = c_ulong
 
    SAP.RfcGetTable.argtypes = [c_void_p, c_wchar_p, POINTER(c_void_p), \
    POINTER(ErrInf)]
    SAP.RfcGetTable.restype = c_ulong
 
    SAP.RfcGetVersion.argtypes = [POINTER(c_ulong), POINTER(c_ulong), \
    POINTER(c_ulong)]
    SAP.RfcGetVersion.restype = c_wchar_p
 
    SAP.RfcInstallServerFunction.argtypes = [c_wchar_p, c_void_p, \
    c_void_p, POINTER(ErrInf)]
    SAP.RfcInstallServerFunction.restype = c_ulong
 
    SAP.RfcInvoke.argtypes = [c_void_p, c_void_p, POINTER(ErrInf)]
    SAP.RfcInvoke.restype = c_ulong
 
    SAP.RfcListenAndDispatch.argtypes = [c_void_p, c_ulong, POINTER(ErrInf)]
    SAP.RfcListenAndDispatch.restype = c_ulong
 
    SAP.RfcMoveToFirstRow.argtypes = [c_void_p, POINTER(ErrInf)]
    SAP.RfcMoveToFirstRow.restype = c_ulong
 
    SAP.RfcMoveToNextRow.argtypes = [c_void_p, POINTER(ErrInf)]
    SAP.RfcMoveToNextRow.restype = c_ulong
 
    SAP.RfcOpenConnection.argtypes = [POINTER(ConnParams), c_ulong, \
    POINTER(ErrInf)]
    SAP.RfcOpenConnection.restype = c_void_p
 
    SAP.RfcPing.argtypes = [c_void_p, POINTER(ErrInf)]
    SAP.RfcPing.restype = c_ulong
 
    SAP.RfcRegisterServer.argtypes = [POINTER(SConParams), c_ulong, \
    POINTER(ErrInf)]
    SAP.RfcRegisterServer.restype = c_void_p
 
    SAP.RfcSetChars.argtypes = [c_void_p, c_wchar_p, c_wchar_p, c_ulong, \
    POINTER(ErrInf)]
    SAP.RfcSetChars.restype = c_ulong
 
 
 
 
 
           
   
 
    # FileName = "sapnwrfc.py"
    # exec(compile(open(FileName).read(), FileName, "exec"))
   
    #-Main------------------------------------------------------------------
   
    RfcConnParams[0].name = "ASHOST"; RfcConnParams[0].value = "34.194.191.113"
    RfcConnParams[1].name = "SYSNR" ; RfcConnParams[1].value = "01"
    RfcConnParams[2].name = "CLIENT"; RfcConnParams[2].value = "100"
    RfcConnParams[3].name = "USER"  ; RfcConnParams[3].value = "RAJKUMARS"
    RfcConnParams[4].name = "PASSWD"; RfcConnParams[4].value = "JaiHanuman10"
   
    tables = []
    res = []
    val = 50
    hRFC = SAP.RfcOpenConnection(RfcConnParams, 5, RfcErrInf)
    if hRFC != None:
   
        charBuffer = create_unicode_buffer(1048576 + 1)
        charBuffer1 = create_unicode_buffer(1048576 + 1)
   
    hFuncDesc = SAP.RfcGetFunctionDesc(hRFC, "ZTABLE_NAMES_DESC", RfcErrInf)
    if hFuncDesc != 0:
        hFunc = SAP.RfcCreateFunction(hFuncDesc, RfcErrInf)
        if hFunc != 0:
            rc = SAP.RfcSetInt(hFunc, "N",val, RfcErrInf)
            # print(SAP.RfcInvoke(hRFC, hFunc, RfcErrInf))
            if SAP.RfcInvoke(hRFC, hFunc, RfcErrInf) == RFC_OK:
       
                hTable = c_void_p(0)
                print(SAP.RfcGetTable(hFunc, "DATA", hTable, RfcErrInf))
                if SAP.RfcGetTable(hFunc, "DATA", hTable, RfcErrInf) == RFC_OK:
                    RowCount = c_ulong(0)
                rc = SAP.RfcGetRowCount(hTable, RowCount, RfcErrInf)
                print(RowCount)
                rc = SAP.RfcMoveToFirstRow(hTable, RfcErrInf)
                for i in range(0, RowCount.value):
                    hRow = SAP.RfcGetCurrentRow(hTable, RfcErrInf)
                    rc = SAP.RfcGetChars(hRow, "TAB", charBuffer, 512, RfcErrInf)
                    rc = SAP.RfcGetChars(hRow, "DESC", charBuffer1, 512, RfcErrInf)
                    # print(str(charBuffer.value))
                    # tables.append(dict(table = str(charBuffer.value).strip(),desc = str(charBuffer1.value)))
                    res.append(str(charBuffer.value) + "~" + str(charBuffer1.value)) # Print as a dictionary
                    if i < RowCount.value:
                        rc = SAP.RfcMoveToNextRow(hTable, RfcErrInf)
       
            rc = SAP.RfcDestroyFunction(hFunc, RfcErrInf)
       
        rc = SAP.RfcCloseConnection(hRFC, RfcErrInf)

        dd02l_desc.objects.all().delete()

        print("Hello Yash")
        # print(res[0][0])
        customers_to_create=[]
        for i in range(RowCount.value):
            result = res[i].split("~")
            Dd02 = dd02l_desc(
                        table = result[0],
                        description = result[1]
                    )
            
            # print(i+" "+RowCount.value)
            # break

            customers_to_create.append(Dd02)
            if i%1000 == 0:
                dd02l_desc.objects.bulk_create(customers_to_create, ignore_conflicts=True)
                customers_to_create = []
        # Customer.objects.all().delete()

        # print(tables)
        return Response(tables)
    else:
        print(RfcErrInf.key)    
        print(RfcErrInf.message)
   
    del SAP


@api_view(['GET'])
def SAPtables(request,load):

    print("Hello called Get Api")
    load = load * 50
    sorted_objects = dd02l_desc.objects.order_by('table')[:load]
    # projects = project_details.objects.all()
    serializer = DD02LSerializer(sorted_objects, many=True)
    return Response(serializer.data)
    
    
@api_view(['GET'])
def SAPTableSearch(request,tab):
    print("Hello called Get Api")


      # 1. Query for starts with
    starts_with_objects = dd02l_desc.objects.filter(table__istartswith=tab)

    # 2. Query for contains (excluding starts with to avoid duplicates)
    contains_objects = dd02l_desc.objects.filter(
        table__icontains=tab
    ).exclude(table__istartswith=tab)  # Exclude the starts_with results

    # 3. Combine and order the results
    combined_objects = (starts_with_objects.annotate(order_priority=Value(0, output_field=IntegerField()))  # starts with priority 0
                        .union(contains_objects.annotate(order_priority=Value(1, output_field=IntegerField()))) # contains priority 1
                        .order_by('order_priority', 'table')) # order by priority and then table name

    serializer = DD02LSerializer(combined_objects, many=True)
    return Response(serializer.data)



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
   
 
 
   
 
    return Response("Hii")
 
    # columns = [
    #     ("id", "INTEGER PRIMARY KEY AUTOINCREMENT"),
    #     ("productname", "TEXT")
    #     ("price", "REAL"),
    #     ("description", "TEXT"),
    #     ("is_active", "BOOLEAN"),
    #     ("created_at", "DATETIME"),
    # ]
 
    # table_name = "bala8"
 
    # create_table(columns,table_name)
 
    # data_to_insert =
    # [
    #     {
    #         "productname": "varun A"
    #         "price": 10.99,
    #         "description": "Product A description",
    #         "is_active": True,
    #         "created_at": "2024-10-29 17:00:00",
    #     },
    #     {
    #         "productname": "Product B"
    #         "price": 20.00,
    #         "description": "Product B description",
    #         "is_active": False,
    #         "created_at": "2024-10-29 18:00:00",
    #     }
    # ]
 
 
def TableName_Modification(text):

    allowed_chars = string.ascii_letters + string.digits + ' '  # Add space if needed

    # Filter out characters not in the allowed set
    cleaned_text = ''.join(char for char in text if char in allowed_chars)
    
    return re.sub(r'\s+', '_', cleaned_text)


 
# @api_view(['POST'])
def sheet_get(df,sheet_data,obj_id):


    # deleteSqlLiteTable()
 
    
    project_id = sheet_data['project_id']
    obj_name = sheet_data['obj_name']
    template_name  = sheet_data['template_name']

    # sheet = "Field List"
    # df1 = pd.read_excel(r"C:\Users\varunbalaji.gada\Downloads\excel_dmc.xls",engine="xlrd", sheet_name=sheet)
    # template_name=df1.columns[0]
    # print(template_name)
 
    # sheet = "Field List"
    # df = pd.read_excel(r"C:\Users\varunbalaji.gada\Downloads\excel_dmc.xls",engine="xlrd", sheet_name=sheet,skiprows=[0,1,2],na_filter=False)
    # print(df)

    # obj_save = {
    #     "project_id" : project_id,
    #     "obj_name" : obj_name,
    #     "template_name" : template_name
    # }
    # obj = ObjectSerializer(data=obj_save)
    # if obj.is_valid():
    #     obj_instance = obj.save()
    #     obj_id = obj_instance.obj_id
    #     # return Response(obj_id)
    # else:
    #     print("Error at Object saving")
    #     return "Error at Object saving"

    x=0
    columns = []
    # segment = "Additional Descriptions"
    group = ""
    customers_to_create=[]
    field_data = []
    for ind,i in df.iterrows():
        col = []
        data = []
        # print(i['Sheet Name'] , " : " , i['Sheet Name']!="" and i['Sheet Name'] == segment)
        if i['Sheet Name']=="":
 
            if i['SAP Field'] !="":
                col.append(i['SAP Field'])
                data.append(i['SAP Field'])
                if i['Type'].lower() == 'text':
                    col.append("TEXT")
                elif i['Type'].lower() == 'Number':
                    col.append("INTEGER")
                elif i['Type'].lower() == 'date':
                    col.append("DATE")
                elif i['Type'].lower() == 'boolean':
                    col.append("BOOLEAN")
                elif i['Type'].lower() == 'datetime':
                    col.append("DATETIME")
                else:
                    col.append("TEXT")
                columns.append(col)
                data.append(i['Field Description'])
                if i['Importance'] != "":
                    data.append("True")
                else:
                    data.append("False")
                data.append(i['SAP Structure'])
                field_data.append(data)
        else:
            # print("Columns varun : ",len(columns))
            if len(columns) == 0:
                seg_name =TableName_Modification(i['Sheet Name'])
                tab ="t"+"_"+project_id+"_"+str(obj_name)+"_"+str(seg_name)
                seg = i['Sheet Name']
                seg_obj = {
                    "project_id" : project_id,
                    "obj_id" : obj_id,
                    "segement_name":seg,
                    "table_name" : tab
                }
                seg_instance = SegementSerializer(data=seg_obj)
                if seg_instance.is_valid():
                    seg_id_get = seg_instance.save()
                    segment_id = seg_id_get.segment_id

                else:
                    return Response("Error at first segement creation")
            if len(columns) != 0:
                   

                create_table(tab,columns)
                

                for d in field_data:
                    field_obj = {
                        "project_id" : project_id,
                        "obj_id" : obj_id,
                        "segement_id" : segment_id,
                        "sap_structure" : d[3],
                        "fields" : d[0],
                        "description" : d[1],
                        "isMandatory" : d[2]
                    }
                    field_instance = FieldSerializer(data=field_obj)
                    if field_instance.is_valid():
                        field_id_get = field_instance.save()
                        field_id = field_id_get.field_id
                    else:
                        return Response("Error at Field Creation")


                seg = i['Sheet Name']
                seg_name = TableName_Modification(i['Sheet Name'])
                tab ="t"+"_"+project_id+"_"+str(obj_name)+"_"+str(seg_name)
                seg_obj = {
                    "project_id" : project_id,
                    "obj_id" : obj_id,
                    "segement_name":seg,
                    "table_name" : tab
                }
                # break
                seg_instance = SegementSerializer(data=seg_obj)
                if seg_instance.is_valid():
                    seg_id_get = seg_instance.save()
                    segment_id = seg_id_get.segment_id

                   
                else:
                    return Response("Error at segement creation")
                columns=[]
                field_data=[]
    create_table(tab,columns)
    for d in field_data:
        field_obj = {
            "project_id" : project_id,
            "obj_id" : obj_id,
            "segement_id" : segment_id,
            "sap_structure" : d[3],
            "fields" : d[0],
            "description" : d[1],
            "isMandatory" : d[2]
        }
        field_instance = FieldSerializer(data=field_obj)
        if field_instance.is_valid():
            field_id_get = field_instance.save()
            field_id = field_id_get.field_id
        else:
            return Response("Error at Field Creation")
 
    # return Response("Hello sheet")


@api_view(['GET'])
def project_dataObject(request,pid):

    connections = objects.objects.filter(project_id=pid)
    print("hii : ",connections)
    if connections:
        serializer = ObjectSerializer(connections,many=True)
        return Response(serializer.data)
    else:
        return Response(status=status.HTTP_404_NOT_FOUND)
    

@api_view(['GET'])
def DataObject_Segements(request,pid,oid):

    segment = segments.objects.filter(project_id=pid,obj_id=oid)
    if connections:
        serializer = SegementSerializer(segment,many=True)
        return Response(serializer.data)
    else:
        return Response(status=status.HTTP_404_NOT_FOUND)
    


@api_view(['GET'])
def Segements_Fields(request,pid,oid,sid):

    connections = fields.objects.filter(project_id=pid,obj_id=oid,segement_id=sid)
    print("Hiiiiiiiiiiiii : ",connections)
    
    if connections:
        serializer = FieldSerializer(connections,many=True)
        return Response(serializer.data)
    else:
        return Response(status=status.HTTP_404_NOT_FOUND)





@api_view(['POST'])
def objects_create(request):
    print("Hello called Objects Post")
    file = request.FILES['file']
    obj_name = request.data['obj_name']
    project_id = request.data['project_id']
    template_name = request.data['file_name']

    obj_data = {
        "obj_name" : obj_name,
        "project_id" : project_id,
        "template_name" : template_name
    }

    print("Heloooooooooooooo")
    obj = ObjectSerializer(data=obj_data)

    
    if objects.objects.filter(project_id=obj_data['project_id'],obj_name = obj_data['obj_name']):
        return Response(status=status.HTTP_406_NOT_ACCEPTABLE)

    if obj.is_valid():
        obj_instance=obj.save()
        objid = obj_instance.obj_id

        df = pd.read_excel(file,sheet_name="Field List",skiprows=[0,1,2],na_filter=False)
        # print(df)
        sheet_get(df,obj_data,objid)


        return Response(obj.data)
    else:
        return Response(status=status.HTTP_409_CONFLICT)

    return Response("Hello")


@api_view(['PUT'])
def objects_update(request,oid):

    print("Hello called objects update")
    # return Response("Hello")
    # print(request.data)
    

    file = request.FILES['file']
    obj_name = request.data['obj_name']
    project_id = request.data['project_id']
    template_name = request.data['file_name']

    obj_data = {
        "obj_name" : obj_name,
        "project_id" : project_id,
        "template_name" : template_name
    }

    if objects.objects.filter(obj_id=oid).exists():
        obj = objects.objects.get(obj_id=oid)
        if obj.obj_name == obj_name:

            if obj:
                
                #Deleting existing segements and tables 
                seg = segments.objects.filter(project_id=obj.project_id,obj_id=oid)
                for s in seg:
                    deleteSqlLiteTable(s.table_name)
                    # segSerializer = SegementSerializer(s)
                    # s.delete()


                #Creating new excel tables and details into segements and fields tables
                data = ObjectSerializer(instance=obj, data=obj_data)
                if data.is_valid():
                    obj_instance=data.save()
                    objid = obj_instance.obj_id

                    df = pd.read_excel(file,sheet_name="Field List",skiprows=[0,1,2],na_filter=False)
                    # print(df)
                    sheet_delete(df,obj_data,objid)
                    sheet_update(df,obj_data,objid)

                    return Response(data.data)
                else:
                    return Response(status=status.HTTP_406_NOT_ACCEPTABLE)
            else:
                return Response(status=status.HTTP_404_NOT_FOUND)



                # return Response(serializer.data,status=status.HTTP_202_ACCEPTED)
        else:
                return Response(status=status.HTTP_401_UNAUTHORIZED)
    else:
        return Response(status=status.HTTP_404_NOT_FOUND)


@api_view(['DELETE'])
def objects_delete(request,oid):
    print("Hello called object Delete")
    if objects.objects.filter(obj_id=oid).exists():
        obj = objects.objects.get(obj_id=oid)
        if obj:

            seg = segments.objects.filter(project_id=obj.project_id,obj_id=oid)
            for s in seg:
                deleteSqlLiteTable(s.table_name)
            serializer = ObjectSerializer(obj)
            obj.delete()
            return Response(serializer.data,status=status.HTTP_202_ACCEPTED)
        else:
            return Response(status=status.HTTP_404_NOT_FOUND)
    else:
        return Response(status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
def objects_get(request):
    print("Hello called object Get Api")
    obj = objects.objects.all()
    serializer = ObjectSerializer(obj, many=True)
    return Response(serializer.data)


@api_view(['POST'])
def xls_read(request):
    file = request.FILES['file']
    excel_file = pd.ExcelFile(file)
    # Get the sheet names
    sheet_names = excel_file.sheet_names
    # Print the sheet names
    # print(len(sheet_names))
    if len(sheet_names) <= 1 :
        return Response(status=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE)
    else:
        if 'Field List' in sheet_names:
            # print("Yes Iam in ...")
            df = pd.read_excel(file, sheet_name='Field List')
            
            val = df.columns[0].split(':')
            return Response(val[1])
        else:
            return Response(status=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE)


@api_view(['GET'])
def tableDelete(request):

    # lst = ['demo0','demo138','demo143','demo154','demo171','demo177','demo185','demo193','demo201'
    #        ,'demo206','demo218','demo227','demo278','demo290','demo312','demo321','demo496','demo490'
    #        ,'demo496','demo521','demo553','demo561','demo618','demo644','demo656','demo698']
    
    # for l in lst:
    deleteSqlLiteTable('demo469')
    return Response("Hello Deleted")




@api_view(['GET'])
def RuleVersions(request,pid,oid,sid):
    latest_version = Rule.objects.filter(
                project_id=pid,  # Assuming all items have the same IDs
                object_id=oid,
                segment_id=sid
            ).order_by('-version_id').first()

    # print(latest_version.version_id)
    l=[]
    if latest_version:
        for i in range(latest_version.version_id):
            l.append({'ind':i+1})
        print("Hello : ",l)
        return Response(l)
    else:
        return Response(l)
 
 
@api_view(['GET'])
def VerisonData(request,pid,oid,sid,vid):
 
    versiondata = Rule.objects.filter(
                project_id=pid,  # Assuming all items have the same IDs
                object_id=oid,
                segment_id=sid,
        version_id = vid    )

    versiondata = RuleSerializer(versiondata,many=True)
    return Response(versiondata.data)
 
    
@api_view(['POST'])
def SaveRuleCreate(request):

    data = request.data
    print("Hello called SaveRuleCreate")
    for item in data:
        # 1. Check if a record with the same criteria exists
        print("Hello : ",item)
        existing_record = SaveRule.objects.filter(
            project_id=item['project_id'],
            object_id=item['object_id'],
            segment_id=item['segment_id'],
            field_id = item['field_id']
        ).first()
        print(existing_record)


        now = timezone.now()
        formatted_datetime = now.strftime("%Y-%m-%d %H:%M:%S")  # yyyy-mm-dd hh:mm:ss
        item['last_updated_on'] = formatted_datetime

        if existing_record:
            # 2. Update existing record
            serializer = SaveRuleSerializer(existing_record, data=item, partial=True)  # partial=True for partial updates
            if serializer.is_valid():
                serializer.save()
                
                
            else:
                print(serializer.error_messages)
                return Response(status = status.HTTP_404_NOT_FOUND)

        else:
            # 3. Create a new record
            serializer = SaveRuleSerializer(data=item)
            if serializer.is_valid():
                serializer.save()
               
            else:
                print(serializer.error_messages)
                return Response(status = status.HTTP_404_NOT_FOUND)
    return Response(status = status.HTTP_200_OK)


@api_view(['GET'])
def GetSaveRule(request,pid,oid,sid):

    
    serializer = SaveRule.objects.filter(
            project_id = pid,
            object_id = oid,
            segment_id = sid
        )
    if serializer:
        rule = SaveRuleSerializer(serializer,many=True)
        return Response(rule.data,status=status.HTTP_200_OK)
    else:
        f = 10/0
        # return Response(status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
def VersionRuleCreate(request):

    print("Hello called Version create")
    data=request.data
    latest_version = Rule.objects.filter(
                project_id=data[0]['project_id'],  # Assuming all items have the same IDs
                object_id=data[0]['object_id'],
                segment_id=data[0]['segment_id']
            ).order_by('-version_id').first()
    next_version_id = 1  # Default if no previous versions
    if latest_version:
        next_version_id = latest_version.version_id + 1
    for item in data:
            item['version_id'] = next_version_id

    serializer = RuleSerializer(data=data, many=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    else:
        return Response(status=status.HTTP_404_NOT_FOUND)




def sheet_update(df,sheet_data,obj_id):
    project_id = sheet_data['project_id']
    obj_name = sheet_data['obj_name']
    template_name  = sheet_data['template_name']

    x=0
    is_seg=0
    columns = []
    # segment = "Additional Descriptions"
    group = ""
    customers_to_create=[]
    field_data = []
    for ind,i in df.iterrows():
        col = []
        data = []
        # print(i['Sheet Name'] , " : " , i['Sheet Name']!="" and i['Sheet Name'] == segment)
        if i['Sheet Name']=="":
 
            if i['SAP Field'] !="":
                col.append(i['SAP Field'])
                data.append(i['SAP Field'])
                if i['Type'].lower() == 'text':
                    col.append("TEXT")
                elif i['Type'].lower() == 'Number':
                    col.append("INTEGER")
                elif i['Type'].lower() == 'date':
                    col.append("DATE")
                elif i['Type'].lower() == 'boolean':
                    col.append("BOOLEAN")
                elif i['Type'].lower() == 'datetime':
                    col.append("DATETIME")
                else:
                    col.append("TEXT")
                columns.append(col)
                data.append(i['Field Description'])
                if i['Importance'] != "":
                    data.append("True")
                else:
                    data.append("False")
                data.append(i['SAP Structure'])
                field_data.append(data)
        else:
            # print("Columns varun : ",len(columns))
            if len(columns) == 0:
                seg_name =TableName_Modification(i['Sheet Name'])
                tab ="t"+"_"+project_id+"_"+str(obj_name)+"_"+str(seg_name)
                seg = i['Sheet Name']
                seg_obj = {
                    "project_id" : project_id,
                    "obj_id" : obj_id,
                    "segement_name":seg,
                    "table_name" : tab
                }
                seg_instance = segments.objects.filter(project_id=project_id,obj_id=obj_id)
                x=0
                for s in seg_instance:
                    if s.segement_name == seg:
                        x=1
                        is_seg=0
                        break
                if x==0:
                    seg_instanc = SegementSerializer(data=seg_obj)
                    if seg_instance.is_valid():
                        seg_id_get = seg_instanc.save()
                        segment_id = seg_id_get.segment_id
                        is_seg=1
                    else:
                        return Response("Error at first segement creation")
                else:
                    segment_id = s.segment_id
            if len(columns) != 0:
                   

                create_table(tab,columns)

                field_names = []
                for fie in columns:
                    field_names.append(fie[0])
                
                fields_in_table = fields.objects.filter(project_id=project_id,obj_id=obj_id,segement_id=segment_id)
                
                for v in fields_in_table:
                    if v.fields in field_names:
                        pass
                    else:
                        serlzr = FieldSerializer(v)
                        v.delete()
                

                # if is_seg == 1:
                for d in field_data:
                    field_obj = {
                        "project_id" : project_id,
                        "obj_id" : obj_id,
                        "segement_id" : segment_id,
                        "sap_structure" : d[3],
                        "fields" : d[0],
                        "description" : d[1],
                        "isMandatory" : d[2]
                    }
                    field_check = fields.objects.filter(project_id=project_id,obj_id=obj_id,segement_id=segment_id)
                    y=0
                    for f in field_check:
                        if f.fields == d[0]:
                            y=1
                            break
                    if y==0:
                        field_instance = FieldSerializer(data=field_obj)
                        if field_instance.is_valid():
                            field_id_get = field_instance.save()
                            field_id = field_id_get.field_id
                        else:
                            return Response("Error at Field Creation")
                    else:
                        field_obj = {
                            "field_id" : f.field_id,
                            "project_id" : project_id,
                            "obj_id" : obj_id,
                            "segement_id" : segment_id,
                            "sap_structure" : d[3],
                            "fields" : d[0],
                            "description" : d[1],
                            "isMandatory" : d[2]
                        }
                        field = fields.objects.get(field_id=f.field_id)
                        data = FieldSerializer(instance=field, data=field_obj)
                        # print("Fields : ",field_obj)
                        # print(data)
                        if data.is_valid():
                            # print("Valid field")
                            # print(data)
                            data.save()
                        else:
                            # print("Error : ",data.error_messages)
                            return Response("Error at Field Creation")


                field_inst = Rule.objects.filter(project_id=project_id,object_id=obj_id,segment_id=segment_id)
                if field_inst:
                    latest_version = Rule.objects.filter(
                        project_id=project_id,  # Assuming all items have the same IDs
                        object_id=obj_id,
                        segment_id=segment_id
                    ).order_by('-version_id').first()
                    field_inst = fields.objects.filter(project_id=project_id,obj_id=obj_id,segement_id=segment_id)
                    for fi in field_inst:
                        fields_tab = Rule.objects.filter(project_id=project_id,object_id=obj_id,segment_id=segment_id,version_id=latest_version.version_id,field_id=fi.field_id).first()
                        if fields_tab:
                            rule = {
                                "project_id" : project_id,
                                "object_id" : obj_id,
                                "segment_id" : segment_id,
                                "field_id" : fi.field_id,
                                "version_id" : latest_version.version_id+1,
                                "target_sap_table" : fi.sap_structure,
                                "target_sap_field" : fi.fields,
                                "source_table" : fields_tab.source_table,
                                "source_field_name" : fields_tab.source_field_name,
                                "data_mapping_rules": fields_tab.data_mapping_rules,
                                "text_description" : fi.description
                            }
                            sezr = RuleSerializer(data=rule)
                            if sezr.is_valid():
                                sezr.save() 
                        else:
                            rule = {
                                "project_id" : project_id,
                                "object_id" : obj_id,
                                "segment_id" : segment_id,
                                "field_id" : fi.field_id,
                                "version_id" : latest_version.version_id+1,
                                "target_sap_table" : fi.sap_structure,
                                "target_sap_field" : fi.fields,
                                "text_description" : fi.description
                            }
                            sezr = RuleSerializer(data=rule)
                            if sezr.is_valid():
                                sezr.save()       


                seg = i['Sheet Name']
                seg_name = TableName_Modification(i['Sheet Name'])
                tab ="t"+"_"+project_id+"_"+str(obj_name)+"_"+str(seg_name)
                seg_obj = {
                    "project_id" : project_id,
                    "obj_id" : obj_id,
                    "segement_name":seg,
                    "table_name" : tab
                }
                # break

                seg_instance = segments.objects.filter(project_id=project_id,obj_id=obj_id)
                x=0
                for s in seg_instance:
                    if s.segement_name == seg:
                        x=1
                        is_seg=0
                        break
                if x==0:
                    seg_instanc = SegementSerializer(data=seg_obj)
                    if seg_instanc.is_valid():
                        seg_id_get = seg_instanc.save()
                        segment_id = seg_id_get.segment_id
                        is_seg=1

                    else:
                        return Response("Error at first segement creation")
                else:
                    segment_id = s.segment_id

                columns=[]
                field_data=[]
    create_table(tab,columns)
    # if is_seg==1:

    field_names = []
    for fie in columns:
        field_names.append(fie[0])
    
    fields_in_table = fields.objects.filter(project_id=project_id,obj_id=obj_id,segement_id=segment_id)
    
    for v in fields_in_table:
        if v.fields in field_names:
            pass
        else:
            serlzr = FieldSerializer(v)
            v.delete()


    for d in field_data:
        field_obj = {
            "project_id" : project_id,
            "obj_id" : obj_id,
            "segement_id" : segment_id,
            "sap_structure" : d[3],
            "fields" : d[0],
            "description" : d[1],
            "isMandatory" : d[2]
        }
        field_check = fields.objects.filter(project_id=project_id,obj_id=obj_id,segement_id=segment_id)
        y=0
        for f in field_check:
            if f.fields == d[0]:
                y=1
                break
        if y==0:
            field_instance = FieldSerializer(data=field_obj)
            if field_instance.is_valid():
                field_id_get = field_instance.save()
                field_id = field_id_get.field_id
            else:
                return Response("Error at Field Creation")
        else:
            field_obj = {
                            "field_id" : f.field_id,
                            "project_id" : project_id,
                            "obj_id" : obj_id,
                            "segement_id" : segment_id,
                            "sap_structure" : d[3],
                            "fields" : d[0],
                            "description" : d[1],
                            "isMandatory" : d[2]
                        }
            field = fields.objects.get(field_id=f.field_id)
            # print("Fields : ", field_obj)
            data = FieldSerializer(instance=field, data=field_obj)
            if data.is_valid():
                # print("Valid data")
                data.save()
            else:
                return Response("Error at Field Creation")
    field_inst = Rule.objects.filter(project_id=project_id,object_id=obj_id,segment_id=segment_id)
    if field_inst:
        latest_version = Rule.objects.filter(
            project_id=project_id,  # Assuming all items have the same IDs
            object_id=obj_id,
            segment_id=segment_id
        ).order_by('-version_id').first()
        field_inst = fields.objects.filter(project_id=project_id,obj_id=obj_id,segement_id=segment_id)
        for fi in field_inst:
            fields_tab = Rule.objects.filter(project_id=project_id,object_id=obj_id,segment_id=segment_id,version_id=latest_version.version_id,field_id=fi.field_id).first()
            if fields_tab:
                rule = {
                    "project_id" : project_id,
                    "object_id" : obj_id,
                    "segment_id" : segment_id,
                    "field_id" : fi.field_id,
                    "version_id" : latest_version.version_id+1,
                    "target_sap_table" : fi.sap_structure,
                    "target_sap_field" : fi.fields,
                    "source_table" : fields_tab.source_table,
                    "source_field_name" : fields_tab.source_field_name,
                    "data_mapping_rules": fields_tab.data_mapping_rules,
                    "text_description" : fi.description
                }
                sezr = RuleSerializer(data=rule)
                if sezr.is_valid():
                    sezr.save() 
            else:
                rule = {
                    "project_id" : project_id,
                    "object_id" : obj_id,
                    "segment_id" : segment_id,
                    "field_id" : fi.field_id,
                    "version_id" : latest_version.version_id+1,
                    "target_sap_table" : fi.sap_structure,
                    "target_sap_field" : fi.fields,
                    "text_description" : fi.description
                }
                sezr = RuleSerializer(data=rule)
                if sezr.is_valid():
                    sezr.save()       




def sheet_delete(df,sheet_data,obj_id):


    # deleteSqlLiteTable()
    
    project_id = sheet_data['project_id']
    obj_name = sheet_data['obj_name']
    template_name  = sheet_data['template_name']

    x=0
    is_seg=0
    columns = []
    # segment = "Additional Descriptions"
    sheet_names = []
    for ind,i in df.iterrows():
        # print(i['Sheet Name'] , " : " , i['Sheet Name']!="" and i['Sheet Name'] == segment)
        if i['Sheet Name']=="":
            pass
        else:
            sheet_names.append(i['Sheet Name'])

    print("Sheets : ",sheet_names)

    segment_instance = segments.objects.filter(project_id=project_id,obj_id=obj_id)
    for s in segment_instance:
        if s.segement_name in sheet_names:
            pass
        else:
            seg_delete = SegementSerializer(s)
            s.delete()
            
    

def join_json_objects_multiple_keys(obj1, obj2, primary_keys):
    result = []

    # Create a dictionary to efficiently look up items in obj2 by combined primary keys
    obj2_lookup = {}
    for item2 in obj2:
        key = tuple(item2[key] for key in primary_keys)  # Create a tuple key
        obj2_lookup[key] = item2

    for item1 in obj1:
        key = tuple(item1[key] for key in primary_keys)
        item2 = obj2_lookup.get(key)  # Efficient lookup

        if item2:
            merged_object = {**item1, **item2}
            result.append(merged_object)
        else:
            result.append(item1)  # Keep item1 if no match
            print(f"No match found for {key}")

    return result



@api_view(['GET'])
def getSapTableData(request):
    #-Begin-----------------------------------------------------------------

#-Packages--------------------------------------------------------------


    #-Constants-------------------------------------------------------------

    #-RFC_RC - RFC return codes---------------------------------------------
    RFC_OK = 0
    RFC_COMMUNICATION_FAILURE = 1
    RFC_LOGON_FAILURE = 2
    RFC_ABAP_RUNTIME_FAILURE = 3
    RFC_ABAP_MESSAGE = 4
    RFC_ABAP_EXCEPTION = 5
    RFC_CLOSED = 6
    RFC_CANCELED = 7
    RFC_TIMEOUT = 8
    RFC_MEMORY_INSUFFICIENT = 9
    RFC_VERSION_MISMATCH = 10
    RFC_INVALID_PROTOCOL = 11
    RFC_SERIALIZATION_FAILURE = 12
    RFC_INVALID_HANDLE = 13
    RFC_RETRY = 14
    RFC_EXTERNAL_FAILURE = 15
    RFC_EXECUTED = 16
    RFC_NOT_FOUND = 17
    RFC_NOT_SUPPORTED = 18
    RFC_ILLEGAL_STATE = 19
    RFC_INVALID_PARAMETER = 20
    RFC_CODEPAGE_CONVERSION_FAILURE = 21
    RFC_CONVERSION_FAILURE = 22
    RFC_BUFFER_TOO_SMALL = 23
    RFC_TABLE_MOVE_BOF = 24
    RFC_TABLE_MOVE_EOF = 25
    RFC_START_SAPGUI_FAILURE = 26
    RFC_ABAP_CLASS_EXCEPTION = 27
    RFC_UNKNOWN_ERROR = 28
    RFC_AUTHORIZATION_FAILURE = 29

    #-RFCTYPE - RFC data types----------------------------------------------
    RFCTYPE_CHAR = 0
    RFCTYPE_DATE = 1
    RFCTYPE_BCD = 2
    RFCTYPE_TIME = 3
    RFCTYPE_BYTE = 4
    RFCTYPE_TABLE = 5
    RFCTYPE_NUM = 6
    RFCTYPE_FLOAT = 7
    RFCTYPE_INT = 8
    RFCTYPE_INT2 = 9
    RFCTYPE_INT1 = 10
    RFCTYPE_NULL = 14
    RFCTYPE_ABAPOBJECT = 16
    RFCTYPE_STRUCTURE = 17
    RFCTYPE_DECF16 = 23
    RFCTYPE_DECF34 = 24
    RFCTYPE_XMLDATA = 28
    RFCTYPE_STRING = 29
    RFCTYPE_XSTRING = 30
    RFCTYPE_BOX = 31
    RFCTYPE_GENERIC_BOX = 32

    #-RFC_UNIT_STATE - Processing status of a background unit---------------
    RFC_UNIT_NOT_FOUND = 0 
    RFC_UNIT_IN_PROCESS = 1 
    RFC_UNIT_COMMITTED = 2 
    RFC_UNIT_ROLLED_BACK = 3 
    RFC_UNIT_CONFIRMED = 4 

    #-RFC_CALL_TYPE - Type of an incoming function call---------------------
    RFC_SYNCHRONOUS = 0 
    RFC_TRANSACTIONAL = 1 
    RFC_QUEUED = 2 
    RFC_BACKGROUND_UNIT = 3 

    #-RFC_DIRECTION - Direction of a function module parameter--------------
    RFC_IMPORT = 1 
    RFC_EXPORT = 2 
    RFC_CHANGING = RFC_IMPORT + RFC_EXPORT 
    RFC_TABLES = 4 + RFC_CHANGING 

    #-RFC_CLASS_ATTRIBUTE_TYPE - Type of an ABAP object attribute-----------
    RFC_CLASS_ATTRIBUTE_INSTANCE = 0 
    RFC_CLASS_ATTRIBUTE_CLASS = 1 
    RFC_CLASS_ATTRIBUTE_CONSTANT = 2 

    #-RFC_METADATA_OBJ_TYPE - Ingroup repository----------------------------
    RFC_METADATA_FUNCTION = 0 
    RFC_METADATA_TYPE = 1 
    RFC_METADATA_CLASS = 2 


    #-Variables-------------------------------------------------------------
    ErrInf = RFC_ERROR_INFO; RfcErrInf = ErrInf()
    ConnParams = RFC_CONNECTION_PARAMETER * 5; RfcConnParams = ConnParams()
    SConParams = RFC_CONNECTION_PARAMETER * 3; RfcSConParams = SConParams()


    #-Library---------------------------------------------------------------
    # if str(platform.architecture()[0]) == "32bit":
    #   os.environ['PATH'] += ";C:\\SAPRFCSDK\\32bit"
    #   SAPNWRFC = "C:\\SAPRFCSDK\\32bit\\sapnwrfc.dll"
    # elif str(platform.architecture()[0]) == "64bit":
    #   os.environ['PATH'] += ";C:\\SAPRFCSDK\\64bit"
    #   SAPNWRFC = "C:\\SAPRFCSDK\\64bit\\sapnwrfc.dll"

    SAPNWRFC = "sapnwrfc.dll"
    SAP = windll.LoadLibrary(SAPNWRFC)

    #-Prototypes------------------------------------------------------------
    SAP.RfcAppendNewRow.argtypes = [c_void_p, POINTER(ErrInf)]
    SAP.RfcAppendNewRow.restype = c_void_p

    SAP.RfcCreateTable.argtypes = [c_void_p, POINTER(ErrInf)]
    SAP.RfcCreateTable.restype = c_void_p

    SAP.RfcCloseConnection.argtypes = [c_void_p, POINTER(ErrInf)]
    SAP.RfcCloseConnection.restype = c_ulong

    SAP.RfcCreateFunction.argtypes = [c_void_p, POINTER(ErrInf)]
    SAP.RfcCreateFunction.restype = c_void_p

    SAP.RfcCreateFunctionDesc.argtypes = [c_wchar_p, POINTER(ErrInf)]
    SAP.RfcCreateFunctionDesc.restype = c_void_p

    SAP.RfcDestroyFunction.argtypes = [c_void_p, POINTER(ErrInf)]
    SAP.RfcDestroyFunction.restype = c_ulong

    SAP.RfcDestroyFunctionDesc.argtypes = [c_void_p, POINTER(ErrInf)]
    SAP.RfcDestroyFunctionDesc.restype = c_ulong

    SAP.RfcGetChars.argtypes = [c_void_p, c_wchar_p, c_void_p, c_ulong, \
    POINTER(ErrInf)]
    SAP.RfcGetChars.restype = c_ulong

    SAP.RfcGetCurrentRow.argtypes = [c_void_p, POINTER(ErrInf)]
    SAP.RfcGetCurrentRow.restype = c_void_p

    SAP.RfcGetFunctionDesc.argtypes = [c_void_p, c_wchar_p, POINTER(ErrInf)]
    SAP.RfcGetFunctionDesc.restype = c_void_p

    SAP.RfcGetRowCount.argtypes = [c_void_p, POINTER(c_ulong), \
    POINTER(ErrInf)]
    SAP.RfcGetRowCount.restype = c_ulong

    SAP.RfcGetStructure.argtypes = [c_void_p, c_wchar_p, \
    POINTER(c_void_p), POINTER(ErrInf)]
    SAP.RfcGetStructure.restype = c_ulong

    SAP.RfcGetTable.argtypes = [c_void_p, c_wchar_p, POINTER(c_void_p), \
    POINTER(ErrInf)]
    SAP.RfcGetTable.restype = c_ulong

    SAP.RfcGetVersion.argtypes = [POINTER(c_ulong), POINTER(c_ulong), \
    POINTER(c_ulong)]
    SAP.RfcGetVersion.restype = c_wchar_p

    SAP.RfcInstallServerFunction.argtypes = [c_wchar_p, c_void_p, \
    c_void_p, POINTER(ErrInf)]
    SAP.RfcInstallServerFunction.restype = c_ulong

    SAP.RfcInvoke.argtypes = [c_void_p, c_void_p, POINTER(ErrInf)]
    SAP.RfcInvoke.restype = c_ulong

    SAP.RfcListenAndDispatch.argtypes = [c_void_p, c_ulong, POINTER(ErrInf)]
    SAP.RfcListenAndDispatch.restype = c_ulong

    SAP.RfcMoveToFirstRow.argtypes = [c_void_p, POINTER(ErrInf)]
    SAP.RfcMoveToFirstRow.restype = c_ulong

    SAP.RfcMoveToNextRow.argtypes = [c_void_p, POINTER(ErrInf)]
    SAP.RfcMoveToNextRow.restype = c_ulong

    SAP.RfcOpenConnection.argtypes = [POINTER(ConnParams), c_ulong, \
    POINTER(ErrInf)]
    SAP.RfcOpenConnection.restype = c_void_p

    SAP.RfcPing.argtypes = [c_void_p, POINTER(ErrInf)]
    SAP.RfcPing.restype = c_ulong

    SAP.RfcRegisterServer.argtypes = [POINTER(SConParams), c_ulong, \
    POINTER(ErrInf)]
    SAP.RfcRegisterServer.restype = c_void_p

    SAP.RfcSetChars.argtypes = [c_void_p, c_wchar_p, c_wchar_p, c_ulong, \
    POINTER(ErrInf)]
    SAP.RfcSetChars.restype = c_ulong
    

    #-Main------------------------------------------------------------------

    RfcConnParams[0].name = "ASHOST"; RfcConnParams[0].value = "34.194.191.113"
    RfcConnParams[1].name = "SYSNR" ; RfcConnParams[1].value = "01"
    RfcConnParams[2].name = "CLIENT"; RfcConnParams[2].value = "100"
    RfcConnParams[3].name = "USER"  ; RfcConnParams[3].value = "RAJKUMARS"
    RfcConnParams[4].name = "PASSWD"; RfcConnParams[4].value = "JaiHanuman10"

    TableName = "VBAP"
    keyFields = []
    cnt = 0

    hRFC = SAP.RfcOpenConnection(RfcConnParams, 5, RfcErrInf)
    if hRFC != None:

      charBuffer = create_unicode_buffer(1048576 + 1)

      hFuncDesc = SAP.RfcGetFunctionDesc(hRFC, "CACS_GET_TABLE_FIELD450", RfcErrInf)
      if hFuncDesc != 0:
        hFunc = SAP.RfcCreateFunction(hFuncDesc, RfcErrInf)
        if hFunc != 0:

          rc = SAP.RfcSetChars(hFunc, "I_TABNAME", TableName, \
            len(TableName), RfcErrInf)
          print(SAP.RfcInvoke(hRFC, hFunc, RfcErrInf) == RFC_OK)
          if SAP.RfcInvoke(hRFC, hFunc, RfcErrInf) == RFC_OK:

            hTable = c_void_p(0)
            if SAP.RfcGetTable(hFunc, "T_KEYFIELD", hTable, RfcErrInf) == RFC_OK:
              RowCount = c_ulong(0)
              rc = SAP.RfcGetRowCount(hTable, RowCount, RfcErrInf)
              print(RowCount, 1)
              rc = SAP.RfcMoveToFirstRow(hTable, RfcErrInf)
              for i in range(0, RowCount.value):
                hRow = SAP.RfcGetCurrentRow(hTable, RfcErrInf)
                rc = SAP.RfcGetChars(hRow, "FIELDNAME", charBuffer, 512, RfcErrInf)
                # print(str(charBuffer.value), end="    ")
                fieldName = str(charBuffer.value)
                # rc = SAP.RfcGetChars(hRow, "LENGTH", charBuffer, 512, RfcErrInf)
                # val = int(charBuffer.value)
                # if (sum + val < 512):
                #   sum += val
                #   l1.append(fieldName.strip())
                #   # print(sum)
                # else:
                keyFields.append(fieldName.strip())
                  # l1 = [fieldName.strip()]
                  # sum = val
                if i < RowCount.value:
                  rc = SAP.RfcMoveToNextRow(hTable, RfcErrInf)

          rc = SAP.RfcDestroyFunction(hFunc, RfcErrInf)

      # rc = SAP.RfcCloseConnection(hRFC, RfcErrInf)

      print(*keyFields)
      keyFieldsCnt = len(keyFields)
      print(keyFieldsCnt)
    else:
      print(RfcErrInf.key)
      print(RfcErrInf.message)


    ind, keyDict = 0, {}

    # hRFC = SAP.RfcOpenConnection(RfcConnParams, 5, RfcErrInf)
    if hRFC != None:

      charBuffer = create_unicode_buffer(1048576 + 1)

      hFuncDesc = SAP.RfcGetFunctionDesc(hRFC, "Z450RFC_READ_TABLE", RfcErrInf)
      if hFuncDesc != 0:
        hFunc = SAP.RfcCreateFunction(hFuncDesc, RfcErrInf)
        if hFunc != 0:

          rc = SAP.RfcSetChars(hFunc, "QUERY_TABLE", TableName, \
            len(TableName), RfcErrInf)
          rc = SAP.RfcSetChars(hFunc, "DELIMITER", "~", 1, RfcErrInf)
          if SAP.RfcInvoke(hRFC, hFunc, RfcErrInf) == RFC_OK:

            hTable = c_void_p(0)
            if SAP.RfcGetTable(hFunc, "FIELDS", hTable, RfcErrInf) == RFC_OK:
              
              
              sum, l, l1 = 0, [], keyFields.copy()
              keyFieldsLen = 0
              RowCount = c_ulong(0)
              rc = SAP.RfcGetRowCount(hTable, RowCount, RfcErrInf)
              print(RowCount)
              rc = SAP.RfcMoveToFirstRow(hTable, RfcErrInf)
              for i in range(0, RowCount.value):
                hRow = SAP.RfcGetCurrentRow(hTable, RfcErrInf)
                rc = SAP.RfcGetChars(hRow, "FIELDNAME", charBuffer, 512, RfcErrInf)
                # print(str(charBuffer.value), end="    ")
                fieldName = str(charBuffer.value)
                rc = SAP.RfcGetChars(hRow, "LENGTH", charBuffer, 512, RfcErrInf)
                val = int(charBuffer.value)
                cnt += 1
                # print(fieldName.strip(), cnt)
                if (i < keyFieldsCnt):
                  print(i)
                  i += 1
                  keyFieldsLen += val
                else:
                  if (sum + val + keyFieldsLen < 400):
                    sum += val
                    l1.append(fieldName.strip())
                    # print(sum)
                  else:
                    l.append(l1)
                    l1 = keyFields.copy()
                    l1.append(fieldName.strip())
                    # print(sum + keyFieldsLen)
                    sum = val
                    
                if i < RowCount.value:
                  rc = SAP.RfcMoveToNextRow(hTable, RfcErrInf)
              l.append(l1)
          rc = SAP.RfcDestroyFunction(hFunc, RfcErrInf)

      # rc = SAP.RfcCloseConnection(hRFC, RfcErrInf)

      # print(l)
    else:
      print(RfcErrInf.key)
      print(RfcErrInf.message)

    # for i in l:
    #   print(i[:2])

    length = 0
    for ii in l:
      for jj in ii:
        if (jj == 'MANDT' or jj == 'MATNR'): continue
        length += 1
    print(length)

    jsonTemp = jsonPrimary = []
    for splittedFields in l:
      # hRFC = SAP.RfcOpenConnection(RfcConnParams, 5, RfcErrInf)
      if hRFC != None:

        charBuffer = create_unicode_buffer(1048576 + 1)

        hFuncDesc = SAP.RfcGetFunctionDesc(hRFC, "Z450RFC_READ_TAB_DATA", RfcErrInf)
        if hFuncDesc != 0:
          hFunc = SAP.RfcCreateFunction(hFuncDesc, RfcErrInf)
          if hFunc != 0:

            rc = SAP.RfcSetChars(hFunc, "QUERY_TABLE", TableName, \
              len(TableName), RfcErrInf)
            rc = SAP.RfcSetChars(hFunc, "DELIMITER", "~", 1, RfcErrInf)

            #MATNR,MTART,ATTYP,SATNR,MATKL,MBRSH,MEINS,SPART,BISMT,DATAB,LIQDT,NORMT,GROES,LABOR,BRGEW,NTGEW,GEWEI,LAENG,BREIT,HOEHE,MEABM,VOLUM,VOLEH,KZKFG,IPRKZ,RAUBE,TEMPB,BEHVO,STOFF,ETIAR,ETIFO,WESCH,XGCHP,MHDHB,MHDRZ,SLED_BBD

            field = ','.join(splittedFields)
            # print(field)
            rc = SAP.RfcSetChars(hFunc, "FIELDNAME", field, len(field), RfcErrInf)

            # print(SAP.RfcInvoke(hRFC, hFunc, RfcErrInf) == RFC_OK)
            if SAP.RfcInvoke(hRFC, hFunc, RfcErrInf) == RFC_OK:

              hTable = c_void_p(0)
              if SAP.RfcGetTable(hFunc, "DATA", hTable, RfcErrInf) == RFC_OK:

                RowCount = c_ulong(0)
                rc = SAP.RfcGetRowCount(hTable, RowCount, RfcErrInf)
                rc = SAP.RfcMoveToFirstRow(hTable, RfcErrInf)
                for i in range(0, RowCount.value):
                  hRow = SAP.RfcGetCurrentRow(hTable, RfcErrInf)
                  rc = SAP.RfcGetChars(hRow, "WA", charBuffer, 1024, RfcErrInf)
                  data_row=charBuffer.value
                  # data_dict = {field: value for field, value in zip(splittedFields, data_row)}
                  # print(data_dict)

                  data_row = charBuffer.value.split("~")
    
                                    # Create dictionary using only requested fields
                                # data_dict = {field: value for field, value in zip(field, data_row)}
                                # # print(charBuffer.value)
                                # res.append(data_dict)
                  fields = field.split(",")
                  data_dict = {f: v.strip() for f, v in zip(fields, data_row)}
                  jsonTemp.append(data_dict)

                  if i < RowCount.value:
                    rc = SAP.RfcMoveToNextRow(hTable, RfcErrInf)

            rc = SAP.RfcDestroyFunction(hFunc, RfcErrInf)
        # print(jsonTemp)
        if (jsonPrimary == []): 
          jsonPrimary = jsonTemp
        else:
          jsonPrimary = join_json_objects_multiple_keys(jsonPrimary, jsonTemp, keyFields)
        jsonTemp = []
        # rc = SAP.RfcCloseConnection(hRFC, RfcErrInf)
    

      else:
        print(RfcErrInf.key)
        print(RfcErrInf.message)

    return Response(jsonPrimary)


    del SAP

    # for d in jsonPrimary:
    #   for j in d:
    #     d[j] = d[j].strip()

    # print(jsonPrimary[-1])


 
class PlotGet(APIView):
    # def post(self, request):
        # df = pd.read_csv(r"C:\Users\raj.kumar\Downloads\MARM.csv", encoding = 'latin-1')
        # figsize=(12, 6)
        # x_col = request.data['x-axis']
        # y_col = request.data['y-axis']
        # plt.figure(figsize=figsize)
        # # Scatter plot
        # sns.scatterplot(data=df, x=x_col, y=y_col, alpha=0.5)
        # # Add trend line
        # sns.regplot(data=df, x=x_col, y=y_col, scatter=False, color='red', line_kws={'linestyle': '--'})
        # plt.title(f'Relationship between {x_col} and {y_col}')
        # plt.tight_layout()
        # plt.show()
 
 
        # np.random.seed(42)
        # num_samples = 100
        # data = {
        #     'Age': np.random.randint(18, 65, size=num_samples),
        #     'Weight': np.random.normal(70, 10, size=num_samples)
        # }
        # df = pd.DataFrame(data)
 
        # # Create a scatter plot
        # plt.figure(figsize=(10, 6))
        # plt.scatter(df['Age'], df['Weight'])
        # plt.title('Scatter Plot of Age vs Weight')
        # plt.xlabel('Age (years)')
        # plt.ylabel('Weight (kg)')
        # plt.grid(True)
 
        # # Save to a BytesIO object instead of a file for direct response
        # buf = BytesIO()
        # plt.savefig(buf, format='png')
        # buf.seek(0)
       
        # # Close the plot to free memory
        # plt.close()
 
        # Return the response with the image data
        # buf.getvalue(),
        # , status=status.HTTP_200_OK
        # response = HttpResponse(buf.getvalue(), content_type='image/png')
        # response['Content-Disposition'] = 'inline; filename="scatter_plot.png"'
       
        # return response
       
       
        # sampleData = request.data
        # serializer = SampleSerializer(data = sampleData)
        # if (serializer.is_valid()):
        #     serializer.save()
        #     return Response(serializer.data)    
    plot = []
    def count_mandatory_fields(self, l, d):
        num_fields = len(l)
        cols = 2  
        rows = (num_fields + cols - 1) // cols
 
        fig, axes = plt.subplots(rows, cols, figsize=(8, 3 * rows))
        axes = axes.flatten()
 
        for i, x in enumerate(l):
            summary = pd.DataFrame({
                'Count': [d[x].count()],
                'Missing Values': [d[x].isnull().sum()]
            })
 
            ax = summary.plot(kind='bar', ax=axes[i], color=['skyblue', 'salmon'], legend=False)
            for p in ax.patches:
                ax.annotate(f'{int(p.get_height())}',
                            (p.get_x() + p.get_width() / 2., p.get_height()),
                            ha='center', va='center',
                            fontsize=12, color='black',
                            xytext=(0, 5),  # Vertical offset
                            textcoords='offset points')
 
            axes[i].set_title(f'Count of NULL values in {x}', fontsize=14)
            axes[i].set_xlabel(x, fontsize=12)
            axes[i].set_ylabel('Count', fontsize=12)
            axes[i].tick_params(axis='both', which='major', labelsize=10)
            axes[i].grid(axis='y', linestyle='--', alpha=0.7)
           
        for j in range(i + 1, len(axes)):
            fig.delaxes(axes[j])
        plt.switch_backend('agg')
        plt.tight_layout()
        mandatory = self.save_plot_to_bytes()
        self.plot.append({'mandatory': [mandatory]})
 
    def check_data(self, d1,d2):
        d=[]
        v=[]
        count=0
        x =d2['Customer']
        y= d1['Customer']
        for i in range(len(y)):
            f=0
            for j in x:
                if str(y[i])==str(j):
                    count+=1
                    f=1
                    break
            if f==1:
                f=0
                v.append(d1.loc[i])
            else:
                d.append(d1.loc[i])
        d = pd.DataFrame(d)
        v = pd.DataFrame(v)
       
        return d,v,count
 
    def graph_data(self,d1,d2,s1,s2):
        df = d1.merge(d2,on ='PRODUCT',how='inner')
        summary = pd.DataFrame({
        f'In {s2} data': [len(df)],
        f'Not in {s2} data': [len(d1)- len(df)]})
        ax = summary.plot(kind='bar', figsize=(6, 5), color=['green', 'red'])
        for p in ax.patches:
            ax.annotate(f'{int(p.get_height())}',
                        (p.get_x() + p.get_width() / 2., p.get_height()),
                        ha='center', va='center',
                        fontsize=12, color='black',
                        xytext=(0, 5),  # Vertical offset
                        textcoords='offset points')
       
        # Set plot title and labels
        plt.switch_backend('agg')
        plt.title(f'{s1} Data')
        plt.xlabel('CUSTOMER_NUMBER')
        plt.ylabel('Count')
        parent_child = self.save_plot_to_bytes()
        self.plot.append({'parent child': [parent_child]})
 
        # return JsonResponse({'plots': plots})
 
   
    # graph_data(knvv,kna1,'Sales','Customer')
 
    def get(self, request):
        self.plot = []
        # kna1 = pd.read_csv(r"c:\Users\balamurali.y\Downloads\kna1 1.csv")
        # knvv = pd.read_csv(r"c:\Users\balamurali.y\Downloads\knvv 1.csv")

        
        table_name = "t_59_Product_Additional_Descriptions"
        df=read_dynamic_table(table_name)

        table_name1= "t_59_Product_Additional_GTINs"
        df1=read_dynamic_table(table_name1)


        # mkna1 = ['PRODUCT','SPRAS','MAKTX'] # Mandatory Fields in Kna1

        rule = fields.objects.filter(project_id=59,obj_id=36,segement_id=388,isMandatory=True)
        mkna1=[]
        for r in rule:
            mkna1.append(r.fields)
        print("Mandatory Fields : ",mkna1)
        self.count_mandatory_fields(mkna1,df)
 
        self.graph_data(df,df1,'Desciptions','GTINs')
        # Generate sample data
        # np.random.seed(42)
        # data = {
        #     'Category': np.random.choice(['A', 'B', 'C'], size=100),
        #     'Values': np.random.randn(100).cumsum()
        # }
        # df = pd.DataFrame(data)
 
        # # Create multiple plots
        # plots = []
 
        # # Line plot
        # plt.figure(figsize=(10, 6))
        # sns.lineplot(data=df, x=df.index, y='Values', hue='Category')
        # plt.title('Line Plot of Cumulative Values')
        # plt.xlabel('Index')
        # plt.ylabel('Cumulative Values')
        # line_plot = self.save_plot_to_bytes()
        # plots.append({'line_plot': line_plot})
 
        # # Bar plot
        # plt.figure(figsize=(10, 6))
        # sns.barplot(data=df, x='Category', y='Values', estimator=np.mean)
        # plt.title('Bar Plot of Average Values by Category')
        # plt.xlabel('Category')
        # plt.ylabel('Average Values')
        # bar_plot = self.save_plot_to_bytes()
        # plots.append({'bar_plot': bar_plot})
 
        # # Histogram
        # plt.figure(figsize=(10, 6))
        # sns.histplot(df['Values'], bins=20, kde=True)
        # plt.title('Histogram of Values with KDE')
        # plt.xlabel('Values')
        # plt.ylabel('Frequency')
        # histogram = self.save_plot_to_bytes()
        # plots.append({'histogram': histogram})
 
        return JsonResponse({'plots': self.plot})
 
    def save_plot_to_bytes(self):
        """Save the current plot to a BytesIO object and return it."""
        buf = BytesIO()
        plt.savefig(buf, format='png')
        buf.seek(0)  # rewind the buffer to the beginning
        plt.close()  # close the plot to free memory
        return buf.getvalue().decode('latin1')  # encode for
 
 

@api_view(['GET'])
def insertDatatoDynamicTables(request):

    sam = [
        {
        "PRODUCT" : "5000"
        },

    ]
    df = pd.DataFrame(sam)
    print(df)

    insert_data_from_dataframe(df, "t_59_Product_Additional_Descriptions")



    return Response("Hello yash")

    
from django.db import connection
 
def read_dynamic_table(table_name):
    with connection.cursor() as cursor:

        cursor.execute(f"SELECT * FROM {table_name}")  # NEVER do this directly with user input!
        rows = cursor.fetchall()
        # Get column names (if needed):
        columns = [col[0] for col in cursor.description]
        print(columns)
        print(rows)
        df = pd.DataFrame.from_records(rows, columns=columns) # Efficient DataFrame creation

        # print(df)
        return df 


