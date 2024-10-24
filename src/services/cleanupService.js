const fs = require("fs");
const path = require("path");
const logger = require("../utils/logger");

// Fonction pour vérifier si un fichier a plus de N jours
const isFileOlderThan = (filePath, days) => {
  const fileStat = fs.statSync(filePath);
  const now = new Date();
  const fileAgeInMs = now - new Date(fileStat.mtime);
  const ageInDays = fileAgeInMs / (1000 * 60 * 60 * 24);
  return ageInDays > days;
};


// Fonction pour obtenir la taille totale d'un répertoire
const getDirectorySize = (dirPath) => {
  const files = fs.readdirSync(dirPath);
  let totalSize = 0;

  files.forEach((file) => {
    const filePath = path.join(dirPath, file);
    const fileStat = fs.statSync(filePath);
    if (fileStat.isFile()) {
      totalSize += fileStat.size;
    }
  });

  return totalSize; // Taille totale en octets
};


// Fonction pour supprimer un fichier
const deleteFile = (filePath) => {
  return new Promise((resolve, reject) => {
    fs.unlink(filePath, (err) => {
      if (err) {
        const errorMsg = `Échec de la suppression du fichier ${filePath}: ${err.message}`;
        logger.error(errorMsg);
        console.error(errorMsg);
        reject(err);
      } else {
        const successMsg = `Fichier supprimé avec succès: ${filePath}`;
        logger.info(successMsg);
        console.info(successMsg);
        resolve();
      }
    });
  });
};

// Fonction pour nettoyer les fichiers plus anciens que N jours dans les répertoires de destination
const cleanOldFilesFromDirs = (sourceToDestMapping) => {
  sourceToDestMapping.forEach(({ dest, cleanup }) => {
    if (!cleanup || !cleanup.enabled) {
      const message = `Nettoyage désactivé pour le répertoire: ${dest}. Passer au prochain répertoire.`;
      logger.info(message);
      console.info(message);
      return;
    }

    const { maxAgeInDays } = cleanup;

    // Vérification de l'existence du répertoire de destination
    if (!fs.existsSync(dest)) {
      const message = `Le répertoire de destination est introuvable: ${dest}. Passer au prochain répertoire.`;
      logger.error(message);
      console.error(message);
      return;
    }

    const files = fs.readdirSync(dest);
    console.log(files);
    files.forEach((file) => {
      const filePath = path.join(dest, file);

      // Si le fichier est plus ancien que la limite, le supprimer
      if (fs.statSync(filePath).isFile() && isFileOlderThan(filePath, maxAgeInDays)) {
        deleteFile(filePath)
          .then(() => {
            const successMsg = `Fichier supprimé car trop ancien: ${filePath}`;
            logger.info(successMsg);
            console.info(successMsg);
          })
          .catch((err) => {
            const errorMsg = `Erreur lors de la suppression du fichier: ${filePath}. ${err.message}`;
            logger.error(errorMsg);
            console.error(errorMsg);
          });
      }
    });

    // Affichage de la taille du répertoire pour un suivi futur
    const dirSize = getDirectorySize(dest);
    logger.info(`Taille actuelle du répertoire ${dest}: ${dirSize} octets`);
    console.info(`Taille actuelle du répertoire ${dest}: ${dirSize} octets`);
  });
};

module.exports = { cleanOldFilesFromDirs };
