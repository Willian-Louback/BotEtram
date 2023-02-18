/*const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ],
});
const chalk = require('chalk');

require('dotenv').config({ path: './secure/.env' });

const { ID_LOGS_DEPLOY, ID_LOGS_INFO, ID_LOGS_COMMANDS } = process.env;
function apagaTudo(){
        const canalDeploy = client.channels.cache.get(ID_LOGS_DEPLOY);
        const apagaDeploy = canalDeploy.messages.fetch()
        .then((mensagens) => {
            canalDeploy.bulkDelete(mensagens);
            console.log(chalk.yellow(`Foram apagadas ${mensagens.size} mensagens! No canal ${canalDeploy.name}.`));
            canalDeploy.send("Mensagens Apagadas!");
        })
        .catch(console.error);
        return apagaDeploy;

        const canalInfo = client.channels.cache.get(ID_LOGS_INFO);
        const apagaInfo = canalInfo.messages.fetch()
        .then((mensagens) => {
            return canalInfo.bulkDelete(mensagens);
            //console.log(chalk.yellow(`Foram apagadas ${mensagens.size} mensagens! No canal ${mensagens.channel.name}.`));
        })
        .catch(console.error);

        const canalCommands = client.channels.cache.get(ID_LOGS_COMMANDS);
        const apagaCommands = canalCommands.messages.fetch()
        .then((mensagens) => {
            return canalCommands.bulkDelete(mensagens);
            //console.log(chalk.yellow(`Foram apagadas ${mensagens.size} mensagens! No canal ${mensagens.channel.name}.`));
        })
        .catch(console.error);
        return apagaCommands, apagaDeploy, apagaInfo;
    }
module.exports = apagaTudo;
*/
