const client = require('../index');
const chalk = require('chalk');

require('dotenv').config({ path: './secure/.env' });

const { ID_LOGS_DEPLOY, ID_LOGS_INFO, ID_LOGS_COMMANDS } = process.env;
function apagaTudo(){
        const canalDeploy = client.channels.cache.get(ID_LOGS_DEPLOY);
        const apagaDeploy = canalDeploy.messages.fetch()
        .then((mensagens) => {
            if(mensagens.size <= 12){
                canalDeploy.bulkDelete(mensagens);
                console.log(chalk.yellow(`Foram apagadas ${mensagens.size} mensagens! No canal ${canalDeploy.name}.`));
                canalDeploy.send(`Foram apagadas ${mensagens.size} mensagens! No canal ${canalDeploy.name}.`);
            }
        })
        .catch(console.error);

        const canalInfo = client.channels.cache.get(ID_LOGS_INFO);
        const apagaInfo = canalInfo.messages.fetch()
        .then((mensagens) => {
            if(mensagens.size <= 30){
                canalCommands.bulkDelete(mensagens);
                console.log(chalk.yellow(`Foram apagadas ${mensagens.size} mensagens! No canal ${canalInfo.name}.`));
                canalInfo.send(`Foram apagadas ${mensagens.size} mensagens! No canal ${canalInfo.name}.`);
            }
        })
        .catch(console.error);

        const canalCommands = client.channels.cache.get(ID_LOGS_COMMANDS);
        const apagaCommands = canalCommands.messages.fetch()
        .then((mensagens) => {
            if(mensagens.size <= 30){
                canalCommands.bulkDelete(mensagens);
                console.log(chalk.yellow(`Foram apagadas ${mensagens.size} mensagens! No canal ${canalCommands.name}.`));
                canalCommands.send(`Foram apagadas ${mensagens.size} mensagens! No canal ${canalCommands.name}.`);
            }
        })
        .catch(console.error);
        return apagaCommands, apagaDeploy, apagaInfo;
    }
module.exports = apagaTudo;

