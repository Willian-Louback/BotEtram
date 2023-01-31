const { SlashCommandBuilder } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('sentidodavida')
		.setDescription('Qual o sentido da vida? Será que Etram pode responder esta pergunta?'),
	async execute(interaction) {
		await interaction.deferReply();
		await wait(7000);
		await interaction.editReply('Desculpa, mas ainda não fui programado para responder perguntas complexas.');
	},
};