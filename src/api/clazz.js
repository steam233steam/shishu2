import request from "@/utils/request"

// export const queryPageApi = (name,begin,end,page,pageSize) => 
// request.get(`/clazzs?name=${name}&begin=${begin}&end=${end}&page=${page}&pageSize=${pageSize}`)

export const queryPageApi = (params) =>
request.get('/clazzs', { params })
export const addApi = () =>  request.post('/clazzs', clazz)

export const queryInfoApi = (id) =>  request.get(`/clazzs/${id}`)

export const updateApi = (clazz) =>  request.put('/clazzs', clazz)

export const deleteApi = (id) =>  request.delete(`/clazzs/${id}`)

export const queryAllApi = () => request.get('/clazzs/list')