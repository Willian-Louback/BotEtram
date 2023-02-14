const { SlashCommandBuilder, AttachmentBuilder, EmbedBuilder } = require('discord.js');
const Canvas = require('@napi-rs/canvas');
const chalk = require('chalk');  //apenas para estilizar//
const axios = require('axios'); /*atualizando para axios invés de fetch (Pesquisar mais sobre)
O axios converte para .Json() automaticamente, então um código que seria assim:
    const link = await fetch(`https://pokeapi.co/api/v2/pokemon/${filtrarResposta(pokemon)}`);
    const data = await link.json();
será assim:
    const link = await axios.get(`https://pokeapi.co/api/v2/pokemon/${filtrarResposta(pokemon)}`);
*/

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
        let link;
        try{
            link = await axios.get(`https://pokeapi.co/api/v2/pokemon/${filtrarResposta(pokemon)}`);
        } catch (err){
            link = err.response;
        }
        

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
            chalk.magenta(`Usuário:`), chalk.cyan(`"${interaction.user.username}".\n`)+
            chalk.magenta(`Link:`), chalk.cyan(`"https://pokeapi.co/api/v2/pokemon/${filtrarResposta(pokemon)}".\n`)+
            chalk.magenta(`Código do erro:`), chalk.cyan(`${link.status}.\n`)+
            chalk.magenta(`Texto do erro:`), chalk.cyan(`${link.statusText}.\n`)+
            chalk.magenta(`Shiny:`), chalk.cyan(`${shiny}.`));
            console.log(chalk.redBright("--------------------------------------------------"));
            await interaction.reply({content: `Pokémon não encontrado!`, 
                 files: [attachment], ephemeral: true});
        } else {
            const data = await link.data; //Só para não reescrever o código, usando a váriavel "link" + .data também funcionaria
            const id = data.id;
            const height = data.height / 10;
            const weight = data.weight / 10;
            const types = data.types;
            let color = '#FF0043';
            types.map((item)=>{
                let type;
                if (item.slot == 1){
                    type = item.type.name;  
                }
                if(type == 'grass'){
                    color = 'Green';
                } else if (type == 'fire'){
                    color = '#FF0043';
                } else if(type == "water"){
                    color = 'Blurple';
                } else if (type == 'poison' ){
                    color = 'Purple';
                } else if(type == 'ghost'){
                    color = 'DarkPurple';
                } else if(type == 'electric'){
                    color = 'Yellow';
                } else if(type == 'psychic' || type == 'fairy'){
                    color = 'LuminousVividPink';
                } else if(type == 'rock'){
                    color = 'DarkerGrey';
                } else if(type == 'steel' || type == "flying"){
                    color = 'LightGrey';
                } else if (type == 'bug'){
                    color = 'DarkGreen';
                } else if (type == 'dark'){
                    color = '#000000';
                } else if (type == "dragon"){
                    color = 'Orange';
                } else if (type == "fighting"){
                    color = '#800000';
                } else if (type == "ground"){
                    color = '#964B00';
                } else if (type == 'ice'){
                    color = '#00FFFF';
                } else if (type == 'normal'){
                    color = '#ffffff';
                }
            })

            if (650 <= id && id <= 898 && shiny != true){
                const embedPokemonStatic = new EmbedBuilder()
                    .setColor(`${color}`)
                    .setTitle('Pokédex')
                    .setURL('https://pokedexwi.netlify.app/')
                    //.setAuthor({ name: 'Etram#1391', iconURL: `https://cdn.discordapp.com/app-icons/${process.env.CLIENT_ID}/${process.env.AVATAR_CLIENT}.png`, url: 'https://discord.com/api/oauth2/authorize?client_id=1065838867485302854&permissions=8&scope=bot' })
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
                    .setColor(`${color}`)
                    .setTitle('Pokédex')
                    .setURL('https://pokedexwi.netlify.app/')
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
                    .setColor(`${color}`)
                    .setTitle('Pokédex')
                    .setURL('https://pokedexwi.netlify.app/')
                    .setThumbnail(`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/${id}.gif`)
                    .addFields(
                        { name: `${estilizaNome(data.name)}`, value: `Número: #${id}\nAltura: ${height.toFixed(1)} m\nPeso: ${weight.toFixed(1)} kg` }
                    )
                    .addFields({ name: 'Estatísticas', value: `Tipo: ${types.map((item)=>{const typesR = ' '+item.type.name; return typesR})}.`, inline: true })
                    .setTimestamp()
                    .setFooter({ text: `${interaction.user.username}`, iconURL: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/25.gif' });
                await interaction.reply({embeds: [embedPokemonAnimated] });
            }
            if(id >= 1 && id <= 649 && shiny == true){
                const embedPokemonAnimatedShiny = new EmbedBuilder()
                    .setColor(`${color}`)
                    .setTitle('Pokédex')
                    .setURL('https://pokedexwi.netlify.app/')
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
                    .setColor(`${color}`)
                    .setTitle('Pokédex')
                    .setURL('https://pokedexwi.netlify.app/')
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