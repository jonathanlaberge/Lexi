# Lexi
*Un questionnaire intéractif*

## Structure du programme

## Installation
**Vous pouvez utiliser [ce logiciel](http://x "ce logiciel") pré-configuré et portable pour vous épargner de la configuration et de l'installation.**
#### Logiciel néccessaire
Avant de commencer, il est néccessaire d'avoir ces logiciels d'installés pour le bon fonctionnement du programme:
- Un serveur **Apache 2.4** avec les modules suivants:
 - **mod_rewrite** pour les redirections
 - **mod_negotiation**
- **PHP 7.1** ou plus récent avec les extensions suivants:
 - **OpenSSL** PHP
 - **PDO** PHP
 - **Mbstring** PHP
- Un serveur Mysql 5.7 ou équivalant

##### Téléchargement des dépendances du web service Lumen
Pour pouvoir exécuter le web service, il faut télécharger les dépendances de Lumen. Pour ce faire, il faut le logiciels suivants:
- [Composer](https://getcomposer.org/download/ "Composer") 

Une fois installé, exécuter la commande `composer update` sur la racine du web service (étant dans le dossier **lumen** de ce répertoire).

##### Téléchargement des dépendances du front-end Angular
Pour pouvoir compiler le projet angular, il faut les logiciels suivants:
- [Node.js](https://nodejs.org/en/download/ "Node.js") Version 12 ou plus récent (la version 10 ne marchera pas avec Angular 8)
- [Angular-CLI](https://angular.io/cli "Angular-CLI") pour Angular 8

Une fois installé, exécuter la commande `npm install` sur la racine du projet Angular (étant dans le dossier **Lexi** de ce répertoire).

#### Configuration du projet
Le programme comporte 2 fichiers de configuration. Un pour le front-end Angular et un autre pour le web service Lumen.

...

#### Compilation du front-end Angular
Après avoir téléchargé et configuré le front-end Angular, compiler le projet à l'aide de la commande `ng build --prod` sur la racine du projet. Cette commande créera un dossier avec le nom **dist/Lexi** dans la racine du projet contenant l'intégralité du front-end. Ces fichiers seront utilisés pour le serveur Apache.

*Pour pouvoir tester sans compiler le projet, utiliser la commande `ng serves --open` toujours dans la racine. Cela ouvrera un page web local sur le poste.*

#### Importation de la base de données

...

#### Configuration du serveur Apache

...
