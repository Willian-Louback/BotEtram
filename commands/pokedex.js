const { SlashCommandBuilder, AttachmentBuilder, EmbedBuilder } = require('discord.js');
const Canvas = require('@napi-rs/canvas');
//const bot = require('../config.json')
const chalk = require('chalk');  //apenas para estilizar//

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

function estilizaNome(name){
    let resultado = 0;
    for (let i = 1; i <= name.length; i++){
        let primeiraLetra = name.substring(0,1).toUpperCase();
        let restanteLetras = name.substring(i,1);
        resultado = primeiraLetra + restanteLetras;
    }
    return resultado;
}

function filtrarResposta(resposta){
    let resultado = "";
    if(isNaN(resposta)){
        for (let i = 1; i <= resposta.length; i++){
            let letras = resposta.slice(i-1,i);
            if(letras != " "){
                resultado += letras;
            }
        } 
    } else {
        resultado = resposta;
    }
    return resultado;
}

module.exports = {
    data,
    async execute(interaction) {
        const resposta = interaction.options.getString("pokémon");
        const pokemon = resposta.toLowerCase();
        const shiny = interaction.options.getBoolean('shiny');
        const link = await fetch(`https://pokeapi.co/api/v2/pokemon/${filtrarResposta(pokemon)}`);

        //manipulando imagem de erro
        const canvas = Canvas.createCanvas(700, 250);
        const context = canvas.getContext('2d');

        const background = await Canvas.loadImage('./images/cenario.gif');
        context.drawImage(background, 0, 0, canvas.width, canvas.height);
        
        const imagemError = await Canvas.loadImage('./images/Psyduck-confuso-error.png');
        context.drawImage(imagemError, 290, 65, 140, 170);

        const attachment = new AttachmentBuilder(await canvas.encode('png'), { name: 'error-image.png' });
        //fim da manipulação de imagem

        if(link.status != 200){
            console.log(chalk.redBright("--------------------------------------------------"));
            console.log(chalk.red(`[Error] Pokémon não encontrado!\n`)+
            chalk.magenta(`Procura do usuário:`), chalk.cyan(`"${resposta}".\n`)+
            chalk.magenta(`Link:`), chalk.cyan(`"https://pokeapi.co/api/v2/pokemon/${filtrarResposta(pokemon)}".\n`)+
            chalk.magenta(`Código do erro:`), chalk.cyan(`${link.status}.\n`)+
            chalk.magenta(`Texto do erro:`), chalk.cyan(`${link.statusText}.\n`)+
            chalk.magenta(`Shiny:`), chalk.cyan(`${shiny}.`));
            console.log(chalk.redBright("--------------------------------------------------"));
            await interaction.reply({content: `Pokémon não encontrado!`, 
                 files: [attachment]});
        } else {
            const data = await link.json();
            const id = data.id;
            const height = data.height / 10;
            const weight = data.weight / 10;
            const types = data.types;

            if (650 <= id && id <= 898 && shiny != true){
                const embedPokemonStatic = new EmbedBuilder()
                    .setColor('#FF0043')
                    .setTitle('Pokédex')
                    .setURL('https://pokedexwi.netlify.app/')
                    //.setAuthor({ name: 'Etram#1391', iconURL: `https://cdn.discordapp.com/app-icons/${bot.clientId}/${bot.avatarClient}.png`, url: 'https://discord.com/api/oauth2/authorize?client_id=1065838867485302854&permissions=8&scope=bot' })
                    .setThumbnail(`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`)
                    .addFields(
                        { name: `${estilizaNome(data.name)}`, value: `Número: ${id}\nAltura: ${height.toFixed(1)} m\nPeso: ${weight.toFixed(1)} kg` }
                    )
                    .addFields({ name: 'Estatísticas', value: `Tipo: ${types.map((item)=>{const typesR = ' '+item.type.name; return typesR})}.`, inline: true })
                    .setTimestamp()
                    .setFooter({ text: `${interaction.user.username}`, iconURL: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/25.gif' });

                await interaction.reply({embeds: [embedPokemonStatic] });
                await interaction.followUp(`(Este pokémon ainda não possui sprite animado!)`);
                
            } else if(id > 898 && shiny != true || id > 898 && shiny == true) {
                const embedPokemonNoSprite = new EmbedBuilder()
                    .setColor('#FF0043')
                    .setTitle('Pokédex')
                    .setURL('https://pokedexwi.netlify.app/')
                    //.setAuthor({ name: 'Etram#1391', iconURL: `https://cdn.discordapp.com/app-icons/${bot.clientId}/${bot.avatarClient}.png`, url: 'https://discord.com/api/oauth2/authorize?client_id=1065838867485302854&permissions=8&scope=bot' })
                    .setThumbnail(`https://68.media.tumblr.com/e0bac3a565ceb39f1b55b913765a2cc7/tumblr_inline_nwf8c2J5NL1sp8z39_500.gif`)
                    .addFields(
                        { name: `${estilizaNome(data.name)}`, value: `Número: ${id}\nAltura: ${height.toFixed(1)} m\nPeso: ${weight.toFixed(1)} kg` }
                    )
                    .addFields({ name: 'Estatísticas', value: `Tipo: ${types.map((item)=>{const typesR = ' '+item.type.name; return typesR})}.`, inline: true })
                    .setTimestamp()
                    .setFooter({ text: `${interaction.user.username}`, iconURL: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/25.gif' });
                    
                await interaction.reply({embeds: [embedPokemonNoSprite]});
                await interaction.followUp(`Este pokémon ainda não possui sprit!`);
            } else if(shiny != true) {
                const embedPokemonAnimated = new EmbedBuilder()
                    .setColor('#FF0043')
                    .setTitle('Pokédex')
                    .setURL('https://pokedexwi.netlify.app/')
                    //.setAuthor({ name: 'Etram#1391', iconURL: `https://cdn.discordapp.com/app-icons/${bot.clientId}/${bot.avatarClient}.png`, url: 'https://discord.com/api/oauth2/authorize?client_id=1065838867485302854&permissions=8&scope=bot' })
                    .setThumbnail(`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/${id}.gif`)
                    .addFields(
                        { name: `${estilizaNome(data.name)}`, value: `Número: #${id}\nAltura: ${height.toFixed(1)} m\nPeso: ${weight.toFixed(1)} kg` }
                    )
                    .addFields({ name: 'Estatísticas', value: `Tipo: ${types.map((item)=>{const typesR = ' '+item.type.name; return typesR})}.`, inline: true })
                    .setTimestamp()
                    .setFooter({ text: `${interaction.user.username}`, iconURL: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/25.gif' });
                await interaction.reply({embeds: [embedPokemonAnimated] });
                console.log(`https://pokeapi.co/api/v2/pokemon/${filtrarResposta(pokemon)}`);
            }
            if(id >= 1 && id <= 649 && shiny == true){
                const embedPokemonAnimatedShiny = new EmbedBuilder()
                    .setColor('#FF0043')
                    .setTitle('Pokédex')
                    .setURL('https://pokedexwi.netlify.app/')
                    //.setAuthor({ name: 'Etram#1391', iconURL: `https://cdn.discordapp.com/app-icons/${bot.clientId}/${bot.avatarClient}.png`, url: 'https://discord.com/api/oauth2/authorize?client_id=1065838867485302854&permissions=8&scope=bot' })
                    .setThumbnail(`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/shiny/${id}.gif`)
                    .addFields(
                        { name: `${estilizaNome(data.name)}`, value: `Número: #${id}\nAltura: ${height.toFixed(1)} m\nPeso: ${weight.toFixed(1)} kg` }
                    )
                    .addFields({ name: 'Estatísticas', value: `Tipo: ${types.map((item)=>{const typesR = ' '+item.type.name; return typesR})}.`, inline: true })
                    .addFields({ name: 'Shiny!', value: ' ' })
                    .setTimestamp()
                    .setFooter({ text: `${interaction.user.username}`, iconURL: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/25.gif' });

                await interaction.reply({embeds: [embedPokemonAnimatedShiny] });
            } else if(id >= 650 && id <= 898 && shiny == true){
                const embedPokemonStaticShiny = new EmbedBuilder()
                    .setColor('#FF0043')
                    .setTitle('Pokédex')
                    .setURL('https://pokedexwi.netlify.app/')
                    //.setAuthor({ name: 'Etram#1391', iconURL: `https://cdn.discordapp.com/app-icons/${bot.clientId}/${bot.avatarClient}.png`, url: 'https://discord.com/api/oauth2/authorize?client_id=1065838867485302854&permissions=8&scope=bot' })
                    .setThumbnail(`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${id}.png`)
                    .addFields(
                        { name: `${estilizaNome(data.name)}`, value: `Número: #${id}\nAltura: ${height.toFixed(1)} m\nPeso: ${weight.toFixed(1)} kg` }
                    )
                    .addFields({ name: 'Estatísticas', value: `Tipo: ${types.map((item)=>{const typesR = ' '+item.type.name; return typesR})}.`, inline: true })
                    .addFields({ name: 'Shiny!', value: ' ' })
                    .setTimestamp()
                    .setFooter({ text: `${interaction.user.username}`, iconURL: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/25.gif' });

                await interaction.reply({embeds: [embedPokemonStaticShiny] });
                await interaction.followUp(`(Este pokémon ainda não possui sprite animado!)`);
            }
        }
    },
}
//await interaction.reply(`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/shiny/6.gif`)
//"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/1.gif";