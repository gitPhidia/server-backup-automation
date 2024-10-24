const fs = require("fs");
const path = require("path");

// Définir le chemin du dossier logs et du fichier log
const logDir = path.resolve(__dirname, "../../logs");
const logFilePath = path.join(logDir, "app.log");

// Fonction pour vérifier et créer le dossier logs et le fichier app.log si nécessaire
const ensureLogFileExists = () => {
  // Vérifier si le dossier logs existe, sinon le créer
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }

  // Vérifier si le fichier log existe, sinon le créer
  if (!fs.existsSync(logFilePath)) {
    fs.writeFileSync(logFilePath, ""); // Crée un fichier vide
  }
};

// Fonction pour écrire dans le fichier log
const writeLogToFile = (message) => {
  ensureLogFileExists();  // S'assurer que le fichier log existe avant d'écrire dedans
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
