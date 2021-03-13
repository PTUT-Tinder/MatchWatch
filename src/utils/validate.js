const Ajv = require("ajv/dist/2019").default;
const ajv = new Ajv({ allErrors: true, strictRequired: "log" });

module.exports.ajv = ajv;

module.exports.validateRequest = function validateRequest(validate, req, res = null) {
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