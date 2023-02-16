/*const { Client, GatewayIntentBits, Events } = require('discord.js');
const client = new Client({ intents: GatewayIntentBits.Guilds});
const chalk = require('chalk');
const config = require("../config.json");

run: async(client,message,args) => {
    const canalDeploy = client.channels.cache.get(config.id_logs_deploy);
    const apagaDeploy = canalDeploy.messages.fetch()
        .then((mensagens) => {
            canalDeploy.bulkDelete(mensagens);
            //console.log(chalk.yellow(`Foram apagadas ${mensagens.size} mensagens! No canal ${mensagens.channel.name}.`));
            //canalDeploy.send("Mensagens Apagadas!");
        })
        .catch(console.error);
        
    const canalInfo = client.channels.cache.get(config.id_logs_info);
    const apagaInfo = canalInfo.messages.fetch()
        .then((mensagens) => {
            return canalInfo.bulkDelete(mensagens);
            //console.log(chalk.yellow(`Foram apagadas ${mensagens.size} mensagens! No canal ${mensagens.channel.name}.`));
        })
        .catch(console.error);
    
    const canalCommands = client.channels.cache.get(config.id_logs_commands);
    const apagaCommands = canalCommands.messages.fetch()
        .then((mensagens) => {
            return canalCommands.bulkDelete(mensagens);
            //console.log(chalk.yellow(`Foram apagadas ${mensagens.size} mensagens! No canal ${mensagens.channel.name}.`));
        })
        .catch(console.error);

    module.exports = {
        apagaCommands,
        apagaDeploy,
        apagaInfo
    }
};*/



