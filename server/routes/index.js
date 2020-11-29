const router = require('@koa/router')()
router.prefix('/api/admin')
const WeixinAuth = require('../middlewares/koa2-weixin-auth')
let WXBizDataCrypt = require('../lib/WXBizDataCrypt');
const jsonwebtoken = require('jsonwebtoken')

const AppID = 'wx7884e3fd54e3bf98'
const AppSecret= '5862d91d01fe030d10858ed491d4156e'
const weixinAuth= new WeixinAuth(AppID, AppSecret)
const JET_SECRET = 'JETSECRET'


// test
router.get('/test', async (ctx, next) => {
    // let response = ctx.request.body
    ctx.body = { 'success': 'true', 'data': {name:"111",age:"222"} }
})

// 登录
router.post('/login',async(ctx, next)=>{
    ctx.body = {
        "data": {
            "id": 1, 
            "isDel": 0, 
            "createdAt": "2020-11-02T15:16:08.888Z", 
            "updatedAt": "2020-11-02T15:16:08.888Z", 
            "username": "admin", 
            "platform": null, 
            "isSuper": 1, 
            "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJhZG1pbiIsImlzU3VwZXIiOjEsImlhdCI6MTYwNjQ2NDMwNywiZXhwIjoxNjA3MDY5MTA3fQ.zktRNC3IRsTRWcnVwz_hHmDnhhIbWQVRX7fXD-4Wlbs"
        }, 
        "code": 200, 
        "message": "请求成功"
    }
})

// 退出
router.get('/logout',async(ctx, next)=>{
    ctx.body = {
        "data": null, 
        "code": 200, 
        "message": "请求成功"
    }
})


// 请求菜单
router.post('/menus',async(ctx, next)=>{
    ctx.body = {
        "data": [
            {
                "id": 18, 
                "url": "test", 
                "sort": 1, 
                "icon": "icon-BUG", 
                "parentId": -1, 
                "name": "测试模块"
            }, 
            {
                "id": 19, 
                "url": "test/01", 
                "sort": 1, 
                "icon": "icon-zujianshiyong", 
                "parentId": 18, 
                "name": "测试3"
            }, 
            {
                "id": 29, 
                "url": "test/03", 
                "sort": 1, 
                "icon": "icon-zujianshiyong", 
                "parentId": 19, 
                "name": "测试3----1"
            },
            {
                "id": 30, 
                "url": "test/04", 
                "sort": 1, 
                "icon": "icon-zujianshiyong", 
                "parentId": 19, 
                "name": "测试3----2"
            }, 
            {
                "id": 20, 
                "url": "test/02", 
                "sort": 1, 
                "icon": "icon-zujianshiyong", 
                "parentId": 18, 
                "name": "测试02"
            }, 
            {
                "id": 31, 
                "url": "test/05", 
                "sort": 1, 
                "icon": "icon-zujianshiyong", 
                "parentId": 20, 
                "name": "测试2----1"
            }, 
            {
                "id": 2, 
                "url": "system/account", 
                "sort": 3, 
                "icon": "icon-kehuguanli", 
                "parentId": 1, 
                "name": "账号管理"
            }, 
            {
                "id": 3, 
                "url": "/system/role", 
                "sort": 3, 
                "icon": "icon-yonghu", 
                "parentId": 1, 
                "name": "角色管理"
            }, 
            {
                "id": 27, 
                "url": "222", 
                "sort": 4, 
                "icon": "icon-zhuxingtu", 
                "parentId": 1, 
                "name": "2222"
            }, 
            {
                "id": 4, 
                "url": "system/access", 
                "sort": 5, 
                "icon": "icon-ziyuan", 
                "parentId": 1, 
                "name": "菜单管理"
            }, 
            {
                "id": 1, 
                "url": "system", 
                "sort": 6, 
                "icon": "icon-shezhi", 
                "parentId": -1, 
                "name": "系统管理"
            }, 
            {
                "id": 5, 
                "url": "system/dict", 
                "sort": 6, 
                "icon": "icon-ziduanguanli", 
                "parentId": 1, 
                "name": "字典管理"
            }
        ], 
        "code": 200, 
        "message": "请求成功"
    }
})


// 账户管理
router.get('/account',async(ctx, next)=>{
    ctx.body ={
        "result": {
            "data": [
                {
                    "id": 37, 
                    "isDel": 0, 
                    "createdAt": "2020-11-26T14:26:52.696Z", 
                    "updatedAt": "2020-11-26T15:53:57.000Z", 
                    "platform": null, 
                    "isSuper": 0, 
                    "roles": [
                        {
                            "id": 2, 
                            "createdAt": "2020-11-11T14:31:52.024Z", 
                            "updatedAt": "2020-11-27T09:24:40.000Z", 
                            "title": "系统审计员", 
                            "description": "这是一个系统审计员"
                        }, 
                        {
                            "id": 13, 
                            "createdAt": "2020-11-26T06:28:06.454Z", 
                            "updatedAt": "2020-11-26T06:28:06.454Z", 
                            "title": "草帽团", 
                            "description": "草帽海贼团"
                        }
                    ], 
                    "platformDict": null, 
                    "username": "路飞"
                }, 
                {
                    "id": 36, 
                    "isDel": 0, 
                    "createdAt": "2020-11-25T10:03:25.838Z", 
                    "updatedAt": "2020-11-25T10:03:25.838Z", 
                    "platform": null, 
                    "isSuper": 0, 
                    "roles": [
                        {
                            "id": 3, 
                            "createdAt": "2020-11-11T14:32:40.512Z", 
                            "updatedAt": "2020-11-17T01:26:59.000Z", 
                            "title": "系统管理员", 
                            "description": "系统管理员。"
                        }
                    ], 
                    "platformDict": null, 
                    "username": "test"
                }, 
                {
                    "id": 22, 
                    "isDel": 0, 
                    "createdAt": "2020-11-16T10:26:13.376Z", 
                    "updatedAt": "2020-11-26T14:22:21.000Z", 
                    "platform": null, 
                    "isSuper": 0, 
                    "roles": [
                        {
                            "id": 2, 
                            "createdAt": "2020-11-11T14:31:52.024Z", 
                            "updatedAt": "2020-11-27T09:24:40.000Z", 
                            "title": "系统审计员", 
                            "description": "这是一个系统审计员"
                        }, 
                        {
                            "id": 13, 
                            "createdAt": "2020-11-26T06:28:06.454Z", 
                            "updatedAt": "2020-11-26T06:28:06.454Z", 
                            "title": "草帽团", 
                            "description": "草帽海贼团"
                        }
                    ], 
                    "platformDict": null, 
                    "username": "wowo"
                }, 
                {
                    "id": 21, 
                    "isDel": 0, 
                    "createdAt": "2020-11-16T10:25:41.446Z", 
                    "updatedAt": "2020-11-16T10:25:41.446Z", 
                    "platform": null, 
                    "isSuper": 0, 
                    "roles": [
                        {
                            "id": 2, 
                            "createdAt": "2020-11-11T14:31:52.024Z", 
                            "updatedAt": "2020-11-27T09:24:40.000Z", 
                            "title": "系统审计员", 
                            "description": "这是一个系统审计员"
                        }
                    ], 
                    "platformDict": null, 
                    "username": "788"
                }, 
                {
                    "id": 20, 
                    "isDel": 0, 
                    "createdAt": "2020-11-16T09:57:06.225Z", 
                    "updatedAt": "2020-11-16T09:57:06.225Z", 
                    "platform": null, 
                    "isSuper": 0, 
                    "roles": [
                        {
                            "id": 2, 
                            "createdAt": "2020-11-11T14:31:52.024Z", 
                            "updatedAt": "2020-11-27T09:24:40.000Z", 
                            "title": "系统审计员", 
                            "description": "这是一个系统审计员"
                        }, 
                        {
                            "id": 3, 
                            "createdAt": "2020-11-11T14:32:40.512Z", 
                            "updatedAt": "2020-11-17T01:26:59.000Z", 
                            "title": "系统管理员", 
                            "description": "系统管理员。"
                        }
                    ], 
                    "platformDict": null, 
                    "username": "123123"
                }, 
                {
                    "id": 10, 
                    "isDel": 0, 
                    "createdAt": "2020-11-13T16:14:13.721Z", 
                    "updatedAt": "2020-11-13T16:14:13.721Z", 
                    "platform": null, 
                    "isSuper": 0, 
                    "roles": [
                        {
                            "id": 2, 
                            "createdAt": "2020-11-11T14:31:52.024Z", 
                            "updatedAt": "2020-11-27T09:24:40.000Z", 
                            "title": "系统审计员", 
                            "description": "这是一个系统审计员"
                        }
                    ], 
                    "platformDict": null, 
                    "username": "666"
                }
            ], 
            "total": 6, 
            "pageNumber": 1, 
            "pageSize": 10
        }, 
        "code": 200, 
        "message": "请求成功"
    }
})


// 角色管理
router.get('/role',async(ctx, next)=>{
    ctx.body = {
        "data": {
            "data": [
                {
                    "id": 2, 
                    "createdAt": "2020-11-11T14:31:52.024Z", 
                    "updatedAt": "2020-11-27T09:24:40.000Z", 
                    "title": "系统审计员", 
                    "description": "这是一个系统审计员"
                }, 
                {
                    "id": 3, 
                    "createdAt": "2020-11-11T14:32:40.512Z", 
                    "updatedAt": "2020-11-17T01:26:59.000Z", 
                    "title": "系统管理员", 
                    "description": "系统管理员。"
                }, 
                {
                    "id": 13, 
                    "createdAt": "2020-11-26T06:28:06.454Z", 
                    "updatedAt": "2020-11-26T06:28:06.454Z", 
                    "title": "草帽团", 
                    "description": "草帽海贼团"
                }
            ], 
            "total": 3, 
            "pageNumber": 1, 
            "pageSize": 10
        }, 
        "code": 200, 
        "message": "请求成功"
    }
})

// 菜单管理
router.get('/access',async(ctx, next)=>{
    ctx.body ={
        "data": {
            "data": [
                {
                    "id": 18, 
                    "isDel": 0, 
                    "createdAt": "2020-11-16T03:24:06.558Z", 
                    "updatedAt": "2020-11-16T05:30:49.000Z", 
                    "moduleName": "测试模块", 
                    "actionName": "", 
                    "icon": "icon-BUG", 
                    "url": "test", 
                    "moduleId": -1, 
                    "sort": 1, 
                    "description": null, 
                    "children": true
                }, 
                {
                    "id": 1, 
                    "isDel": 0, 
                    "createdAt": "2020-11-02T15:16:08.891Z", 
                    "updatedAt": "2020-11-19T06:21:39.000Z", 
                    "moduleName": "系统管理", 
                    "actionName": "", 
                    "icon": "icon-shezhi", 
                    "url": "system", 
                    "moduleId": -1, 
                    "sort": 6, 
                    "description": null, 
                    "children": true
                }
            ], 
            "total": 2, 
            "pageNumber": 1, 
            "pageSize": 10
        }, 
        "code": 200, 
        "message": "请求成功"
    }
})

// 字典管理
router.get('/dict_config',async(ctx, next)=>{
    ctx.body = {
        "data": {
            "data": [
                {
                    "id": 12, 
                    "createdAt": "2020-11-26T06:24:18.785Z", 
                    "updatedAt": "2020-11-26T06:24:18.785Z", 
                    "label": "ff", 
                    "category": "gg", 
                    "description": "gg"
                }, 
                {
                    "id": 11, 
                    "createdAt": "2020-11-25T06:04:45.901Z", 
                    "updatedAt": "2020-11-25T06:04:45.901Z", 
                    "label": "111", 
                    "category": "11", 
                    "description": "11"
                }, 
                {
                    "id": 10, 
                    "createdAt": "2020-11-25T06:04:38.079Z", 
                    "updatedAt": "2020-11-25T06:04:38.079Z", 
                    "label": "324", 
                    "category": "23432", 
                    "description": "4"
                }, 
                {
                    "id": 9, 
                    "createdAt": "2020-11-24T07:00:15.720Z", 
                    "updatedAt": "2020-11-24T07:00:15.720Z", 
                    "label": "tt", 
                    "category": "22", 
                    "description": "333"
                }, 
                {
                    "id": 8, 
                    "createdAt": "2020-11-24T01:30:33.656Z", 
                    "updatedAt": "2020-11-24T01:30:33.656Z", 
                    "label": "ii", 
                    "category": "1", 
                    "description": ""
                }, 
                {
                    "id": 7, 
                    "createdAt": "2020-11-23T13:06:38.453Z", 
                    "updatedAt": "2020-11-23T13:06:54.000Z", 
                    "label": "55577", 
                    "category": "1", 
                    "description": "5555"
                }, 
                {
                    "id": 6, 
                    "createdAt": "2020-11-20T10:37:02.813Z", 
                    "updatedAt": "2020-11-20T10:37:02.813Z", 
                    "label": "a", 
                    "category": "哈哈", 
                    "description": ""
                }, 
                {
                    "id": 5, 
                    "createdAt": "2020-11-19T15:00:12.439Z", 
                    "updatedAt": "2020-11-19T15:00:12.439Z", 
                    "label": "6", 
                    "category": "6", 
                    "description": "6"
                }, 
                {
                    "id": 4, 
                    "createdAt": "2020-11-19T14:54:00.140Z", 
                    "updatedAt": "2020-11-19T14:54:00.140Z", 
                    "label": "6", 
                    "category": "6", 
                    "description": "6"
                }, 
                {
                    "id": 3, 
                    "createdAt": "2020-11-15T11:27:36.543Z", 
                    "updatedAt": "2020-11-19T14:53:50.000Z", 
                    "label": "6", 
                    "category": "6", 
                    "description": "66"
                }
            ], 
            "total": 12, 
            "pageNumber": 1, 
            "pageSize": 10
        }, 
        "code": 200, 
        "message": "请求成功"
    }
})


module.exports = router