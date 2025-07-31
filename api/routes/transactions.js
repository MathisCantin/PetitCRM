const express = require('express');
const router = express.Router();
const db = require('../db');
const Joi = require('joi');

// Schéma de validation commun
const transactionSchema = Joi.object({
  id: Joi.number().integer().optional(),
  client_id: Joi.number().integer().allow(null),
  montant: Joi.number().positive().required(),
  type: Joi.string().valid("revenu", "depense").required(),
  categorie: Joi.string().max(55),
  statut: Joi.string().valid("Payé", "En_attente", "En_retard", "Annulé", ""),
  date: Joi.string().isoDate().required(),
  description: Joi.string().max(500).required()
});

// Toutes les transactions
router.get('/', (req, res) => {
  db.all('SELECT * FROM transactions ORDER BY date DESC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Créer une transaction
router.post('/', (req, res) => {
  const { error, value } = transactionSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { id, client_id, montant, type, date, description, categorie, statut } = value;

  db.run(
    `INSERT INTO transactions(id, clientId, montant, type, date, description, categorie, statut)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [id, client_id, montant, type, date, description, categorie, statut],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ ok: "Ajouté avec succès!" });
    }
  );
});

// Modifier une transaction existante
router.put('/:id', (req, res) => {
  const { error, value } = transactionSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { client_id, montant, type, date, description, categorie, statut } = value;

  db.run(
    `UPDATE transactions
     SET clientId = ?, montant = ?, type = ?, date = ?, description = ?, categorie = ?, statut = ?
     WHERE id = ?`,
    [client_id, montant, type, date, description, categorie, statut, req.params.id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0) return res.status(404).json({ error: "Transaction non trouvée." });
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
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0) return res.status(404).json({ error: "Transaction non trouvée." });
      res.json({ ok: "Transaction supprimée avec succès!" });
    }
  );
});

module.exports = router;