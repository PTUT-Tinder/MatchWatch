const express = require("express");
const bodyParser = require("body-parser");
const argon2 = require('argon2');
const { db, User } = require("./db");

db.sync().then(() => {
	const app = express();
	
	app.use(bodyParser.json());

	app.post("/register", async (req, res) => {
		const hashedPassword = await argon2.hash(req.body.password);

		try {
			const createdUser = await User.create({
				username: req.body.username,
				password: hashedPassword,
				email: req.body.email,
			});
	
			res.status(200).send({
				id: createdUser.get("id"),
				username: createdUser.get("username"),
				email: createdUser.get("email"),
			});
		} catch (error) {
			if (
				error.name === "SequelizeUniqueConstraintError" ||
				error.name === "SequelizeValidationError"
			) {
				res.status(400).send({
					error: error.errors.map(err => err.message),
				});
			} else {
				console.dir(JSON.stringify(error));
				throw error;
			}
		}
	});
	
	app.post("/login", async (req, res) => {
		const user = await User.findOne({
			where: {
				email: req.body.email,
			},
		});

		if (user == null) {
			res.status(404).send({
				error: "Unknown user",
			});
		} else if (await argon2.verify(user.get("password"), req.body.password)) {
			res.status(200).send({
				id: user.get("id"),
				username: user.get("username"),
				email: user.get("email"),
			});
		} else {
			res.status(403).send({
				error: "Incorrect password",
			});
		}
	});
	
	app.listen(5000);
});
