require("dotenv").config();

module.exports = {
    username: 'root',
    password: 'marcolinobd',
    database: 'joblink-database',
    dialect: 'mysql',
    define:{
        timezone: '-2:00',
        timestamp: true,
        underscored: true
    }
}