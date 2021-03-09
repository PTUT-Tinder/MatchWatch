<script>
  import "hamburgers/dist/hamburgers.min.css";
  import "font-awesome/css/font-awesome.min.css";
  import "../css/main.css";
  import logo from "../img/logo.svg";

  let open = false;

  function toggleSidebar() {
    open = !open;
  }

  document.addEventListener("DOMContentLoaded", (event) => {
    console.log(document.cookie);
    if (document.cookie == null) {
      let profile = document.getElementById("profile");
      profile.style.display = "none";
    }
  });
</script>

<nav>
  <div class="toggle">
    <button
      class="hamburger hamburger--spin"
      class:is-active={open}
      type="button"
      on:click={toggleSidebar}
    >
      <span class="hamburger-box">
        <span class="hamburger-inner" />
      </span>
    </button>
  </div>
  <div id="nav-bar">
    <div class="responsive-container" class:active={open}>
      <ul class="responsive">
        <li>
          <a class="nav-button" href="/"
            ><img class="logo" src={logo} alt="MatchWatch" /></a
          >
        </li>
        <li>
          <a class="nav-button" href="join-room.html" id="joinRoom"
            >Rejoindre un salon</a
          >
        </li>
        <li>
          <a class="nav-button" href="create-room.html" id="createRoom"
            >Créer un salon</a
          >
        </li>
        <li>
          <a class="nav-button" href="profile.html" id="profile">Mon profile</a>
        </li>
      </ul>
    </div>

    <div class="button-container">
      <li><a href="login.html" id="login">Se connecter</a></li>
      <li><a href="register.html" id="register">S'inscrire</a></li>
    </div>
  </div>
</nav>

<style>
  nav {
    position: absolute;
  }

  #nav-bar {
    margin-top: 50px;
    display: flex;
    width: 100%;
  }

  #nav-bar,
  #nav-bar ul {
    list-style-type: none;
  }

  #nav-bar ul {
    display: inline-block;
  }

  .button-container {
    width: 300px;
    height: 75px;
    display: flex;
    position: fixed;
    right: 50px;
    margin-top: 50px;
  }

  .toggle {
    position: fixed;
    top: 40px;
    left: 50px;
    transform: translate(-25%, -25%);
    padding: 10px 20px;
    color: white;
    font-size: 40px;
    z-index: 100;
  }

  .responsive-container {
    display: none;
  }

  .responsive {
    position: fixed;
    left: 0;
    top: 0;
    width: 350px;
    background: #1e232f;
    padding: 0;
    padding-top: 150px;
    height: 100%;
    box-shadow: 0 0 10px black;
    margin: 0;
  }

  .responsive .logo {
    width: 200px;
  }

  .nav-button {
    display: block;
    margin: 0;
    text-align: center;
    font-size: 20px;
    padding: 1em;
    color: white;
  }

  .nav-button:hover {
    background-color: #14171f;
  }

  #nav-bar a {
    text-decoration: none;
    vertical-align: middle;
    transition: 0.2s;
  }

  #nav-bar #register,
  #nav-bar #login {
    font-weight: bold;
    white-space: nowrap;
    width: 150px;
    border-radius: 5px;
    padding: 10px 20px;
    border: 2px solid white;
    margin: 0 15px;
  }

  #nav-bar #register,
  #nav-bar #login:hover {
    color: black;
    background-color: white;
  }

  #nav-bar #login,
  #nav-bar #register:hover {
    color: white;
    background: none;
  }

  .active {
    display: block;
  }

  @media (max-width: 768px) {
    .responsive {
      width: 100%;
    }
  }

  .hamburger-inner,
  .hamburger-inner::after,
  .hamburger-inner::before,
  .hamburger.is-active .hamburger-inner,
  .hamburger.is-active .hamburger-inner::after,
  .hamburger.is-active .hamburger-inner::before {
    background-color: #fff;
  }
</style>
