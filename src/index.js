const cron = require("node-cron");
const paths = require("./config/paths");
const fileService = require("./services/fileService");
const { cleanOldFilesFromDirs } = require('./services/cleanupService');

function main() {
  console.log("Démarrage du processus de copie...");
  //console.log("Destination de la copie : " + paths.destDir);
  fileService.moveMostRecentFileFromDirs(paths.sourceToDestMapping);
}

// Appel initial pour exécuter le processus immédiatement au démarrage
//main();
//cleanOldFilesFromDirs(paths.sourceToDestMapping);

// Configurer la tâche cron pour s'exécuter toutes les heures à 19h
cron.schedule("29 18 * * *", () => {
  console.log("Tâche cron : Lancement du processus de copie...");
  main();
});

// Exécuter la tâche tous les samedis et dimanches à 23h59
/*
cron.schedule("59 23 * * 6,0", () => {
  console.log("Tâche cron : Nettoyage des fichiers anciens pendant le week-end...");
  cleanOldFilesFromDirs(paths.sourceToDestMapping);
});
*/