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
        }
    }, {
        underscored: false,
        timestamps: false,
        freezeTableName: true,
        charset: 'utf8'
    })
}
