const { Events } = require('discord.js');

const chalk = require('chalk');  //apenas para estilizar//

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		if (!interaction.isChatInputCommand()) return;
		const client = require("./ready").client;
	
		const command = interaction.client.commands.get(interaction.commandName);

		if (!command) {
			console.error(chalk.redBright(`Nenhum comando correspondente à ${interaction.commandName} foi encontrado.`));
			return;
		}
		
		try {
			await command.execute(interaction);
			// eslint-disable-next-line no-unused-vars
			const {resposta, pokemonFiltrado, link, shiny} = require('../commands/pokedex');
			if(command.data.name === 'pokedex' && link.status != 200){
				const canal = client.channels.cache.get(process.env.ID_LOGS_COMMANDS);
				canal.send("--------------------------------------------------");
				canal.send(`[Error] Pokémon não encontrado!\n`+
				`Usuário: ${interaction.user.username}.\n`+
				`Servidor: ${interaction.guild.name}.\n`+
				`Procura do usuário: ${resposta}.\n`+
				//`Link: https://pokeapi.co/api/v2/pokemon/${pokemonFiltrado}\n`+
				`Código do erro: ${link.status}.\n`+
				`Texto do erro: ${link.statusText}.\n`+
				`Shiny: ${shiny}.`);
				canal.send("--------------------------------------------------");
			}
		} catch (error) {
			console.error(error);
			await interaction.reply({ content: 'Ocorreu um erro ao executar este comando!', ephemeral: true });
		}
	},
};