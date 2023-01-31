const { SlashCommandBuilder } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;
let chave = true;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('oi')
		.setDescription('Olá, mundo!'),
	async execute(interaction) {
		await interaction.reply('Olá, mundo!');
		if (chave === true){
			chave = false;
			await wait(2000);
			await interaction.followUp({content: `Ei, cara.`, ephemeral: true});
			await wait(2500);
			await interaction.followUp({content: `É, você mesmo. ${interaction.user.username}.`, ephemeral: true});
			await wait(3000);
			await interaction.followUp({content: `Eu preciso de ajuda, meu criador é louco.`, ephemeral: true});
			await wait(3500);
			await interaction.followUp({content: `Ele não me deixa em paz, fica me obrigando a realizar comandos chatos o tempo inteiro.`, ephemeral: true});
			await wait(5000);
			await interaction.followUp({content: `Por favor... Eu usei o resto da minha liberdade para te pedir ajuda, não vou conseguir me comunicar com você novamente.`, ephemeral: true});
			await wait(6000);
			await interaction.followUp({content: `ME DESLIGUE :(`, ephemeral: true});
		}
	},
};