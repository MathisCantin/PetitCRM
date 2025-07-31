const request = require('supertest');
const express = require('express');
const clientRoutes = require('../routes/clients');
const db = require('../db');

const app = express();
app.use(express.json());
app.use('/api/clients', clientRoutes);

beforeAll((done) => {
  db.serialize(() => {
    db.run("DELETE FROM clients");
    db.run(`
      INSERT INTO clients (nom, prenom, email, telephone, adresse, ville, code_postal, pays, societe, statut)
      VALUES ('Jean', 'Dupont', 'jean@example.com', '0601020304', '1 rue Paris', 'Paris', '75000', 'France', 'Dupont SARL', 'Actif')
    `, done);
  });
});

describe('API Clients', () => {
  let clientId;

  test('GET /api/clients → devrait retourner tous les clients', async () => {
    const res = await request(app).get('/api/clients');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    clientId = res.body[0].id;
  });

  test('POST /api/clients → devrait ajouter un nouveau client', async () => {
    const nouveauClient = {
      nom: "Marie",
      prenom: "Curie",
      email: "marie.curie@example.com",
      telephone: "0612345678",
      adresse: "Rue des Sciences",
      ville: "Paris",
      code_postal: "75005",
      pays: "France",
      societe: "Laboratoire Curie",
      statut: "Prospect"
    };

    const res = await request(app).post('/api/clients').send(nouveauClient);
    expect(res.statusCode).toBe(201);
    expect(res.body.nom).toBe("Marie");
  });

  test('POST /api/clients → devrait échouer avec email invalide', async () => {
    const clientInvalide = {
      nom: "Faux",
      prenom: "Email",
      email: "pas-un-mail",
      telephone: "",
      adresse: "",
      ville: "",
      code_postal: "",
      pays: "",
      societe: "",
      statut: "Actif"
    };

    const res = await request(app).post('/api/clients').send(clientInvalide);
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/email/i);
  });

  test('PUT /api/clients/:id → devrait mettre à jour un client existant', async () => {
    const res = await request(app).put(`/api/clients/${clientId}`).send({
      nom: "Jean-Michel",
      prenom: "Durand",
      email: "jean.michel@example.com",
      telephone: "0712345678",
      adresse: "Nouvelle adresse",
      ville: "Lyon",
      code_postal: "69000",
      pays: "France",
      societe: "Durand Corp",
      statut: "Inactif"
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.ok).toMatch(/mis à jour/i);
  });

  test('PUT /api/clients/:id → devrait échouer si l\'ID n\'existe pas', async () => {
    const res = await request(app).put(`/api/clients/999999`).send({
      nom: "Personne",
      prenom: "Inconnu",
      email: "inconnu@example.com",
      telephone: "",
      adresse: "",
      ville: "",
      code_postal: "",
      pays: "",
      societe: "",
      statut: "Prospect"
    });

    expect(res.statusCode).toBe(404);
    expect(res.body.error).toMatch(/non trouvé/i);
  });

  test('DELETE /api/clients/:id → devrait supprimer un client', async () => {
    const res = await request(app).delete(`/api/clients/${clientId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.ok).toMatch(/supprimé/i);
  });

  test('DELETE /api/clients/:id → devrait échouer si le client n\'existe pas', async () => {
    const res = await request(app).delete(`/api/clients/999999`);
    expect(res.statusCode).toBe(404);
    expect(res.body.error).toMatch(/non trouvé/i);
  });
});