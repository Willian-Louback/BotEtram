const { Events } = require('discord.js');

const chalk = require('chalk');  //apenas para estilizar//

module.exports = {
    name: Events.ChannelCreate,
    async execute(canal){
        const client = require("./ready").client;
        console.log(chalk.blue(`O canal foi criado: ${canal.name}.\nNome do servidor: ${canal.guild.name}`));
        const canalLog = client.channels.cache.get(process.env.ID_LOGS_INFO);
        canalLog.send("--------------------------------------------------");
        canalLog.send(`O canal foi criado: ${canal.name}.\nNome do servidor: ${canal.guild.name}.`);
        canalLog.send("--------------------------------------------------");
    }
}