<script>
	import "font-awesome/css/font-awesome.min.css";
	import "./css/main.css";
	import "./css/login.css";
	import NavBar from "./components/NavBar.svelte";
	import "./js/profile.js";
	import handleErrors from "./js/handle-errors";

	let email;
	let password;

	function login(event) {
		event.preventDefault();

		fetch("/api/login", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				email,
				password,
			}),
		})
			.then(async (res) => {
				const data = await res.json();
				
				handleErrors(res, data);

				window.localStorage.setItem("token", data.token);

				location = "/";
			})
			.catch((err) => console.log(err));
	}
</script>

<NavBar />

<main>
	<div class="container-global">
		<div class="container container-login">
			<h1>Welcome !</h1>
			<form action="" method="" on:submit={login}>
				<label for="mail">e-mail</label>
				<input bind:value={email} id="mail" name="mail" type="text" />

				<label for="pwd">Password</label>
				<input bind:value={password} id="pwd" name="pwd" type="password" />

				<input type="submit" name="connect" value="Log in" />
			</form>
		</div>

		<div class="container container-inscr">
			<h1>Not registered ?</h1>
			<p>
				A MatchWatch account is optionnal, but gives you great advantages ! <a href="/about.html">More</a>
			</p>
			<a href="register.html" id="inscr">Register</a>
		</div>
	</div>
</main>

<footer />
