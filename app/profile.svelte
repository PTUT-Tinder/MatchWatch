<script>
	import "font-awesome/css/font-awesome.min.css";
	import "./css/main.css";
	import "./css/profile.css";
	import NavBar from "./components/NavBar.svelte";
	import "./js/profile.js";
	import handleErrors from "./js/handle-errors";

	let user;
	let editing = false;
	let form;
	let genre;
	let newPassword;
	let oldPassword;

	function saveChanges() {
		const body = {
			email: user.email,
			username: user.username,
			favoriteGenres: user.favoriteGenres,
		};
	
		if (oldPassword && newPassword) {
			body.oldPassword = oldPassword;
			body.newPassword = newPassword;

			oldPassword = "";
			newPassword = "";
		}

		return fetch("/api/user/@me", {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
				"Authorization": window.localStorage.getItem("token"),
			},
			body: JSON.stringify(body),
		})
			.then(async (res) => {
				const data = await res.json();

				handleErrors(res, data);

				user = data;
			})
			.catch((err) => console.log(err));
	}

	function genreSubmit(event) {
		event.preventDefault();
		user.favoriteGenres = [...new FormData(form).keys()];
		
		return saveChanges();
	}

	function formSubmit(event) {
		event.preventDefault();

		editing = !editing;
		if (editing) {
			return;
		}

		return saveChanges();
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

	if (window.localStorage.getItem("token") != null) {
		fetch("/api/user/@me", {
			headers: {
				Authorization: window.localStorage.getItem("token"),
			},
		})
			.then(async (res) => {
				const data = await res.json();

				handleErrors(res, data);

				if (!data.id.startsWith("temp_")) {
					user = data;
				}
			})
			.catch((err) => console.log(err));
	}
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
							<form action="" method="" on:submit={formSubmit}>
								{#if editing}
									<input type="text" bind:value={user.username} />
								{:else}
									<h1 class="pseudo">{user.username}</h1>
								{/if}

								<input type="submit" value="" class="icon" />
							</form>
							<form action="" method="" on:submit={formSubmit}>
								{#if editing}
									<input type="text" bind:value={user.email} />
								{:else}
									<h2 class="mail">{user.email}</h2>
								{/if}

								<input type="submit" value="" class="icon" />
							</form>
							{#if editing}
							<form action="" method="" on:submit={formSubmit}>
								<label for="oldPwd">Current password</label>
									<input type="password" bind:value={oldPassword} id="oldPwd"  name="oldPwd"/>
									<label for="newPwd">New password</label>
									<input type="password" bind:value={newPassword} id="newPwd" name="newPwd"/>
								
								<input type="submit" value="" class="icon" />
							</form>
							{/if}
						</div>
					</div>
					<div class="genres">
						<ul class="zone-genre">
							<li>
								<h2 class="genres">Favourites genres</h2>
								<form
									id="formulaireGenre"
									action=""
									method=""
									on:submit={genreSubmit}
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
														checked={user.favoriteGenres?.includes(genre)}
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
										value="Validate"
										id="genre"
									/>
								</form>
							</li>
						</ul>
					</div>
				</div>
			</div>

			<div class="lastviews">
				<h1>Last match</h1>
			</div>

			<div class="reccos">
				<h1>Watch later</h1>
			</div>
		</div>
	{:else}
		<div class="logged-out">You are not logged in</div>
	{/if}
</main>

<footer />
