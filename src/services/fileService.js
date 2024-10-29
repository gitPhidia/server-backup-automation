const fs = require("fs");
const path = require("path");
const logger = require("../utils/logger");

// Vérification combinée pour un répertoire
const checkDirectory = (dir) => {
  if (!fs.existsSync(dir)) {
    const message = `Répertoire introuvable: ${dir}`;
    logger.error(message);
    console.error(message);
    return false;
  }

  try {
    fs.accessSync(dir, fs.constants.W_OK);
  } catch (err) {
    const message = `Permissions d'écriture insuffisantes pour le répertoire: ${dir}`;
    logger.error(message);
    console.error(message);
    return false;
  }

  return true;
};

// Vérifier si un répertoire est vide
const isDirectoryEmpty = (dir) => {
  const files = fs.readdirSync(dir);
  return files.length === 0;
};

// Obtenir le fichier le plus récent
const getMostRecentFile = (dir) => {
  const files = fs.readdirSync(dir);
  let mostRecentFile = null;

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const fileStat = fs.statSync(filePath);

    if (fileStat.isFile() && (!mostRecentFile || fileStat.mtime > mostRecentFile.mtime)) {
      mostRecentFile = { filePath, mtime: fileStat.mtime };
    }
  });

  return mostRecentFile ? mostRecentFile.filePath : null;
};

// Déplacer un fichier s'il n'existe pas déjà dans la destination
const moveFileIfNotExists = async (sourceFile, destFile) => {
  if (fs.existsSync(destFile)) {
    const message = `Le fichier ${path.basename(destFile)} existe déjà dans ${path.dirname(destFile)}. Copie ignorée.`;
    logger.info(message);
    console.info(message);
    return;
  }

  try {
    await fs.promises.rename(sourceFile, destFile);
    const successMsg = `Déplacement réussi de ${sourceFile} vers ${destFile}`;
    logger.info(successMsg);
    console.info(successMsg);
  } catch (err) {
    const errorMsg = `Échec du déplacement de ${sourceFile} vers ${destFile}: ${err.message}`;
    logger.error(errorMsg);
    console.error(errorMsg);
  }
};

// Fonction principale pour déplacer le fichier le plus récent
const moveMostRecentFileFromDirs = (sourceToDestMapping, isDryRun = false) => {
  sourceToDestMapping.forEach(({ source, dest }) => {
    // Vérification de l'existence du répertoire source
    if (!checkDirectory(source))
      return;

    // Obtenir le fichier le plus récent du répertoire source
    const mostRecentFile = getMostRecentFile(source);

    if (mostRecentFile) {
      const fileName = path.basename(mostRecentFile);
      const destFile = path.join(dest, fileName);

      // Mode simulation - Affichage sans déplacement
      if (isDryRun) {
        console.info(`[Simulation] Le fichier le plus récent ${fileName} serait déplacé de ${source} vers ${dest}`);
      } else {
        // Déplacer le fichier
        moveFileIfNotExists(mostRecentFile, destFile)
          .then(() => {
            console.info(`Le fichier ${fileName} a été déplacé avec succès de ${source} à ${dest}.`);
          })
          .catch((err) => {
            console.error(`Erreur lors du déplacement du fichier ${fileName} de ${source} à ${dest}: ${err.message}`);
          });
      }
    } else {
      console.info(`Aucun fichier trouvé dans le répertoire ${source}.`);
    }
  });
};

module.exports = { moveMostRecentFileFromDirs };
