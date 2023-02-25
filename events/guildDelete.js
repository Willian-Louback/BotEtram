const { Events, ActivityType } = require('discord.js');

const chalk = require('chalk');  //apenas para estilizar//

module.exports = {
    name: Events.GuildDelete,
    execute(guild){
        const client = require("./ready").client;
        console.log(chalk.magenta(`O bot foi removido do servidor: ${guild.name}.`));
        client.user.setPresence({ activities: [{name: `Eu estou em ${client.guilds.cache.size} servidor(es). Experimente usar o comando "/Pokedex"!`, type: ActivityType.Playing }], status: 'online' });
        const canal = client.channels.cache.get(process.env.ID_LOGS_INFO);
        canal.send("--------------------------------------------------");
        canal.send(`O bot foi removido do servidor: ${guild.name}.`);
        canal.send("--------------------------------------------------");
    }
}