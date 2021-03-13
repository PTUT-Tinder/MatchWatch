<script>
    import "font-awesome/css/font-awesome.min.css";
    import "./css/main.css";
    import NavBar from "./components/NavBar.svelte";
    import logo from "./img/logo.svg";
</script>

<NavBar />

<main>
    <div id="slogan">
        <img src={logo} alt="logoMatchWatch" />
        <div>
            <h1>Find the movie</h1>
            <h3>that will please everybody</h3>
            <a href="create-room.html" id="chooseFilm">Choose a movie</a>
        </div>
    </div>

    <div id="container">
        <h1>1... 2... 3... It's a match!</h1>
        <div id="1" class="etapes">
            <h1>1</h1>
            <p>Choose a film with your friends or start a solo session</p>
        </div>

        <div id="2" class="etapes">
            <h1>2</h1>
            <p>Quickly pick your favourite movies among the suggestions</p>
        </div>

        <div id="3" class="etapes">
            <h1>3</h1>
            <p>Enjoy!</p>
        </div>
    </div>
</main>

<footer>

</footer>
