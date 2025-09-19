async function render() {
    showLoadingSpinner();
    await getPokemon(offset, limit);
    hideLoadingSpinner();
}

let offset = 1;
let limit = 6;

async function getPokemon(offset, limit) {
    let loadMore = document.getElementById("loadMore");
    if (loadMore) {
        loadMore.remove();
    }
    await getPokemonForResult(offset, limit);

    pkmnMain.innerHTML += getLoadMore(offset, limit);
}

async function getPokemonForResult(offset, limit) {
    let pkmnMain = document.getElementById("pkmnMain");
    for (let i = offset; i <= limit; i++) {
        await getURL(i);
        await getEvoSpecies(i);
        let { name, type1, type2, img, description } = pkmnDetails(i);
        pkmnMain.innerHTML += loadPkmn(name, type1, type2, img, i, description)
    }
}

function pkmnDetails(i) {
    let name = pokemon[i].name;
    let type1 = pokemon[i].type1;
    let type2 = pokemon[i].type2;
    let img = pokemon[i].sprite;
    let description = species[i].description;
    return { name, type1, type2, img, description };
}

function capitalize(capitalizeWord) {
    let capitalize = "";
    if (capitalizeWord.length > 0) {
        capitalize = String(capitalizeWord[0]).toUpperCase() + String(capitalizeWord).slice(1);
    } else
        capitalize = "";
    return capitalize;
}


function showPkmn(name, type1, type2, img, i, description) {
    let overlay = document.getElementById("overlay");
    overlay.innerHTML = "";
    toggleOverlay();
    blockScroll();
    overlay.innerHTML += getDialog(name, type1, type2, img, i, description);
    showInfo(i);
    catchBreed(i);
}

function toggleOverlay() {
    let overlayRef = document.getElementById("overlay");
    overlayRef.classList.toggle("d_none");
    disableBlockScroll();
}

function eventBubbling(event) {
    event.stopPropagation();
}

function showType2(type2) { // noch benötigt?
    if (type2 != "") {
        return `<p class="${type2}">${type2}</p>`
    } else {
        return "";
    }
}

async function catchBreed(i) {
    let pkmnDataContent = document.getElementById("pkmnDataContent");
    pkmnDataContent.innerHTML = getCatchBreedInfo(i);
}

function checkGender(responseToJson) {
    if (responseToJson === -1) {
        return "Genderless";
    }
    let female = (responseToJson / 8) * 100;
    let male = (100 - female);
    return `${female}% ♀<br> ${male}% ♂`
}

function checkEggGroup2(responseToJson) {
    if (responseToJson.egg_groups[1] !== undefined) {
        return `<br> ${responseToJson.egg_groups[1].name}`;
    } else {
        return "";
    }
}

async function showBasestats(i) {
    let pkmnDataContent = document.getElementById("pkmnDataContent");
    pkmnDataContent.innerHTML = getBaseStats(i);
}

function calcTotalStat(i) {
    let total = pokemon[i].hp + pokemon[i].atk + pokemon[i].def + pokemon[i].spAtk + pokemon[i].spDef + pokemon[i].spd;
    return total;
}

async function showEvolution(i) {
    let responseToJson = await getEvoSpecies(i);
    let evoCheck = await checkEvo(responseToJson, i)
    let pkmnDataContent = document.getElementById("pkmnDataContent");
    pkmnDataContent.innerHTML = evoCheck;
}

async function checkEvo(responseToJson) {
    let evoURL = responseToJson.evolution_chain.url
    let response = await fetch(evoURL);
    let evoData = await response.json();

    let evo1 = capitalize(evoData.chain.species.name);
    let response1 = await getURL(evo1)
    let img1 = response1.sprites.front_default

    let { evo2, img2 } = await getEvo2Data(evoData);
    let { evo3, img3 } = await getEvo3Data(evoData);

    return getEvo(evo1, img1, evo2, img2, evo3, img3);
}

async function getEvo2Data(evoData) {
    let evo2 = "";
    let img2 = "";
    if (evoData.chain.evolves_to.length > 0) {
        evo2 = capitalize(evoData.chain.evolves_to[0].species.name);
        let response2 = await getURL(evo2)
        img2 = response2.sprites.front_default;
    }
    return { evo2, img2 };
}

async function getEvo3Data(evoData) {
    let evo3 = "";
    let img3 = "";
    if (evoData.chain.evolves_to.length > 0 && evoData.chain.evolves_to[0].evolves_to.length > 0) {
        evo3 = capitalize(evoData.chain.evolves_to[0].evolves_to[0].species.name);
        let response3 = await getURL(evo3)
        img3 = response3.sprites.front_default;
    }
    return { evo3, img3 };
}

function checkEvo2(evo2, img2) {
    if (evo2 === "") {
        return "";
    } else {
        return checkEvo2Tempalte(evo2, img2);
    }
}

function checkEvo3(evo3, img3) {
    if (evo3 === "") {
        return "";
    } else {
        return checkEvo3Tempalte(evo3, img3);
    }
}

function loadType2(type2) {
    if (type2 != "") {
        return loadType2Template(type2);
    }
    return "";
}

async function showInfo(i) {
    let showInfo = document.getElementById("showInfo");
    showInfo.innerHTML = "";
    showInfo.innerHTML = getInfo(i);
}

async function loadMore(offset, limit) {
    showLoadingSpinner();
    offset = limit + 1;
    limit = limit + 20;
    await getPokemon(offset, limit);
    hideLoadingSpinner();
}

function nextPkmn(i) {
    i++;
    if (i > limit) {
        return;
    }
    showOtherPkmn(i);
}

function previousPkmn(i) {
    i--;
    if (i < 1) {
        return;
    }
    showOtherPkmn(i);
}

async function showOtherPkmn(i) {
    let overlay = document.getElementById("overlay");
    let { name, type1, type2, img, description } = pkmnDetails(i);
    overlay.innerHTML = getDialog(name, type1, type2, img, i, description);
    showInfo(i);
    catchBreed(i);
}

// async function getOtherPkmnOverlay(name, type1, type2, img, i, description) {
//     let overlay = document.getElementById("overlay");
//     overlay.innerHTML = getDialog(name, type1, type2, img, i, description);
//     showInfo(i);
//     catchBreed(i);
// }


function mySearchFunction() {
    let input = document.getElementById("searchInput");
    let filter = input.value.toUpperCase();
    let divs = document.getElementsByClassName("mainView");
    let loadMore = document.querySelector(".loadMore");

    if (filter.length >= 3) {
        getSearchResult(divs, filter);
    } else { }

    if (filter.length > 0) {
        loadMore.style.display = "none";
    } else {
        loadMore.style.display = "";
    }
}

function getSearchResult(divs, filter) {
    for (i = 0; i < divs.length; i++) {

        if (divs[i].classList.contains("loadMore")) {
            continue;
        }

        let a = divs[i].getElementsByTagName("a")[0];
        let txtValue = a.textContent || a.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            divs[i].style.display = "";
        } else {
            divs[i].style.display = "none";
        }
    }
}

function checkType2(pkmn) {
    if (pkmn.types[1] !== undefined) {
        type2 = pkmn.types[1].type.name;
    } else {
        type2 = "";
    }
    return type2;
}

function checkSecondAbility(pkmn) {
    if (pkmn.abilities[1] !== undefined) {
        return pkmn.abilities[1].ability.name;
    } else {
        return "";
    }
}

function showLoadingSpinner() {
    document.getElementById("loaderContent").style.display = "block"
    document.body.classList.add("noscroll");
}

function hideLoadingSpinner() {
    document.getElementById("loaderContent").style.display = "none"
    document.body.classList.remove("noscroll");
}

function blockScroll() {
    document.body.style.overflow = "hidden";
}

function disableBlockScroll() {
    document.body.style.overflow = "";
}