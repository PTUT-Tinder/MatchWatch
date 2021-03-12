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
			<h1>Welcome</h1>
			<form action="" method="" on:submit={register}>
				<label for="pseudo">Pseudo</label>
				<input bind:value={username} id="pseudo" name="pseudo" type="text" />

				<label for="mail">e-mail</label>
				<input bind:value={email} id="mail" name="mail" type="text" />

				<label for="pwd">Password</label>
				<input bind:value={password} id="pwd" name="pwd" type="password" />

				<label for="confirmpwd">Password confirmation</label>
				<input id="confirmpwd" name="confirmpwd" type="password" />

				<input type="submit" name="connect" value="S'inscrire" id="register" />
			</form>
		</div>

		<div class="container container-login">
			<h1>Already registered?</h1>
			<p>
				A MatchWatch account is optionnal, but gives you great advantages ! <a id="about" href="/about.html">More</a>
			</p>
			<a href="login.html" id="login">Log in</a>
		</div>
	</div>
</main>

<footer />
