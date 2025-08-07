const request = require('supertest');
const express = require('express');
const clientRoutes = require('../routes/clients');
const db = require('../db');

const app = express();
app.use(express.json());
app.use('/api/clients', clientRoutes);

beforeAll((done) => {
  db.serialize(() => {
    db.run("DROP TABLE IF EXISTS clients");
    db.run(`
      CREATE TABLE clients (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nom TEXT NOT NULL,
        prenom TEXT NOT NULL,
        email TEXT,
        telephone TEXT,
        adresse TEXT,
        ville TEXT,
        code_postal TEXT,
        pays TEXT,
        societe TEXT,
        statut TEXT,
        date_creation TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);
    db.run(`
      INSERT INTO clients (nom, prenom, email, telephone, adresse, ville, code_postal, pays, societe, statut)
      VALUES ('Durand', 'Alice', 'alice@example.com', '0123456789', '1 rue de Paris', 'Paris', '75000', 'France', 'ACME', 'Actif')
    `, done);
  });
});

//Tests des routes clients
describe('API Clients', () => {
  let clientId;

  //Retourne tous les client
  test('GET /api/clients', async () => {
    const res = await request(app).get('/api/clients');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    clientId = res.body[0].id;
  });

  //Ajoute un nouveau client
  test('POST /api/clients', async () => {
    const newClient = {
      nom: "Martin",
      prenom: "Jean",
      email: "jean@example.com",
      telephone: "0600000000",
      adresse: "2 avenue des Champs",
      ville: "Lyon",
      code_postal: "69000",
      pays: "France",
      societe: "Entreprise X",
      statut: "Prospect"
    };

    const res = await request(app).post('/api/clients').send(newClient);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.nom).toBe("Martin");
  });

  //error si données invalides
  test('POST /api/clients', async () => {
    const res = await request(app).post('/api/clients').send({
      prenom: "SansNom"
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/"nom" is required/);
  });

  //Met à jour un client existant
  test('PUT /api/clients/:id', async () => {
    const res = await request(app).put(`/api/clients/${clientId}`).send({
      nom: "Durand",
      prenom: "Alice",
      email: "nouvel.email@example.com",
      telephone: "0999999999",
      adresse: "1 rue modifiée",
      ville: "Paris",
      code_postal: "75001",
      pays: "France",
      societe: "ACME Corp",
      statut: "Inactif"
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.ok).toBe("Client mis à jour avec succès.");
  });

  //error si client inexistant
  test('PUT /api/clients/:id', async () => {
    const res = await request(app).put('/api/clients/9999').send({
      nom: "Ghost",
      prenom: "Client",
      email: null,
      telephone: null,
      adresse: null,
      ville: null,
      code_postal: null,
      pays: null,
      societe: null,
      statut: "Prospect"
    });
    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBe("Client non trouvé.");
  });

  //Supprime un client
  test('DELETE /api/clients/:id', async () => {
    const ajout = await request(app).post('/api/clients').send({
      nom: "Test",
      prenom: "Supprimer",
      email: "test@supprimer.com",
      telephone: "0101010101",
      adresse: "null",
      ville: "Testville",
      code_postal: "00000",
      pays: "Testpays",
      societe: "TestSociete",
      statut: "Inactif"
    });

    const idToDelete = ajout.body.id;

    const res = await request(app).delete(`/api/clients/${idToDelete}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.ok).toBe("Client supprimé avec succès.");
  });

  //error si client inexistant'
  test('DELETE /api/clients/:id', async () => {
    const res = await request(app).delete('/api/clients/9999');
    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBe("Client non trouvé.");
  });

  //Retourne le résumé des clients
  test('GET /api/clients/dashboard/clients-resume', async () => {
    const res = await request(app).get('/api/clients/dashboard/clients-resume');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('total');
    expect(res.body).toHaveProperty('actif');
    expect(res.body).toHaveProperty('inactif');
    expect(res.body).toHaveProperty('prospect');
    expect(res.body).toHaveProperty('ceMois');
  });

  test('POST /api/clients - accepte email vide ou null', async () => {
    const res = await request(app).post('/api/clients').send({
      nom: "SansEmail",
      prenom: "Test",
      email: "",
      telephone: "0123456789",
      adresse: "Rue X",
      ville: "Nice",
      code_postal: "06000",
      pays: "France",
      societe: "TestCorp",
      statut: "Prospect"
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.email).toBe("");
  });

  //Accepte les valeurs facultatives (nulles)
  test('POST /api/clients', async () => {
    const res = await request(app).post('/api/clients').send({
      nom: "Test",
      prenom: "Facultatif",
      email: null,
      telephone: null,
      adresse: null,
      ville: null,
      code_postal: null,
      pays: null,
      societe: null,
      statut: "Prospect"
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.telephone).toBe(null);
  });
});
