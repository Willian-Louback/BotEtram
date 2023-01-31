const { SlashCommandBuilder } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Apenas para testes.'),
	async execute(interaction) {
		await interaction.reply("pong!");
		await wait(3000);
		await interaction.editReply('PONG!!');
		await wait(2000);
		await interaction.followUp("PONG DE NOVO!!!")
	},
};