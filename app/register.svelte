<script>
	import "font-awesome/css/font-awesome.min.css";
	import "./css/main.css";
	import "./css/register.css";
	import NavBar from "./components/NavBar.svelte";
	import handleErrors from "./js/handle-errors";

	let username;
	let password;
	let email;

	function register(event) {
		event.preventDefault();

		fetch("/api/register", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				username,
				password,
				email,
			}),
		})
			.then(async (res) => {
				const data = await res.json();
				
				handleErrors(res, data)

				window.localStorage.setItem("token", data.token);

				location = "/";
			})
			.catch((err) => console.log(err));
	}
</script>

<NavBar />

<main>
	<div class="container-global">
		<div class="container container-register">
			<h1>Bienvenue&nbsp;!</h1>
			<form action="" method="" on:submit={register}>
				<label for="pseudo">Pseudo</label>
				<input bind:value={username} id="pseudo" name="pseudo" type="text" />

				<label for="mail">Adresse Mail</label>
				<input bind:value={email} id="mail" name="mail" type="text" />

				<label for="pwd">Mot de passe</label>
				<input bind:value={password} id="pwd" name="pwd" type="password" />

				<label for="confirmpwd">Confirmation du mot de passe</label>
				<input id="confirmpwd" name="confirmpwd" type="password" />

				<input type="submit" name="connect" value="S'inscrire" id="register" />
			</form>
		</div>

		<div class="container container-login">
			<h1>Vous êtes déjà inscrit&nbsp;?</h1>
			<p>
				Le compte MatchWatch est optionnel, mais il vous offre de nombreux
				avantages&nbsp;! <a id="about" href="/about.html">En savoir plus</a>
			</p>
			<a href="login.html" id="login">Se connecter</a>
		</div>
	</div>
</main>

<footer />
