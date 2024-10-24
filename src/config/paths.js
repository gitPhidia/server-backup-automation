const { resolve } = require("path");

const paths = {
  sourceToDestMapping: [
    {
      source: resolve("/home/mgbi/elixir/fracomex/fracomex_2024/fracomex_2.0_2024/backups"),
      dest: resolve("/home/mgbi/Documents/all_backup/fracomex_backups"),
      cleanup: {
        enabled: true, // Activer ou désactiver le nettoyage
        maxAgeInDays: 7, // Nombre maximum de jours avant suppression des fichiers
      }
    },
    {
      source: resolve("/home/mgbi/elixir/bbmay/prod/bbmay_prod/backups"),
      dest: resolve("/home/mgbi/Documents/all_backup/bbmay_backups"),
      cleanup: {
        enabled: true,
        maxAgeInDays: 7, // Différentes règles de nettoyage pour ce dossier
      }
    },
    {
      source: resolve("/home/mgbi/elixir/focicom/master/focicom/backups"),
      dest: resolve("/home/mgbi/Documents/all_backup/focicom_backups"),
      cleanup: {
        enabled: true, // Aucun nettoyage activé pour ce dossier
        maxAgeInDays: 7,
      }
    },
    // Ajoutez d'autres relations source-destination ici si nécessaire
  ],
};

module.exports = paths;
