const Ajv = require("ajv/dist/2019").default;
const token = require("./token");
const argon2 = require("argon2");
const {  User } = require("./db");
const userToJson = require("./utils/user-to-json");
const { ajv, validateRequest } = require("./utils/validate");

const tempUsers = new Map();

module.exports.tempUsers = tempUsers;

module.exports.userRoutes = function (app) {
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

	app.get("/api/user/:id", async (req, res) => {
		let requestedId;

		if (req.params.id === "@me") {
			const userId = await token.getUser(req, res);

			if (userId == null) return;

			requestedId = userId;
		} else {
			requestedId = req.params.id;
		}

		if (requestedId.startsWith("temp_")) {
			return res.status(200).send(tempUsers.get(requestedId));
		}

		const user = await User.findOne({
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
	});

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
	});
}