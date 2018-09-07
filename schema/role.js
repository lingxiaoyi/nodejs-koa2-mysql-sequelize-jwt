const moment = require('moment')
module.exports = function(sequelize, DataTypes) {
    return sequelize.define('role', {
        id: {
            type: DataTypes.BIGINT(11),
            autoIncrement: true,
            primaryKey: true,
            unique: true,
            comment: '角色Id'
        },
        roleName: {
            type: DataTypes.STRING,
            comment: '角色名'
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
        freezeTableName: true,
        charset: 'utf8'
    })
}
