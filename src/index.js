const express = require("express");
const bodyParser = require("body-parser");
const Ajv = require("ajv/dist/2019").default;
const { db } = require("./db");
const code = require("./utils/create-room.js");
const token = require("./token");
const { userRoutes, tempUsers } = require("./user");
const { ajv, validateRequest } = require("./utils/validate");
const films = require("../app/json/movies.json");

Promise.all([db.sync(), token.setUpKeys()]).then(() => {
	const app = express();

	app.use(express.static("./public"));
	app.use(bodyParser.json());

	app.get("/api/ping", (req, res) => {
		res.status(200).send({ msg: "Pong!" });
	});

	userRoutes(app);

	const rooms = new Map();

	const roomSchema = {
		type: "object",
		properties: {
			displayName: { type: "string" },
		},
		additionalProperties: false,
	};

	const roomValidate = ajv.compile(roomSchema);

	app.post("/api/room/create", async (req, res) => {
		if (!validateRequest(roomValidate, req, res)) return;
		const userId = await token.getUser(req, res);

		if (userId == null) return;

		const createdRoom = {
			id: code(),
			status: "setup", // "setup" | "voting" | "match"
			members: [userId],
			votes: {}, // film ID: { "approved": [user IDs], "rejected": [userIDs] }
			matchedFilms: [],
			newMatches: 0,
			userStatus: {
				[userId]: {
					displayName: req.body.displayName,
					preferredGenres: null,
					preferredDates: null,
					readyToVote: false,
					acceptsMatch: null,
					filmsSeen: 0,
					filmsApproved: 0,
				},
			},
		};

		rooms.set(createdRoom.id, createdRoom);
		res.status(200).send(createdRoom);
	});

	app.post("/api/room/:id/join", async (req, res) => {
		if (!validateRequest(roomValidate, req, res)) return;

		const userId = await token.getUser(req, res);

		if (userId == null) return;

		const room = rooms.get(req.params.id);

		if (room == null) {
			res.status(404).send({
				error: "Unknown room",
			});
		}

		if (room.members.includes(userId)) {
			res.status(400).send({
				error: "You're aleady in this room",
			});
		}

		if (!room.status === "waiting") {
			return res.status(412).send({
				error: "This room is not waiting for new participants anymore",
			});
		}

		room.members.push(userId);
		room.userStatus[userId] = {
			displayName: req.body.displayName,
			preferredGenres: null,
			preferredDates: null,
			readyToVote: false,
			acceptsMatch: null,
			filmsSeen: 0,
			filmsApproved: 0,
		};
		res.status(200).send(room);
	});

	app.get("/api/room/:id", async (req, res) => {
		const userId = await token.getUser(req, res);

		if (userId == null) return;

		const room = rooms.get(req.params.id);

		if (room == null) {
			return res.status(404).send({
				error: "Unknown room",
			});
		}

		if (!room.members.includes(userId)) {
			return res.status(403).send({
				error: "You are not part of this room",
			});
		}

		res.status(200).send(room);
	});

	const userStatusSchema = {
		type: "object",
		properties: {
			displayName: { type: "string" },
			preferredGenres: {
				type: "array",
				items: { type: "string" },
			},
			preferredDates: {
				type: "array",
				items: {
					type: "array",
					maxItems: 2,
					minItems: 2,
					items: [{ type: "integer" }, { type: "integer" }],
					additionalItems: false,
				},
			},
			readyToVote: { type: "boolean" },
			acceptsMatch: { type: ["boolean", "null"] },
			filmsSeen: { type: "integer" },
			filmsApproved: { type: "integer" },
		},
		additionalProperties: false,
	};

	const userStatusValidate = ajv.compile(userStatusSchema);

	app.patch("/api/room/:id/update-status", async (req, res) => {
		if (!validateRequest(userStatusValidate, req, res)) return;

		const userId = await token.getUser(req, res);

		if (userId == null) return;

		const room = rooms.get(req.params.id);

		if (room == null) {
			return res.status(404).send({
				error: "Unknown room",
			});
		}

		if (!room.members.includes(userId)) {
			return res.status(403).send({
				error: "You are not part of this room",
			});
		}

		room.userStatus[userId] = {
			...room.userStatus[userId],
			...req.body,
		};

		if (
			room.status === "setup" &&
			room.members.every((userId) => room.userStatus[userId].readyToVote)
		) {
			room.status = "voting";
			console.log("Ranking films for room " + room.id);
			room.queue = rankFilms(room);
			console.log("Done");
		}

		if (
			room.status === "match" &&
			room.members.every((userId) => room.userStatus[userId].acceptsMatch != null)
		) {
			let accepted = 0;

			for (const userId of room.members) {
				if (room.userStatus[userId].acceptsMatch === true) {
					accepted++;
				}
			}

			if (accepted >= room.members.length * 4 / 5) {
				room.status = "ended";
			} else {
				room.status = "voting";

				for (const userId of room.members) {
					room.userStatus[userId].acceptsMatch = null;
				}

				room.newMatches = 0;
			}
		}

		res.status(200).send(room);
	});

	function rankFilms(room) {
		const scores = [];

		// 1. Determine the score of every film
		for (const film of films) {
			if (film.genres == null) {
				// Currently, we have no way of ranking films with no genres
				// Fortunately, those only take up 0.4% of the database
				scores.push(0);
				continue;
			}

			// The final score will be the total the film got for each user
			let finalFilmScore = 0;

			for (const userId of room.members) {
				const user = room.userStatus[userId];

				// 1.1. The genre score is the number of genres the film has which the user selected
				let genreScore = 0;

				for (const genre of film.genres) {
					if (user.preferredGenres.includes(genre)) {
						genreScore++;
					}
				}

				const releaseYear = new Date(film.release_date * 1000).getUTCFullYear();
				const dateScores = [];

				if (user.preferredDates.length === 0) {
					dateScores.push(1);
				}

				// 1.2. For each date selected by the user, we calculate a date score representing how well the film matches that date
				for (const preferredDate of user.preferredDates) {
					if (
						releaseYear >= preferredDate[0] &&
						releaseYear <= preferredDate[1]
					) {
						// If a film is within a date selected by the user, it gets a date score of 1
						dateScores.push(1);
						break; // And we can stop because it can't get higher
					} else {
						// If a film is not within the date selected by the user, its date score depends on how far it is
						const distance = Math.min(
							Math.abs(preferredDate[0] - releaseYear),
							Math.abs(preferredDate[1] - releaseYear)
						);

						dateScores.push(Math.max(0, 1 - distance / 10));
					}
				}

				// 1.3. We determine the final date score, which is the highest date score
				const finalDateScore = Math.max(...dateScores);

				// 1.4 The film's score is its genre score multiplied by its final date score
				finalFilmScore += genreScore * finalDateScore;
			}

			// Once all the users score have been added up, they're the film's final score
			scores.push(finalFilmScore);
		}
		// 2. We can now sort the films
		// But sorting the original array would require duplicating it, which would be expensive memory-wise
		// So instead we'll sort an array of numbers, where each number is the index of its corresponding film

		const sortedFilms = [...Object.keys(films)];

		// The lowest scores go first
		// This is because we start with the highest scores and remove them progressively
		// and computers can remove last elements faster than the first ones.
		sortedFilms.sort((a, b) => scores[a] - scores[b]);

		// 3. We chunk the array, meaning we split it into arrays of n items each.
		// n = number of users * 6
		const filmsPerChunk = room.members.length * 6;
		const chunkedArray = [[]];

		for (let i = 0; i < sortedFilms.length; i++) {
			// These maths make it so the first element's length is the remainder length
			// Like, you'd imagine if you distributed 8 elements in chunks of 3 items, you'd end up like this:
			// [1, 2, 3], [4, 5, 6], [7, 8]
			// But we distribute it this way
			// [1, 2], [3, 4, 5], [6, 7, 8]
			// Again, this is because we read the array backwards to remove element more effociently
			if ((i - (sortedFilms.length % filmsPerChunk)) % filmsPerChunk === 0 && i !== 0) {
				chunkedArray.push([]);
			}

			chunkedArray[chunkedArray.length - 1].push(sortedFilms[i]);
		}

		// 4. We shuffle each chunk
		// https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle#The_modern_algorithm
		for (const chunk of chunkedArray) {
			let i = chunk.length;

			while (i > 0) {
				let j = Math.floor(Math.random() * i);

				i--;

				let temp = chunk[i];
				chunk[i] = chunk[j];
				chunk[j] = temp;
			}
		}

		return chunkedArray;
	}

	app.get("/api/room/:id/films", async (req, res) => {
		const userId = await token.getUser(req, res);

		if (userId == null) return;

		const room = rooms.get(req.params.id);

		if (room == null) {
			return res.status(404).send({
				error: "Unknown room",
			});
		}

		if (!room.members.includes(userId)) {
			return res.status(403).send({
				error: "You are not part of this room",
			});
		}

		if (!room.queue) {
			return res.status(412).send({
				error: "Voting has not started yet",
			});
		}

		let suggestedFilms = [];
		const offset = room.members.indexOf(userId) * 6;

		// Loop starts at the end, loops until there are more than 6 suggested films
		// This can crash if we run out of films, but when will that happen?
		for (let chunk = room.queue.length - 1; suggestedFilms.length < 6; chunk--) {
			const currentChunk = room.queue[chunk];
			let allFilmsWereRejected = true;

			// Loops until the last index OR until more than 6 films are suggested
			for (let i = 0; i < currentChunk.length && suggestedFilms.length < 6; i++) {
				const filmId = currentChunk[(i + offset) % currentChunk.length];
				const rejectNum = room.votes[filmId]?.rejected?.length ?? 0;
				
				// Film will not be suggested if more than 1/5th of people have rejected it
				if (rejectNum > room.members * (1 / 5)) {
					continue;
				}

				allFilmsWereRejected = false;

				// Films the user already approved or rejected will not be suggested
				if (
					room.votes[filmId]?.rejected?.includes(userId) ||
					room.votes[filmId]?.approved?.includes(userId)
				) {
					continue;
				}

				suggestedFilms.push(filmId);
			}

			if (allFilmsWereRejected) {
				room.queue.pop();
			}
		}

		res.status(200).send(suggestedFilms);
	})

	const filmVoteSchema = {
		type: "object",
		properties: {
			approved: {
				type: "array",
				items: { type: "string" },
			},
			rejected: {
				type: "array",
				items: { type: "string" },
			},
		},
		required: ["approved", "rejected"],
		additionalProperties: false,
	};

	const filmVoteValidate = ajv.compile(filmVoteSchema);

	app.put("/api/room/:id/films", async (req, res) => {
		if (!validateRequest(filmVoteValidate, req, res)) return;

		const userId = await token.getUser(req, res);

		if (userId == null) return;

		const room = rooms.get(req.params.id);

		if (room == null) {
			return res.status(404).send({
				error: "Unknown room",
			});
		}

		if (!room.members.includes(userId)) {
			return res.status(403).send({
				error: "You are not part of this room",
			});
		}

		if (!room.queue) {
			return res.status(412).send({
				error: "Voting has not started yet",
			});
		}

		for (const filmId of req.body.approved) {
			if (room.votes[filmId] == null) {
				room.votes[filmId] = {};
			}

			if (room.votes[filmId].approved == null) {
				room.votes[filmId].approved = [];
			}

			if (!room.votes[filmId].approved.includes(userId)) {
				room.votes[filmId].approved.push(userId);
			}

			if (
				room.votes[filmId].approved.length >= room.members.length * (4 / 5) &&
				!room.matchedFilms.includes(filmId)
			) {
				room.newMatches++;
				room.matchedFilms.push(filmId);
			}
		}

		if (room.newMatches > 0) {
			room.status = "match";
		}

		for (const filmId of req.body.rejected) {
			if (room.votes[filmId] == null) {
				room.votes[filmId] = {};
			}

			if (room.votes[filmId].rejected == null) {
				room.votes[filmId].rejected = [];
			}

			if (!room.votes[filmId].rejected.includes(userId)) {
				room.votes[filmId].rejected.push(userId);
			}
		}

		room.userStatus[userId].filmsSeen += req.body.rejected.length + req.body.approved.length;
		room.userStatus[userId].filmsApproved += req.body.approved.length;

		res.status(200).send(room);
	});

	app.listen(5000);
	console.log("Initialisation sucessful! Backend listening on port 5000");
});
