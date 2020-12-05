import { request } from '/@/utils/api.request'

/**-------------------------------用户------------------------------- */
// 查询用户列表
export const getUserPage = (data) => request.post('/sysUser/getUserPage', data)

// 新增用户
export const saveUser = (data) => request.post('/sysUser/saveUser', data)

// 修改用户信息
// {
//     "account": "string",
//     "avatar": "string",
//     "birthday": "2020-12-04T08:50:39.189Z",
//     "createTime": "2020-12-04T08:50:39.189Z",
//     "createUser": "string",
//     "email": "string",
//     "isDisable": "string",
//     "menuList": [
//       {
//         "component": "string",
//         "createTime": "2020-12-04T08:50:39.189Z",
//         "createUser": "string",
//         "hidden": "string",
//         "icon": "string",
//         "isDisable": "string",
//         "menuId": 0,
//         "menuLevel": 0,
//         "menuPath": "string",
//         "menuType": "string",
//         "name": "string",
//         "noCache": "string",
//         "parentId": 0,
//         "priority": 0,
//         "redirect": "string",
//         "status": "string",
//         "title": "string",
//         "updateTime": "2020-12-04T08:50:39.189Z",
//         "updateUser": "string",
//         "version": 0
//       }
//     ],
//     "name": "string",
//     "organizationId": "string",
//     "organizationName": "string",
//     "password": "string",
//     "phone": "string",
//     "roleId": "string",
//     "roles": [
//       {
//         "createTime": "2020-12-04T08:50:39.190Z",
//         "createUser": "string",
//         "isDisable": "string",
//         "roleCode": "string",
//         "roleId": "string",
//         "roleName": "string",
//         "sort": 0,
//         "updateTime": "2020-12-04T08:50:39.190Z",
//         "updateUser": "string",
//         "version": 0
//       }
//     ],
//     "salt": "string",
//     "sex": "string",
//     "status": "string",
//     "updateTime": "2020-12-04T08:50:39.190Z",
//     "updateUser": "string",
//     "userId": "string",
//     "version": 0
//   }
export const updateUser = (data) => request.post('/sysUser/updateUser', data)

// 根据id查询用户信息
export const getUser = (data) => request.get('/sysUser/getUser', data)

// 删除用户信息
export const deleteUser = (data) => request.post('/sysUser/deleteUser', data)

// 批量删除用户信息
export const deleteUsers = (data) => request.post('/sysUser/deleteUsers', data)


/**-------------------------------角色------------------------------- */
// 删除角色信息
export const deleteRole = (data) => request.post('/sysRole/deleteRole', data)

// 批量删除用户信息
export const deleteRoles = (data) => request.post('/sysRole/deleteRoles', data)

// 根据id查询角色信息
export const getRole = (data) => request.get('/sysRole/getRole', data)

// 查询角色列表
// {
//     "createTime": "2020-12-04T08:54:33.626Z",
//     "createUser": "string",
//     "isDisable": "string",
//     "roleCode": "string",
//     "roleId": "string",
//     "roleName": "string",
//     "sort": 0,
//     "updateTime": "2020-12-04T08:54:33.626Z",
//     "updateUser": "string",
//     "version": 0
//   }
export const getRolePage = (data) => request.post('/sysRole/getRolePage', data)

// 新增角色
export const saveRole = (data) => request.post('/sysRole/saveRole', data)

// 修改角色信息
export const updateRole = (data) => request.post('/sysRole/updateRole', data)


/**-------------------------------菜单------------------------------- */
// 新增菜单
export const addMenu = (data) => request.post('/menu/add', data)

// 修改菜单
export const updateMenu = (data) => request.post('/menu/update', data)

// 删除菜单
export const deleteMenu = (menuId) => request.get(`/menu/delete/${menuId}`)

// 查询菜单详情
export const getMenu = (menuId) => request.get(`/menu/detail/${menuId}`)


/**-------------------------------字典------------------------------- */
/* 新增字典项
{
    "dicCode": "string",
    "dicValue": "string",
    "parentCode": "string",
    "priority": 0
  }
*/
export const addDictionary = (data) => request.post('/dictionary/add', data)

// 删除字典项
export const deleteDictionary = (id) => request.get(`/dictionary/delete/${id}`)

/* 查询字典项详情
{
    "dicCode": "string",
    "dicValue": "string",
    "isDisable": "string",
    "parentCode": "string",
    "priority": 0
}
*/
export const getDictionaryDetail = (id) => request.get(`/dictionary/detail/${id}`)

// 按条件查询字典项
export const getDictionary = (data) => request.post('/dictionary/list', data)

// 修改字典项
export const updateDictionary = (data) => request.post('/dictionary/update', data)



/**--------------- */

// 获取菜单资源
export const getAccess = () => request.get('/sys/role_access')

// 获取权限菜单
export const getRoleAccess = (id) => request.get(`/sys/access/${id}`)