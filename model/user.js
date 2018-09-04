const db = require('../config/db')
const Sequelize = db.sequelize
const User = Sequelize.import('../schema/user.js')
const Role = Sequelize.import('../schema/role.js')
const Article = Sequelize.import('../schema/article.js')
Sequelize.sync({force: false})
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
        //let {username, password, nickname, headimgurl} = user
        await User.create(user)
        return true
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
    static async findUserByName(username) {
        return User.findOne({
            where: {
                username
            }
        })
    }
    static async findUserArticleList() {
        let data = await User.findOne()
        data = data.getArticle()
        return data
    }
}

module.exports = UserModel
