'use strict'

const express = require('express');
const bodyParser = require('body-parser'); //todo requiste converte o corpo para JSON

const app = express();

// carrega as rotas
const appRoute = require('./src/routes/parserRoute');

app.use(bodyParser.json()); //tramforma os dados para json
app.use(bodyParser.urlencoded({ extended: false})); //codifica as urls

// Habilita o CORS
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*'); //urls que vão acessar a API
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, x-access-token');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    next();
});

app.use('/', appRoute);

module.exports = app; //exportar a classe para pode usar em outro arquivo