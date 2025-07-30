const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', (req, res) => {
  db.all('SELECT * FROM clients', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

router.post('/', (req, res) => {
  const { id, name } = req.body;
  db.run('INSERT INTO clients(id, name) VALUES (?, ?)', [id, name], (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ ok: "Ajouté avec succès!" });
  });
});

module.exports = router;
