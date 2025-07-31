const express = require("express");
const router = express.Router();
const db = require("../db");
const Joi = require("joi");

// Schéma de validation pour une catégorie
const categorieSchema = Joi.object({
  id: Joi.number().integer().optional(),
  type: Joi.string().valid("revenu", "depense").required(),
  nom: Joi.string().trim().min(1).max(55).required()
});

// Récupérer toutes les catégories (option: filtrer par type)
router.get("/", (req, res) => {
  const type = req.query.type;
  const query = type
    ? "SELECT * FROM categories WHERE type = ?"
    : "SELECT * FROM categories";

  const params = type ? [type] : [];

  db.all(query, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Créer une catégorie
router.post("/", (req, res) => {
  const { error, value } = categorieSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { type, nom } = value;

  db.run(
    "INSERT INTO categories (type, nom) VALUES (?, ?)",
    [type, nom],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: this.lastID, type, nom });
    }
  );
});

// Modifier une catégorie existante
router.put("/:id", (req, res) => {
  const { error, value } = categorieSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { type, nom } = value;

  db.run(
    "UPDATE categories SET type = ?, nom = ? WHERE id = ?",
    [type, nom, req.params.id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0) {
        return res.status(404).json({ error: "Catégorie non trouvée" });
      }
      res.json({ id: req.params.id, type, nom });
    }
  );
});

// Supprimer une catégorie
router.delete("/:id", (req, res) => {
  db.run("DELETE FROM categories WHERE id = ?", [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) {
      return res.status(404).json({ error: "Catégorie non trouvée" });
    }
    res.json({ message: "Catégorie supprimée" });
  });
});

module.exports = router;
