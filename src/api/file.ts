import { request } from '/@/utils/api.request'

/**-------------------------------附件相关------------------------------- */
// 文件上传
export const uploadAttachFile = (data) => request.post('/attachFile/upload', data)

// 删除附件
export const deleteMenuList = (id) => request.post(`/attachFile/delete/${id}`)

// 文件下载
export const getMenuList = (id) => request.post(`/attachFile/get/${id}`)

