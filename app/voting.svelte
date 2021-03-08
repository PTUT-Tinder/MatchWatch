<script>
    import "font-awesome/css/font-awesome.min.css";
    import "../css/main.css";
    import "../css/voting.css";
    import "./js/main.js";
    import NavBar from "./components/NavBar.svelte";
    import logo from "./img/logo.svg";
</script>

<NavBar />

<nav>
    <div class="toggle">
        <button class="hamburger hamburger--spin" type="button">
            <span class="hamburger-box">
                <span class="hamburger-inner"></span>
            </span>
        </button>
        
    </div>
    <ul id="nav-bar">
        <li><a href="index.html"><img src={logo} alt="logoMatchWatch"/></a></li>
        <div class="responsive-container">
            <ul class="responsive">
                <li><a href="#" id="joinSloon">Rejoindre un salon</a></li>
                <li><a href="creation_salon.html" id="createSaloon">Créer un salon</a></li>
                <li><a href="profile.html" id="profile">Mon profile</a></li>
            </ul> 
        </div>
    </ul>
</nav>

<main>
    <div class="container-films">
    </div>

    <div class="reroll">
        <button>Reroll</button>
    </div>
</main>