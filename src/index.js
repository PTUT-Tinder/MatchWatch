const express = require("express");
const bodyParser = require("body-parser");
const argon2 = require('argon2');
const { db, User, } = require("./db");

import { creerCode } from "./js/create-room.js";

db.sync().then(() => {
	const app = express();

	app.use(express.static("./public"));
	app.use(bodyParser.json());

	app.get("/api/ping", (req, res) => {
		res.status(200).send({ nsg: "Pong!" });
	})

	app.post("/api/register", async (req, res) => {
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
				throw error;
			}
		}
	});
	
	app.post("/api/login", async (req, res) => {
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


const rooms = [];

	app.post("/api/create-room", async(req, res) => {
		const createdRoom = {
			id : creerCode,
			members : user.get("username"),
		};

		rooms.push(createdRoom);
	
		res.status(200).send({
			id: createdRoom.get("id"),
			members: createdRoom.get("members")
		});
	});

	app.post("/api/join-room", async(req, res) => {
		const room = await rooms.find(room => room.id === req.body.id);

		if (room == null) {
			res.status(404).send({
				error: "Unknown room",
			});
		} else {
			res.status(200).send({
				id: room.get("id"),
				members: room.get("members"),
			});
			Room.get("members").push(user.get("username"));
		}

	});
	
	app.listen(5000);
});
