module.exports = function userToJson(user) {
	return {
		id: user.get("id").toString(),
		username: user.get("username"),
		email: user.get("email"),
		favoriteGenres: user.get("genre")?.split(", ") ?? [],
	};
}