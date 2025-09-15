function capitalize(s) {
    let cap = ""
    if (s.length > 0) {
        cap = String(s[0]).toUpperCase() + String(s).slice(1)
    } else
        cap = "";
    return cap;
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

function showType2(type2) {
    if (type2 != "") {
        return type2Exist = `<p class="${type2}">${type2}</p>`
    } else {
        return "";
    }
}

function checkSecondAbility(responseToJson) {
    if (responseToJson.abilities[1] !== undefined) {
        return responseToJson.abilities[1].ability.name;
    } else {
        return "";
    }
}

async function catchBreed(i) {
    let responseToJson = await getEvoSpecies(i);
    let pkmnDataContent = document.getElementById("pkmnDataContent");
    pkmnDataContent.innerHTML = getCatchBreedInfo(responseToJson);
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
    let responseToJson = await getURL(i);

    let pkmnDataContent = document.getElementById("pkmnDataContent");
    pkmnDataContent.innerHTML = getBaseStats(responseToJson);
}

function calcTotalStat(responseToJson) {
    let total = 0;
    for (let i = 0; i < 6; i++) {
        total += responseToJson.stats[i].base_stat;
    }
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
        return `
        <img class="arrowEvo" src="assets/img/arrow_evo.png">
        <div class="evoChain">
            <img src="${img2}">
            <p>${evo2}</p>
        </div>
        `
    }
}

function checkEvo3(evo3, img3) {
    if (evo3 === "") {
        return "";
    } else {
        return `
        <img class="arrowEvo" src="assets/img/arrow_evo.png">
        <div class="evoChain">
            <img src="${img3}">
            <p>${evo3}</p>
        </div>
        `
    }
}

function loadType2(type2) {
    if (type2 != "") {
        return type2Exist = `<img class="typeIcon" src="./assets/img/types/${type2}.svg" alt="${type2}">`
    }
    return "";
}

async function showInfo(i) {
    let showInfo = document.getElementById("showInfo");
    let responseToJson = await getURL(i);

    showInfo.innerHTML = "";
    showInfo.innerHTML = getInfo(responseToJson);
}

async function loadMore(offset, limit) {
    showLoadingSpinner();
    offset = limit + 1;
    limit = limit + 24;
    await getPokemon(offset, limit);
    hideLoadingSpinner();
}

function nextPkmn(i) {
    i++;
    if (i > limit) {
        i = 0;
    }
    showOtherPkmn(i);
}

function previousPkmn(i) {
    i--;
    if (i < 0) {
        i = limit - 1;
    }
    showOtherPkmn(i);
}

async function showOtherPkmn(i) {
    let responseToJson = await getURL(i);
    let responseToJsonSpecies = await getEvoSpecies(i);

    let description = responseToJsonSpecies.flavor_text_entries[0].flavor_text
    let img = responseToJson.sprites.front_default;
    let name = responseToJson.name;
    let { type1, type2 } = await pkmnTypes(i)
    getOtherPkmnOverlay(name, type1, type2, img, i, description)
}

async function getOtherPkmnOverlay(name, type1, type2, img, i, description) {
    let overlay = document.getElementById("overlay");
    overlay.innerHTML = getDialog(name, type1, type2, img, i, description);
    showInfo(i);
    catchBreed(i);
}

async function pkmnTypes(i) {
    let responseToJson = await getURL(i);
    let type1 = "";
    let type2 = "";

    type1 = responseToJson.types[0].type.name;
    if (responseToJson.types[1] !== undefined) {
        type2 = responseToJson.types[1].type.name;
    } else {
        type2 = "";
    }
    return { type1, type2 };
}

function mySearchFunction() {
    let input, filter, divs, a, i, txtValue
    input = document.getElementById("searchInput");
    filter = input.value.toUpperCase();
    divs = document.getElementsByClassName("mainView");
    let loadMore = document.querySelector(".loadMore")

    getSearchResult(divs, filter, loadMore)

    if (filter.length > 0) {
        loadMore.style.display = "none";
    } else {
        loadMore.style.display = "";
    }
}

function getSearchResult(divs, filter, loadMore) {
    for (i = 0; i < divs.length; i++) {

        if (divs[i].classList.contains("loadMore")) {
            continue;
        }

        a = divs[i].getElementsByTagName("a")[0];
        txtValue = a.textContent || a.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            divs[i].style.display = "";
        } else {
            divs[i].style.display = "none";
        }
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