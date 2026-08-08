import request from '@/utils/request'

//export const 函数名 = (参数) => request.方法(url,参数)

export const queryempjobdataApi = (empjobdata) => request.get('/report/empJobData')

export const queryempgenderdataApi = (empgenderdata) => request.get('/report/empGenderData')

export const querystudentcountdata = (studentcountdata) => request.get('/report/studentCountData')

export const querystudentdegreedata = (studentdegreedata) => request.get('/report/studentDegreeData')
