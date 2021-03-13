<script>
    import "font-awesome/css/font-awesome.min.css";
    import "./css/main.css";
    import "./css/about.css";
    import NavBar from "./components/NavBar.svelte";
</script>

<NavBar />

<main>
    <div class="ensemble">
        <div class="zone-bleu">
            <h1 class="bienvenue">A Propos</h1>

            <p>
                A MatchWatch account is optionnal, but gives you many advantages!
            </p>
            <p>
                Wanna save some time? Set your <strong>favourite movie genres</strong> so you don't have to set them again!
            </p>
            <p>
                Right movie, wrong time? Add it to your "<strong>Watch Later</strong>" list by clicking the star!
            </p>
            <p>
                Keep an eye on your <strong>last matches</strong> from your profile.
            </p>
        </div>
        <div class="zone-bleu">
            <h1 class="titre2">Now that you know about that</h1>
            <p>
                A MatchWatch account is optionnal, but gives you many advantages!
            </p>
            <div class="disposition-bouton">
                <a href="login.html" class="btn-connecter">Log in</a>
                <a href="register.html" class="btn-register">Register</a>
            </div>
        </div>
    </div>
</main>

<footer />
