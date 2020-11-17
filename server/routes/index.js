const router = require('@koa/router')()
router.prefix('/user')
const WeixinAuth = require('../middlewares/koa2-weixin-auth')
let WXBizDataCrypt = require('../lib/WXBizDataCrypt');
const jsonwebtoken = require('jsonwebtoken')

const AppID = 'wx7884e3fd54e3bf98'
const AppSecret= '5862d91d01fe030d10858ed491d4156e'
const weixinAuth= new WeixinAuth(AppID, AppSecret)
const JET_SECRET = 'JETSECRET'

// web-view h5 测试
router.get('/home', async (ctx, next) => {
    ctx.body = { 'success': 'true', 'result': {name:"111",age:"222"} }
})

// test
router.get('/test', async (ctx, next) => {
    // let response = ctx.request.body
    ctx.body = { 'success': 'true', 'result': {name:"111",age:"222"} }
})

// 第一次小程序登录
router.post('/weixin-login1', async (ctx) => {
    console.log('2222222222')
    let { code, userInfo, encryptedData, iv } = ctx.request.body
    console.log(code)
    const token = await weixinAuth.getAccessToken(code)
    const sessionKey = token.data.session_key
    // const openId = token.data.openid
    // console.log('token', token)
    // const useeinfo = await weixinAuth.getUser(openId) // 使用openId和accessToken去获取用户信息
    // console.log('useeinfo', useeinfo)

    // 用这个组件进行解密，把openId解密出来
    let pc = new WXBizDataCrypt(AppID, sessionKey) 
    let decryptedUserInfo = pc.decryptData(encryptedData , iv);
    console.log('解密后：', decryptedUserInfo)

    console.log('解密后的openId：', decryptedUserInfo.openId)

    let authorizationToken = jsonwebtoken.sign(
        {name: decryptedUserInfo.nicName},
        JET_SECRET,
        {expiresIn: '1d'}
    )
    Object.assign(decryptedUserInfo, {authorizationToken})

    ctx.status = 200
    ctx.body = {
        code: 200,
        msg: 'ok',
        data : decryptedUserInfo
    }
})


module.exports = router