<script>
    import "font-awesome/css/font-awesome.min.css";
    import "./css/main.css";
    import "./css/register.css";
    import NavBar from "./components/NavBar.svelte";
</script>

<NavBar />

<main>
    <div class="container-global">
        <div class="container container-register">
            <h1>Bienvenue&nbsp;!</h1>
            <form action="" method="">
                <label for="pseudo">Pseudo</label>
                <input id="pseudo" name="pseudo" type="text"/>

                <label for="mail">Adresse Mail</label>
                <input id="mail" name="mail" type="text"/>

                <label for="pwd">Mot de passe</label>
                <input id="pwd" name="pwd" type="password"/>

                <label for="confirmpwd">Confirmation du mot de passe</label>
                <input id="confirmpwd" name="confirmpwd" type="password"/>

                <input type="submit" name="connect" value="Se connecter"/>
            </form>
        </div>

        <div class="container container-login">
            <h1>Vous êtes déjà inscrit&nbsp;?</h1>
            <p>Le compte MatchWatch est optionnel, mais il vous offre de nombreux avantages&nbsp;! <a href="/TODO">En savoir plus</a></p>
            <a href="login.html" id="login">Se connecter</a>
        </div>

    </div>
</main>

<footer>

</footer>