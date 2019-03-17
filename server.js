'use strict'

const app = require('./app');

//importação de modulos
const http = require('http');
const debug = require('debug')('nodestr:server'); //deu o nome de nodestr:server

// função para obter a porta disponivel
const normalizePort = (val) => {
    const port  = parseInt(val, 10);

    if(isNaN(port)) return val;
    if(port >= 0) return port;

    return false;
}

// função para tartar erros
const onError = (error) => {
    if(error.syscall !== 'listen') throw error;

    const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

    switch (error.code) {
        case 'EACCES' : // error de permissão 
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE' : //error de endetreço em uso
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default : 
            throw error;
    }
}

// pega as informações do servidor e chama o debug
const onListening = () => {
    const addr = server.address();
    const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port '+ addr.port;
    debug('Listenring on ' + bind);
}

const port = normalizePort(process.env.PORT || '3000');
app.set('port', port); 

const server = http.createServer(app);

server.listen(port); //fala para o servidor ficar ouvindo
server.on('error', onError); //chama a função de erro;
server.on('listering', onListening); //chama a função de onListering;
console.log('API rodando na porta:', port);

