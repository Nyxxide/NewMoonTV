//TODO: Add stars in foreground

var width = window.innerWidth;
var pageState = "default";
var keepLooping = true;
var fonts = ["\"Jersey 25\"", "Akaya Kanadaka", "Architects Daughter", "Atomic Age", "Bagel Fat One", "Barrio",
                    "Black Ops One", "Calligraffitti", "Trade Winds", "Finger Paint", "CURSEOFRA", "Creepster", "Cute Font",
                    "Damion", "Devonshire", "Ewert", "Faster One", "Fascinate Inline", "Gajraj One", "Geostar Fill",
                    "Clash", "Honk"]
// var fonts = ["\"Jersey 25\"", "CURSEOFRA"];

var background = document.getElementById("background");
var foreground = document.getElementById("foreground");
var moon = document.getElementById("Moon");
var glitchdiv = document.getElementById("GlitchDiv")
var glitchlayerdiv = document.getElementById("GlitchLayerDiv")
var glitchlayer1 = document.getElementById("GlitchLayer1")
var glitchlayer2 = document.getElementById("GlitchLayer2")
var glitchlayer3 = document.getElementById("GlitchLayer3")

var htmlbody = document.getElementById("HTMLBody");
var nexus = document.getElementById("nexus");
var title = document.getElementById("title");
var banner = document.getElementById("head");
var buttonbody = document.getElementById("grid");
var buttons = document.getElementsByClassName("linkbutton");
var backbutton = document.getElementById("back");
var settingsbutton = document.getElementById("settings");
var icon = document.getElementById("favicon");
var imgleft = document.getElementById("imgleft");
var imgright = document.getElementById("imgright");
var buttonVals = [];
let initbuttons = document.getElementsByClassName("linkbutton");
for(let i = 0; i < initbuttons.length; i++){
    buttonVals.push(initbuttons[i].innerText);
}


for(let i = 0; i < buttons.length; i++){
    buttons[i].classList.add("linkbutton-glitch");
}

var alphabet = "abcdefghijklmnopqrstuvwxyz";
var alph2egy = {
    "a":"𓁟",
    "b":"𓄎",
    "c":"𓃭",
    "d":"𓆞",
    "e":"𓁶",
    "f":"𓅟",
    "g":"𓆧",
    "h":"𓊄",
    "i":"𓇣",
    "j":"𓊮",
    "k":"𓊝",
    "l":"𓂈",
    "m":"𓆈",
    "n":"𓆣",
    "o":"𓆚",
    "p":"𓍳",
    "q":"𓎶",
    "r":"𓌝",
    "s":"𓅓",
    "t":"𓆤",
    "u":"𓁨",
    "v":"𓌛",
    "w":"𓀬",
    "x":"𓂀",
    "y":"𓋹",
    "z":"𓆏"}



function backHover() {
    backbutton.src = "/images/ManSelected.png";
}
function backStopHover() {
    backbutton.src = "/images/Man.png";
}


function moonHoverStart() {
    glitchdiv.classList.add("glitch");
    glitchlayerdiv.classList.add("glitch__layers");
    glitchlayer1.classList.add("glitch__layer");
    glitchlayer2.classList.add("glitch__layer");
    glitchlayer3.classList.add("glitch__layer");
}

function moonHoverEnd() {
    glitchdiv.classList.remove("glitch");
    glitchlayerdiv.classList.remove("glitch__layers");
    glitchlayer1.classList.remove("glitch__layer");
    glitchlayer2.classList.remove("glitch__layer");
    glitchlayer3.classList.remove("glitch__layer");
}

async function changeTheme(){
    if(pageState==="default"){
        nexus.style.transition = "none";
        nexus.style.color = "#11b7ff";
        nexus.innerText = "NYXXUS";
        await sleep (100);
        resetPage();
        nexus.style.fontFamily = "\"Jersey 25\"";
        backbutton.style.opacity = "1";
        settingsbutton.style.opacity = "0";
        title.classList.add("lighting");
        keepLooping = true;
        let index = 0;
        while (keepLooping) {
            if (!keepLooping || pageState !== "default") {
                break;
            }
            nexus.style.color = "#ff27d4";
            let tmp = Math.floor(Math.random() * (fonts.length));
            while (tmp === index) {
                tmp = Math.floor(Math.random() * (fonts.length));
            }
            index = tmp;
            await sleep(1250);
            nexus.style.color = "#11fcff";
            if (fonts[index] === "CURSEOFRA") {
                nexus.innerText = "𓆣𓋹𓂀𓂀𓁨𓅓";
                if (width > 1400) {
                    nexus.style.fontSize = "3vw";
                } else if (width <= 1400 && width >= 600) {
                    nexus.style.fontSize = "42px";
                } else {
                    nexus.style.fontSize = "8vw"
                }
                nexus.style.cursor = "pointer";
                nexus.addEventListener("click", curseofraFunc);
            } else {
                nexus.removeEventListener("click", curseofraFunc);
                nexus.innerText = "NYXXUS"
                nexus.style.cursor = "default";
                nexus.style.fontFamily = fonts[index];
                if (index === 0) {
                    if (width > 1400) {
                        nexus.style.fontSize = "5vw";
                    } else if (width <= 1400 && width >= 600) {
                        nexus.style.fontSize = "70vpx";
                    } else {
                        nexus.style.fontSize = "12vw"
                    }
                } else {
                    if (width > 1400) {
                        nexus.style.fontSize = "4vw";
                    } else if (width <= 1400 && width >= 600) {
                        nexus.style.fontSize = "56px";
                    } else {
                        nexus.style.fontSize = "10vw"
                    }
                }
            }
            nexus.classList.add("nexus-glitch");
            await sleep(500);
            nexus.classList.remove("nexus-glitch");
            await sleep(3000);
        }
    }
    else if(pageState==="curseofra"){
        curseofraFunc();
    }
}


async function backAnim(){
    backbutton.src = "/images/BackStep2.png";
    await sleep(150);
    backbutton.src = "/images/BackStep3.png";
    await sleep(150);
    backbutton.src = "/images/BackFinal.png";
    backbutton.style.animation = "imgGlitch 2s infinite";
}

function undoBackAnim(){
    backbutton.src = "/images/BackStep1.png";
    backbutton.style.animation = "none";
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function resetPage() {

    pageState = "default";

    let curseofra = document.getElementById("curseofra");

    htmlbody.style.backgroundImage = "none";

    banner.style.backgroundImage = "none";
    banner.style.borderBottom = "2px solid #323c69";

    nexus.style.border = "none";
    nexus.style.borderRadius = "0px"
    nexus.removeEventListener("click", curseofraFunc);
    nexus.style.backgroundImage = "none";
    nexus.style.transition = "opacity 1.25s 0.6s ease-in, color 1.25s 375ms linear";
    nexus.style.fontFamily = "\"Jersey 25\""
    if(width > 1400) {
        nexus.style.fontSize = "5vw";
    }
    else if(width <= 1400 && width >= 600){
        nexus.style.fontSize = "70px";
    }
    else{
        nexus.style.fontSize = "12vw";
    }

    title.innerText = "Welcome to the";
    title.style.color = "#11b7ff";
    title.style.border = "none";
    title.style.borderRadius = "0px";
    if(width > 1400) {
        title.style.fontSize = "3vw";
    }
    else if(width <= 1400 && width >= 600){
        title.style.fontSize = "42px";
    }
    else{
        title.style.fontSize = "8vw";
    }
    title.classList.remove("lighting");
    title.style.backgroundImage = "none";

    imgright.src = "";
    imgright.style.width = "0px";
    imgright.style.marginTop = "0px";

    imgleft.src = "";
    imgleft.style.width = "0px"
    imgleft.style.marginTop = "0px";

    buttonbody.style.marginTop = "4.5em";
    buttonbody.style.backgroundImage = "none";
    buttonbody.style.border = "none";

    for(let i = 0; i < buttons.length; i++){
        buttons[i].style.backgroundImage = "none";
        buttons[i].style.border = "3px solid #11b7ff";
        buttons[i].style.color = "#11b7ff";
        buttons[i].classList.add("linkbutton-glitch")
        buttons[i].classList.remove("hoverEgypt");
        buttons[i].innerText = buttonVals[i];
    }

    backbutton.style.opacity = "0";
    backbutton.src = "/images/BackStep1.png";
    backbutton.style.border = "none";
    backbutton.style.borderRadius = "0px";
    backbutton.removeEventListener("mouseenter", backHover);
    backbutton.removeEventListener("mouseleave", backStopHover);
    backbutton.addEventListener("mouseenter", backAnim);
    backbutton.addEventListener("mouseleave", undoBackAnim);

    settingsbutton.style.opacity = "0";
    settingsbutton.src = "/images/wall.png";
    settingsbutton.style.border = "none";
    settingsbutton.style.borderRadius = "0px";

    keepLooping = false;

    icon.href = "/images/Nyxxus.ico";



    if(curseofra){
        curseofra.pause();
        curseofra.currentTime = 0;
    }

}

function curseofraFunc(event) {
    keepLooping = false;

    pageState = "curseofra";

    let curseofra = document.getElementById("curseofra");

    if(!curseofra){
        let music = document.createElement("audio");
        music.id = "curseofra";
        music.style.display = "none";
        let song = Math.floor(Math.random() * (2));
        if(song===1){
            music.src = "/audio/PharaohCurse.mp3";
        }
        else{
            music.src = "/audio/MarioLandUnderground.mp3";
        }
        document.body.appendChild(music);
        music.loop = true;
        music.play();
    }
    else{
        curseofra.loop = true;
        curseofra.play();
    }

    htmlbody.style.backgroundImage = "url(\'/images/markings.png\')";
    htmlbody.style.backgroundPosition = "0 0";

    banner.style.backgroundImage = "url(\'/images/slope.png\')";
    banner.style.backgroundSize = "3vw 3vw";
    banner.style.borderBottom = "solid 4px black";

    nexus.innerText = "𓆣𓋹𓂀𓂀𓁨𓅓";
    nexus.style.fontSize = "5vw";
    if(width > 1400) {
        nexus.style.fontSize = "3vw";
    }
    else if(width <= 1400 && width >= 600) {
        nexus.style.fontSize = "42px";
    }
    else{
        nexus.style.fontSize = "9vw";
    }
    nexus.style.transition = "color 0s";
    nexus.style.color = "black";
    nexus.style.fontWeight = "bold";
    nexus.style.cursor = "default";
    if(event){
        event.target.removeEventListener("click", curseofraFunc);
    }
    nexus.style.backgroundImage = "url(\'/images/sand.png\')";
    nexus.style.border = "black 2px solid";
    nexus.style.borderRadius = "20px";

    title.innerText = "𓀬𓁶𓂈𓃭𓆚𓆈𓁶 𓆤𓆚 𓆤𓊄𓁶";
    if(width > 1400) {
        title.style.fontSize = "2vw";
    }
    else if(width <= 1400 && width >= 600){
        title.style.fontSize = "28px";
    }
    else{
        title.style.fontSize = "5vw";
    }
    title.style.color = "black";
    title.classList.remove("lighting");
    title.style.backgroundImage = "url(\'/images/sand.png\')";
    title.style.border = "black 2px solid";
    title.style.borderRadius = "20px";

    imgleft.src = "/images/Pharaoh1.webp";
    if(width > 1400){
        imgleft.style.width = "25vw";
    }
    else if(width <= 1400 && width >= 600){
        imgleft.style.width = "350px";
    }
    else{
        imgleft.style.width = "40vw";
    }
    imgleft.style.marginTop = "2vw";

    imgright.src = "/images/Pharaoh2.png";
    if(width > 1400){
        imgright.style.width = "20vw";
    }
    else if(width <= 1400 && width >= 600){
        imgright.style.width = "280px";
    }
    else{
        imgright.style.width = "35vw";
    }
    imgright.style.marginTop = "2vw";

    buttonbody.style.marginTop = "0";
    buttonbody.style.backgroundImage = "url(\'/images/wall.png\')";
    buttonbody.style.border = "solid 4px black";
    if(width <= 600){
        buttonbody.style.marginTop = "4.5em";
    }

    icon.href = "/images/Eye.ico";

    backbutton.src = "/images/Man.png"
    backbutton.style.border = "solid 4px black";
    backbutton.style.borderRadius = "10px";
    backbutton.removeEventListener("mouseenter", backAnim);
    backbutton.removeEventListener("mouseleave", undoBackAnim);
    backbutton.addEventListener("mouseenter", backHover);
    backbutton.addEventListener("mouseleave", backStopHover);

    settingsbutton.src = "/images/slope.png"
    settingsbutton.style.border = "solid 4px black";
    settingsbutton.style.borderRadius = "10px";

    for(let i = 0; i < buttons.length; i++){
        buttons[i].style.backgroundImage = "url(\'/images/sand.png\')";
        buttons[i].style.backgroundSize = "1.4vw 1.4vw";
        buttons[i].style.border = "solid 4px black";
        buttons[i].style.color = "black";
        buttons[i].classList.remove("linkbutton-glitch")
        buttons[i].classList.add("hoverEgypt");
        let current = buttons[i].innerText.toLowerCase().substring(0,5);
        for(let char of alphabet){
            current = current.replaceAll(char, alph2egy[char]);
        }
        buttons[i].innerText = current;
    }

}

window.addEventListener("resize", () => {
    width = innerWidth;
    if(width > 1400){
        if(nexus.innerText.toLowerCase() !== "nyxxus")
        {
            nexus.style.fontSize = "3vw";
        }
        else if(nexus.fontFamily !== "\"Jersey 25\""){
            nexus.style.fontSize = "4vw";
        }
        else{
            nexus.style.fontSize = "5vw";
        }
        if(title.innerText.toLowerCase() !== "welcome to the"){
            title.style.fontSize = "2vw";
        }
        else{
            title.style.fontSize = "3vw"
        }
        buttonbody.style.marginTop = "4.5em";
        imgleft.style.width = "25vw";
        imgright.style.width = "20vw";
    }
    else if(width <= 1400 && width >= 600){
        if(nexus.innerText.toLowerCase() !== "nyxxus")
        {
            nexus.style.fontSize = "42px";
        }
        else if(nexus.fontFamily !== "\"Jersey 25\""){
            nexus.style.fontSize = "56px";
        }
        else{
            nexus.style.fontSize = "70px";
        }
        if(title.innerText.toLowerCase() !== "welcome to the"){
            title.style.fontSize = "28px";
        }
        else{
            title.style.fontSize = "42px";
        }
        buttonbody.style.marginTop = "4.5em";
        imgleft.style.width = "280px";
        imgright.style.width = "210px";
    }
    else{
        if(nexus.innerText.toLowerCase() !== "nyxxus")
        {
            nexus.style.fontSize = "8vw";
        }
        else if(nexus.fontFamily !== "\"Jersey 25\""){
            nexus.style.fontSize = "10vw";
        }
        else{
            nexus.style.fontSize = "12vw";
        }
        if(title.innerText.toLowerCase() !== "welcome to the"){
            title.style.fontSize = "5vw";
        }
        else{
            title.style.fontSize = "8vw";
        }
        imgleft.style.width = "40vw";
        imgright.style.width = "35vw";
    }
});
glitchdiv.addEventListener("click", async (event) => {
    // resetPage();
    nexus.style.color = "#11b7ff";
    nexus.innerText = "NEXUS";
    keepLooping = true;
    if(width > 1400){
        nexus.style.fontSize = "5vw";
    }
    else if(width <= 1400 && width >= 600){
        nexus.style.fontSize = "70px";
    }
    else{
        nexus.style.fontSize = "12vw"
    }
    moon.style.animation = "none";
    if(width > 1750){
        moon.style.transform = "scale(25,25) translateX(125px) translateY(-50px)";
    }
    else if(width <= 1750 && width >= 600){
        moon.style.transform = "scale(25,25) translateX(90px) translateY(-35px)";
    }
    else{
        moon.style.transform = "scale(25,25) translateX(75px) translateY(-25px)";
    }
    glitchdiv.classList.remove("glitch");
    glitchlayerdiv.classList.remove("glitch__layers");
    glitchlayer1.classList.remove("glitch__layer");
    glitchlayer2.classList.remove("glitch__layer");
    glitchlayer3.classList.remove("glitch__layer");
    glitchdiv.removeEventListener("mouseenter", moonHoverStart);
    glitchdiv.removeEventListener("mouseleave", moonHoverEnd);
    await sleep(2000);
    background.style.opacity= "0";
    foreground.style.animation= "fadein 2s";
    foreground.style.display = "block";
    title.style.opacity = "1";
    await sleep(600);
    nexus.style.opacity = "1";
    await sleep(2000);
    background.style.display = "none";
    foreground.style.animation = "";
    nexus.classList.add("nexus-glitch");
    nexus.innerText = "NYXXUS";
    backbutton.style.display = "block";
    settingsbutton.style.display = "block";
    await sleep(500);
    backbutton.style.opacity = "1";
    backbutton.addEventListener("mouseenter", backAnim);
    backbutton.addEventListener("mouseleave", undoBackAnim);
    settingsbutton.style.opacity = "0";
    title.classList.add("lighting");
    nexus.classList.remove("nexus-glitch");
    let index = 0;
    await sleep(3000);
    while(keepLooping){
        if(!keepLooping || pageState !== "default"){
            break;
        }
        nexus.style.color= "#ff27d4";
        let tmp = Math.floor(Math.random() * (fonts.length));
        while(tmp===index){
            tmp = Math.floor(Math.random() * (fonts.length));
        }
        index = tmp;
        await sleep(1250);
        nexus.style.color = "#11fcff";
        if(fonts[index]==="CURSEOFRA"){
            nexus.innerText = "𓆣𓋹𓂀𓂀𓁨𓅓";
            if(width > 1400){
                nexus.style.fontSize = "3vw";
            }
            else if(width <= 1400 && width >= 600){
                nexus.style.fontSize = "42px";
            }
            else{
                nexus.style.fontSize = "8vw"
            }
            nexus.style.cursor = "pointer";
            nexus.addEventListener("click", curseofraFunc);
        }
        else{
            nexus.removeEventListener("click", curseofraFunc);
            nexus.innerText = "NYXXUS"
            nexus.style.cursor = "default";
            nexus.style.fontFamily = fonts[index];
            if(index===0){
                if(width > 1400){
                    nexus.style.fontSize = "5vw";
                }
                else if(width <= 1400 && width >= 600){
                    nexus.style.fontSize = "70vpx";
                }
                else{
                    nexus.style.fontSize = "12vw"
                }
            }
            else {
                if(width > 1400){
                    nexus.style.fontSize = "4vw";
                }
                else if(width <= 1400 && width >= 600){
                    nexus.style.fontSize = "56px";
                }
                else{
                    nexus.style.fontSize = "10vw"
                }
            }
        }
        nexus.classList.add("nexus-glitch");
        await sleep(500);
        nexus.classList.remove("nexus-glitch");
        await sleep(3000);
    }
});

backbutton.addEventListener("click", async () => {
    background.style.display = "block";
    background.style.opacity = "1";
    foreground.style.animation = "fadein 1s reverse";
    // foreground.style.webkitAnimation = "fadein 1s reverse";
    await sleep(1000);
    foreground.style.display = "none";
    await sleep(250);
    moon.style.transform = "scale(1,1) translateX(0px) translateY(0px)";
    resetPage();
    await sleep(3000);
    moon.style.animation = "imgGlitch 5.0s infinite, pulse2 5.0s infinite";
    glitchdiv.addEventListener("mouseenter", moonHoverStart);
    glitchdiv.addEventListener("mouseleave", moonHoverEnd);
})

settingsbutton.addEventListener("click", () => {
    if(pageState==="default"){
        pageState = "curseofra";
    }
    else if(pageState==="curseofra"){
        pageState = "default";
    }
    changeTheme();
})

glitchdiv.addEventListener("mouseenter", moonHoverStart);

glitchdiv.addEventListener("mouseleave", moonHoverEnd);