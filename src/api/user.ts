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

export const login = (data) => request.post('/sys/login', data)

export const logout = (data) => request.get('/sys/logout', data)

export const getUserInfo = (data) => request.post('/sys/test', data)

export const test = (data) => request.get('/sys/test', data)

