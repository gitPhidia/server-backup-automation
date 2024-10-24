const fs = require("fs");
const path = require("path");

// Définir le chemin du fichier log
const logFilePath = path.resolve(__dirname, "../../logs/app.log");

// Fonction pour écrire dans le fichier log
const writeLogToFile = (message) => {
  const logMessage = `${new Date().toISOString()} - ${message}\n`;
  fs.appendFile(logFilePath, logMessage, (err) => {
    if (err) {
      console.error(
        "Erreur lors de l'écriture dans le fichier log:",
        err.message
      );
    }
  });
};

const logger = {
  info: (message) => {
    const logMessage = `INFO: ${message}`;
    console.log(logMessage);
    writeLogToFile(logMessage);
  },
  error: (message) => {
    const logMessage = `ERROR: ${message}`;
    console.error(logMessage);
    writeLogToFile(logMessage);
  },
};

module.exports = logger;
