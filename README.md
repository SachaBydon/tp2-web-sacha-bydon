<div align="center">
  <h3 align="center">Projet web - IA2</h3>
  <p align="center">
    Projet effectué par Sacha BYDON <img src="https://avatars.githubusercontent.com/u/42966540?v=4" alt="img sacha bydon" style="width: 20px;border-radius: 50px;"/>
    <br />
    <a href="https://projet-web-sacha-bydon.herokuapp.com"><strong>Application hébergée</strong></a>
    ·
    <a href="#"><strong>Vidéo de présentation</strong></a>
  </p>
</div>

## À propos du projet
Le projet devait être réalisé en Angular/Node. Cependant, comme vous nous avez laissé de la liberté sur les technologies, j'ai décidé d'utiliser React avec le framework <a href="https://nextjs.org/">Next</a>, que je n'avais jamais  utilisé et que j'avais envie d'apprendre. Ainsi que typescript.  

Cependant toutes les fonctionnalités demandés on été réalisé, plus des fonctionnalités bonus.

Pour ce qui est des bibliothèques, j'ai utilisé material ui ou plutôt <a href="https://mui.com/">MUI</a> désormais, et quelques bibliothèques utilitaires tel que:
* `jsonwebtoken`: pour utiliser des jwt,
* `mongoose`: pour manipuler la base mongo,
* `nookies`: pour gérer les cookies,
* `sass`: css pre-processor.


---
## Fonctionnalités
Une vidéo de présentation des fonctionnalités est disponible ici:
<div>
  <a href="https://www.youtube.com/watch?v=YeKdTNnXsqY"><img src="https://img.youtube.com/vi/YeKdTNnXsqY/0.jpg" alt="video youtube" style="max-width: 400px;"></a>
</div>

### Fonctionnalités demandées (100%):
1. [x] Rendre la présentation plus jolie
    - [x] Afficher les assignments dans une table
      - [x] Table de hauteur fixe
      - [x] Colonnes tribales
      - [x] Mettre en surlignage la ligne sur laquelle on déplace la souris
    - [x] Faire la pagination
2. [x] Ajouter une icône qui affiche le détail quand on clique dessus.
3. [x] Ajouter une icône qui supprime l'assignment quand on clique dessus.
4. [x] Ajouter une dialogue de confirmation de suppression.
5. [x] Utiliser les snackbars
6. [x] Gérer la connexion login/password
    - [x] Formulaire de connexion et bouton de déconnexion
    - [x] Authentification à l'aide de JWT

### Fonctionnalités BONUS:
- Les colonnes triables/pages/filtres sont synchronisées au backend (requête à chaque changement).
- Il est possible de faire des recherches par nom avec un input text.
- Il est possible de filtrer les assignments rendu ou non rendu.
- L'application est responsive (tout format, pc et téléphone).
- Server side rendering: les données des assignments sont récupérées directement au premier chargement.


---

## Organisation du code


### Les composants:
Tous les composants créés sont situés dans le dossier "<a href="src/components/">src/components/</a>". Chaque composant a été documenté avec des commentaires.

### Les contextes:
Les contextes react situés dans le dossier "<a href="src/contexts/">src/contexts/</a>" permettent de partager des informations de manière global dans toute l'application:
* Le contexte Assignment partage les informations des assignments.
* Le contexte Auth partage les informations de l'utilisateur connecté.
* Le contexte snackbar partage des méthodes utilitaires pour le système de snackbar.

### Les pages:
Les pages sont situées dans le dossier "<a href="src/pages/">src/pages/</a>". La page index (d'accueil) affiche les assignments. Et la page login (connexion) afficher un formulaire de connexion.

### L'API backend:
L'API backend se trouve dans le dossier "<a href="src/pages/api/">src/pages/api/</a>". On y trouve le fichier assignment.ts qui continent les routes REST pour l'ajout, la modification et la suppression d'assignments. Et le fichier auth.ts qui contient les routes pour la connexion avec les json web tokens.

---
## Utilisation


### Se connecter à l'application
Pour se connecter, utilisez les identifiants:

* User classique:  
  login: `user`,
  password: `langouste`
* Admin:  
  login: `admin`,
  password: `alligator`

### Lancer en local

Pour exécuter l'application en local, il faut:
* Cloner le repo,
* lancer la commande: `npm i`,
* lancer la commande: `npm run dev`,
* créer un fichier `.env.local` avec un l'interieur l'uri de connexion mongo comme ceci:

  `.env.local`
  ```
  MONGODB_URI=<ajouter ici l'uri mongo>
  ```

  ⚠️ Attention la base doit avoir des collections avec des modèles de donnée qui correspondent au schemas mongoose (que l'on peut retrouver dans "<a href="src/types/">src/types/</a>")
