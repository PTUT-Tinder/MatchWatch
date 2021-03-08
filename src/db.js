const { Sequelize, DataTypes } = require("sequelize");
const config = require("./utils/config");

const db = new Sequelize(config.db);

const User = db.define("User", {
	username: {
		type: DataTypes.STRING,
		unique: true,
		validate: {
			len: [3, 16],
		},
	},
	password: {
		type: DataTypes.STRING,
	},
	email: {
		type: DataTypes.STRING,
		unique: true,
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
