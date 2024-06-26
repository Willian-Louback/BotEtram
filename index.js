const fs = require('fs');
const path = require('path');
const express = require('express');
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const chalk = require('chalk');  //apenas para estilizar//

require('dotenv').config({ path: './secure/.env'});

//Verificando se precisa apagar as logs
setInterval(() => {
	const now = new Date();
	const apagaTudo = require('./events/ready').apagaTudo;
	apagaTudo();
	console.log(chalk.blue(`Verificação concluída! Horário: ${now.getHours()}:${now.getMinutes()}.`));
}, 86400000);

//Puxando comandos
client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	} else {
		console.log(chalk.redBright(`[Aviso]`), `O comando em ${filePath} está precisando de algo, tente adicionar "data" ou "execute".`);
	}
}

//Puxando eventos
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

client.login(process.env.TOKEN_BOT);

// feedback que a aplicação subiu

const app = express();

const port = process.env.PORT || 3001;

app.listen(port, () => console.log("Servidor online"));