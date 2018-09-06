module.exports = function(sequelize, DataTypes) {
    return sequelize.define('userCheckin', {
        id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        userId: {
            type: DataTypes.BIGINT,
            comment: '用户id'
        },
        loginIp: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: '',
            validate: {isIP: true},
            comment: '登录IP'
        }
    }, {
        underscored: false,
        timestamps: false,
        paranoid: true,
        freezeTableName: true, // 为 true 则表的名称和 model 相同
        charset: 'utf8'
    })
}
