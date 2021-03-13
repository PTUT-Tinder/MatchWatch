<script>
	import "font-awesome/css/font-awesome.min.css";
	import "./css/main.css";
	import "./css/create-room.css";
	import NavBar from "./components/NavBar.svelte";
	import handleErrors from "./js/handle-errors";
	import ensureTokenValidity from "./js/ensure-token-validity";

	let displayName;

	async function createRoom(event) {
		event.preventDefault();

		await ensureTokenValidity();

		if (window.localStorage.getItem("token") == null) {
			await fetch("/api/create-temp-user", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					username: displayName,
				}),
			})
				.then(async (res) => {
					const data = await res.json();

					handleErrors(res, data);

					window.localStorage.setItem("token", data.token);
				})
		}

		await fetch("/api/room/create", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"Authorization": window.localStorage.getItem("token")
			},
			body: JSON.stringify({
				 displayName,
			}),
		})
			.then(async (res) => {
				const data = await res.json();

				handleErrors(res, data);

				window.localStorage.setItem("room-id", data.id);
				window.location = "voting.html?id=" + data.id;
			})
			.catch((err) => console.log(err));
	}
</script>

<NavBar />

<main>
	<div>
		<div class="ensemble">
			<div class="zone-bleu">
				<h1 class="bienvenue">Welcome !</h1>
				<form action="" method="" on:submit={createRoom}>
					<div>
						<h2>Choose your name, it will be shown to the other</h2>
						<input
							class="input-nom"
							type="text"
							id="name"
							name="name"
							bind:value={displayName}
						/>
					</div>
					<p>A room will be created, with a 6 letter long code.</p>
					<p>
						People will use this code to join your room, so you will choose a movie together.
					</p>
					<div class="position-bouton-suivant">
						<input class="bouton-suivant" type="submit" value="Next" />
					</div>
				</form>
				<div class="position-lien">
					<a class="lien" href="join-room.html"
						>I already have a code, join a room</a
					>
				</div>
			</div>
			<div class="zone-bleu">
				<h1 class="titre2">Do you come here often ?</h1>
				<p>
					A MatchWatch account is optionnal, but gives you great advantages !
					<a class="lien-more" href="about.html">More</a>
				</p>
				<div class="disposition-bouton">
					<a href="login.html" class="btn-connecter">Log in</a>
					<a href="register.html" class="btn-register">Register</a>
				</div>
			</div>
		</div>
	</div>
</main>

<footer />
