const fs = require("fs");
const path = require("path");
const logger = require("../utils/logger");

// Fonction pour vérifier si un répertoire existe
const checkDirectoryExists = (dir) => {
  try {
    if (!fs.existsSync(dir)) {
      const message = `Répertoire introuvable: ${dir}`;
      logger.error(message);
      console.error(message);
      return false;
    }
    return true;
  } catch (err) {
    const message = `Erreur lors de la vérification du répertoire ${dir}: ${err.message}`;
    logger.error(message);
    console.error(message);
    return false;
  }
};

// Fonction pour vérifier si un répertoire est vide
const isDirectoryEmpty = (dir) => {
  const files = fs.readdirSync(dir);
  return files.length === 0;
};

// Fonction pour vérifier les permissions d'écriture d'un répertoire
const checkDirectoryWritable = (dir) => {
  try {
    fs.accessSync(dir, fs.constants.W_OK);
    const message = `Permissions d'écriture vérifiées pour le répertoire: ${dir}`;
    logger.info(message);
    console.info(message);
    return true;
  } catch (err) {
    const message = `Permissions d'écriture insuffisantes pour le répertoire: ${dir}`;
    logger.error(message);
    console.error(message);
    return false;
  }
};

// Fonction pour obtenir le fichier le plus récent dans un répertoire
const getMostRecentFile = (dir) => {
  const files = fs.readdirSync(dir);
  let mostRecentFile = null;

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const fileStat = fs.statSync(filePath);

    if (fileStat.isFile()) {
      if (!mostRecentFile || fileStat.mtime > mostRecentFile.mtime) {
        mostRecentFile = { filePath, mtime: fileStat.mtime };
      }
    }
  });

  return mostRecentFile ? mostRecentFile.filePath : null;
};

// Fonction pour déplacer un fichier
const moveFile = (sourceFile, destFile) => {
  return new Promise((resolve, reject) => {
    fs.rename(sourceFile, destFile, (err) => {
      if (err) {
        const errorMsg = `Échec du déplacement de ${sourceFile} vers ${destFile}: ${err.message}`;
        logger.error(errorMsg);
        console.error(errorMsg);
        reject(err);
      } else {
        const successMsg = `Déplacement réussi de ${sourceFile} vers ${destFile}`;
        logger.info(successMsg);
        console.info(successMsg);
        resolve();
      }
    });
  });
};

// Fonction principale pour déplacer le fichier le plus récent de plusieurs répertoires vers leurs destinations respectives
const moveMostRecentFileFromDirs = (sourceToDestMapping) => {
  sourceToDestMapping.forEach(({ source, dest }) => {
    // Vérification de l'existence du répertoire source
    if (!checkDirectoryExists(source)) {
      const message = `Le répertoire source est introuvable: ${source}. Passer au prochain répertoire.`;
      logger.error(message);
      console.error(message);
      return; // Esquiver et passer au prochain répertoire source
    }

    // Vérification si le répertoire source est vide
    if (isDirectoryEmpty(source)) {
      const emptyMsg = `Le répertoire source est vide: ${source}. Passer au prochain répertoire.`;
      logger.info(emptyMsg);
      console.info(emptyMsg);
      return; // Esquiver et passer au prochain répertoire source
    }

    // Vérification des permissions du répertoire source
    if (!checkDirectoryWritable(source)) {
      const permissionMsg = `Le répertoire source ${source} ne dispose pas des permissions suffisantes. Passer au prochain répertoire.`;
      logger.error(permissionMsg);
      console.error(permissionMsg);
      return; // Esquiver et passer au prochain répertoire source
    }

    // Vérification de l'existence du répertoire destination
    if (!checkDirectoryExists(dest)) {
      const message = `Le répertoire de destination est introuvable: ${dest}. Passer au prochain répertoire.`;
      logger.error(message);
      console.error(message);
      return; // Esquiver et passer au prochain répertoire destination
    }

    // Vérification des permissions du répertoire destination
    if (!checkDirectoryWritable(dest)) {
      const permissionMsg = `Le répertoire de destination ${dest} ne dispose pas des permissions suffisantes. Passer au prochain répertoire.`;
      logger.error(permissionMsg);
      console.error(permissionMsg);
      return; // Esquiver et passer au prochain répertoire destination
    }

    // Obtenir le fichier le plus récent du répertoire source
    const mostRecentFile = getMostRecentFile(source);

    if (mostRecentFile) {
      const fileName = path.basename(mostRecentFile);
      const destFile = path.join(dest, fileName);

      // Afficher les informations avant de déplacer le fichier
      console.info(
        `Déplacement du fichier le plus récent: ${fileName} de ${source} vers ${dest}`
      );
      logger.info(
        `Déplacement du fichier le plus récent: ${fileName} de ${source} vers ${dest}`
      );

      // Déplacer le fichier
      moveFile(mostRecentFile, destFile)
        .then(() => {
          const successMsg = `Le fichier ${fileName} a été déplacé avec succès de ${source} à ${dest}.`;
          logger.info(successMsg);
          console.info(successMsg);
        })
        .catch((err) => {
          const errorMsg = `Erreur lors du déplacement du fichier ${fileName} de ${source} à ${dest}: ${err.message}`;
          logger.error(errorMsg);
          console.error(errorMsg);
        });
    } else {
      const noFileMsg = `Aucun fichier trouvé dans le répertoire ${source}.`;
      logger.info(noFileMsg);
      console.info(noFileMsg);
    }
  });
};

module.exports = { moveMostRecentFileFromDirs };
