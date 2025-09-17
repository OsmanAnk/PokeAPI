function loadPkmn(name, type1, type2, img, i, description) {
    return `   <div class="mainView">
                    <div class="pkmnTitle">
                        <p class="pkmnNumber">#${i}</p>
                        <a href="#" class="pkmnName">${capitalize(name)}</a>
                    </div>
                    <img class="${type1}" onclick="showPkmn('${name}', '${type1}', '${type2}', '${img}', '${i}', \`${description}\`)" src="${img}" alt="${name}">
                    <div class="type">
                        <img class="typeIcon" src="./assets/img/types/${type1}.svg" alt="${type1}">
                        ${loadType2(type2)}
                    </div>
                </div>
            `
}

function getDialog(name, type1, type2, img, i, description) {
    return `   <div class="dialog" onclick="eventBubbling(event)">
                    <div class="pkmnTitleDialog">
                        <p class="pkmnNameDialog">${name}</p>
                        <p class="pkmnNumberDialog">#${i}</p>
                        <p class="closeBtn d_none" onclick="toggleOverlay()">X</p>
                    </div>
                    <div class="mainDialog">
                            <div class="additionalInfo">
                                <div class="dialogImgWrapper ${type1}">
                                    <img class="dialogImg" src="${img}" alt="${name}">
                                </div>
                                    <div class="descriptionTextWrapper">
                                    <p class="descriptionText">${description}</p>
                                    <div class="typeDialog">
                                        <p class="${type1}">${type1}</p>
                                        ${showType2(type2)}
                                    </div>
                                </div>
                            </div>
                            <div class="pkmnDataWrapper">
                                <div class="pkmnData">
                                <div class="infoButtons">
                                    <button class="btnDialog" onclick="catchBreed(${i})">Catching<br>& Breeding</button>
                                    <button class="btnDialog" onclick="showBasestats(${i})">Base stats</button>
                                    <button class="btnDialog" onclick="showEvolution(${i})">Evolution</button>
                                </div>
                                <div id="pkmnDataContent" class="pkmnDataContent">
                                </div>
                            </div>
                                <div class="showInfo" id="showInfo"></div>
                            </div>
                    </div>
                    <div class="arrowButtons">
                        <img class="arrowBtn" src="assets/img/arrow.png" alt="" onclick="previousPkmn(${i})">
                        <img class="arrowBtn rotate" src="assets/img/arrow.png" alt="" onclick="nextPkmn(${i})">
                    </div>
                </div>
            `
}

function getBaseStats(responseToJson) {
    return `
        <div class="baseStats">
            <div>
                <p>HP: </p>
                <p>ATK: </p>
                <p>DEF: </p>
                <p>SPA: </p>
                <p>SPD: </p>
                <p>SPE: </p>
                <p>Total: </p>
            </div>
            <div>
                <p>${responseToJson.stats[0].base_stat}</p>
                <p>${responseToJson.stats[1].base_stat}</p>
                <p>${responseToJson.stats[2].base_stat}</p>
                <p>${responseToJson.stats[3].base_stat}</p>
                <p>${responseToJson.stats[4].base_stat}</p>
                <p>${responseToJson.stats[5].base_stat}</p>
                <p>${calcTotalStat(responseToJson)}</p>
            </div>
            <div class="baseStatBar"> 
                <div class="statRow">
                    <div class="statGeneral" style="width: ${responseToJson.stats[0].base_stat / 255 * 100}%"></div>
                </div>
                <div class="statRow">
                    <div class="statGeneral" style="width: ${responseToJson.stats[1].base_stat / 190 * 100}%"></div>
                </div>
                <div class="statRow">
                    <div class="statGeneral" style="width: ${responseToJson.stats[2].base_stat / 230 * 100}%"></div>
                </div>
                <div class="statRow">
                    <div class="statGeneral" style="width: ${responseToJson.stats[3].base_stat / 194 * 100}%"></div>
                </div>
                <div class="statRow">
                    <div class="statGeneral" style="width: ${responseToJson.stats[4].base_stat / 230 * 100}%"></div>
                </div>
                <div class="statRow">
                    <div class="statGeneral" style="width: ${responseToJson.stats[5].base_stat / 200 * 100}%"></div>
                </div>
        </div>
        `
}

function getCatchBreedInfo(responseToJson) {
    return `
        <div class="catchBreed">
            <div class="catchBreedContainer">
                <p class="catchBreedLabel">Catch Rate: </p>
                <p class="catchBreedValue">${responseToJson.capture_rate}</p>
            </div>
            <div class="catchBreedContainer">
                <p class="catchBreedLabel">Gender Ratio: </p>
                <p class="catchBreedValue">${checkGender(responseToJson.gender_rate)}</p>
            </div>
            <div class="catchBreedContainer">
                <p class="catchBreedLabel">Egg Groups: </p>
                <p class="catchBreedValue cap">${responseToJson.egg_groups[0].name} ${checkEggGroup2(responseToJson)}</p>
            </div>
            <div class="catchBreedContainer">
                <p class="catchBreedLabel">Hatch Counter: </p>
                <p class="catchBreedValue">${responseToJson.hatch_counter}</p>
            </div>
        </div>
        `
}

function getInfo(responseToJson) {
    return `   <div class="infoList">
                <div>
                    <p>Height</p>
                    <p class="black">${responseToJson.height / 10} m</p>
                </div>
                <div>
                    <p>Weight</p>
                    <p class="black">${responseToJson.weight / 10} kg</p>
                </div>
                <div>
                    <p>Base Experience</p>
                    <p class="black">${responseToJson.base_experience}</p>
                </div>
                <div>
                    <p>Abilities</p>
                    <div>
                    <p class="black">${capitalize(responseToJson.abilities[0].ability.name)}</p>
                    <p class="black">${capitalize(checkSecondAbility(responseToJson))}</p>
                    </div>
                </div>
            </div>
        `
}

function getEvo(evo1, img1, evo2, img2, evo3, img3) {
    return `
        <div class="evoContent">
            <div class="evoChain">
                <img src="${img1}">
                <p>${evo1}</p>
            </div>
            ${checkEvo2(evo2, img2)}
            ${checkEvo2(evo3, img3)}
        </div>
        `
}

function getLoadMore(offset, limit) {
    return `<div class="mainView loadMore" id="loadMore" onclick="loadMore(${offset}, ${limit})">
        <p> more... </p>
    </div>
    `
}

function checkEvo2Tempalte(evo2, img2) {
    return `
        <img class="arrowEvo" src="assets/img/arrow_evo.png">
        <div class="evoChain">
            <img src="${img2}">
            <p>${evo2}</p>
        </div>
        `
}

function checkEvo3Tempalte(evo3, img3) {
    return `
        <img class="arrowEvo" src="assets/img/arrow_evo.png">
        <div class="evoChain">
            <img src="${img3}">
            <p>${evo3}</p>
        </div>
        `
}

function loadType2Template(type2) {
    return `<img class="typeIcon" src="./assets/img/types/${type2}.svg" alt="${type2}">`
}