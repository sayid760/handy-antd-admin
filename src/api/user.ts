import { request } from '/@/utils/api.request'

// export const login = ({ account, password }) => {
//   return axios.request({
//     url: '/admin/login',
//     data: {account: account, password },
//     method: 'post'
//   })
// }

// export const logout = ({ account, password }) => {
//   return axios.request({
//     url: '/admin/login',
//     data: {account: account, password },
//     method: 'post'
//   })
// }

// export const getUserInfo = (token) => {
//   return axios.request({
//     url: 'get_info',
//     params: {
//       token
//     },
//     method: 'get'
//   })
// }

// export const test = (token) => {
//   return axios.request({
//     url: '/admin/test',
//     // params: {
//     //   token
//     // },
//     method: 'get'
//   })
// }

export const login = (data) => request.post('/admin/login', data)

export const logout = (data) => request.get('/admin/logout', data)

export const getUserInfo = (data) => request.post('/admin/test', data)

export const test = (data) => request.get('/admin/test', data)

