GROUPOMANIA 

Ceci est le dernier projet de ma formation Openclassrooms, création d'un réseau social d'entreprise : Groupomania

J'ai réalisé le Front comme le Back. Dans ce dernier, j'ai utilisé une base de donnée SQL et, sur les conseil de mon mentor, j'ai utilisé l'ORM Sequelize pour communiquer avec elle.
Pour le Front, j'ai utilisé le framework React. Etant mon premier projet avec ce framework, je suis bien conscient que mon code est trés perfectible.

Pour lancer le projet:

Après avoir configurer et lancer un serveur en local à l'aide de MAMP par exemple, il faut installer node et toute les dépendances du front :

*npm i*

Maintenant, il faut installer les dépendances du Back avec:

*cd ./backend && npm i* 

Il faut, à présent, initialiser et configurer sequelize:

*sequelize init*

Entrer le mot de passe de votre base de donnée dans le fichier config.json précédemment créer,

Vous pouvez maintenant créer et migrer vos models de tables dans la base de donnée à l'aide de:

*sequelize db:create && sequelize db:migrate*

Pour finir, vous pouvez lancer les serveur Back et Front dans deux terminaux différent avec:

*npm start* pour le Front
*node server* ou *nodemon server* pour le Back
