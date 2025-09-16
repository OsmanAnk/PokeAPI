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
