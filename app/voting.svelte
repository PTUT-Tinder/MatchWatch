<script>
import "font-awesome/css/font-awesome.min.css";
import "./css/main.css";
import "./css/voting.css";
import NavBar from "./components/NavBar.svelte";
import sidebarImg from "./img/sidebar-toggle.svg";
import CreateRoom from "./create-room.svelte";

const roomId = new URL(location).searchParams.get("id");
let room;
let user;

fetch("/api/user/@me", {
	headers: {
		Authorization: window.localStorage.getItem("token"),
	},
}).then(async (res) => {
	const data = await res.json();

	if (!res.ok) {
		console.error(data);
		return;
	}

	user = data;
});

if (roomId == null) {
	location = "/create-room.html";
}

function updateRoom() {
	if (room?.status === "ended") {
		return;
	}

	return fetch("/api/room/" + roomId, {
		headers: {
			Authorization: window.localStorage.getItem("token"),
		},
	}).then(async (res) => {
		const data = await res.json();

		if (!res.ok) {
			console.error(data);
			return;
		}

		room = data;
	});
}

function updateStatus(newStatus) {
	const oldStatus = room.userStatus[user.id];

	room.userStatus[user.id] = {
		...oldStatus,
		...newStatus,
	};

	return fetch(`/api/room/${roomId}/update-status`, {
		method: "PATCH",
		headers: {
			Authorization: window.localStorage.getItem("token"),
			"Content-Type": "application/json",
		},
		body: JSON.stringify(newStatus),
	}).then(async (res) => {
		const data = await res.json();

		if (!res.ok) {
			console.error(data);
			room.userStatus[user.id] = oldStatus;
			return;
		}

		room = data;
	});
}

setInterval(updateRoom, 4000);
updateRoom();

function toggleArray(arr, item) {
	const index = arr.indexOf(item);

	let newArr;

	if (index > -1) {
		newArr = [...arr.slice(0, index), ...arr.slice(index + 1)];
	} else {
		newArr = [...arr, item];
	}

	return newArr;
}

const genreFilters = [
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

const genresPerPage = 5;

let genreIndex = 0;

let selectedGenres = [];

const dateFilters = [
	{ label: "1970 and before", span: [0, 1970] },
	{ label: "1970 - 1980", span: [1970, 1980] },
	{ label: "1980 - 1990", span: [1980, 1990] },
	{ label: "1990 - 2000", span: [1990, 2000] },
	{ label: "2000 - 2010", span: [2000, 2010] },
	{ label: "2010 and after", span: [2010, 99999] }, // TODO: This will break in a few millenia
];

let selectedDates = [];

let films;

fetch("/json/movies.json").then(async (res) => {
	const data = await res.json();

	if (!res.ok) {
		console.error(data);
		return;
	}

	films = data;
});

function setUpNext() {
	if (stepDisplayed === "genre" && selectedGenres.length > 0) {
		updateStatus({
			preferredGenres: selectedGenres,
		});

		stepDisplayed = "date";
	} else if (stepDisplayed === "date") {
		updateStatus({
			preferredDates: selectedDates.map((date) => date.span),
		});

		stepDisplayed = "waiting";
	}
}

function setUpBack() {
	if (stepDisplayed === "date") {
		stepDisplayed = "genre";
	}
	if (stepDisplayed === "waiting") {
		if (!room.userStatus[user.id].readyToVote) {
			stepDisplayed = "date";
		}
	}
}

function updateReady() {
	window.requestAnimationFrame(() => {
		updateStatus({
			readyToVote: room.userStatus[user.id].readyToVote,
		});
	});
}

let stepDisplayed = "genre"; // date | genre | waiting

let sidebarOpen = true;

function toggleSidebar() {
	sidebarOpen = !sidebarOpen;
}

let loading = true;
$: loading = films == null || user == null || room == null;

let currentSuggestions = [];
let approvedSuggestions = [];
$: approvedSuggestions = approvedSuggestions.filter(item => currentSuggestions.includes(item))
let loadingSuggestions = false;

function fetchSuggestions() {
	loadingSuggestions = true;

	return fetch(`/api/room/${roomId}/films`, {
		headers: {
			Authorization: window.localStorage.getItem("token"),
		},
	}).then(async (res) => {
		const data = await res.json();

		if (!res.ok) {
			console.error(data);
			return;
		}

		currentSuggestions = data;
		loadingSuggestions = false;
	});
}

function sendVotes() {
	const rejectedSuggestions = currentSuggestions.filter(
		(item) => !approvedSuggestions.includes(item)
	);

	loadingSuggestions = true;

	return fetch(`/api/room/${roomId}/films`, {
		method: "PUT",
		headers: {
			Authorization: window.localStorage.getItem("token"),
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			approved: approvedSuggestions,
			rejected: rejectedSuggestions,
		}),
	}).then(async (res) => {
		const data = await res.json();

		if (!res.ok) {
			console.error(data);
			return;
		}

		room = data;

		fetchSuggestions();
	});
}

$: {
	if (
		room &&
		room.status === "voting" &&
		currentSuggestions.length === 0 &&
		!loadingSuggestions
	) {
		fetchSuggestions();
	}
}

function handleMatchVoteChange(event) {
	if (String(acceptsMatch) === event.target.value) {
		acceptsMatch = null;
	}

	window.requestAnimationFrame(() => {
		updateStatus({
			acceptsMatch,
		});
	})
}

function* iterateArrayReverse(arr) {
	for (let i = arr.length - 1; i >= 0; i--) {
		yield arr[i];
	}
}

let acceptsMatch = null;

let popup = null;
</script>

<NavBar thick={true} />

<main class:sidebar-open={sidebarOpen && !loading && room.members.length >= 2}>
	{#if loading}
		<div class="setup">
			<h1>Loading...</h1>
		</div>
	{:else}
		<div
			class="central-container"
			class:setup={room.status === "setup"}
			class:voting={room.status === "voting"}
			class:match={room.status === "match"}
			class:ended={room.status === "ended"}
		>
			<div class="central-container-content">
				{#if room.status === "setup"}
					<div class="code-banner">
						<p>Tell the participants to use this code:</p>
						<code>{room.id}</code>
					</div>
					<header>
						{#if stepDisplayed === "genre"}
							<p class="step-count">Step 1/3.</p>
							<h1>What kind of film would you like to see?</h1>
							<p>
								Get spot-on suggestions based on your mood!<br />
								Feel free to select as many genres as you see fit.
							</p>
						{:else if stepDisplayed === "date"}
							<p class="step-count">Step 2/3.</p>
							<h1>Have a timespan in mind?</h1>
							<p>Find the right film for you, one you can connect with.</p>
						{:else if stepDisplayed === "waiting"}
							<p class="step-count">Step 3/3.</p>
							<h1>Now get get ready...</h1>
							<p>Is everyone here, or are you waiting for more people?</p>
						{/if}
					</header>
					{#if stepDisplayed === "genre"}
						<ul class="setup-select">
							{#each genreFilters as genre}
								<li
									class:select={selectedGenres.includes(genre)}
									on:click={() =>
										(selectedGenres = toggleArray(selectedGenres, genre))}
								>
									{genre}
								</li>
							{/each}
						</ul>

						<div class="button-container">
							<button
								class="btn"
								on:click={setUpNext}
								disabled={selectedGenres.length === 0}
							>
								Next
							</button>
						</div>
					{:else if stepDisplayed === "date"}
						<ul class="setup-select">
							{#each dateFilters as date}
								<li
									class:select={selectedDates.includes(date)}
									on:click={() =>
										(selectedDates = toggleArray(selectedDates, date))}
								>
									{date.label}
								</li>
							{/each}
						</ul>

						<div class="button-container">
							<button class="btn inverted-button" on:click={setUpBack}
								>Back</button
							>
							<button class="btn" on:click={setUpNext}>Next</button>
						</div>
					{:else if stepDisplayed === "waiting"}
						<div class="big-checkbox">
							<input
								type="checkbox"
								name="ready"
								id="ready"
								bind:checked={room.userStatus[user.id].readyToVote}
								on:input={updateReady}
							/>
							<label for="ready">Ready to continue!</label>
						</div>

						<p class="checkbox-supporting-text">
							{#if room.userStatus[user.id].readyToVote}
								Waiting for everyone to be ready...
							{:else}
								Check this box when everyone is here.
							{/if}
						</p>
						<div class="button-container">
							<button
								on:click={setUpBack}
								class="btn inverted-button"
								disabled={room.userStatus[user.id].readyToVote}
							>
								Back
							</button>
						</div>
					{/if}
				{:else if room.status === "voting"}
					{#if loadingSuggestions}
						<h1>Loading...</h1>
					{:else}
						<div class="film-container">
							{#each currentSuggestions as filmId}
								<button
									class="film"
									on:click={() =>
										(approvedSuggestions = toggleArray(
											approvedSuggestions,
											filmId
										))}
									class:selected={approvedSuggestions.includes(filmId)}
								>
									<img
										class="poster"
										src={films[filmId].poster}
										alt=""
										loading="lazy"
									/>
									<h4>{films[filmId].title}</h4>

									<button class="info-button" on:click|stopPropagation={() => popup = filmId}>?</button>
								</button>
							{/each}
						</div>

						<div class="button-container center">
							<button class="btn" on:click={sendVotes}>Next</button>
						</div>
					{/if}
				{:else if room.status === "match" || room.status === "ended"}
					{#if room.status === "ended"}
						<h1>Success! A consensus has been reached!</h1>

						<p>Hopefully, MatchWatch has been helpful to you and your group. We hope to see you again!</p>

						<p><strong>Enjoy the show!</strong></p>
					{:else}
						<h1>You got {room.newMatches >= 2 ? "new matches" : "a new match"}!</h1>

						<p>Many of you wanted {room.matchedFilms.length >= 2 ? "these films" : "this film"}, maybe consider {room.matchedFilms.length >= 2 ? "them" : "it"}?</p>
						
						<div class="match-vote">
							{#key room.status}
								<label>
									<input
										type="radio"
										bind:group={acceptsMatch}
										value={true}
										on:click={handleMatchVoteChange}
									/>
		
									<div class="radio-text">
										<h4>That's it!</h4>
										<p>End the vote</p>
									</div>
								</label>
							{/key}
	
							<label>
								<input
									type="radio"
									bind:group={acceptsMatch}
									value={false}
									on:click={handleMatchVoteChange}
								/>
	
								<div class="radio-text">
									<h4>Something else...</h4>
									<p>Keep voting</p>
								</div>
							</label>
						</div>
	
						{#if room.members.length > 1}
							<p>
								If {
									room.members.length < 5
										? "everyone"
										: `at least ${Math.ceil(room.members.length * 4 / 5)} participants`
								} approve of this match, voting will end.
							</p>
						{/if}
					{/if}
					

					<div class="film-container">
						{#each [...iterateArrayReverse(room.matchedFilms)] as filmId, index}
							<button
								class="film"
								class:glow={index < room.newMatches}
							>
								<img
									class="poster"
									src={films[filmId].poster}
									alt=""
									loading="lazy"
								/>
								<h4>{films[filmId].title}</h4>

								<button class="info-button" on:click={() => popup = filmId}>?</button>
							</button>
						{/each}
					</div>
				{/if}
			</div>
		</div>

		{#if room.members.length >= 2}
			<aside class="sidebar">
				<ul class="user-list">
					{#each room.members as memberId}
						<li>
							<h3 class="username">
								{room.userStatus[memberId].displayName}
								{#if memberId === user.id}
									<span class="you-label">(you)</span>
								{/if}
							</h3>

							{#if room.status === "setup"}
								{#if room.userStatus[memberId].preferredGenres == null || room.userStatus[memberId].preferredDates == null}
									Choosing preferences...
								{:else if !room.userStatus[memberId].readyToVote}
									Waiting for more people...
								{:else}
									Ready!
								{/if}
							{:else if room.status === "voting"}
								{
								 room.userStatus[memberId].filmsApproved.toLocaleString()
								}/{
									room.userStatus[memberId].filmsSeen.toLocaleString()
								} films approved
								
								({Math.round(
									room.userStatus[memberId].filmsApproved /
									room.userStatus[memberId].filmsSeen *
									100
								) || 0}%)

								<div
									class="film-approval-ratio"
									style="--progress: {Math.round(
										room.userStatus[memberId].filmsApproved /
										room.userStatus[memberId].filmsSeen *
										100
									) || 0}%"
								>
									<div class="ratio-bar" />
								</div>
							{:else if room.status === "match"}
								{#if room.userStatus[memberId].acceptsMatch === null}
									Choosing...
								{:else if room.userStatus[memberId].acceptsMatch === true}
									It's a match!<br/>Voted to end selection.
								{:else if room.userStatus[memberId].acceptsMatch === false}
									Not a fan...<br/>Voted to keep going.
								{/if}
							{/if}
						</li>
					{/each}
				</ul>
				<button class="sidebar-toggle" on:click={toggleSidebar}>
					<img src={sidebarImg} alt="" />
				</button>
			</aside>
		{/if}
	{/if}
</main>

{#if popup}
	<div class="popup">
		<img
			class="poster"
			src={films[popup].poster}
			alt=""
			loading="lazy"
		/>

		<div class="description">
			<h1>{films[popup].title}</h1>

			<p>
				{films[popup].overview}
			</p>

			<ul class="genres">
				{#each films[popup].genres as genre}
					<li>{genre}</li>
				{/each}
			</ul>

			<div class="button-container center">
				<button class="btn" on:click={() => popup = null}>Close</button>
			</div>
		</div>
	</div>

	<div class="popup-background" on:click={() => popup = null} />
{/if}