const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits, ActivityType } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const chalk = require('chalk');  //apenas para estilizar//

require('dotenv').config();

//const apagaTudo = require('./others/deletar');

client.on(Events.ClientReady, () => {
    console.log(chalk.greenBright(`Bot foi iniciado, com ${client.users.cache.size} usuários, em ${client.channels.cache.size} canais, em ${client.guilds.cache.size} servidores.`));
    client.user.setPresence({ activities: [{name: `Eu estou em ${client.guilds.cache.size} servidor(es). Experimente usar o comando "/Pokedex"!`, type: ActivityType.Playing }], status: 'online' });
	const canal = client.channels.cache.get(process.env.ID_LOGS_DEPLOY);
	canal.send(`Bot foi iniciado, com ${client.users.cache.size} usuários, em ${client.channels.cache.size} canais, em ${client.guilds.cache.size} servidores.`);
	//console.log(client.guilds.cache); interessante
});

/*setInterval(() => {
	const now = new Date();
	if (now.getHours() === 17 && now.setMinutes(9)) {
		console.log(apagaTudo())
		apagaTudo;
		const canalDeploy = client.channels.cache.get(process.env.ID_LOGS_DEPLOY);
		canalDeploy.messages.fetch()
        .then((mensagens) => {
            canalDeploy.bulkDelete(mensagens);
            console.log(chalk.yellow(`Foram apagadas ${mensagens.size} mensagens! No canal ${canalDeploy.name}.`));
            canalDeploy.send("Mensagens Apagadas!");
        })
	}
	console.log("verificado");
}, 5000);*/

client.on(Events.GuildCreate, guild => {
    console.log(chalk.magenta(`Bot entrou no servidor: ${guild.name}.`));
    client.user.setActivity(`Eu estou em ${client.guilds.cache.size} servidor(es). Experimente usar o comando "/Pokedex"!`);
	const canal = client.channels.cache.get(process.env.ID_LOGS_INFO);
	canal.send("--------------------------------------------------");
	canal.send(`Bot entrou no servidor: ${guild.name}.`);
	canal.send("--------------------------------------------------");
});

client.on(Events.GuildDelete, guild => {
    console.log(chalk.magenta(`O bot foi removido do servidor: ${guild.name}.`));
    client.user.setActivity(`Eu estou em ${client.guilds.cache.size} servidor(es). Experimente usar o comando "/Pokedex"!`);
	const canal = client.channels.cache.get();
	canal.send("--------------------------------------------------");
	canal.send(`O bot foi removido do servidor: ${guild.name}.`);
	canal.send("--------------------------------------------------");
});

client.on(Events.ChannelDelete, canal => {
    console.log(chalk.blue(`O canal foi deletado: ${canal.name}.\nNome do servidor: ${canal.guild.name}`));
	const canalLog = client.channels.cache.get("1075507143693848616");
	canalLog.send("--------------------------------------------------");
	canalLog.send(`O canal foi deletado: ${canal.name}.\nNome do servidor: ${canal.guild.name}`);
	canalLog.send("--------------------------------------------------");
});

client.on(Events.ChannelCreate, canal => {
    console.log(chalk.blue(`O canal foi criado: ${canal.name}.\nNome do servidor: ${canal.guild.name}`));
	const canalLog = client.channels.cache.get("1075507143693848616");
	canalLog.send("--------------------------------------------------");
	canalLog.send(`O canal foi criado: ${canal.name}.\nNome do servidor: ${canal.guild.name}`);
	canalLog.send("--------------------------------------------------");
});

client.login(process.env.TOKEN_BOT);

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

	if (!command) {
		console.error(chalk.redBright(`Nenhum comando correspondente à ${interaction.commandName} foi encontrado.`));
		return;
	}
	
	try {
		await command.execute(interaction);
		// eslint-disable-next-line no-unused-vars
		const {resposta, pokemonFiltrado, link, shiny} = require('./commands/pokedex');
		if(command.data.name === 'pokedex' && link.status != 200){
			const canal = client.channels.cache.get("1075515530166947900");
			canal.send("--------------------------------------------------");
			canal.send(`[Error] Pokémon não encontrado!\n`+
			`Usuário: ${interaction.user.username}.\n`+
			`Servidor: ${interaction.guild.name}.\n`+
			`Procura do usuário: ${resposta}.\n`+
			//`Link: https://pokeapi.co/api/v2/pokemon/${pokemonFiltrado}.\n`+
			`Código do erro: ${link.status}.\n`+
			`Texto do erro: ${link.statusText}.\n`+
			`Shiny: ${shiny}.`);
			canal.send("--------------------------------------------------");
		}
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'Ocorreu um erro ao executar este comando!', ephemeral: true });
	}
});