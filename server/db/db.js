const {Sequelize} = require("sequelize");

module.exports = new Sequelize(
    {
        dialect: 'sqlite',
        storage: './server/db/task-manager.sqlite',
        logging: console.log,
        define: {
            timestamps: false
          },
    }
)