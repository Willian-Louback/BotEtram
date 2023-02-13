const pokemonList1 = async () => {
    let pokemon = "";
    for(let i = 1; i <= 50; i++){
        let link = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}`);
        let data = await link.json();
        pokemon += /*"Nome: " + */data.name + " "+/* " Id: " +*/ data.id + '\n';
    }
    return pokemon;
}
const pokemonList2 = async () => {
    let pokemon = "";
    for(let i = 51; i <= 101; i++){
        let link = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}`);
        let data = await link.json();
        pokemon += /*"Nome: " + */data.name + " "+/* " Id: " +*/ data.id + '\n';
    }
    return pokemon;
}
const pokemonList3 = async () => {
    let pokemon = "";
    for(let i = 102; i <= 151; i++){
        let link = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}`);
        let data = await link.json();
        pokemon += /*"Nome: " + */data.name + " "+/* " Id: " +*/ data.id + '\n';
    }
    return pokemon;
}
module.exports = {
    pokemonList1,
    pokemonList2, 
    pokemonList3
};
//module.exports = pokemonList1;

 /* pokemonList().then(pokemonList => {
    console.log(pokemonList); 
  });*/
  