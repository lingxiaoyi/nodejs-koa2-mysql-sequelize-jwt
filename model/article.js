const db = require('../config/db')
const Sequelize = db.sequelize
const Article = Sequelize.import('../schema/article')
const User = Sequelize.import('../schema/user.js')
//Article.sync({force: false})

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
     * 更新文章数据
     * @param id  用户ID
     * @param status  事项的状态
     * @returns {Promise.<boolean>}
     */
    static async updateArticle(req) {
        /*await Article.update({
            title: data.title,
            author: data.author,
            content: data.content,
            category: data.category
        }, {
            where: {
                id
            },
            fields: [
                'title',
                'author',
                'content',
                'category'
            ]
        })
        return true*/
        let user = await User.findAll({include: [{ model: Article, as: 'Article' }]})
        //user.setArticle(Article.build(req))
        return user
    }

    /**
     * 获取文章列表
     * @returns {Promise<*>}
     */
    static async getArticleList() {
        return Article.findAndCountAll()
    }

    /**
     * 获取文章详情数据
     * @param id  文章ID
     * @returns {Promise.<Model>}
     */
    static async getArticleDetail(id) {
        return Article.findOne({
            where: {
                id
            }
        })
    }

    /**
     * 删除文章
     * @param id listID
     * @returns {Promise.<boolean>}
     */
    static async deleteArticle(id) {
        await Article.destroy({
            where: {
                id
            }
        })
        return true
    }
}

module.exports = ArticleModel
