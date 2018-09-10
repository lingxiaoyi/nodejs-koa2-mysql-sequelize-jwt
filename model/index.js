const db = require('../config/db')
const Sequelize = db.sequelize
const User = Sequelize.import('../schema/user.js')
const UserInfo = Sequelize.import('../schema/user_info.js')
const UserCheckin = Sequelize.import('../schema/user_checkin.js')
const Role = Sequelize.import('../schema/role.js')
const Article = Sequelize.import('../schema/article.js')
const sequelize = require('sequelize')
const UserRoles = Sequelize.define('userroles', {
    userId: {
        type: sequelize.INTEGER(11),
        allowNull: false,
        primaryKey: true
    },
    roleId: {
        type: sequelize.INTEGER(11),
        allowNull: false,
        primaryKey: true
    },
})
Sequelize.sync({force: true})
User.hasOne(UserCheckin)
UserCheckin.belongsTo(User)
User.hasOne(UserInfo)
UserInfo.belongsTo(User)
//关联数据库关系
User.belongsToMany(Role, {
    through: 'userRoles',
    as: 'UserRoles'
})
Role.belongsToMany(User, {
    through: 'userRoles',
    as: 'UserRoles'
})
User.hasMany(Article, {
    foreignKey: 'userId',
    targetKey: 'id',
    as: 'Article'
})

class UserModel {
    /**
     * 创建用户
     * @param user
     * @returns {Promise<boolean>}
     */
    static async create(user) {
        try {
            let [userData, userInfo, userCheckin] = await Promise.all([
                User.create(user),
                UserInfo.create({nickname: user.nickname, headImg: user.headImg}),
                UserCheckin.create({loginIp: user.loginIp})
            ])
            userData.setUserCheckin(userCheckin)
            userData.setUser_info(userInfo)
            return userData
        } catch (e) {
            await User.destroy({
                where: {
                    email: user.email
                }
            })
            return false
        }
    }
    /**
     * 创建用户角色
     * @param role
     * @returns role数据
     */
    static async createRole(role) {
        let arr = [
            '仙',
            '人',
            '魔',
            '鬼',
            '妖',
            '魔'
        ]
        for (let item of arr) {
            let data = await Role.findOne({
                where: {
                    roleName: item
                }
            })
            if (!data) {
                await Role.create({roleName: item})
            }
        }
    }

    /**
     * 用户角色关系表
     * @param id
     * @param roleid
     * @returns {Promise.<boolean>}
     */
    static async createUserRole(id, roleid) {
        return UserRoles.create({
            userId: id,
            roleId: roleid
        })
    }
    static async getUserRole(id) {
        let user = await User.findById(id, {
            include: [{
                model: Role,
                as: 'UserRoles'
            }]
        })
        return user
    }
    /**
     * 删除用户
     * @param id listID
     * @returns {Promise.<boolean>}
     */
    static async delete(id) {
        await User.destroy({
            where: {
                id
            }
        })
        return true
    }

    /**
     * 查询用户列表
     * @returns {Promise<*>}
     */
    static async findAllUserList() {
        return User.findAll({
            attributes: [
                'id',
                'username'
            ]
        })
    }

    /**
     * 查询用户信息
     * @param username  姓名
     * @returns {Promise.<*>}
     */
    static async findUserByName(email) {
        return User.findOne({
            where: {
                email
            }
        })
    }
}
//UserModel.createRole()
class ArticleModel {
    /**
     * 创建文章
     * @param data
     * @returns {Promise<*>}
     */
    static async createArticle(data) {
        return Article.create({
            title: data.title,
            author: data.author,
            content: data.content,
            category: data.category,
            userId: data.userId
        })
    }
    /**
     * 获取用户文章列表
     * @param id 用户ID
     * @returns {Promise.<*>}
     */
    static async getUserArticleList(id) {
        let user = await User.findById(id,
            {
                include: [
                    {
                        model: Article,
                        as: 'Article'
                    },
                ]
            })
        return user.Article
    }
    /**
     * 更新文章数据
     * @param id  用户ID
     * @param status  事项的状态
     * @returns {Promise.<boolean>}
     */
    static async updateArticle(data) {
        let user = await User.findById(data.userId,
            {
                include: [
                    {
                        model: Article,
                        as: 'Article',
                        where: {
                            id: data.id
                        }
                    },
                ]
            })
        if (!user) {
            return false //找不到文章
        } else {
            try {
                await user.Article[0].updateAttributes(data)
            } catch (e) { //更新错误
                return false
            }
            return true
        }
    }
    /**
     * 删除文章
     * @param id listID
     * @returns {Promise.<boolean>}
     */
    static async deleteArticle(userId, id) {
        let user = await User.findById(userId,
            {
                include: [
                    {
                        model: Article,
                        as: 'Article',
                        where: {
                            id: id
                        }
                    },
                ]
            })
        if (!user) {
            return false //找不到文章
        } else {
            await user.Article[0].destroy()
            return true
        }
    }
}

module.exports = {UserModel, ArticleModel}
