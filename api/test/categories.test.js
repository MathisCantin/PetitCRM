const request = require('supertest');
const express = require('express');
const categorieRoutes = require('../routes/categories');
const db = require('../db');

const app = express();
app.use(express.json());
app.use('/api/categories', categorieRoutes);

beforeAll((done) => {
  db.serialize(() => {
    db.run("DELETE FROM categories", () => {
      db.run("INSERT INTO categories (type, nom) VALUES ('revenu', 'TestRevenu')", () => {
        db.run("INSERT INTO categories (type, nom) VALUES ('depense', 'TestDepense')", done);
      });
    });
  });
});

describe('API Catégories', () => {
  let categorieId;

  test('GET /api/categories → doit retourner toutes les catégories', async () => {
    const res = await request(app).get('/api/categories');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(2);
    categorieId = res.body[0].id;
  });

  test('GET /api/categories?type=revenu → doit retourner uniquement les revenus', async () => {
    const res = await request(app).get('/api/categories?type=revenu');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    res.body.forEach((cat) => {
      expect(cat.type).toBe('revenu');
    });
  });

  test('POST /api/categories → doit créer une nouvelle catégorie', async () => {
    const res = await request(app).post('/api/categories').send({
      type: 'depense',
      nom: 'NouveauTest'
    });
    expect(res.statusCode).toBe(201);
    expect(res.body.id).toBeDefined();
    expect(res.body.type).toBe('depense');
    expect(res.body.nom).toBe('NouveauTest');
  });

  test('POST /api/categories → doit échouer avec des données invalides', async () => {
    const res = await request(app).post('/api/categories').send({
      type: 'invalid_type',
      nom: ''
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  test('PUT /api/categories/:id → doit modifier une catégorie existante', async () => {
    const res = await request(app).put(`/api/categories/${categorieId}`).send({
      type: 'revenu',
      nom: 'TestModifié'
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.nom).toBe('TestModifié');
  });

  test('PUT /api/categories/:id → doit échouer si l\'ID n\'existe pas', async () => {
    const res = await request(app).put(`/api/categories/999999`).send({
      type: 'depense',
      nom: 'Inexistant'
    });
    expect(res.statusCode).toBe(404);
    expect(res.body.error).toMatch(/non trouvée/i);
  });

  test('DELETE /api/categories/:id → doit supprimer une catégorie', async () => {
    // Créer une catégorie à supprimer
    const creation = await request(app).post('/api/categories').send({
      type: 'depense',
      nom: 'À supprimer'
    });

    const res = await request(app).delete(`/api/categories/${creation.body.id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/supprimée/i);
  });

  test('DELETE /api/categories/:id → doit échouer si la catégorie n\'existe pas', async () => {
    const res = await request(app).delete('/api/categories/999999');
    expect(res.statusCode).toBe(404);
    expect(res.body.error).toMatch(/non trouvée/i);
  });
});
