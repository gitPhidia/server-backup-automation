// src/index.js

const cron = require("node-cron");
const paths = require("./config/paths");
const fileService = require("./services/fileService");

// Vérification du mode simulation (par exemple, avec une variable ou un argument de ligne de commande)
const isDryRun = process.argv.includes("--dry-run");

function main() {
  console.log("Démarrage du processus de récupération des backups...");
  fileService.moveMostRecentFileFromDirs(paths.sourceToDestMapping, isDryRun);
}

// Appel initial pour tester la fonction immédiatement
main();

// Tâche cron - Exécuter sans le mode simulation
cron.schedule("00 20 * * *", () => {
  console.log("Tâche cron : Lancement du processus de récupération des backups...");
  fileService.moveMostRecentFileFromDirs(paths.sourceToDestMapping);
});
