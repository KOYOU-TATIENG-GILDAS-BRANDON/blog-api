const express = require('express');
const router = express.Router();
const db = require('../db'); // connexion MySQL

// ========================
// GET tous les articles
// ========================
/**
 * @swagger
 * /api/articles:
 *   get:
 *     summary: Récupère tous les articles
 *     responses:
 *       200:
 *         description: Liste des articles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   titre:
 *                     type: string
 *                   contenu:
 *                     type: string
 *                   auteur:
 *                     type: string
 *                   categorie:
 *                     type: string
 *                   tags:
 *                     type: string
 *                   date_creation:
 *                     type: string
 *                     format: date-time
 */
router.get('/', (req, res) => {
    db.query('SELECT * FROM articles', (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json(results);
    });
});

// ========================
// GET recherche articles
// ========================
/**
 * @swagger
 * /api/articles/search:
 *   get:
 *     summary: Recherche des articles par mot-clé
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         required: true
 *         description: Mot à rechercher dans le titre ou contenu
 *     responses:
 *       200:
 *         description: Liste des articles correspondant au mot-clé
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
router.get('/search', (req, res) => {
    const texte = `%${req.query.query}%`;
    db.query('SELECT * FROM articles WHERE titre LIKE ? OR contenu LIKE ?', [texte, texte], (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json(results);
    });
});

// ========================
// GET un article par ID
// ========================
/**
 * @swagger
 * /api/articles/{id}:
 *   get:
 *     summary: Récupère un article par ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'article
 *     responses:
 *       200:
 *         description: Article trouvé
 *       404:
 *         description: Article non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.get('/:id', (req, res) => {
    db.query('SELECT * FROM articles WHERE id = ?', [req.params.id], (err, result) => {
        if (err) return res.status(500).json({ error: err });
        if (result.length === 0) return res.status(404).json({ message: 'Article non trouvé' });
        res.json(result[0]);
    });
});

// ========================
// POST créer un article
// ========================
/**
 * @swagger
 * /api/articles:
 *   post:
 *     summary: Création d'un article
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - titre
 *               - auteur
 *             properties:
 *               titre:
 *                 type: string
 *                 example: Mon premier article
 *               contenu:
 *                 type: string
 *                 example: Contenu de l'article
 *               auteur:
 *                 type: string
 *                 example: Gildas
 *               categorie:
 *                 type: string
 *                 example: Tech
 *               tags:
 *                 type: string
 *                 example: NodeJS,Express
 *     responses:
 *       201:
 *         description: Article créé avec succès
 *       400:
 *         description: Titre ou auteur manquant
 *       500:
 *         description: Erreur serveur
 */
router.post('/', (req, res) => {
    const { titre, contenu, auteur, categorie, tags } = req.body || {};

    if (!titre || !auteur) {
        return res.status(400).json({ error: 'Titre et auteur obligatoires' });
    }

    const query = `
        INSERT INTO articles 
        (titre, contenu, auteur, categorie, tags, date_creation) 
        VALUES (?, ?, ?, ?, ?, NOW())
    `;
    db.query(query, [titre, contenu, auteur, categorie, tags], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: 'Article créé', id: result.insertId });
    });
});

// ========================
// PUT modifier un article
// ========================
/**
 * @swagger
 * /api/articles/{id}:
 *   put:
 *     summary: Modifie un article
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'article à modifier
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titre:
 *                 type: string
 *               contenu:
 *                 type: string
 *               categorie:
 *                 type: string
 *               tags:
 *                 type: string
 *     responses:
 *       200:
 *         description: Article modifié
 *       500:
 *         description: Erreur serveur
 */
router.put('/:id', (req, res) => {
    const { titre, contenu, categorie, tags } = req.body;
    db.query('UPDATE articles SET titre=?, contenu=?, categorie=?, tags=? WHERE id=?',
        [titre, contenu, categorie, tags, req.params.id], (err, result) => {
            if (err) return res.status(500).json({ error: err });
            res.json({ message: 'Article modifié' });
        });
});

// ========================
// DELETE supprimer un article
// ========================
/**
 * @swagger
 * /api/articles/{id}:
 *   delete:
 *     summary: Supprime un article
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'article à supprimer
 *     responses:
 *       200:
 *         description: Article supprimé
 *       500:
 *         description: Erreur serveur
 */
router.delete('/:id', (req, res) => {
    db.query('DELETE FROM articles WHERE id=?', [req.params.id], (err, result) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ message: 'Article supprimé' });
    });
});

module.exports = router;