# Un résumé de Vite & Svelte

Vite et Svelte sont tout les deux des outils utilisés en dévelopment front-end web.

Svelte offre les plus gros avantages. Nous l'utilisons avec Vite. Vite a aussi des avantages, mais de façon moins concrète.

Comme Svelte dépend de Vite, je vais l'expliquer en premier. Gardez à l'esprit que j'ai mis en place Vite afin d'utiliser Svelte, le meilleur viendra donc après, faites-moi confiance 🙏.

## Vite, un compilateur de JavaScript

Quand on utilise Node.js, on peut faire ceci

```js
const express = require("express");
```

Les modules de Node.js sont pratiques, ils offrent une façon plus simple d'utiliser du code externe comparée à `<script src="...">` en HTML.

Des gens se sont dit que ce serait bien si on pouvait faire pareil sur les navigateurs. Ainsi sont nés les empaqueteurs de code.

Par exemple, sur vite, au lieu de faire

```html
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
```

Grace à Vite, il est possible de faire

```html
<script>
import $ from "jquery";
// Maintenant on a le $ de JQuery
</script>
```

Cette solution à plusieurs avantages.

- Elle évite de charger du code d'un autre serveur. Le code de JQuery est inclut par Vite sur notre serveur.
- Elle est plus fiable, le chargement ne peut pas échouer tout seul.
- Elle est moins pénible, car le fait que JQuery charge avant le code, dans le bon ordre, est garantie.
- Elle est plus prévisible, car on sait le nom de la variable qu'on importe.

## Les modules JavaScript

```js
import "cocacola";
```

Ca va lancer le code dans le module cocacola, sans sauvegarder de variable.

Mais d'où vient cocacola? Il vient de pnpm, comme les autres modules Node.js.

Vous pouvez voir la liste des modules qu'on a installé dans notre package.json.

Vous pouvez installer un module avec

```sh
pnpm add cocacola
```

Si vous n'avez pas pnpm, [installez-le ici](https://pnpm.js.org/installation).


-------------

Il est possible d'aller chercher un fichier spécifique dans un module, comme ça

```
import "cocacola/chats/garfield.js";
```

Il est aussi possible d'aller chercher un fichier JS dans le projet, relativement au fichier actuel.

En commencant le chemin par "./", on prend on module dans le même dossier. Si je suis dans "src/module/a", `import "./b"` va mener à "src/module/b". `import "./utils/b"` va mener à "src/module/utils/b".

En commencant par "../" on va un dossier en arrière, donc `import "../b"` mènerai à "src/b". On peut le faire plusieurs fois, donc `import "../../b"` mène à "b" tout court.

**L'import ne peut pas être placé dans une fonction ou un block, il doit être "à l'extérieur", sinon ça crashera**

------------

## Créer ses propres modules

Le module que l'on importe peut décider d'exporter des variables grâce au mot clé "export".

```js
export leNombre = 123;

export function additionner(a, b) {
	return a + b;
}
```

On peut importer ainsi

```js
import { additionner, leNombre } from "./b";

console.log(additionner(123000, leNombre)); // 123123
```

Il est possible de l'écrire en plusieur lignes

```js
import {
	additionner,
	leNombre,
} from "./b";
```

Si on veut renommer les valeurs, la syntaxe est un peu compliquée

```js
import {
	additionner as add,
	leNombre as num,
} from "./b";

console.log(add(123000, num)); // 123123
```

Le module peut définir un export comme "default"

```js
export default function additionner(a, b) {
	return a + b;
}
```

Dans ce cas-là, la variable peut être importée avec une syntaxe plus simple, sans accolades.

```js
import additionner from "./b";

console.log(additionner(1, 2)); // 3
```

On peut facilement renommer la variable, car tant qu'il y a pas d'accolades, l'export default est toujours pris

```js
import add from "./b";

console.log(add(1, 2)); // 3
```

On peut importer la valeur default avec d'autres valeurs comme ça

```js
import add, { leNombre } from "./b";

console.log(add(1, leNombre)); // 124
```

**Les exports doivent aussi être à l'extérieur des blocks et des fonctions**

# Svelte!

Svelte est un framework visant à simplifier les intéractions entre le JS et l'HTML.

Avec Svelte, vous pouvez afficher des valeurs du JS dans votre HTML sans utiliser getElementById ou inneHTML

```html
<script>
	let nom = "Daniel";
</script>

<h1>Bonjour {nom}!</h1>
```

Cet exemple affiche "Bonjour Daniel!"

Vous pouvez tester ce code sur https://svelte.dev/repl.

On peut aussi le faire sur les attributs.

```html
<script>
	let image = "https://upload.wikimedia.org/wikipedia/commons/1/16/Rainbow_trout_transparent.png";
</script>

<img src={image} alt="Une truite" />
```

---------------------

Cela devient très puissant quand on le combine avec des évènements.

Svelte nous permet d'attacher des évènements facilement.

```html
<script>
	let count = 0;

	function more() {
		count += 1;
	}
</script>

<p>Compteur: {count}</p>

<button on:click={more}>Ajouter 1</button>
```

Regardez attentivement ce script, et peut-être essayez-le sur https://svelte.dev/repl.

Quand on clique sur le bouton, la fontcion `more` est lancée, et elle ajoute 1 à la variable `count`. 

Notez qu'on a pas besoin de dire à Svelte de modifier la balise p, il le fait automatiquement.

Svelte garde notre interface automatiquement à jour avec les variables, alors que c'est typiquement très pénible de le faire.

--------------

On peut mettre des expression dans les accolades, genre des calculs et tout.

```html
<script>
	let count = 0;

	function more() {
		count += 1;
	}
</script>

<!-- count ** 2 met le compteur au carré dans l'interface -->
<p>Compteur au carré: {count ** 2}</p>

<button on:click={more}>Ajouter 1</button>
```

--------------

Avec `bind`, on peut synchroniser le contenu d'un input avec une variable.

```html
<script>
	let nom = 'Daniel';
</script>

<input type="text" bind:value={nom}>

<h1>Bonjour {nom}!</h1>
```

Dans cet exemple, si vous modifiez l'input, le h1 se met à jour automatiquement.

------------------

On peut mettre des styles dans les fichiers Svelte.

C'est la manière recommandée de coder des styles qui ne s'appliquent qu'a un fichier.

```html
<style>
	.magnifique {
		background: linear-gradient(to right, orange , yellow, green, cyan, blue, violet);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
	}
</style>

<h1 class="magnifique">Ce texte est magnifique</h1>
```

Ca peut être utile de pouvoir mettre et retirer une classe facilement.

Avec une booléenne, Svelte propose un raccourcis pour ça.

```html
<style>
	.magnifique {
		background: linear-gradient(to right, orange , yellow, green, cyan, blue, violet);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
	}
</style>

<script>
	let activer = false;

	function toggleActive() {
		activer = !activer; // Inverse la valeur true <-> false
	}
</script>

<h1 class:magnifique={activer}>Ce texte est magnifique</h1>

<button on:click={toggleActive}>Activer la beauté</button>
```

Rappelez-vous d'essayer sur https://svelte.dev/repl

-------------

Vous vous souvenez de `bind:value` qui permet de synchroniser un input avec une variable?

Il y a un équivalent pour les checkboxes, `bind:checked`, pour synchroniser la checkbox avec une booléenne.

```html
<style>
	.magnifique {
		background: linear-gradient(to right, orange , yellow, green, cyan, blue, violet);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
	}
</style>

<script>
	let activer = false;
</script>

<h1 class:magnifique={activer}>Ce texte est magnifique</h1>

<label>
	<input type="checkbox" bind:checked={activer} /> Activer la beauté
</label>
```

-----------------

On a des blocks if, pour afficher des éléments si une condition est vrai.

```html
<script>
	let afficherTruite = false;
</script>

<label>
	<input type="checkbox" bind:checked={afficherTruite} /> Afficher une truite
</label>

{#if afficherTruite}
	<img src="https://upload.wikimedia.org/wikipedia/commons/1/16/Rainbow_trout_transparent.png" alt="Une truite" />
{/if}
```

On a des blocks else et else if aussi

```html
<script>
	let poisson = "";
</script>

<label>
	Quel poisson voulez-vous voir ?<br />
	<input type="text" bind:value={poisson} />
</label>

{#if poisson === "truite"}
	<img src="https://upload.wikimedia.org/wikipedia/commons/1/16/Rainbow_trout_transparent.png" alt="Une truite" />
{:else if poisson === "baleine"}
	<img src="https://upload.wikimedia.org/wikipedia/commons/0/07/Jumping_Humpback_whale.jpg" alt="Une baleine" width="500" />
{:else}
	<p>Nous n'avons pas de photos de ce poisson</p>
{/if}
```

---------------

Il est possible d'afficher une liste d'éléments, c'est très utile.

Regardez attentivement le code suivant :

```html
<script>
	let taches = [
		{ id: 12, text: "Mettre le bébé dans le congel" },
		{ id: 20, text: "Acheter un cerveau" },
		{ id: "b", text: "Verifier que le soleil fonctionne" },
		{ id: 4, text: "Eteindre le feu dans les bureaux" },
		{ id: "asdf", text: "Transformer du plomb en or" }
	];
	
	function gererClick(index) {
		// Création de nouvel array avec l'élément retiré
		taches = [...taches.slice(0, index), ...taches.slice(index + 1)];
	}
</script>

{#each taches as tache, index (tache.id)}
	<p>{tache.text} - <button on:click={gererClick(index)}>Supprimer</button></p>
{/each}
```

Essayez sur https://svelte.dev/repl.

Pour expliquer la ligne suivante :

```html
{#each taches as tache, index (tache.id)}
```

- `taches` est le tableau sur lequel on boucle
- `tache` est le nom qu'on donne à l'élément actuel
- `index` est le nom qu'on donne au niméro de l'élément actuel
- `tache.id` est l'id d'organisation de l'élément

Qu'est-ce que l'id d'organisation ? C'est la partie la plus technique de ce guide, donc accrochez-vous.

Quand le tableau change, Svelte le vois passer d'un certain contenu à un autre, mais il ne peut pas savoir concrètement quels éléments ont été supprimés, déplacés, ou changés.

Imaginez cet exemple:

### Avant

```js
[
	{ text: "Mettre le bébé dans le congel" },
	{ text: "Acheter un cerveau" },
	{ text: "Verifier que le soleil fonctionne" },
]
```

### Après

```js
[
	{ text: "Mettre le bébé dans le congel" },
	{ text: "Eteindre le feu dans les bureaux" },
]
```

La question est: **quel élément à été modifié, et quel élément à été supprimé ?**

Dans ce cas là, **il n'y a aucun moyen de savoir**. "Acheter un cerveau" aurrait pu être changé en "Eteindre le feu dans les bureaux", ou ça pourrait être "Verifier que le soleil fonctionne".

Peut-être même que les deux éléments ont été supprimés et que "Eteindre le feu dans les bureaux" est un nouvel élément et non un élément modifié.

Svelte peut essayer de deviner ce qui s'est passé, mais s'il se trompe, ça peut causer des problèmes étranges dans des cas plus complexes.

La solution à ce problème fut les "ids d'organisations".

Chaque élément dans la liste devrait avoir un id unique, et qinsi, on peut sqvoir ce qui s'est passé entre deux changements.

Reprenont notre exemple, mais ajoutons des ids.

```js
[
	{ id: 12, text: "Mettre le bébé dans le congel" },
	{ id: 20, text: "Acheter un cerveau" },
	{ id: "b", text: "Verifier que le soleil fonctionne" },
]
```

### Après

```js
[
	{ id: 12, text: "Mettre le bébé dans le congel" },
	{ id: "b", text: "Eteindre le feu dans les bureaux" },
]
```

Maintenant, nous pouvons deviner que "Acheter un cerveau" à été supprimé, et que "Verifier que le soleil fonctionne" a été modifié en "Eteindre le feu dans les bureaux"! Svelte fera donc les bons changements sur la page.

*Ajouter un id d'organisation est néanmoins optionel, si vous omettez les paranthèses dans la boucle each, Svelte essaiera de deviner les changements automatiquement.*

*Ajouter un id est vivement recommand, mais si vous êtes sûr qu'aucun élément de votre liste ne sera jamais supprimé ou ajouté en milieu de liste, alors vous pouvez vous en passer.*

-----------

Svelte a une limitation importante à connaître : il ne peut détecter des changements que quand = ou un opérateur similaire est utilisé.

Regardons un deuxième exemple de liste :

```html
<script>
	let clicks = [];
	
	function gererClick() {
		const click = {
			time: new Date(),
			uuid: Math.random().toString(),
		};

		clicks.push(click);
	}
</script>

<button on:click={gererClick}>Cliquez ici</button>

<p>Vous avez cliqué le bouton à</p>

<ul>
	{#each clicks as click, index (click.uuid)}
		<li>{click.time.toLocaleString()}</li>
	{/each}
</ul>
```

- J'ai un tableau nommé "clicks".
- Quand on clique le boutton, on ajoute un objet dans le tableau "clicks" qui contient le temps et un id aléatoire.
- Les temps de chaque clique du bouton est listé immédiatement.

**Cependant, ce code ne fonctionne pas...** Vous pouvez en constater sur https://svelte.dev/repl/.

Le problème est que les éléments sont ajoutés avec `clicks.push(click);`.

Svelte ne peut pas détecter ce changement, car il n'utilise pas =.

Svelte peut détecter les changements suivants :
- `a = b`
- `a += b`, `a -= b`, `a *= b`, et les autres opérateurs de ce type
- `a++` et `a--`

Ces changements seront aussi detectés s'ils sont fait sur une propriété de l'objet. Par exemple, `a.c = b` ou `a[c] = b` sont detectés.

`clicks.push(click);` ne sera pas détecté, donc on peut le remplacer par `clicks = [...clicks, click];`, qui fait la même chose, mais avec l'opérateur =.

Voici le code qui marche !

```html
<script>
	let clicks = [];
	
	function gererClick() {
		const click = {
			time: new Date(),
			uuid: Math.random().toString(),
		};

		clicks = [...clicks, click];
	}
</script>

<button on:click={gererClick}>Cliquez ici</button>

<p>Vous avez cliqué le bouton à</p>

<ul>
	{#each clicks as click, index (click.uuid)}
		<li>{click.time.toLocaleString()}</li>
	{/each}
</ul>
```

Cette limitation de Svelte concerne principalement les arrays, car les autres types de données n'ont pas de méthodes comme eux pour modifier leurs données.

--------------

Si vous voulez obtenir des éléments dans votre JavaScript pour les manipuler manuellement, voici comment faire :

```html
<script>
	import { onMount } from 'svelte';

	let maTruite;

	onMount(() => {
		// Cette fonction est appelée quand le co,ponent est prêt
		// C'est comme un document ready, mais local

		// Ici, maTruite est notre img!
		console.log(maTruite.src); // => "https://upload.wikimedia.org/wikipedia/commons/1/16/Rainbow_trout_transparent.png"
	})
</script>

<!-- C'est bind:this qui permet de définir une variable pour l'élément -->
<img bind:this={maTruite}
	src="https://upload.wikimedia.org/wikipedia/commons/1/16/Rainbow_trout_transparent.png"
	alt="Une truite" />
```

Parfois, ça peut être utile de faire ça.

Mais pensz d'abord si ce que vous voulez faire peut simplement être fait avec juste Svelte.

Si vous voulez écouter des évènements, ou modifier le contenu d'un élément, vous n'avez pas besoin d'accéder à l'élément directement la plupart du temps.

----------

## Les components Svelte

Cette section est tellement importante qu'elle mérite son propre titre.

Vous pouvez importer un ficher svelte dans un autre comme ça :

```html
<script>
	import MonTitre from "./components/MonTitre.svelte";
</script>

<MonTitre />
```

Le contenu de MonTitre sera inclut dans la page, ainsi on économise du code.

Il est pertinant de savoir que la portée de vos styles CSS devrait être restreinte à votre component automatiquement.

Cela veut dire que, normallement, vous aurriez beau essayer, mais vos styles CSS n'affecteront jamais les éléments en dehors de votre component.

Ils ne peuvent pas non-plus affecter les components que vous importez.

Cela vous protège d'erreurs de CSS, que des règles affectent accidentellement des éléments sans rapport.

-----------

Il est possible de créer un component prenant des arguments, comme ça :

```html
<script>
	import MonTitre from "./components/MonTitre.svelte";
</script>

<MonTitre nom="David" />
```

Pour cela, dans MonTitre, il faut utiliser le mot-clé export.

```html
<script>
	export let nom;
</script>

<h1>Bonjour, {nom} !</h1>
```

## Un problème avec notre setup : l'import d'images

Afin d'expliquer ce problème, je dois expliquer un traitement fait par Vite : l'empaquetage de médias.

Bien sûr Vite fait de l'empaquetage de code, c'est ce dont j'ai parlé au tout début. Mais pourquoi empaqueter **les médias** ?

Imaginons que nous avons un component avec une image relative dedans.

```html
<img src="./truite.jpg" />
```

Si on importe le component dans un fichier qui est dans le même dossier que l'image, tout vas bien.

Mais dès que l'on est dans un autre dossier, tout échouerai. L'image ne pointerai plus au bonne endroit et notre component serait inutilisable.

Les développeurs se sont rendu compte qu'il fallait, pour corriger ça, faire en sorte que le chemin de l'image soit toujours relatif au component. Que tant que le component pointe vers la bonne image, alors on peut l'importer n'importe où, et ça marche.

Pour cela, Vite change toutes les images.

Pour le site construit, il met toutes les images dans le même dossier et change les balises HTML pour qu'elles pointes dessus.

Ainsi, il peut s'assurer que la balise pointe vers la bonne image, peut importe où elle est.

***Mais il y a un petit problème : ça marche pas avec ma setup de Svelte, je sais pas pourquoi.***

Vite ignore l'output de Svelte et les images ne peuvent pas être reliées au bon endroit.

Cela ne cause pas de problèmes sur le serveur de dévelopment, mais ça fera crash la build de prod.

Pour régler cela, il existe une "solution de secours" offerte par Vite.

```html
<script>
	import logo from "./assets/logo.jpg";
</script>

<img src={logo} alt="MatchWatch" />
```

Il est possible d'importer des fichiers non-JS. Dans ce cas-la, un string contenant le nom du fichier dans le paquet est retourné.

Si on mettait un console.log sur logo, on aurait `"_assets/logo.28a75f50.jpg"`, ou quelque chose du genre. C'est le lien correct vers l'image.

**En résumé :** des incompatibilités techniques font qu'on ne peut pas avoir de balise img pointant directement à un fichier du projet. Il faut importer le fichier et utiliser le résultat comme src.

Cela n'affecte PAS la balise &lt;a&gt;. Ainsi que les &lt;img&gt; pointant vers une URL externe à notre site (genre les affiches de films)

Cette incompatibilité sera sans doutes résolu plus tard ce mois-ci, car l'équipe de Svelte sont en train de créer une intégration officielle à Vite.