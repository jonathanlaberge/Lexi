-- phpMyAdmin SQL Dump
-- version 4.8.3
-- https://www.phpmyadmin.net/
--
-- Hôte : 10.0.4.101:3300
-- Généré le :  ven. 05 juil. 2019 à 04:22
-- Version du serveur :  5.7.26-0ubuntu0.18.04.1-log
-- Version de PHP :  7.2.19-0ubuntu0.18.04.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données :  `QCM`
--

DELIMITER $$
--
-- Procédures
--
CREATE DEFINER=`guillaume`@`10.0.4.100` PROCEDURE `insert_data` (IN `p_cur` INT, IN `p_max` INT)  BEGIN
 
    START TRANSACTION;
    WHILE p_cur <= p_max do
INSERT INTO `fiche`(`idFiche`, `idCategorie`, `titre`, `dateCreation`, `estPublic`, `idMaitresseCreatrice`) VALUES (p_cur,4,CONCAT("Fiche Cartonnée - Série: 4, Groupe: ", p_cur),'2019-06-04 00:00:00',1,1);
        SET p_cur = p_cur + 1;
    END WHILE;
    COMMIT;
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Structure de la table `categorie`
--

CREATE TABLE `categorie` (
  `idCategorie` int(11) UNSIGNED NOT NULL,
  `nom` varchar(128) NOT NULL,
  `matiere` varchar(128) DEFAULT NULL,
  `niveau` varchar(128) DEFAULT NULL,
  `estPublic` tinyint(1) NOT NULL DEFAULT '1',
  `idMaitresseCreatrice` int(11) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `classe_eleve_maitresse`
--

CREATE TABLE `classe_eleve_maitresse` (
  `idMaitresse` int(11) UNSIGNED NOT NULL,
  `idEleve` int(11) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `eleve`
--

CREATE TABLE `eleve` (
  `idEleve` int(11) UNSIGNED NOT NULL,
  `prenom` varchar(128) NOT NULL,
  `nom` varchar(128) NOT NULL,
  `qcmMode` tinyint(4) NOT NULL DEFAULT '0',
  `dateNaissance` date DEFAULT NULL,
  `genre` tinyint(1) DEFAULT '2',
  `avatar` varchar(512) DEFAULT 'assets/kids-avatars/png/boy.png'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `fiche`
--

CREATE TABLE `fiche` (
  `idFiche` int(11) UNSIGNED NOT NULL,
  `idCategorie` int(11) UNSIGNED NOT NULL,
  `titre` varchar(128) NOT NULL,
  `dateCreation` datetime DEFAULT CURRENT_TIMESTAMP,
  `estPublic` tinyint(1) NOT NULL DEFAULT '1',
  `idMaitresseCreatrice` int(11) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `fiche_a_remplir`
--

CREATE TABLE `fiche_a_remplir` (
  `idEleve` int(4) UNSIGNED NOT NULL,
  `idMaitresse` int(4) UNSIGNED NOT NULL,
  `idCategorie` int(4) UNSIGNED NOT NULL,
  `idFiche` int(4) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `historique`
--

CREATE TABLE `historique` (
  `idEleve` int(11) UNSIGNED NOT NULL,
  `idFiche` int(11) UNSIGNED NOT NULL,
  `idCategorie` int(11) UNSIGNED NOT NULL,
  `date` datetime DEFAULT CURRENT_TIMESTAMP,
  `nombreTentative` smallint(4) UNSIGNED NOT NULL,
  `erreurMax` smallint(4) UNSIGNED NOT NULL,
  `erreurMin` smallint(4) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `maitresse`
--

CREATE TABLE `maitresse` (
  `idMaitresse` int(11) UNSIGNED NOT NULL,
  `email` varchar(128) NOT NULL,
  `motdepasse` text NOT NULL,
  `prenom` varchar(128) NOT NULL,
  `nom` varchar(128) NOT NULL,
  `dateNaissance` date DEFAULT NULL,
  `genre` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `maitresse`
--

INSERT INTO `maitresse` (`idMaitresse`, `email`, `motdepasse`, `prenom`, `nom`, `dateNaissance`, `genre`) VALUES
(1, 'admin@admin', '$argon2i$v=19$m=2048,t=6,p=2$OUhJUmJ4WUxJRk1VbkwxNw$rU3+kjv7qGBAZsRdnYX+D6jukMDzwIwGhNeBWSQc/F4', 'Admin', 'Admin', NULL, NULL);

-- --------------------------------------------------------

--
-- Structure de la table `question`
--

CREATE TABLE `question` (
  `idQuestion` int(11) UNSIGNED NOT NULL,
  `idFiche` int(11) UNSIGNED NOT NULL,
  `idCategorie` int(11) UNSIGNED NOT NULL,
  `question` text NOT NULL,
  `choixDeReponses` json NOT NULL,
  `bonneReponse` smallint(4) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `categorie`
--
ALTER TABLE `categorie`
  ADD PRIMARY KEY (`idCategorie`),
  ADD KEY `idMaitresseCreatrice` (`idMaitresseCreatrice`);

--
-- Index pour la table `classe_eleve_maitresse`
--
ALTER TABLE `classe_eleve_maitresse`
  ADD PRIMARY KEY (`idMaitresse`,`idEleve`),
  ADD KEY `classe_eleve_maitresse_ibfk_2` (`idEleve`);

--
-- Index pour la table `eleve`
--
ALTER TABLE `eleve`
  ADD PRIMARY KEY (`idEleve`);

--
-- Index pour la table `fiche`
--
ALTER TABLE `fiche`
  ADD PRIMARY KEY (`idCategorie`,`idFiche`),
  ADD KEY `idMaitresseCreatrice` (`idMaitresseCreatrice`);

--
-- Index pour la table `fiche_a_remplir`
--
ALTER TABLE `fiche_a_remplir`
  ADD KEY `idCategorie` (`idCategorie`,`idFiche`),
  ADD KEY `idEleve` (`idEleve`,`idMaitresse`);

--
-- Index pour la table `historique`
--
ALTER TABLE `historique`
  ADD PRIMARY KEY (`idEleve`,`idFiche`,`idCategorie`),
  ADD KEY `historique_ibfk_2` (`idCategorie`,`idFiche`);

--
-- Index pour la table `maitresse`
--
ALTER TABLE `maitresse`
  ADD PRIMARY KEY (`idMaitresse`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Index pour la table `question`
--
ALTER TABLE `question`
  ADD PRIMARY KEY (`idCategorie`,`idFiche`,`idQuestion`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `categorie`
--
ALTER TABLE `categorie`
  MODIFY `idCategorie` int(11) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `eleve`
--
ALTER TABLE `eleve`
  MODIFY `idEleve` int(11) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `maitresse`
--
ALTER TABLE `maitresse`
  MODIFY `idMaitresse` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `categorie`
--
ALTER TABLE `categorie`
  ADD CONSTRAINT `categorie_ibfk_1` FOREIGN KEY (`idMaitresseCreatrice`) REFERENCES `maitresse` (`idMaitresse`);

--
-- Contraintes pour la table `classe_eleve_maitresse`
--
ALTER TABLE `classe_eleve_maitresse`
  ADD CONSTRAINT `classe_eleve_maitresse_ibfk_1` FOREIGN KEY (`idMaitresse`) REFERENCES `maitresse` (`idMaitresse`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `classe_eleve_maitresse_ibfk_2` FOREIGN KEY (`idEleve`) REFERENCES `eleve` (`idEleve`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `fiche`
--
ALTER TABLE `fiche`
  ADD CONSTRAINT `fiche_ibfk_1` FOREIGN KEY (`idCategorie`) REFERENCES `categorie` (`idCategorie`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fiche_ibfk_2` FOREIGN KEY (`idMaitresseCreatrice`) REFERENCES `maitresse` (`idMaitresse`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `fiche_a_remplir`
--
ALTER TABLE `fiche_a_remplir`
  ADD CONSTRAINT `fiche_a_remplir_ibfk_1` FOREIGN KEY (`idEleve`,`idMaitresse`) REFERENCES `classe_eleve_maitresse` (`idEleve`, `idMaitresse`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fiche_a_remplir_ibfk_2` FOREIGN KEY (`idCategorie`,`idFiche`) REFERENCES `fiche` (`idCategorie`, `idFiche`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `historique`
--
ALTER TABLE `historique`
  ADD CONSTRAINT `historique_ibfk_1` FOREIGN KEY (`idEleve`) REFERENCES `eleve` (`idEleve`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `historique_ibfk_2` FOREIGN KEY (`idCategorie`,`idFiche`) REFERENCES `fiche` (`idCategorie`, `idFiche`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `question`
--
ALTER TABLE `question`
  ADD CONSTRAINT `question_ibfk_1` FOREIGN KEY (`idCategorie`,`idFiche`) REFERENCES `fiche` (`idCategorie`, `idFiche`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
