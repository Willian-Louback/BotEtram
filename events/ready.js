const { Events, ActivityType } = require('discord.js');

const chalk = require('chalk');  //apenas para estilizar//

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		console.log(chalk.greenBright(`Bot foi iniciado, com ${client.users.cache.size} usuários, em ${client.channels.cache.size} canais, em ${client.guilds.cache.size} servidores.`));
		client.user.setPresence({ activities: [{name: `Eu estou em ${client.guilds.cache.size} servidor(es). Experimente usar o comando "/Pokedex"!`, type: ActivityType.Playing }], status: 'online' });
		const canal = client.channels.cache.get(process.env.ID_LOGS_DEPLOY);
		canal.send(`Bot foi iniciado, com ${client.users.cache.size} usuários, em ${client.channels.cache.size} canais, em ${client.guilds.cache.size} servidores.`);
		if(client.isReady() === true){
			module.exports.client = client;
			const apagaTudo = require('../others/deletar');
			module.exports.apagaTudo = apagaTudo;
		}	
	},
};