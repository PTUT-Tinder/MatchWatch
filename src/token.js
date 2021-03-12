const crypto = require("crypto");
const { default: SignJWT } = require("jose/jwt/sign");
const { default: jwtVerify } = require('jose/jwt/verify')
const fs = require("fs/promises");
const { promisify } = require("util");
const { request } = require("express");

let privateKey;
let publicKey;

async function setUpKeys() {
	if (!await fs.access("publickey.pem").then(() => true).catch(() => false)) {
		console.log("[JWT] Generating encryption keys for token generation...");

		const keys = await promisify(crypto.generateKeyPair)("ed25519");

		publicKey = keys.publicKey;
		privateKey = keys.privateKey;

		await Promise.all([
			fs.writeFile("publickey.pem", publicKey.export({ format: "pem", type: "spki" }), "utf8"),
			fs.writeFile("privatekey.pem", privateKey.export({ format: "pem", type: "pkcs8" }), "utf8"),
		]);
	} else {
		console.log("[JWT] Importing encryption keys for token generation...");
		const [publicKeyPem, privateKeyPem] = await Promise.all([
			fs.readFile("publickey.pem", "utf8"),
			fs.readFile("privatekey.pem", "utf8"),
		]);

		publicKey = crypto.createPublicKey(publicKeyPem, { format: "pem", type: "spki" });
		privateKey = crypto.createPrivateKey(privateKeyPem, { format: "pem", type: "pkcs8" });
	}

	console.log("[JWT] Done.")
}

const sessionIssuer = "MatchWatch_" + Date.now();

function createToken(subject) {
	if (subject == null || Number.isNaN(subject)) {
		throw new TypeError("Cannot create token with a null subject");
	}

	return new SignJWT({})
		.setProtectedHeader({ alg: "EdDSA", typ: "JWT" })
		.setIssuedAt()
		.setSubject(String(subject))
		.setIssuer(sessionIssuer)
		.sign(privateKey);
}

async function readToken(token) {
	const { payload } = await jwtVerify(token, publicKey).catch(err => {
		if (err.code === "ERR_JWS_SIGNATURE_VERIFICATION_FAILED") {
			return;
		}

		throw err;
	});

	const subject = payload?.sub != null ? String(payload.sub) : payload?.sub;

	if (subject?.startsWith?.("temp_") && payload.iss != sessionIssuer) {
		// Invalidates tokens issued for temp accounts in previous sessions
		return null;
	}

	return subject ?? null;
}

async function getUser(req, res = null) {
	if (!(req instanceof request.constructor)) {
		throw new TypeError("First argument of getUser must be a request.");
	}

	if (!req.headers.authorization)	{
		res?.status(403)?.send({
			error: "You must be logged in to see this",
		});

		return undefined;
	}

	const id = await readToken(req.headers.authorization);

	if (id == null) {
		res?.status(403)?.send({
			error: "This token is invalid",
		});
	}

	return id;
}

module.exports = {
	setUpKeys,
	createToken,
	readToken,
	getUser,
};
