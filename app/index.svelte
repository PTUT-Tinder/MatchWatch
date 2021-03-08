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
            <h1>Trouvez le film</h1>
            <h3>qui va mettre <br>tout le monde d'accord</h3>
            <a href="create-room.html" id="chooseFilm">Choisir un film</a>
        </div>
    </div>

    <div id="container">
        <h1>1&hellip; 2&hellip; 3&hellip; Trouvé&nbsp;!</h1>
        <div id="1" class="etapes">
            <h1>1</h1>
            <p>Connectez-vous avec vos amis ou commencez une session solo</p>
        </div>

        <div id="2" class="etapes">
            <h1>2</h1>
            <p>Choisissez rapidement vos films préférés parmis les propositions</p>
        </div>

        <div id="3" class="etapes">
            <h1>3</h1>
            <p>Profitezzz&nbsp;!</p>
        </div>
    </div>
</main>

<footer>

</footer>
