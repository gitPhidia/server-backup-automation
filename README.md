# Backup Management Program

## Description
Ce projet est un programme Node.js conçu pour automatiser la gestion des backups des projets déployés sur un serveur. Il récupère les fichiers de backup depuis des chemins sources spécifiques et les regroupe dans un dossier principal

## Caractéristiques principales
- Récupération automatique des backups à partir de plusieurs sources définies.
- Regroupement des backups dans un dossier centralisé.
- Fichier de log pour suivre l'exécution du programme et les éventuelles erreurs.

## Prérequis
- Node.js (version X.X ou supérieure)
- Git (pour le contrôle de version)
- Un serveur où sont déployés les projets dont les backups doivent être récupérés

## Installation

1. Clonez ce dépôt Git sur votre machine locale :
   ```bash
   git clone https://github.com/votre-utilisateur/votre-repository.git


2. Creer une le fichier de configuration dans une dossier 'config/path.js' a partir  du template 'path.exemple'

    ''' bash

        const paths = {
        sourceToDestMapping: [
            {
            source: resolve("/path/to/source1"), // Remplacer par le chemin source spécifique
            dest: resolve("/path/to/destination1"), // Remplacer par le chemin de destination spécifique
            },
            {
            source: resolve("/path/to/source2"), // Remplacer par le chemin source spécifique
            dest: resolve("/path/to/destination2"), // Remplacer par le chemin de destination spécifique
            
            },
            {
            source: resolve("/path/to/source3"), // Remplacer par le chemin source spécifique
            dest: resolve("/path/to/destination3"), // Remplacer par le chemin de destination spécifique
            
            },
            // Ajouter d'autres relations source-destination ici si nécessaire
        ],
        };

        module.exports = paths;


    '''


