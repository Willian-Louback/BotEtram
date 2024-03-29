const { REST, Routes } = require('discord.js');
require('dotenv').config({ path: './secure/.env' });
//const { clientId, guildId, token } = require('./config.json'); ARRUMANDO CÓDIGO
// eslint-disable-next-line no-unused-vars
const { CLIENT_ID, TOKEN_BOT, GUILD_ID } = process.env;
const fs = require('node:fs');
const chalk = require('chalk'); //apenas para estilizar//

const commands = [];
// Grab all the command files from the commands directory you created earlier
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	commands.push(command.data.toJSON());
}

// Construct and prepare an instance of the REST module
const rest = new REST({ version: '10' }).setToken(TOKEN_BOT);

// and deploy your commands!
(async () => {
	try {
		console.log(chalk.blue(`Foi iniciada a atualização de ${commands.length} comandos (/) aplicativos.`));

		// The put method is used to fully refresh all commands in the guild with the current set
		const data = await rest.put(
			Routes.applicationCommands(CLIENT_ID),
			{ body: commands }
		);

		console.log(chalk.green(`Sucesso! ${data.length} comandos foram carregados (/) aplicativos.`));
	} catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
})();