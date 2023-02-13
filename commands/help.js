const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
require('dotenv').config();
//const bot = require('../config.json'); add .env
const { pokemonList1, pokemonList2, pokemonList3 } = require('../Events/lista');
const wait = require('node:timers/promises').setTimeout;

module.exports = {
    data: new SlashCommandBuilder()
    .setName('helpokemon')
    .setDescription('Mostra uma lista de todos os pokémons disponiveis.')
    .addStringOption(option =>
		option.setName('geracao')
			.setDescription('escolha a geração que deseja ver')
            .setRequired(true)
			.addChoices(
				{ name: 'Primeira geração', value: '1' },
                { name: 'Segunda geração', value: '2' },
			)),
    async execute(interaction) {
        const choice = interaction.options.getString("geracao");
        console.log(choice);
        //A lista foi separada em três partes porque o discord não suporta muitas palavras
        let lista1;
        let lista2;
        let lista3;
        pokemonList1().then(pokemonList => {
            lista1 = pokemonList;
          });
        pokemonList2().then(pokemonList => {
            lista2 = pokemonList;
          });
        pokemonList3().then(pokemonList => { 
            lista3 = pokemonList;
          });
        await interaction.deferReply({ephemeral: true});
        await wait (5000);
        const embedPokemon = new EmbedBuilder()
            .setColor('#FF0043')
            .setTitle('Pokédex')
            .setURL('https://pokedexwi.netlify.app/')
            .setAuthor({ name: 'Etram#1391', iconURL: `https://cdn.discordapp.com/app-icons/${process.env.CLIENT_ID}/${process.env.AVATAR_CLIENT}.png`, url: 'https://discord.com/api/oauth2/authorize?client_id=1065838867485302854&permissions=8&scope=bot' })
            //.setThumbnail('https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/6.gif')
            .addFields(
                { name: 'Essa lista ainda não está em sua versão final!', value: ` `},
                { name: 'Lista de Pokémon', value: `${lista1}`, inline: true},
                { name: ' ', value: `${lista2}`, inline: true },
                { name: ' ', value: `${lista3}`, inline: true }
            )
            //.setTimestamp()
            //.setFooter({ text: `${interaction.user.username}`, iconURL: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/25.gif' });
        await interaction.editReply({embeds: [embedPokemon], ephemeral: true});
    },
};