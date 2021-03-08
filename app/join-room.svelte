<script>
    import "font-awesome/css/font-awesome.min.css";
    import "./css/main.css";
    import "./css/join-room.css";
    import NavBar from "./components/NavBar.svelte";
</script>

<NavBar />

<main>
    <div>
        <div class="ensemble">
            <div class="zone-bleu">
                <h1 class="bienvenue">Bienvenue&nbsp;!</h1>
                <form action="">
                    <div>
                        <h2>Entrez un code de session&nbsp;:</h2>
                        <input class="input-nom" type="text" id="name" name="name">
                    </div>
                    <p>Entrez le code à 6 caractères fourni.</p>
                    <p>Vous rejoindrez le salon correspondant et pourrez profiter au maximum de la puissance redoutable de notre algorithme.</p>
                    <div class="position-bouton-suivant">
                        <input class="bouton-suivant" type="submit" value="Suivant">
                    </div>
                </form>
            </div>
            <div class="zone-bleu">
                <h1 class="titre2">Vous venez ici souvent&nbsp;?</h1>
                <p>Le compte MatchWatch est optionnel, mais il vous offre de nombreux avantages&nbsp;!
                    <a class="lien-more" href="about.html">En savoir plus</a>
                </p>
                <div class="disposition-bouton">
                    <a href="login.html" class="btn-connecter">Se connecter</a>
                    <a href="register.html" class="btn-register">S'inscrire</a>
                </div>
            </div>
        </div>
    </div>
</main>

<footer>

</footer>