// *** Imports ***

import {getRandomInt} from "./CRTVStatic.js";



// *** Variables ***

var channelmenu = document.getElementById("channelMenu");
var headDisplay = document.getElementById("headDisplay");
var tvbox = document.getElementById("TVBlock");
var backbutton = document.getElementById("back");
var settingsbutton = document.getElementById("settings");
var icon = document.getElementById("favicon");
var topRowURLs = ["https://github.com/Nyxxide/", "https://yt2.nyxxusnovum.tv/", "https://github.com/Nyxxide/BloonsFarm/releases/"]
var gitRowURLs = ["https://github.com/Nyxxide/BloonsFarm", "", ""]
var webRowURLs = ["https://yt2.nyxxusnovum.tv/", "", ""]
var appRowURLs = ["https://github.com/Nyxxide/BloonsFarm/releases/", "", ""]
var topRowButtons = document.getElementsByClassName("topRow");
var gitRowButtons = document.getElementsByClassName("gitRow");
var webRowButtons = document.getElementsByClassName("webRow");
var appRowButtons = document.getElementsByClassName("appRow");
var sortOpts = document.getElementsByClassName("sortOpt");

var headImgs = ["/images/GithubHead.webp", "/images/YT2Head.webp", "/images/BTDFarmHead.webp", "/images/Pharaoh1.webp",
    "/images/Pharaoh2.png"];

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

const gradients = `
  linear-gradient(to bottom,
    rgba(0, 6, 38, 0) 70%,
    rgba(0, 6, 38, 1) 115%
  ),
  radial-gradient(circle farthest-corner at 50% 10%,
    rgba(0, 6, 38, 0) 52%,
    rgba(0, 6, 38, .35) 70%,
    rgba(0, 6, 38, 1) 92%,
    rgba(0, 6, 38, 1) 112%
  ),
`;

const gradientsSmall = `
  linear-gradient(to bottom,
    rgba(0, 6, 38, 0) 70%,
    rgba(0, 6, 38, 1) 115%
  ),
`;

const TVScreen = (function () {
    const SELECTOR_SCREEN_ELEMENT = ".screen";

    let isTurnedOn = false;
    let timeline;

    function buildTimeline() {
        if (!window.gsap) {
            console.error("GSAP not loaded");
            return;
        }

        timeline = window.gsap.timeline({ paused: true });

        window.gsap.set(SELECTOR_SCREEN_ELEMENT, {
            scaleX: 1,
            scaleY: 1,
            opacity: 1,
            backgroundColor: "#000",
            transformOrigin: "50% 50%",
        });

        timeline
            .to(SELECTOR_SCREEN_ELEMENT, {
                duration: 0.05,
                backgroundColor: "#fff",
                ease: "none",
            })
            .to(
                SELECTOR_SCREEN_ELEMENT,
                {
                    duration: 0.2,
                    scaleY: 0.0015,
                    ease: "power2.out",
                },
                "<"
            )
            .to(SELECTOR_SCREEN_ELEMENT, {
                duration: 0.2,
                scaleX: 0,
                ease: "power2.in",
            })
            .to(SELECTOR_SCREEN_ELEMENT, {
                duration: 0.05,
                opacity: 0,
                ease: "none",
            });

        // Start in ON state
        timeline.progress(1).pause();
    }

    function tvOff() {
        if (!timeline || !isTurnedOn) return;
        timeline.play(0);
        isTurnedOn = false;
    }

    function tvOn() {
        if (!timeline || isTurnedOn) return;
        timeline.reverse();
        isTurnedOn = true;
    }

    function toggle() {
        isTurnedOn ? tvOff() : tvOn();
    }

    document.addEventListener("DOMContentLoaded", buildTimeline);

    //public API
    return {
        on: tvOn,
        off: tvOff,
        toggle,
    };
})();



// *** Functions ***

function preload(url) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(url);
        img.onerror = reject;
        img.src = url;
    });
}

function pickRandom(arr, avoid) {
    if (!arr.length) return null;
    if (arr.length === 1) return arr[0];
    let next;
    do {
        next = arr[Math.floor(Math.random() * arr.length)];
    } while (next === avoid);
    return next;
}

let currentUrl = null;
let timerId = null;

async function setHeadBackgroundFade(url) {
    if (!url || url === currentUrl) return;

    try { await preload(url); } catch (e) { console.warn("Image failed:", url, e); return; }

    headDisplay.classList.add("is-fading");

    await new Promise(r => setTimeout(r, 400));
    console.log(window.innerWidth);

    // if(window.innerWidth>600){
    headDisplay.style.backgroundImage = `${gradients} url("${url}")`;
    // }
    // else{
    //     // headDisplay.style.backgroundImage = `${gradientsSmall} url("${url}")`;
    //     headDisplay.style.backgroundImage = `url("${url}")`;
    // }

    currentUrl = url;

    headDisplay.classList.remove("is-fading");
}

let randImgsArray = []
let tmp = [];

for(let i = 0; i < 4; i++) {
    let randint = getRandomInt(0, headImgs.length - 1);
    if(tmp.includes(randint)){
        while(tmp.includes(randint)){
            randint = getRandomInt(0, headImgs.length - 1);
        }
        tmp.push(randint);
        randImgsArray[i] = headImgs[randint];
    }
    else{
        tmp.push(randint);
        randImgsArray[i] = headImgs[randint];
    }
}

function startHeadRotation(intervalMs = 10000) {
    // set initial immediately
    const first = pickRandom(randImgsArray, currentUrl);
    if (first) setHeadBackgroundFade(first);

    // rotate
    timerId = setInterval(() => {
        const next = pickRandom(randImgsArray, currentUrl);
        if (next) setHeadBackgroundFade(next);
    }, intervalMs);
}

async function exitSite() {
    TVScreen.off();
    channelmenu.style.visibility = "hidden";
    await sleep(650);
    window.location.href = "/index.html"
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

function clickButton(){
    for(let i = 0; i < sortOpts.length; i++) {
        if(sortOpts[i].classList.contains("selectedSort")){
            sortOpts[i].classList.remove("selectedSort");
            break;
        }
    }
    this.classList.add("selectedSort");
    console.log(this.innerHTML);
}




// *** Some Setup ***

for(let i = 0; i < topRowURLs.length; i++){
    topRowButtons[i].addEventListener("click", async () => {
        TVScreen.off();
        channelmenu.style.visibility = "hidden";
        await sleep(650);
        TVScreen.on();
        await sleep(440);
        window.location.href = topRowURLs[i];
    });
}

for(let i = 0; i < webRowURLs.length; i++){
    webRowButtons[i].addEventListener("click", async () => {
        TVScreen.off();
        channelmenu.style.visibility = "hidden";
        await sleep(650);
        TVScreen.on();
        await sleep(440);
        window.location.href = webRowURLs[i];
    });
}

for(let i = 0; i < appRowURLs.length; i++){
    appRowButtons[i].addEventListener("click", async () => {
        TVScreen.off();
        channelmenu.style.visibility = "hidden";
        await sleep(650);
        TVScreen.on();
        await sleep(440);
        window.location.href = appRowURLs[i];
    });
}



export {channelmenu, headDisplay, tvbox, backbutton, settingsbutton, icon, topRowURLs, gitRowURLs, webRowURLs, appRowURLs, topRowButtons, gitRowButtons, webRowButtons, appRowButtons, sortOpts, headImgs, alphabet, alph2egy, TVScreen,
        startHeadRotation, exitSite, backAnim, undoBackAnim, clickButton, sleep};