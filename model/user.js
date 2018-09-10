const db = require('../config/db')
const Sequelize = db.sequelize
const User = Sequelize.import('../schema/user.js')
const UserCheckin = Sequelize.import('../schema/userCheckin.js')
const Role = Sequelize.import('../schema/role.js')
class UserModel {
    /**
     * 创建用户
     * @param user
     * @returns {Promise<boolean>}
     */
    static async create(user) {
        try {
            let userData = await User.create(user)
            let userCheckin = await UserCheckin.create({loginIp: user.loginIp})
            let [userData, userCheckin] = await Promise.all([
                User.create(user),
                UserCheckin.create({loginIp: user.loginIp})
            ])
            userData.setUserCheckin(userCheckin)
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
    /**
     * 创建用户角色
     * @param role
     * @returns role数据
     */
    static async createSubject(role) {
        let arr = []
        role.roleName.split(',').forEach(async function(item) {
            let data = await User.findOne({
                where: {
                    roleName: item
                }
            })
            if (!data) {
                Role.create({roleName: item})
            }
        })
        return Role.bulkCreate(arr)
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
