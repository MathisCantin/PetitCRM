const express = require('express');
const router = express.Router();
const db = require('../db');

// Récupérer toutes les transactions
router.get('/', (req, res) => {
  db.all('SELECT * FROM transactions ORDER BY date DESC', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Créer une nouvelle transaction
router.post('/', (req, res) => {
  const { id, clientId, montant, type, date, description, categorie, statut } = req.body;

  db.run(
    `INSERT INTO transactions(id, clientId, montant, type, date, description, categorie, statut)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [id, clientId, montant, type, date, description, categorie, statut],
    (err) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ ok: "Ajouté avec succès!" });
    }
  );
});

// Modifier une transaction
router.put('/:id', (req, res) => {
  const { clientId, montant, type, date, description, categorie, statut } = req.body;

  db.run(
    `UPDATE transactions
     SET clientId = ?, montant = ?, type = ?, date = ?, description = ?, categorie = ?, statut = ?
     WHERE id = ?`,
    [clientId, montant, type, date, description, categorie, statut, req.params.id],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: "Transaction non trouvée." });
      }
      res.json({ ok: "Transaction mise à jour avec succès!" });
    }
  );
});

// Supprimer une transaction
router.delete('/:id', (req, res) => {
  db.run(
    `DELETE FROM transactions WHERE id = ?`,
    [req.params.id],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: "Transaction non trouvée." });
      }
      res.json({ ok: "Transaction supprimée avec succès!" });
    }
  );
});

module.exports = router;
