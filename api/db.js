const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./data.db');

// Création des tables
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS clients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      clientId TEXT,
      montant REAL,
      type TEXT,
      categorie TEXT,
      statut TEXT,
      date TEXT,
      description TEXT,
      FOREIGN KEY (clientId) REFERENCES clients(id)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT CHECK(type IN ('revenu', 'depense')) NOT NULL,
      nom TEXT NOT NULL
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
