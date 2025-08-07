const request = require('supertest');
const express = require('express');
const categorieRoutes = require('../routes/categories');
const db = require('../db');

const app = express();
app.use(express.json());
app.use('/api/categories', categorieRoutes);

beforeAll((done) => {
  db.serialize(() => {
    db.run("DROP TABLE IF EXISTS categories");
    db.run(`
      CREATE TABLE categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT NOT NULL,
        nom TEXT NOT NULL
      )
    `);
    db.run(`INSERT INTO categories (type, nom) VALUES ('revenu', 'Salaire')`);
    db.run(`INSERT INTO categories (type, nom) VALUES ('depense', 'Courses')`, done);
  });
});

//Tests des routes categories
describe('API Categories', () => {
  let createdCategoryId;
  
  //Retourne toutes les catégories
  test('GET /api/categories', async () => {
    const res = await request(app).get('/api/categories');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(2);
  });

  //Filtre par type
  test('GET /api/categories?type=revenu', async () => {
    const res = await request(app).get('/api/categories?type=revenu');
    expect(res.statusCode).toBe(200);
    expect(res.body.every(c => c.type === 'revenu')).toBe(true);
  });

  //Ajoute une catégorie valide
  test('POST /api/categories', async () => {
    const res = await request(app).post('/api/categories').send({
      type: 'depense',
      nom: 'Transport'
    });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.nom).toBe('Transport');
    createdCategoryId = res.body.id;
  });

  //Retourne error si nom vide
  test('POST /api/categories', async () => {
    const res = await request(app).post('/api/categories').send({
      type: 'depense',
      nom: ''
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/"nom" is not allowed to be empty/);
  });

  //Retourne error si type invalide
  test('POST /api/categories', async () => {
    const res = await request(app).post('/api/categories').send({
      type: 'investissement',
      nom: 'Actions'
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/"type" must be one of/);
  });

  //Met à jour une catégorie existante
  test('PUT /api/categories/:id', async () => {
    const res = await request(app).put(`/api/categories/${createdCategoryId}`).send({
      type: 'depense',
      nom: 'Loisirs'
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.nom).toBe('Loisirs');
  });

  //error si ID inexistant
  test('PUT /api/categories/:id', async () => {
    const res = await request(app).put(`/api/categories/9999`).send({
      type: 'revenu',
      nom: 'Investissement'
    });
    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBe("Catégorie non trouvée");
  });

  //error de validation
  test('PUT /api/categories/:id', async () => {
    const res = await request(app).put(`/api/categories/${createdCategoryId}`).send({
      type: 'revenu',
      nom: ''
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/"nom" is not allowed to be empty/);
  });

  //Supprime une catégorie existante
  test('DELETE /api/categories/:id', async () => {
    const res = await request(app).delete(`/api/categories/${createdCategoryId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Catégorie supprimée");
  });

  //error si ID inexistant
  test('DELETE /api/categories/:id', async () => {
    const res = await request(app).delete('/api/categories/9999');
    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBe("Catégorie non trouvée");
  });
});
