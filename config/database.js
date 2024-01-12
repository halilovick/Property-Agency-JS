const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('wt24', 'root', 'password', {
    host: 'localhost',
    dialect: 'mysql',
    define: {
        freezeTableName: true
    },
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

module.exports = db;