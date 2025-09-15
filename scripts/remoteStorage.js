const BASE_URL = "https://pokeapi.co/api/v2/"

async function getURL(i) {
    let response = await fetch(BASE_URL + "pokemon/" + (i));
    return await response.json();
}

async function getEvoSpecies(i) {
    let response = await fetch(BASE_URL + "pokemon-species/" + (i) + "/")
    return await response.json();
}

async function getEvoChain(i) {
    let response = await fetch(BASE_URL + "evolution-chain/" + (i))
    return await response.json();
}

async function getGender(i) {
    let response = await fetch(BASE_URL + "gender/" + (i))
    return await response.json();
}

async function render() {
    showLoadingSpinner();
    await getPokemon(offset, limit);
    hideLoadingSpinner();
}

let offset = 1;
let limit = 24;

async function getPokemon(offset, limit) {
    let pkmnMain = document.getElementById("pkmnMain");
    let loadMore = document.getElementById("loadMore")
    if (loadMore) {
        loadMore.remove()
    }
    await getPokemonForResult(offset, limit, pkmnMain);

    pkmnMain.innerHTML +=
        `<div class="mainView loadMore" id="loadMore" onclick="loadMore(${offset}, ${limit})">
        <p> more... </p>
    </div>
    `
}

async function getPokemonForResult(offset, limit, pkmnMain) {
    for (let i = offset; i <= limit; i++) {
        let responseToJson = await getURL(i);
        let responseToJsonSpecies = await getEvoSpecies(i);

        let description = responseToJsonSpecies.flavor_text_entries[0].flavor_text
        let img = responseToJson.sprites.front_default;
        let name = responseToJson.name;
        let { type1, type2 } = await pkmnTypes(i)
        pkmnMain.innerHTML += loadPkmn(name, type1, type2, img, i, description);
    }
}