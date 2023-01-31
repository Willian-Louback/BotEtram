const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');
const Canvas = require('@napi-rs/canvas');

const data = new SlashCommandBuilder()
	.setName('pokedex')
	.setDescription('Selecione um pokémon para visualizar.')
    .addStringOption(option =>
		option
            .setName('pokémon')
            .setDescription(`Procure o seu pokémon!`)
            .setRequired(true))
    .addBooleanOption(option =>
        option
            .setName('shiny')
            .setDescription('Veja o seu pokémon shiny!'))
module.exports = {
    data,
    async execute(interaction) {
        const resposta = interaction.options.getString("pokémon");
        const pokemon = resposta.toLowerCase();
        const shiny = interaction.options.getBoolean('shiny');
        console.log(shiny);
        const link = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);

        //manipulando imagem de erro
        const canvas = Canvas.createCanvas(700, 250);
        const context = canvas.getContext('2d');

        const background = await Canvas.loadImage('./images/cenario.gif');
        context.drawImage(background, 0, 0, canvas.width, canvas.height);
        
        const imagemError = await Canvas.loadImage('./images/Psyduck-confuso-error.png');
        context.drawImage(imagemError, 290, 65, 140, 170);

        const attachment = new AttachmentBuilder(await canvas.encode('png'), { name: 'error-image.png' });
        //const attachmentB = new AttachmentBuilder(await canvas.encode('png'), { name: 'background.png' });
        //fim da manipulação de imagem
        
        if(link.status != 200){
            console.log("Página não encontrada!");
            await interaction.reply({content: `Pokémon não encontrado!`, 
                 files: [attachment]});
            //await interaction.followUp({files: [attachmentB]});
        } else {
            const data = await link.json();
            const id = data.id;
            if (650 <= id && id <= 898 && shiny != true){
                await interaction.reply(`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`);
            } else if(id > 898 && shiny != true) {
                await interaction.reply({content: `Nome: ${data.name}.\nNúmero: ${id}.\nEste pokémon ainda não possui sprit!`, 
                 files: [attachment]});
            } else if(shiny != true) {
                await interaction.reply(`Nome: ${data.name}.\nNúmero: ${id}.`);
                await interaction.followUp(`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/${id}.gif`);
            }
            if(id >= 1 && id <= 649 && shiny == true){
                await interaction.reply(`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/shiny/${id}.gif`);
            } else if(id >= 150 && id <= 898 && shiny == true){
                await interaction.reply(`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${id}.png`);
            }
        }
    },
}
//await interaction.reply(`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/shiny/6.gif`)
//"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/1.gif";