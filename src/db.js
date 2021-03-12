const { Sequelize, DataTypes } = require("sequelize");
const config = require("./utils/config");

const db = new Sequelize(config.db);

const User = db.define("User", {
	username: {
		type: DataTypes.STRING,
		allowNull: false,
		validate: {
			len: [3, 16],
		},
	},
	password: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	email: {
		type: DataTypes.STRING,
		unique: true,
		allowNull: false,
		validate: {
			isEmail: true,
		},
	},
	genre: {
		type: DataTypes.STRING,
	},
});

module.exports = {
	User,
	db,
}
