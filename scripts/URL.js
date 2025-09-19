let pokemon = [];
let species = [];
let evoChain = [];
let gender = [];

const BASE_URL = "https://pokeapi.co/api/v2/"

async function getURL(i) {
    let response = await fetch(BASE_URL + "pokemon/" + (i));
    let pkmn = await response.json();

    pokemon[i] =
        {
            name: pkmn.name,
            ability1: pkmn.abilities[0],
            ability2: checkSecondAbility(pkmn),
            ability3: pkmn.abilities[2],
            sprite: pkmn.sprites.front_default,
            type1: pkmn.types[0].type.name,
            type2: checkType2(pkmn),
            hp: pkmn.stats[0].base_stat,
            atk: pkmn.stats[1].base_stat,
            def: pkmn.stats[2].base_stat,
            spAtk: pkmn.stats[3].base_stat,
            spDef: pkmn.stats[4].base_stat,
            spd: pkmn.stats[5].base_stat,
            height: pkmn.height,
            weight: pkmn.weight,
            base_experience: pkmn.base_experience,
        }

    return pkmn;
}

async function getEvoSpecies(i) {
    let response = await fetch(BASE_URL + "pokemon-species/" + (i) + "/")
    let pkmn =  await response.json();

    species[i] = {
        description: pkmn.flavor_text_entries[0].flavor_text,
        capture_rate: pkmn.capture_rate,
        gender_rate: pkmn.gender_rate,
        egg_groups: pkmn.egg_groups,
        hatch_counter: pkmn.hatch_counter
    }
    return pkmn;
}

async function getEvoChain(i) {
    let response = await fetch(BASE_URL + "evolution-chain/" + (i))
    return await response.json();
}

async function getGender(i) {
    let response = await fetch(BASE_URL + "gender/" + (i))
    return await response.json();
}
