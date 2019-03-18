'use strict';

const fs = require('fs');

// função para ler o arquivo
const openFile = () => {
   try {
      const data = fs.readFileSync('./src/assets/games.log', 'utf8');
      return data;
   } catch(e) {
      return e;
   }
}

// função para separar as partidas num array
const separateMatches = (data) => {
   const matches = data.split('------------------------------------------------------------'), // separa as partidas num array
         dataMatches = [];

   // popula o array com dados das partidas tranformadas in array
   for (let i of matches) {
      dataMatches.push(i.split('\n'));
   }

   return dataMatches;
}

// cria o objeto e insere as informações
const structureObject= (data) => {
   const obj = {},
         rgxKill = /^(([0-9]{1,}:[0-9]{1,})\sKill:)/, // expressão regular para verificar se é kill
         rgxUser = /^(([0-9]{1,}:[0-9]{1,})\sClientUserinfoChanged:)/, //expressão regular para verififcar se é player
         rgxPlayerKill = /^(([0-9]{1,}:[0-9]{1,})\sKill:\s([0-9]{1,}\s){1,}[0-9]{1,}:\s([a-zA-Z0-9]{1,}\s){1,}killed)/, //expressão regular para identificar o jogador matador;
         rgxWordKill = /^(([0-9]{1,}:[0-9]{1,})\sKill:\s([0-9]{1,}\s){1,}[0-9]{1,}:\s<world>\skilled\s([a-zA-Z0-9]{1,}\s){1,}by)/; //expressão regular para identificar o jogador morto pelo <world>
      let pos = 1,
         player;

   // percorre o array
   for (let i of data) {
      // remove as posições que não tem informações uteis
      if (i.length > 3){
         // cria a estrutura do objeto
         obj[`game_${pos}`] = {
            total_kills: '',
            players: [],
            kills: {}
         };

         let total_kills = 0;
         
         for (let j of i) {
            // verifica se é player
            if (rgxUser.test(j.trim())) {
               // obtem o nome do play
               player = j.match(/n\\(.*)\\t\\/)[1];
               // verifica se jogador existe no array, se não existir adiciona
               if (obj[`game_${pos}`].players.indexOf(player) < 0) { 
                  obj[`game_${pos}`].players.push(player);
                  obj[`game_${pos}`].kills[player] = 0;
               }
            }

            // verifica se é kill
            if (rgxKill.test(j.trim())) {
               // faz a soma de kills de cada partida
               total_kills=total_kills+1;

               // verifica se é kill por player
               if (rgxPlayerKill.test(j.trim())){
                  // obtem o nome do player
                  player = j.trim().match(/^(([0-9]{1,}:[0-9]{1,})\sKill:\s([0-9]{1,}\s){1,}[0-9]{1,}:\s(.*)\skilled)/)[4];
                  // faz a soma de kills de cada player
                  obj[`game_${pos}`].kills[player] = obj[`game_${pos}`].kills[player] + 1;
               }
               
               // verifica se é kill por <world>
               if (rgxWordKill.test(j.trim())){
                  // obtem o nome do player
                  player = j.trim().match(/^(([0-9]{1,}:[0-9]{1,})\sKill:\s([0-9]{1,}\s){1,}[0-9]{1,}:\s<world>\skilled\s(.*)\sby)/)[4];

                  // verifica se atributo esta com valor maior que 0
                  if (obj[`game_${pos}`].kills[player] > 0) { 
                     // subtrai 1
                     obj[`game_${pos}`].kills[player] = obj[`game_${pos}`].kills[player] - 1;
                  }
               }
            }
         }
         // adiciona o total de kills de cada partida
         obj[`game_${pos}`].total_kills = total_kills;
         // vai somando +1 para gerar os itens do objeto com nome sequncial
         pos++;
      }
   }

   return obj;
}

module.exports = { openFile, separateMatches, structureObject };
