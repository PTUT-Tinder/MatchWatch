<script>
	import "font-awesome/css/font-awesome.min.css";
	import "./css/main.css";
	import "./css/register.css";
	import NavBar from "./components/NavBar.svelte";

	function inscription(e) {
		window.localStorage.setItem("username", document.getElementById("pseudo").value);
		window.localStorage.setItem("mail", document.getElementById("mail").value);
		
		fetch("/api/register", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				username: document.getElementById("pseudo").value,
				password: document.getElementById("pwd").value,
				email: document.getElementById("mail").value,
			}),
		})
			.then((res) => res.json())
			.then((data) => console.log(data))
			.catch((err) => console.log(err));
	}
</script>

<NavBar />

<main>
	<div class="container-global">
		<div class="container container-register">
			<h1>Bienvenue&nbsp;!</h1>
			<form action="" method="">
				<label for="pseudo">Pseudo</label>
				<input id="pseudo" name="pseudo" type="text" />

				<label for="mail">Adresse Mail</label>
				<input id="mail" name="mail" type="text" />

				<label for="pwd">Mot de passe</label>
				<input id="pwd" name="pwd" type="password" />

				<label for="confirmpwd">Confirmation du mot de passe</label>
				<input id="confirmpwd" name="confirmpwd" type="password" />

				<input
					type="submit"
					name="connect"
					value="S'inscrire'"
					id="register"
					on:click={inscription}
				/>
			</form>
		</div>

		<div class="container container-login">
			<h1>Vous êtes déjà inscrit&nbsp;?</h1>
			<p>
				Le compte MatchWatch est optionnel, mais il vous offre de nombreux
				avantages&nbsp;! <a href="/TODO">En savoir plus</a>
			</p>
			<a href="login.html" id="login">Se connecter</a>
		</div>
	</div>
</main>

<footer />
