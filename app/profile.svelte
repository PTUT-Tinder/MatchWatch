<script>
	import "font-awesome/css/font-awesome.min.css";
	import "./css/main.css";
	import "./css/profile.css";
	import NavBar from "./components/NavBar.svelte";
	import "./js/profile.js";
	import { text } from "svelte/internal";

	let user;
	let editing = false;
	let genrePerso;

	if (window.localStorage.getItem("username")) {
		user = {
			pseudo: window.localStorage.getItem("username"),
			mail: window.localStorage.getItem("mail"),
			genre: genrePerso,
		};
	}

	let form;
	let genre;

	function validerGenre(event) {
		event.preventDefault();
		genre = [...new FormData(form).keys()];
		console.log(genre);
		fetch("/api/genre", {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				username: window.localStorage.getItem("username"),
				genre,
			}),
		});
	}

	function changeInfos(event) {
		event.preventDefault();

		editing = !editing;
		if (editing) {
			return;
		}

		fetch("/api/modify", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				newUsername: user.pseudo,
				oldUsername: window.localStorage.getItem("username"),
				newEmail: user.mail,
				oldEmail: window.localStorage.getItem("mail"),
			}),
		})
			.then(() => {
				window.localStorage.setItem("username", user.pseudo);
				window.localStorage.setItem("mail", user.mail);
			})
			.catch((err) => console.log(err));
	}
	const genresList = [
		"Action",
		"Comedy",
		"Fantasy",
		"Adventure",
		"Science Fiction",
		"Thriller",
		"Horror",
		"Animation",
		"Family",
		"Documentary",
		"Mystery",
		"Drama",
		"TV Movie",
		"Music",
		"Crime",
		"History",
		"Romance",
		"War",
		"Western",
	];

	fetch("/api/genre/" + user.pseudo)
		.then((res) => res.json())
		.then((data) => {
			user.genre = data.genre;
			console.log(genrePerso);
		})
		.catch((err) => console.log(err));
</script>

<NavBar />
<main>
	{#if user != null}
		<div class="informations">
			<div>
				<img src="" alt="" />
				<div class="categorie-informations">
					<div class="infoPrincipal">
						<div class="pp">
							<img src="" alt="" />
						</div>
						<div class="text">
							<form action="" method="" on:submit={changeInfos}>
								{#if editing}
									<input type="text" bind:value={user.pseudo} />
								{:else}
									<h1 class="pseudo">{user.pseudo}</h1>
								{/if}

								<input type="submit" value="" class="icon" />
							</form>
							<form action="" method="" on:submit={changeInfos}>
								{#if editing}
									<input type="text" bind:value={user.mail} />
								{:else}
									<h2 class="mail">{user.mail}</h2>
								{/if}

								<input type="submit" value="" class="icon" />
							</form>
						</div>
					</div>
					<div class="genres">
						<ul class="zone-genre">
							<li>
								<h2 class="genres">Genres préférés :</h2>
								<form
									id="formulaireGenre"
									action=""
									method=""
									on:submit={validerGenre}
									bind:this={form}
								>
									<ul>
										{#each genresList as genre}
											<li>
												<div>
													<input
														type="checkbox"
														id={genre}
														name={genre}
														checked={user.genre?.includes(genre)}
													/>
													<label for={genre}>{genre}</label>
												</div>
											</li>
										{/each}
									</ul>
									<input
										class="button-valide"
										type="submit"
										name="genre"
										value="Valider"
										id="genre"
									/>
								</form>
							</li>
						</ul>
					</div>
				</div>
			</div>

			<div class="lastviews">
				<h1>Derniers vus</h1>
			</div>

			<div class="reccos">
				<h1>A regarder plus tard</h1>
			</div>
		</div>
	{:else}
		<div class="logged-out">Vous n'êtes pas connecté</div>
	{/if}
</main>

<footer />
