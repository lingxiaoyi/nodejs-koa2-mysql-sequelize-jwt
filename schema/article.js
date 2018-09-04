const moment = require('moment')
module.exports = function(sequelize, DataTypes) {
    return sequelize.define('article', {
        // 文章ID
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
            comment: 'id'
        }, // 文章标题
        userId: {
            type: DataTypes.BIGINT,
            comment: '用户id'
        },
        title: {
            type: DataTypes.TEXT,
            allowNull: false,
            field: 'title'
        }, // 文章作者
        author: {
            type: DataTypes.STRING,
            allowNull: false,
            field: 'author'
        }, // 文章内容
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
            field: 'content'
        }, // 文章分类
        category: {
            type: DataTypes.STRING,
            allowNull: false,
            field: 'category'
        },
        createdAt: {
            type: DataTypes.DATE,
            get() {
                return moment(this.getDataValue('createdAt')).format('YYYY-MM-DD HH:mm:ss')
            }
        },
        updatedAt: {
            type: DataTypes.DATE,
            get() {
                return moment(this.getDataValue('updatedAt')).format('YYYY-MM-DD HH:mm:ss')
            }
        }
    }, {
        underscored: false,
        //timestamps: false,
        freezeTableName: true, // 为 true 则表的名称和 model 相同
        charset: 'utf8'
    })
}
