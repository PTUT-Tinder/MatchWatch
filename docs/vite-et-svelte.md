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
