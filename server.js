const express = require('express');
const app = express();

// 🔹 parse le JSON
app.use(express.json());

// 🔹 parse les formulaires urlencoded si nécessaire
app.use(express.urlencoded({ extended: true }));

// tes routes
const articlesRouter = require('./routes/articles');
app.use('/api/articles', articlesRouter);

app.listen(3000, () => console.log('Serveur démarré sur le port 3000'));

const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');

const swaggerOptions = {
    swaggerDefinition: {
        openapi: "3.0.0",
        info: {
            title: "Blog API",
            version: "1.0.0",
            description: "API backend pour gérer un blog simple"
        },
        servers: [
            { url: "http://localhost:3000" }
        ]
    },
    apis: ["./routes/*.js"] // fichiers où tu décris les endpoints
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));