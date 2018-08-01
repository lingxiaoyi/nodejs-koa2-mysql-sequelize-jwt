const userModel = require('../model/user');
const jwt = require('jsonwebtoken');
const secret = require('../config/secret');
const bcrypt = require('bcryptjs');
const util = require('util')
const verify = util.promisify(jwt.verify)
const APIError = require('../util/rest').APIError
class StringUtils {
    /**
     * 验证用户名 用户名首个字符为字母,包含._数字 字母
     * @param username
     * @returns {<boolean>}
     */
    static checkUsername(username) {
        let reg = /^[a-zA-Z]{1}([a-zA-Z0-9]|[._]){4,19}$/
        return reg.test(username)
    }
    /**
     * 验证密码 密码同时包含数字和字母
     * @param password
     * @returns {<boolean>}
     */
    static checkPwd(password) {
        let reg =/^(?!([a-zA-Z]+|\d+)$)[a-zA-Z\d]{6,20}$/
        return reg.test(password)
    }
}
let UserController = {
    /**
     * 注册
     * @param ctx
     * @returns {Promise.<void>}
     */
    'post /api/v1/user': async (ctx) => {
        const user = ctx.request.body
        if(!patrn.test(user.username)){
            throw new APIError('username_format_error', '用户名格式不对')
        }
        if(!regx.test(user.password)){
            throw new APIError('password_format_error', '密码格式不对')
        }
        if (user.username && user.password) {
            // 查询用户名是否重复
            const existUser = await userModel.findUserByName(user.username)

            if (existUser) {
                // 反馈存在用户名
                throw new APIError('username_exists', '此用户已经存在')
            } else {

                // 加密密码
                const salt = bcrypt.genSaltSync();
                const hash = bcrypt.hashSync(user.password, salt);
                user.password = hash;

                // 创建用户
                await userModel.create(user);
                const newUser = await userModel.findUserByName(user.username)

                // 签发token
                const userToken = {
                    username: newUser.username,
                    id: newUser.id
                }
                // 储存token失效有效期1小时
                const token = jwt.sign(userToken, secret.sign, {expiresIn: '1h'});
                ctx.cookies.set('token', token, {
                        domain: '172.20.6.219',  // 写cookie所在的域名
                        path: '/',       // 写cookie所在的路径
                        maxAge: 10 * 60 * 1000, // cookie有效时长
                        expires: new Date('2018-02-15'),  // cookie失效时间
                        httpOnly: false,  // 是否只用于http请求中获取
                        overwrite: false  // 是否允许重写
                    }
                )
                let data = {
                    token
                }
                ctx.rest(data)
            }
        }
    },
    /**
     * 登录
     * @param ctx
     * @returns {Promise<void>}
     */
    'post /api/v1/user/login': async (ctx) => {
        const data = ctx.request.body
        // 查询用户
        const user = await userModel.findUserByName(data.username)
        // 判断用户是否存在
        if (user) {
            // 判断前端传递的用户密码是否与数据库密码一致
            if (bcrypt.compareSync(data.password, user.password)) {
                // 用户token
                const userToken = {
                    username: user.username,
                    id: user.id
                }
                // 签发token
                const token = jwt.sign(userToken, secret.sign, {expiresIn: '1h'})
                let data = {
                    id: user.id,
                    username: user.username,
                    token: token
                }
                ctx.rest(data)
            } else {
                throw new APIError('error', '用户名或密码错误')
            }
        } else {
            throw new APIError('error', '此用户名不存在')
        }
    },
    /**
     * 查询用户信息
     * @param ctx
     * @returns {Promise<void>}
     */
    'get /api/v1/user': async (ctx) => {
        // 获取jwt
        const token = ctx.header.authorization;
        if (token) {
            let payload
            try {
                // 解密payload，获取用户名和ID1
                payload = await verify(token.split(' ')[1], secret.sign)
                const user = {
                    id: payload.id,
                    username: payload.username,
                }
                ctx.rest(user)
            } catch (err) {
                throw new APIError('authorization error', '查询失败!')
            }
        } else {
            throw new APIError('authorization not find', 'token值为空')
        }
    },
    /**
     * 删除用户
     * @param ctx
     * @returns {Promise<void>}
     */
    'delete /api/v1/user/:id': async (ctx) => {
        let id = ctx.params.id;

        if (id && !isNaN(id)) {
            await userModel.delete(id);

            ctx.response.status = 200;
            ctx.body = statusCode.SUCCESS_200('删除用户成功')
        } else {

            ctx.response.status = 412;
            ctx.body = statusCode.ERROR_412('用户ID必须传')
        }
    },
    /**
     * 获取用户列表
     * @param ctx
     * @returns {Promise<void>}
     */
    'get /api/v1/user/list': async (ctx) => {
        let userList = ctx.request.body;

        if (userList) {
            const data = await userModel.findAllUserList();
            ctx.rest(data)
        } else {
            throw new APIError('username_exists', '用户已经存在')
        }
    },
}
module.exports = UserController