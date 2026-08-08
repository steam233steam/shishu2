import request from '@/utils/request'

// export const queryPageApi = (name,degree,classId,page,pageSize) => 
// request.get(`/students?name=${name}&degree=${degree}&classId=${classId}&page=${page}&pageSize=${pageSize}`)

export const queryPageApi = (params) => {
  return request({
    url: '/students', // 替换为你实际的后端接口地址
    method: 'get',
    params: params // 这里必须直接传对象，后端会自动映射到 studentqueryparam
  })
}
//新增
export const addApi = (student) =>  request.post('/students', student);

//根据ID查询
export const queryInfoApi = (id) =>  request.get(`/students/${id}`);

//修改
export const updateApi = (student) =>  request.put('/students', student);

//删除(批量)
export const deleteApi = (ids) =>  request.delete(`/students?ids=${ids}`);

//违纪处理
export const updatebyscoreApi = (id,score) => request.put(`/students/violation/${id}/${score}`)