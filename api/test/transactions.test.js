const request = require('supertest');
const express = require('express');
const transactionRoutes = require('../routes/transactions');
const db = require('../db');

const app = express();
app.use(express.json());
app.use('/api/transactions', transactionRoutes);

beforeAll((done) => {
  db.serialize(() => {
    db.run("DROP TABLE IF EXISTS transactions");
    db.run(`
      CREATE TABLE transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        clientId INTEGER,
        montant REAL NOT NULL,
        type TEXT NOT NULL,
        date TEXT NOT NULL,
        description TEXT NOT NULL,
        categorie TEXT,
        statut TEXT
      )
    `);
    db.run(`
      INSERT INTO transactions (clientId, montant, type, date, description, categorie, statut)
      VALUES (NULL, 100.5, 'revenu', '2025-07-30', 'Transaction test', 'Autre', 'Payé')
    `, done);
  });
});

//Tests des routes transactions
describe('API Transactions', () => {
  let transactionId;

  //Retourne toutes les transactions
  test('GET /api/transactions', async () => {
    const res = await request(app).get('/api/transactions');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    transactionId = res.body[0].id;
  });

  //Ajoute une nouvelle transaction
  test('POST /api/transactions', async () => {
    const nouvelleTransaction = {
      client_id: null,
      montant: 200.75,
      type: 'depense',
      categorie: 'Nourriture',
      statut: 'En attente',
      date: '2025-07-30',
      description: 'Achat au marché'
    };

    const res = await request(app).post('/api/transactions').send(nouvelleTransaction);
    expect(res.statusCode).toBe(201);
    expect(res.body.ok).toBe("Ajouté avec succès!");
  });

  //Retourne une erreur si le montant est manquant
  test('POST /api/transactions', async () => {
    const res = await request(app).post('/api/transactions').send({
      client_id: null,
      type: 'revenu',
      date: '2025-07-30',
      description: 'Transaction invalide'
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/"montant" is required/);
  });

  //Retourne une erreur si type invalide
  test('POST /api/transactions', async () => {
    const res = await request(app).post('/api/transactions').send({
      client_id: null,
      montant: 120,
      type: 'investissement',
      categorie: 'Crypto',
      statut: 'Payé',
      date: '2025-08-01',
      description: 'Erreur de type'
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/"type" must be one of/);
  });

  //Mettre à jour une transaction existante
  test('PUT /api/transactions/:id', async () => {
    const res = await request(app).put(`/api/transactions/${transactionId}`).send({
      client_id: null,
      montant: 150.00,
      type: 'revenu',
      categorie: 'Salaire',
      statut: 'Payé',
      date: '2025-07-31',
      description: 'Transaction modifiée'
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.ok).toBe("Transaction mise à jour avec succès!");
  });

  //Retourne une erreur si la transaction n'existe pas
  test('PUT /api/transactions/:id', async () => {
    const res = await request(app).put('/api/transactions/9999').send({
      client_id: null,
      montant: 100,
      type: 'depense',
      categorie: 'Inconnu',
      statut: 'Annulé',
      date: '2025-07-30',
      description: 'Transaction fantôme'
    });
    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBe("Transaction non trouvée.");
  });

  //Supprime une transaction existante
  test('DELETE /api/transactions/:id', async () => {
    const ajout = await request(app).post('/api/transactions').send({
      client_id: 2,
      montant: 80,
      type: 'depense',
      categorie: 'Test',
      statut: 'Payé',
      date: '2025-08-01',
      description: 'À supprimer'
    });

    expect(ajout.statusCode).toBe(201);

    const list = await request(app).get('/api/transactions');
    const idASupprimer = list.body.find(t => t.description === 'À supprimer').id;

    const res = await request(app).delete(`/api/transactions/${idASupprimer}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.ok).toBe("Transaction supprimée avec succès!");
  });

  //Erreur si transaction est inexistante
  test('DELETE /api/transactions/:id', async () => {
    const res = await request(app).delete('/api/transactions/9999');
    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBe("Transaction non trouvée.");
  });

  //Retourne le solde mensuel
  test('GET /api/transactions/solde-par-mois', async () => {
    const res = await request(app).get('/api/transactions/solde-par-mois');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).toHaveProperty('mois');
    expect(res.body[0]).toHaveProperty('solde');
  });

  //Retourne total par catégorie de dépense
  test('GET /api/transactions/par-categorie', async () => {
    const res = await request(app).get('/api/transactions/par-categorie');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    if (res.body.length > 0) {
      expect(res.body[0]).toHaveProperty('categorie');
      expect(res.body[0]).toHaveProperty('total');
    }
  });
});
