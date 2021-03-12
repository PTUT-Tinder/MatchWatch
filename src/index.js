const express = require("express");
const bodyParser = require("body-parser");
const argon2 = require("argon2");
const Ajv = require("ajv/dist/2019").default;
const { db, User } = require("./db");
const code = require("./utils/create-room.js");
const token = require("./token");

const ajv = new Ajv({ allErrors: true, strictRequired: "log" });

function userToJson(user) {
	return {
		id: user.get("id").toString(),
		username: user.get("username"),
		email: user.get("email"),
		favoriteGenres: user.get("genre")?.split(", ") ?? [],
	};
}

function validateRequest(validate, req, res = null) {
	if (req.headers["content-type"] !== "application/json") {
		res?.status(400)?.send({
			error: "'Content-Type' header expected to be 'application/json'",
		});

		return false;
	}

	if (!"body" in req) {
		res?.status(400)?.send({
			error: "Body expected, but none was received",
		});

		return false;
	}

	if (!validate(req.body)) {
		const errors = validate.errors;

		res?.status(400)?.send({
			error: errors.map((err) =>
				err.dataPath ? `${err.dataPath}: ${err.message}` : err.message
			),
		});

		return false;
	}

	return true;
}

Promise.all([db.sync(), token.setUpKeys()]).then(() => {
	const app = express();

	app.use(express.static("./public"));
	app.use(bodyParser.json());

	app.get("/api/ping", (req, res) => {
		res.status(200).send({ msg: "Pong!" });
	});

	const registerSchema = {
		type: "object",
		properties: {
			email: { type: "string" },
			username: { type: "string" },
			password: { type: "string" },
		},
		required: ["email", "username", "password"],
		additionalProperties: false,
	};

	const registerValidate = ajv.compile(registerSchema);

	app.post("/api/register", async (req, res) => {
		if (!validateRequest(registerValidate, req, res)) return;

		const hashedPassword = await argon2.hash(req.body.password);

		try {
			const createdUser = await User.create({
				username: req.body.username,
				password: hashedPassword,
				email: req.body.email,
			});

			res.status(200).send({
				user: userToJson(createdUser),
				token: await token.createToken(createdUser.get("id")),
			});
		} catch (error) {
			if (
				error.name === "SequelizeUniqueConstraintError" ||
				error.name === "SequelizeValidationError"
			) {
				res.status(400).send({
					error: error.errors.map((err) => err.message),
				});
			} else {
				throw error;
			}
		}
	});

	const loginSchema = {
		type: "object",
		properties: {
			email: { type: "string" },
			password: { type: "string" },
		},
		required: ["email", "password"],
		additionalProperties: false,
	};

	const loginValidate = ajv.compile(loginSchema);

	app.post("/api/login", async (req, res) => {
		if (!validateRequest(loginValidate, req, res)) return;

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
				user: userToJson(user),
				token: await token.createToken(user.get("id")),
			});
		} else {
			res.status(403).send({
				error: "Incorrect password",
			});
		}
	});

<<<<<<< HEAD
	app.get("/api/user/:id", async (req, res) => {
		let requestedId;

		if (req.params.id === "@me") {
			const userId = await token.getUser(req, res);

			if (userId == null) return;

			requestedId = userId;
		} else {
			requestedId = req.params.id;
		}

		console.dir(requestedId)

		if (requestedId.startsWith("temp_")) {
			return res.status(200).send(tempUsers.get(requestedId));
		}

		const user = await User.findOne({
=======
	app.post("/api/modify", async (req, res) => {
		const user = await User.update({username: req.body.newUsername,
		email: req.body.newEmail
		}, {
			where: {
				username: req.body.oldUsername,
				email: req.body.oldEmail
			},
		});

		res.status(204).send();
	});

	app.patch("/api/genre", async (req, res) => {
		await User.update({genre: req.body.genre.join(", ")}, {
>>>>>>> 98ded4500b88beb59819f34ad790790db808a7ac
			where: {
				id: requestedId,
			},
		});

		if (user == null) {
			return res.status(404).send({
				error: "Unknown user",
			});
		}

		return res.status(200).send(userToJson(user));
	});

	const patchUserSchema = {
		type: "object",
		properties: {
			email: { type: "string" },
			username: { type: "string" },
			newPassword: { type: "string" },
			oldPassword: { type: "string" },
			favoriteGenres: { type: "array", items: { type: "string" } },
		},
		dependentRequired: {
			newPassword: ["oldPassword"],
		},
		additionalProperties: false,
	};

	const patchUserValidate = ajv.compile(patchUserSchema);

	app.patch("/api/user/:id", async (req, res) => {
		if (!validateRequest(patchUserValidate, req, res)) return;
		let requestedId;

		if (req.params.id === "@me") {
			const userId = await token.getUser(req, res);

			if (userId == null) return;

			requestedId = userId;
		} else {
			return res.status(403).send({
				error: "You cannot edit other people's accounts",
			});
		}

		const user = await User.findOne({
			where: {
				id: requestedId,
			},
		});
<<<<<<< HEAD

		if (user == null) {
			// This can happen despite the token being validated due to temp users
			return res.status(404).send({
				error: "Unknown user",
			});
		}

		if ("email" in req.body) user.set("email", req.body.email);
		if ("username" in req.body) user.set("username", req.body.username);
		if ("newPassword" in req.body) {
			if (await argon2.verify(user.get("password"), req.body.oldPassword)) {
				user.set("password", await argon2.hash(req.body.newPassword));
			} else {
				return res.status(403).send({
					error: "Incorrect password",
				});
			}
		}
		if ("favoriteGenres" in req.body) user.set("genre", req.body.favoriteGenres.join(", "));

		try {
			await user.save();
		} catch (error) {
			if (
				error.name === "SequelizeUniqueConstraintError" ||
				error.name === "SequelizeValidationError"
			) {
				return res.status(400).send({
					error: error.errors.map((err) => err.message),
				});
			} else {
				throw error;
			}
		}	

		return res.status(200).send(userToJson(user));
=======
	});

	app.get("/api/genre/:username", async (req, res) => {
		const user = await User.findOne({
			where: {
				username: req.params.username,
			},
		});
		console.log(user.get("genre"));
		res.status(200).send({
			genre : user.get("genre").split(", "),
		});
>>>>>>> 98ded4500b88beb59819f34ad790790db808a7ac
	});

	const tempUsers = new Map();

	const createTempUserSchema = {
		type: "object",
		properties: {
			username: { type: "string" },
		},
		additionalProperties: false,
	};

	const createTempUserValidate = ajv.compile(createTempUserSchema);

	app.post("/api/create-temp-user", async (req, res) => {
		if (!validateRequest(createTempUserValidate, req, res)) return;

		const userId = "temp_" + tempUsers.size;
		tempUsers.set(userId, {
			id: userId,
			username: req.body.username,
		});

		res.status(200).send({
			user: tempUsers.get(userId),
			token: await token.createToken(userId),
		})
	})

	const rooms = [];

	const roomSchema = {
		type: "object",
		properties: {
			displayName: { type: "string" },
		},
		additionalProperties: false,
	};

	const roomValidate = ajv.compile(roomSchema);

	app.post("/api/create-room", async (req, res) => {
		if (!validateRequest(roomValidate, req, res)) return;
		const userId = await token.getUser(req, res);

		if (userId == null) return;

		const createdRoom = {
			id: code(),
			members: [userId],
			displayNames: new Map([[userId, req.body.displayName]]),
		};

		rooms.push(createdRoom);
		res.status(200).send(createdRoom);
	});

	app.post("/api/join-room", async (req, res) => {
		if (!validateRequest(roomValidate, req, res)) return;

		const userId = await token.getUser(req, res);

		if (userId == null) return;

		const room = await rooms.find((room) => room.id === req.body.id);

		if (room == null) {
			res.status(404).send({
				error: "Unknown room",
			});
		} else {
			room.members.push(userId);
			room.displayNames.set(userId, req.body.displayName);
			res.status(200).send(room);
		}
	});

	app.listen(5000);
	console.log("Initialisation sucessful! Backend listening on port 5000");
});
