const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./data.db');

// Création des tables
db.serialize(() => {
 db.run(`
    CREATE TABLE IF NOT EXISTS clients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nom VARCHAR(255) NOT NULL,
      prenom VARCHAR(255),
      email VARCHAR(255) UNIQUE,
      telephone VARCHAR(255),
      adresse VARCHAR(255),
      ville VARCHAR(255),
      code_postal VARCHAR(255),
      pays VARCHAR(255),
      societe VARCHAR(255),
      statut VARCHAR(55) CHECK(statut IN ('Actif', 'Inactif', 'Prospect')) DEFAULT 'Prospect',
      date_creation DATE DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      clientId INTEGER,
      montant REAL,
      type VARCHAR(55) CHECK(type IN ('revenu', 'depense')) NOT NULL,
      categorie VARCHAR(55),
      statut VARCHAR(55),
      date DATE,
      description TEXT,
      FOREIGN KEY (clientId) REFERENCES clients(id)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type VARCHAR(55) CHECK(type IN ('revenu', 'depense')) NOT NULL,
      nom VARCHAR(55) NOT NULL
    )
  `);

  // Insertion des catégories par défaut (si aucune donnée n'existe)
  db.all("SELECT COUNT(*) as count FROM categories", (err, rows) => {
    if (err) throw err;

    if (rows[0].count === 0) {
      const revenu = ["Récolte", "Pension", "Vente", "Autre"];
      const depense = ["Salaire", "Nourriture", "Entretien", "Materiel", "Réparation", "Autre"];

      const stmt = db.prepare("INSERT INTO categories (type, nom) VALUES (?, ?)");

      revenu.forEach((cat) => stmt.run("revenu", cat));
      depense.forEach((cat) => stmt.run("depense", cat));

      stmt.finalize();
    }
  });
});

module.exports = db;