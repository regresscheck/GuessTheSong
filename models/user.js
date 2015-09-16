// CHANGE MODEL BECAUSE IT DOES NOT SUPPORT ANY OTHER AUTHS
module.exports = function(sequelize, DataTypes) {
    var User = sequelize.define("User", {
            google_id: DataTypes.STRING,
            token: DataTypes.STRING,
            email: DataTypes.STRING,
            name: DataTypes.STRING
        }, {
            timestamps: false
        }
    );
    return User;
};