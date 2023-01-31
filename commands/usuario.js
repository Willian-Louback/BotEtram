const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('user')
		.setDescription('Mostra as suas informações.'),
	async execute(interaction) {
		await interaction.reply({content: `Esse comando foi acionado por ${interaction.user.username}, que se juntou em ${interaction.member.joinedAt}.`, ephemeral: true});
	},
};