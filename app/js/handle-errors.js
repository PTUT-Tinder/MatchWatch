export default function handleErrors(res, data) {
	if (!res.ok) {
		let err;

		if (typeof data.error == "string") {
			err = data.error;
		} else if (Array.isArray(data.error)) {
			err = data.error.map(err => `- ${err}`).join("\n");
		} else {
			err = "unknown error";
		}

		alert(err);

		throw new Error(err);
	}
}