// CHANGE MODEL BECAUSE IT DOES NOT SUPPORT ANY OTHER AUTHS
module.exports = function(sequelize, DataTypes) {
    var User = sequelize.define("User", {
            social_type: DataTypes.STRING,
            social_id: DataTypes.STRING,
            token: DataTypes.STRING,
            name: DataTypes.STRING
        }
    );
    return User;
};