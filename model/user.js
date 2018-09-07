const db = require('../config/db')
const Sequelize = db.sequelize
const User = Sequelize.import('../schema/user.js')
const UserCheckin = Sequelize.import('../schema/userCheckin.js')
const Role = Sequelize.import('../schema/role.js')
const Article = Sequelize.import('../schema/article.js')
Sequelize.sync({force: false})
User.hasOne(UserCheckin)
UserCheckin.belongsTo(User)
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
            /*let userData = await User.create(user)
            let role = await Role.create({roleName: '普通用户'})
            let userCheckin = await UserCheckin.create({loginIp: user.loginIp})*/
            let [userData, role, userCheckin] = await Promise.all([
                User.create(user),
                Role.create({roleName: '普通用户'}),
                UserCheckin.create({loginIp: user.loginIp})
            ])
            userData.setUserCheckin(userCheckin)
            userData.setUserRoles(role)
            return userData
        } catch (e) {
            await User.destroy({
                where: {
                    username: user.username
                }
            })
            return false
        }
    }

    static async getPermissions(id) {
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
    static async findUserByName(username) {
        return User.findOne({
            where: {
                username
            }
        })
    }
}

module.exports = UserModel
