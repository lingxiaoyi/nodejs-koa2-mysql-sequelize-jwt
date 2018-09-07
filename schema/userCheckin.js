const moment = require('moment')
module.exports = function(sequelize, DataTypes) {
    return sequelize.define('userCheckin', {
        id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        loginIp: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: '',
            validate: {isIP: true},
            comment: '登录IP'
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
        paranoid: true,
        freezeTableName: true, // 为 true 则表的名称和 model 相同
        charset: 'utf8'
    })
}
