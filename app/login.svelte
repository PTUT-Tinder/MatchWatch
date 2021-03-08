<script>
  import "font-awesome/css/font-awesome.min.css";
  import "./css/main.css";
  import "./css/login.css";
  import NavBar from "./components/NavBar.svelte";

  function connexion(e) {
    e.preventDefault();
    e.stopPropagation();
    fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        password: document.getElementById("pwd").value,
        email: document.getElementById("mail").value,
      }),
    })
      .then((res) => res.json())
      .then((data) => console.log(data))
      .catch((err) => console.log(err));
  }
</script>

<NavBar />

<main>
  <div class="container-global">
    <div class="container container-login">
      <h1>Bienvenue&nbsp;!</h1>
      <form action="" method="">
        <label for="mail">Adresse Email</label>
        <input id="mail" name="mail" type="text" />

        <label for="pwd">Mot de Passe</label>
        <input id="pwd" name="pwd" type="password" />

        <input
          type="submit"
          name="connect"
          value="Se connecter"
          on:click={connexion}
        />
      </form>
    </div>

    <div class="container container-inscr">
      <h1>Vous n’êtes pas déjà inscrit&nbsp;?</h1>
      <p>
        Le compte MatchWatch est optionnel, mais il vous offre de nombreux
        avantages&nbsp;! <a href="/TODO">En savoir plus</a>
      </p>
      <a href="register.html" id="inscr">S'inscrire</a>
    </div>
  </div>
</main>

<footer />
