const express = require('express');
const router = express.Router();
const db = require('../db');
const Joi = require('joi');

// Schéma de validation pour un client
const clientSchema = Joi.object({
  id: Joi.number().integer().optional(),
  nom: Joi.string().max(255).required(),
  prenom: Joi.string().max(255).required(),
  email: Joi.string().email().max(255).allow('', null),
  telephone: Joi.string().max(255).allow('', null),
  adresse: Joi.string().max(255).allow('', null),
  ville: Joi.string().max(255).allow('', null),
  code_postal: Joi.string().max(255).allow('', null),
  pays: Joi.string().max(255).allow('', null),
  societe: Joi.string().max(255).allow('', null),
  statut: Joi.string().valid('Actif', 'Inactif', 'Prospect').default('Prospect')
});

// Tous les clients
router.get('/', (req, res) => {
  db.all('SELECT * FROM clients ORDER BY date_creation DESC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Créer un client
router.post('/', (req, res) => {
  const { error, value } = clientSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const {
    nom, prenom, email, telephone, adresse,
    ville, code_postal, pays, societe, statut
  } = value;

  const safeEmail = email?.trim() || null;

  db.run(`
    INSERT INTO clients (
      nom, prenom, email, telephone, adresse,
      ville, code_postal, pays, societe, statut
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [nom, prenom, safeEmail, telephone, adresse, ville, code_postal, pays, societe, statut],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: this.lastID, ...value });
    }
  );
});

// Modifier un client
router.put('/:id', (req, res) => {
  const { error, value } = clientSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const {
    nom, prenom, email, telephone, adresse,
    ville, code_postal, pays, societe, statut
  } = value;

  const safeEmail = email?.trim() || null;

  db.run(`
    UPDATE clients SET
      nom = ?, prenom = ?, email = ?, telephone = ?, adresse = ?,
      ville = ?, code_postal = ?, pays = ?, societe = ?, statut = ?
    WHERE id = ?`,
    [nom, prenom, safeEmail, telephone, adresse, ville, code_postal, pays, societe, statut, req.params.id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0) return res.status(404).json({ error: "Client non trouvé." });
      res.json({ ok: "Client mis à jour avec succès." });
    }
  );
});

// Supprimer un client
router.delete('/:id', (req, res) => {
  db.run('DELETE FROM clients WHERE id = ?', [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: "Client non trouvé." });
    res.json({ ok: "Client supprimé avec succès." });
  });
});

module.exports = router;