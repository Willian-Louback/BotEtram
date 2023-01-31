const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('drip')
		.setDescription('Mostre todo o seu drip.'),
	async execute(interaction) {
		await interaction.reply(`🥶🥶`);
	},
};