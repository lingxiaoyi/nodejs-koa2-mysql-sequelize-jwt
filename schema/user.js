module.exports = function(sequelize, DataTypes) {
    return sequelize.define('user', {
        id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        username: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        password: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        nickname: {
            type: DataTypes.STRING(50),
            allowNull: false,
            defaultValue: ''
        },
        headImg: {
            type: DataTypes.STRING(255),
            allowNull: false,
            defaultValue: ''
        },
        country: {
            type: DataTypes.STRING(50),
            allowNull: false,
            defaultValue: ''
        },
        province: {
            type: DataTypes.STRING(50),
            allowNull: false,
            defaultValue: ''
        },
        city: {
            type: DataTypes.STRING(50),
            allowNull: false,
            defaultValue: ''
        },
        content: {
            type: DataTypes.STRING(255),
            allowNull: false,
            defaultValue: ''
        },
        plnum: {
            type: DataTypes.STRING(50),
            allowNull: false,
            defaultValue: ''
        },
        userType: {
            type: DataTypes.STRING(50),
            allowNull: false,
            defaultValue: ''
        },
        phone: {
            type: DataTypes.STRING(50),
            allowNull: false,
            defaultValue: ''
        },
    }, {
        underscored: false,
        timestamps: false,
        paranoid: true,
        freezeTableName: true, // 为 true 则表的名称和 model 相同
        charset: 'utf8'
    })
}
