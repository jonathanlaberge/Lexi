# Lexi
*Un questionnaire intéractif*

## Fonctionnement du programme
*À venir...*

## Installation
**Vous pouvez utiliser [ce logiciel](https://github.com/jonathanlaberge/Lexi/releases "ce logiciel") pré-configuré et portable pour vous épargner de la configuration et de l'installation.**

### Logiciel nécessaire
Avant de commencer, il est nécessaire d'avoir ces logiciels d'installés pour le bon fonctionnement du programme:
+ Un serveur **Apache 2.4** avec les modules suivants:
  + **mod_rewrite** pour les redirections
  + **mod_negotiation**
+ **PHP 7.1** ou plus récent avec les extensions suivants:
  + **OpenSSL** PHP
  + **PDO** PHP
  + **Mbstring** PHP
+ Un serveur Mysql 5.7 ou équivalant

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

Le fichier de configuration pour Lumen est dans le fichier **lumen/.env**. Celui-ci comporte les variables suivantes:

    APP_NAME=Lumen
    APP_ENV=local
    APP_KEY=
    APP_DEBUG=false
    APP_URL=http://localhost/api
    APP_TIMEZONE=UTC
    
    LOG_CHANNEL=stack
    LOG_SLACK_WEBHOOK_URL=
    
    DB_CONNECTION=mysql
    DB_HOST=localhost
    DB_PORT=3306
    DB_DATABASE=QCM
    DB_USERNAME=username
    DB_PASSWORD=password
    
    CACHE_DRIVER=file
    QUEUE_CONNECTION=sync
    
    JWT_SECRET=secret
    JWT_TTL=2880
Voici les variables à configurer:

 - `APP_DEBUG` Permet d'afficher ou non les informations détaillées en cas d'exception sur la page du client. Accepte seulement **true** ou **false**. 
 - `APP_URL` Lien permanent de l'API.
 - `DB_HOST` Adresse du serveur Mysql. Utiliser **localhost** si ce serveur est sur la même machine que le serveur Apache.
 - `DB_PORT` Port du serveur Mysql. Par défaut, le port est **3306**.
 - `DB_DATABASE` Nom de la base de donnée. Par défaut, si vous importez le fichier Database.sql sur le serveur Mysql, le nom de la base de données est **QCM**. Si vous renommez ce nom sur ce serveur, vous devez également le modifier ici.
 - `DB_USERNAME` Utilisateur Mysql ayant accès à la base de données.
 - `DB_PASSWORD`Mot de passe de l'utilisateur Mysql ayant accès à la base de données.
 - `JWT_SECRET` Ceci est le mot de passe secret pour la génération des tokens. Nous vous recommandons fortement de générer une chaîne de caractères d'une longueur de 64 caractères. Vous pouvez utiliser la commande `php artisan jwt:secret` dans le dossier **lumen** pour générer automatiquement cette chaîne de caractères. Pour des raisons évidentes de sécurité, ne partager pas cette variable sur internet.
 - `JWT_TTL` Nombre de minutes avant l'expiration d'un token. Par défaut, 2880 minutes équivaut à 2 jours.

Le fichier de configuration pour le front-end Angular est dans le fichier **Lexi/src/app/service/api.service.ts**. Celui-ci comporte la variable constante suivante:

```ts
export const API_URL = "http://localhost/api/v1/";
```
Ceci correspond à l'adresse du web service Lumen.  Dans le fichier de configuration Lumen,
Si l'adresse du service web est `http://localhost/api`, il faut rajouter `/v1/` à la fin.

#### Compilation du front-end Angular
Après avoir téléchargé et configuré le front-end Angular, compiler le projet à l'aide de la commande `ng build --prod` sur la racine du projet. Cette commande créera un dossier avec le nom **dist/Lexi** dans la racine du projet contenant l'intégralité du front-end. Ces fichiers seront utilisés pour le serveur Apache.

*Pour pouvoir tester sans compiler le projet, utiliser la commande `ng serves --open` toujours dans la racine. Cela ouvrera un page web local sur le poste.*

#### Importation de la base de données

Il faut importer la base de données. Le fichier des tables est **Database.sql** et se trouve dans la racine du répertoire. Vous devez vous-même créer la base de données et importer le fichier **Database.sql** dans le serveur Mysql. Celui-ci créera tous les tables nécessaires. Le nom de la base de données doit être le même que dans le fichier de configuration du web service Lumen.

#### Configuration du serveur Apache

Copier les fichiers produit précédemment par la commande `ng build --prod` sur la racine du dossier **www** du serveur Apache. Ensuite, copier les fichiers avec tous les dépendances du web service Lumen à côté du dossier **www**. En d'autre mot, ne pas mettre le web service dans le dossier **www**. Dans le fichier de configuration Apache, rajouter ces lignes:

```apache
<VirtualHost *:80>
	DocumentRoot "**Localisation du dossier WWW**/"
	ServerName "main-server"
	Alias "/api/" "**Localisation du web service lumen**/public/"
	Alias "/api" "**Localisation du web service lumen**/public/"
	<Directory "**Localisation du dossier WWW**/">
		AllowOverride All
		Options FollowSymLinks Indexes	
	</Directory>
	<Directory "**Localisation du web service lumen**/">
		AllowOverride All
		Options FollowSymLinks Includes Indexes 
	</Directory>
</VirtualHost>
```
**N'oublier pas de remplacer les localisations des dossiers par les bons chemins.**

Finalement, créer un fichier dans le dossier **www** portant le nom **.htaccess**. Ne pas omettre le point avant htaccess. Dans ce fichier, rajouter ces lignes:
```apache
Options All -Indexes

RewriteEngine On
RewriteBase /
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . index.html [L]

php_value display_errors off
```

### Accès administrateur du programme
Utilisateur : *admin@admin*
Mot de passe : *123allo!@#ALLO*
