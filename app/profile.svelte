<script>
  import "font-awesome/css/font-awesome.min.css";
  import "./css/main.css";
  import "./css/profile.css";
  import NavBar from "./components/NavBar.svelte";

  document.addEventListener("DOMContentLoaded", (event) => {
    if (document.cookie != null) {
      let username = document.getElementById("pseudo");
      username.textContent = document.cookie.split(";")[0].split("=")[1];
      let mail = document.getElementById("mail");
      mail.textContent = document.cookie.split(";")[1].split("=")[1];
    }
  });
</script>

<NavBar />

<main>
  <div class="informations">
    <div class="pp">
      <img src="" alt="" />
    </div>
    <div class="text">
      <h1 class="pseudo" id="pseudo">Julien Lacroix</h1>
      <h2 class="mail" id="mail">mail@example.com</h2>
      <h2 class="genres" id="genres">Genres préférés :</h2>
    </div>
  </div>

  <div class="lastviews">
    <h1>Derniers vus</h1>
  </div>

  <div class="reccos">
    <h1>Recomandations</h1>
  </div>
</main>

<footer />
