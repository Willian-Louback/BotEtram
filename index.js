const fs = require('node:fs');
const path = require('node:path');
const chalk = require('chalk');  //apenas para estilizar//
require('dotenv').config();

const token = process.env.TOKEN_BOT;

const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
//const config = require("./config.json"); Arrumando o código com .env

client.on(Events.ClientReady, () => {
    console.log(chalk.greenBright(`Bot foi iniciado, com ${client.users.cache.size} usuários, em ${client.channels.cache.size} canais, em ${client.guilds.cache.size} servidores.`));
    client.user.setActivity(`Eu estou em ${client.guilds.cache.size} servidor(es). Experimente usar o comando "/Pokedex"!`);
});

client.on(Events.GuildCreate, guild => {
    console.log(chalk.magenta(`Bot entrou no servidor: "${guild.name}".`));
    client.user.setActivity(`Eu estou em ${client.guilds.cache.size} servidor(es). Experimente usar o comando "/Pokedex"!`);
});

client.on(Events.GuildDelete, guild => {
    console.log(chalk.magenta(`O bot foi removido do servidor: "${guild.name}".`));
    client.user.setActivity(`Eu estou em ${client.guilds.cache.size} servidor(es). Experimente usar o comando "/Pokedex"!`);
});

client.on(Events.ChannelDelete, canal => {
    console.log(chalk.blue(`O canal foi deletado: "${canal.name}".`));
});

client.on(Events.ChannelCreate, canal => {
    console.log(chalk.blue(`O canal foi criado: "${canal.name}".`));
});

/*client.on(Events.InteractionCreate, () => {
	console.log("teste top");
})*/ //Apenas para testes

client.login(token);

client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	// Set a new item in the Collection with the key as the command name and the value as the exported module
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	} else {
		console.log(chalk.redBright(`[Aviso]`), `O comando em ${filePath} está precisando de algo, tente adicionar "data" ou "execute".`);
	}
}

/*const wait = require('node:timers/promises').setTimeout;*/

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;
	
	const command = interaction.client.commands.get(interaction.commandName);

	/*if (interaction.commandName === 'ping') {
		await interaction.reply('Pong!');
		await wait(2000);
		await interaction.editReply('Pong again!');
	}*/							//Só para agilizar caso eu precise.

	if (!command) {
		console.error(chalk.redBright(`Nenhum comando correspondente à "${interaction.commandName}" foi encontrado.`));
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'Ocorreu um erro ao executar este comando!', ephemeral: true });
	}
});