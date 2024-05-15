const sequelize = require("../db/db.js");
const {DataTypes} = require("sequelize");

const User = sequelize.define("user", {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    login: {type: DataTypes.STRING, unique: true, allowNull: false},
    password: {type: DataTypes.STRING, allowNull: false},
});

const Board = sequelize.define("board", {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    title: {type: DataTypes.STRING, unique: true, allowNull: false},
    description: {type: DataTypes.STRING},
    position: {type: DataTypes.NUMBER},
})

const Section = sequelize.define("section", {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    title: {type: DataTypes.STRING, unique: true, allowNull: false},
});

const Task = sequelize.define("task", {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    title: {type: DataTypes.STRING, unique: true, allowNull: false},
    content: {type: DataTypes.STRING},
    position: {type: DataTypes.NUMBER},
});

User.hasMany(Board)
Board.belongsTo(User)

Board.hasMany(Section)
Section.belongsTo(Board)

Section.hasMany(Task)
Task.belongsTo(Section)

module.exports = {User, Board, Section, Task}