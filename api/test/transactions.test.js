const request = require('supertest');
const express = require('express');
const transactionRoutes = require('../routes/transactions');
const db = require('../db');

const app = express();
app.use(express.json());
app.use('/api/transactions', transactionRoutes);

beforeAll((done) => {
  // Réinitialiser les données de test
  db.serialize(() => {
    db.run("DELETE FROM transactions");
    db.run(`
      INSERT INTO transactions (clientId, montant, type, date, description, categorie, statut)
      VALUES (NULL, 100.5, 'revenu', '2025-07-30', 'Transaction test', 'Autre', 'Payé')
    `, done);
  });
});

describe('API Transactions', () => {
  let transactionId;

  test('GET /api/transactions → doit retourner toutes les transactions', async () => {
    const res = await request(app).get('/api/transactions');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    transactionId = res.body[0].id;
  });

  test('POST /api/transactions → doit ajouter une nouvelle transaction', async () => {
    const nouvelleTransaction = {
      client_id: null,
      montant: 200.75,
      type: 'depense',
      categorie: 'Nourriture',
      statut: 'En_attente',
      date: '2025-07-30',
      description: 'Achat au marché'
    };

    const res = await request(app).post('/api/transactions').send(nouvelleTransaction);
    expect(res.statusCode).toBe(201);
    expect(res.body.ok).toMatch(/Ajouté avec succès/i);
  });

  test('POST /api/transactions → doit échouer avec des données invalides', async () => {
    const transactionInvalide = {
      montant: -100,
      type: 'invalid',
      date: 'mauvaise-date',
      description: ''
    };

    const res = await request(app).post('/api/transactions').send(transactionInvalide);
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  test('PUT /api/transactions/:id → doit mettre à jour une transaction existante', async () => {
    const res = await request(app).put(`/api/transactions/${transactionId}`).send({
      client_id: null,
      montant: 999,
      type: 'revenu',
      categorie: 'Vente',
      statut: 'Payé',
      date: '2025-07-30',
      description: 'Mise à jour test'
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.ok).toMatch(/mise à jour/i);
  });

  test('PUT /api/transactions/:id → doit échouer si l\'ID est inexistant', async () => {
    const res = await request(app).put(`/api/transactions/999999`).send({
      client_id: null,
      montant: 100,
      type: 'revenu',
      categorie: 'Divers',
      statut: 'Payé',
      date: '2025-07-30',
      description: 'Impossible'
    });

    expect(res.statusCode).toBe(404);
    expect(res.body.error).toMatch(/non trouvée/i);
  });

  test('DELETE /api/transactions/:id → doit supprimer une transaction existante', async () => {
    const res = await request(app).delete(`/api/transactions/${transactionId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.ok).toMatch(/supprimée/i);
  });

  test('DELETE /api/transactions/:id → doit échouer si la transaction n\'existe pas', async () => {
    const res = await request(app).delete(`/api/transactions/999999`);
    expect(res.statusCode).toBe(404);
    expect(res.body.error).toMatch(/non trouvée/i);
  });
});
