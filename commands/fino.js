const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('fino')
		.setDescription('Mostre toda a sua fineza.'),
	async execute(interaction) {
		await interaction.reply(`🗿🍷`);
	},
};