const jwt = require('jsonwebtoken')
const secret = require('../config/secret')
const util = require('util')
const verify = util.promisify(jwt.verify)
const APIError = require('../util/rest').APIError
const {UserModel} = require('../model/index')
/**
 * 判断token是否可用
 */
module.exports = function() {
    return async function(ctx, next) {
        try {
            const token = ctx.header.authorization // 获取jwt
            if (token) {
                let payload
                try {
                    // 解密payload，获取用户名和ID
                    payload = await verify(token.split(' ')[1], secret.sign)
                    //将用户信息放到ctx.user
                    let data = await UserModel.findUser(payload.id)
                    if (data.state === 3) {
                        ctx.body = new APIError('user_error', '用户被拉黑')
                        return
                    }
                    ctx.user = {
                        nickname: payload.nickname,
                        headImg: payload.headImg,
                        id: payload.id,
                    }
                    console.log(2222222222)
                    await next()
                } catch (err) {
                    //token过期,解析不了报错
                    ctx.status = 200
                    ctx.body = new APIError('token verify fail', '身份信息验证错误,请重新登陆')
                }
            } else {
                await next()
            }
        } catch (err) {
            if (err.status === 401) {
                ctx.status = 200
                ctx.body = new APIError('Error', '请求需要用户的身份认证！')
            } else {
                err.status = 200
                ctx.body = new APIError('exit，不存在的用户')
            }
        }
    }
}
