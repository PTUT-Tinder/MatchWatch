export default async function ensureTokenValidity() {
	const token = window.localStorage.getItem("token");

	if (token != null) {
		const res = await fetch("/api/user/@me", {
			headers: {
				Authorization: token,
			}
		});

		if (!res.ok) {
			window.localStorage.removeItem("token");
		}
	}
}