// CHANGE MODEL BECAUSE IT DOES NOT SUPPORT ANY OTHER AUTHS
module.exports = function(sequelize, DataTypes) {
    var Song = sequelize.define("Song", {
            artist: DataTypes.STRING,
            title: DataTypes.STRING,
            filename: DataTypes.STRING,
            duration: DataTypes.INTEGER
        }
    );
    return Song;
};