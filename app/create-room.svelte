<script>
    import "font-awesome/css/font-awesome.min.css";
    import "./css/main.css";
    import "./css/create-room.css";
    import NavBar from "./components/NavBar.svelte";
    import "./js/create-room.js"

    function createRoom() {

    }
</script>

<NavBar />

<main>
    <div>
        <div class="ensemble">
            <div class="zone-bleu">
                <h1 class="bienvenue">Bienvenue&nbsp;!</h1>
                <form action="">
                    <div>
                        <h2>Choisissez votre nom, il sera affiché aux autres</h2>
                        <input class="input-nom" type="text" id="name" name="name">
                    </div>
                    <p>Un salon sera créé, ainsi qu’un code de 6 caractères.</p>
                    <p>Les participants pourront utiliser ce code pour vous rejoindre dans le salon, et vous pourrez
                        choisir un film ensemble</p>
                    <div class="position-bouton-suivant">
                        <input class="bouton-suivant" type="submit" value="Suivant" on:click="createRoom">
                    </div>
                </form>
                <div class="position-lien">
                    <a class="lien" href="join-room.html">J'ai déja un code, rejoindre un salon</a>
                </div>
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
