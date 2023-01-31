const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('server')
		.setDescription('Mostra as informações do servidor.'),
	async execute(interaction) {
		await interaction.reply({content:`Você está no servidor ${interaction.guild.name} e há ${interaction.guild.memberCount} membros.`, ephemeral: true});
	},
};