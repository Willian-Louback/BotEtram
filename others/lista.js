const axios = require('axios'); //atualizando para axios invés de fetch (Pesquisar mais sobre)

const pokemonList1 = async () => {
    let pokemon = "";
    for(let i = 1; i <= 50; i++){
        let link = await axios.get(`https://pokeapi.co/api/v2/pokemon/${i}`);
        pokemon += /*"Nome: " + */link.data.name + " "+/* " Id: " +*/ link.data.id + '\n';
    }
    return pokemon;
}
const pokemonList2 = async () => {
    let pokemon = "";
    for(let i = 51; i <= 101; i++){
        let link = await axios.get(`https://pokeapi.co/api/v2/pokemon/${i}`);
        pokemon += /*"Nome: " + */link.data.name + " "+/* " Id: " +*/ link.data.id + '\n';
    }
    return await pokemon;
}
const pokemonList3 = async () => {
    let pokemon = "";
    for(let i = 102; i <= 151; i++){
        let link = await axios.get(`https://pokeapi.co/api/v2/pokemon/${i}`);
        pokemon += /*"Nome: " + */link.data.name + " "+/* " Id: " +*/ link.data.id + '\n';
    }
    return pokemon;
}
module.exports = {
    pokemonList1,
    pokemonList2, 
    pokemonList3
};