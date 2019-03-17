'use strict';

const parserService = require('../services/parserService');

exports.getParser = (req, res, next) => {
   try {
      const dataFile = parserService.openFile(),
         separate = parserService.separateMatches(dataFile),
         obj = parserService.structureObject(separate);

      res.status(200).send(obj);
   } catch(e) {
      res.status(400).send({
         message: 'Erro ao gerar parser'
      });
   }
};