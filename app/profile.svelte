<script>
    import "font-awesome/css/font-awesome.min.css";
    import "./css/main.css";
    import "./css/profile.css";
    import NavBar from "./components/NavBar.svelte";
</script>

<NavBar />

<main>
    <div class="informations">
        <div class="pp">
            <img src="" alt="" />
        </div>
        <div class="text">
            <h1 class="pseudo">Julien Lacroix</h1>
            <h2 class="mail">mail@example.com</h2>
            
            <div class="genres">
                <ul>
                    <li>
                        <h2 class="genres">Genres préférés :</h2>
                        <ul>
                            <li>
                                <div>
                                    <input
                                        type="checkbox"
                                        id="action"
                                        name="action"
                                    />
                                    <label for="action">Action</label>
                                </div>
                            </li>
                            <li>
                                <div>
                                    <input
                                        type="checkbox"
                                        id="aventure"
                                        name="aventure"
                                    />
                                    <label for="aventure">Aventure</label>
                                </div>
                            </li>
                            <li>
                                <div>
                                    <input
                                        type="checkbox"
                                        id="thriller"
                                        name="thriller"
                                    />
                                    <label for="thriller">Thriller</label>
                                </div>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
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
