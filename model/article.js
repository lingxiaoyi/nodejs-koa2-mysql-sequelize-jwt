const db = require('../config/db')
const Sequelize = db.sequelize
const Article = Sequelize.import('../schema/article')
const User = Sequelize.import('../schema/user.js')

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

module.exports = ArticleModel
