<script>
  import "font-awesome/css/font-awesome.min.css";
  import "./css/main.css";
  import "./css/profile.css";
  import NavBar from "./components/NavBar.svelte";

  let user;

  if (window.localStorage.getItem("username")) {
    user = {
      pseudo: window.localStorage.getItem("username"),
      mail: window.localStorage.getItem("mail"),
    };
  }
</script>

<NavBar />
<main>
  {#if user != null}
    <div class="informations">
      <div>
        <img src="" alt="" />
        <div class="informations">
          <div class="pp">
            <img src="" alt="" />
          </div>
          <div class="text">
            <h1 class="pseudo">{user.pseudo}</h1>
            <h2 class="mail">{user.mail}</h2>

            <div class="genres">
              <ul>
                <li>
                  <h2 class="genres">Genres préférés :</h2>
                  <ul>
                    <li>
                      <div>
                        <input type="checkbox" id="action" name="action" />
                        <label for="action">Action</label>
                      </div>
                    </li>
                    <li>
                      <div>
                        <input type="checkbox" id="comedy" name="comedy" />
                        <label for="comedy">Comedy</label>
                      </div>
                    </li>
                    <li>
                      <div>
                        <input type="checkbox" id="fantasy" name="fantasy" />
                        <label for="fantasy">Fantasy</label>
                      </div>
                    </li>
                    <li>
                      <div>
                        <input
                          type="checkbox"
                          id="adventure"
                          name="adventure"
                        />
                        <label for="adventure">Adventure</label>
                      </div>
                    </li>
                    <li>
                      <div>
                        <input
                          type="checkbox"
                          id="science-fiction"
                          name="science-fiction"
                        />
                        <label for="science-fiction">Science Fiction</label>
                      </div>
                    </li>
                    <li>
                      <div>
                        <input type="checkbox" id="thriller" name="thriller" />
                        <label for="thriller">Thriller</label>
                      </div>
                    </li>
                    <li>
                      <div>
                        <input type="checkbox" id="horror" name="horror" />
                        <label for="horror">Horror</label>
                      </div>
                    </li>
                    <li>
                      <div>
                        <input
                          type="checkbox"
                          id="animation"
                          name="animation"
                        />
                        <label for="animation">Animation</label>
                      </div>
                    </li>
                    <li>
                      <div>
                        <input type="checkbox" id="family" name="family" />
                        <label for="family">Family</label>
                      </div>
                    </li>
                    <li>
                      <div>
                        <input
                          type="checkbox"
                          id="documentary"
                          name="documentary"
                        />
                        <label for="documentary">Documentary</label>
                      </div>
                    </li>
                    <li>
                      <div>
                        <input type="checkbox" id="mystery" name="mystery" />
                        <label for="mystery">Mystery</label>
                      </div>
                    </li>
                    <li>
                      <div>
                        <input type="checkbox" id="drama" name="drama" />
                        <label for="drama">Drama</label>
                      </div>
                    </li>
                    <li>
                      <div>
                        <input type="checkbox" id="tv-movie" name="tv-movie" />
                        <label for="tv-movie">TV Movie</label>
                      </div>
                    </li>
                    <li>
                      <div>
                        <input type="checkbox" id="music" name="music" />
                        <label for="music">Music</label>
                      </div>
                    </li>
                    <li>
                      <div>
                        <input type="checkbox" id="crime" name="crime" />
                        <label for="crime">Crime</label>
                      </div>
                    </li>
                    <li>
                      <div>
                        <input type="checkbox" id="history" name="history" />
                        <label for="history">History</label>
                      </div>
                    </li>
                    <li>
                      <div>
                        <input type="checkbox" id="romance" name="romance" />
                        <label for="romance">Romance</label>
                      </div>
                    </li>
                    <li>
                      <div>
                        <input type="checkbox" id="war" name="war" />
                        <label for="war">War</label>
                      </div>
                    </li>
                    <li>
                      <div>
                        <input type="checkbox" id="western" name="western" />
                        <label for="western">Western</label>
                      </div>
                    </li>
                  </ul>
                  <input
                    class="button-valide"
                    type="button"
                    value="Valider mes genres"
                  />
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div class="lastviews">
        <h1>Derniers vus</h1>
      </div>

      <div class="reccos">
        <h1>Recomandations</h1>
      </div>
    </div>
  {:else}
    <div class="logged-out">Vous n'êtes pas connecté</div>
  {/if}
</main>

<footer />
