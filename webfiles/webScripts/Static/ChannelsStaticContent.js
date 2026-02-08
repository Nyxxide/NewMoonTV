// *** Imports ***

import ThemeManager from "../Fancy/ThemeHandler.js"
import {ScreenEffect} from "../Fancy/CRTVStatic.js";
import {startFluidBG} from "../Fancy/FluidBG.js";
import {initGitRowClicks, applyGitSortAndRenderFresh} from "./ChannelsGitRepoFunctions.js";
import {resetHeadHistory, rebuildHeadRotationSet, startHeadRotation} from "./ChannelsHeadRotationFunctions.js"
import {installSequenceTrigger, installAudioUnlock} from "../Fancy/ThemeSpecificLogic.js";


// *** Variables ***

let backAnimCtrl;

var icon = document.getElementById("favicon");
var channelAudio = document.getElementById("channelAudio");

var backbutton = document.getElementById("back");
var settingsbutton = document.getElementById("settings");

var banner = document.getElementById("banner");
var titleSection = document.getElementById("titleSection");
var tvblock = document.getElementById("TVBlock");
var NMText = document.getElementById("NMtext");
var NMLogo = document.getElementById("NMlogo");
var TVText = document.getElementById("TVtext");
var headDisplay = document.getElementById("headDisplay");

var channelmenu = document.getElementById("channelMenu");
var fluid = document.getElementById("fluidBg");
var scrollLabels = document.getElementsByClassName("scrollLabel");
var scrollBars = document.getElementsByClassName("scrollBar");
var sortOpts = document.getElementsByClassName("sortOpt");


var topRowURLs = ["https://github.com/Nyxxide/", "https://yt2.nyxxusnovum.tv/", "https://github.com/Nyxxide/BloonsFarm/releases/", "https://mctag.nyxxusnovum.tv/"]
var webRowURLs = ["https://yt2.nyxxusnovum.tv/", "https://mctag.nyxxusnovum.tv/", ""]
var appRowURLs = ["https://github.com/Nyxxide/BloonsFarm/releases/", "", ""]
var topRowButtons = document.getElementsByClassName("topRow");
var webRowButtons = document.getElementsByClassName("webRow");
var appRowButtons = document.getElementsByClassName("appRow");

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

function clickButton(){
    for(let i = 0; i < sortOpts.length; i++) {
        if(sortOpts[i].classList.contains("selectedSort")){
            sortOpts[i].classList.remove("selectedSort");
            break;
        }
    }
    this.classList.add("selectedSort");

    applyGitSortAndRenderFresh()
}

async function exitSite() {
    TVScreen.off();
    channelmenu.style.visibility = "hidden";
    fluid.style.visibility = "hidden"
    await sleep(650);
    window.location.href = "/"
}

async function backAnim(){
    backAnimCtrl?.abort();
    backAnimCtrl = new AbortController();
    const { signal } = backAnimCtrl;

    backbutton.src = ThemeManager.get("backButton.step2");
    await sleep(150);
    if(signal.aborted) return;

    backbutton.src = ThemeManager.get("backButton.step3");
    await sleep(150);
    if(signal.aborted) return;

    backbutton.src = ThemeManager.get("backButton.final");
    backbutton.style.animation = "imgGlitch 2s infinite";
}

function undoBackAnim(){
    backAnimCtrl?.abort();
    backbutton.src = ThemeManager.get("backButton.image");
    backbutton.style.animation = "none";
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function themeSwap() {
    // Favicon
    icon.href = ThemeManager.get("favicon.icon")

    // Audio
    channelAudio.src = ThemeManager.get("channelMusic.music");
    if(ThemeManager.get("channelMusic.playing")==="yes"){
        channelAudio.currentTime = 0;
        channelAudio.play();
        channelAudio.loop = true;
    }
    const theme = ThemeManager.getThemeName();
    console.log(theme);

    // CSS Theme Swap
    document.documentElement.classList.remove("theme-base", "theme-egypt");
    document.documentElement.classList.add(`theme-${theme}`);

    // NMText Change
    NMText.innerText = ThemeManager.get("NMText.textContent");

    // NMLogo Change
    NMLogo.src = ThemeManager.get("NMLogo.image");

    // TVText Change
    TVText.innerText = ThemeManager.get("TVText.textContent");

    // BackButton Change
    backbutton.src = ThemeManager.get("backButton.image");

    // Settings Change
    settingsbutton.src = ThemeManager.get("settingsButton.image");

    // ScrollLabel Change
    for(let i = 0; i < scrollLabels.length; i++){
        scrollLabels[i].textContent = ThemeManager.get(`scrollLabel.s${i+1}`);
    }

    // SortOpts Changes
    for(let i = 0; i < sortOpts.length; i++){
        sortOpts[i].textContent = ThemeManager.get(`sortOpts.o${i+1}`);
    }

    // TopRow Changes
    for(let i = 0; i < topRowButtons.length; i++){
        if(ThemeManager.get(`topRow.i${i+1}`)!==null){
            topRowButtons[i].src = ThemeManager.get(`topRow.i${i+1}`);
        }
    }

    // TopRow Changes
    for(let i = 0; i < webRowButtons.length; i++){
        if(ThemeManager.get(`webRow.i${i+1}`)!==null){
            webRowButtons[i].src = ThemeManager.get(`webRow.i${i+1}`);
        }
    }

    // TopRow Changes
    for(let i = 0; i < appRowButtons.length; i++){
        if(ThemeManager.get(`appRow.i${i+1}`)!==null){
            appRowButtons[i].src = ThemeManager.get(`appRow.i${i+1}`);
        }
    }

}

async function loadPage() {
    await ThemeManager.init();
    TVScreen.on();
    await sleep(440);

    installSequenceTrigger("curseofra", () => {
        ThemeManager.setTheme("egypt")
    })

    const shouldPlay = () =>
        ThemeManager.getThemeName() === "egypt" &&
        ThemeManager.get("channelMusic.playing") === "yes";

    const unlock = installAudioUnlock({
        audioEl: channelAudio,
        shouldPlay,
    })

    function applyThemeAudio() {
        channelAudio.src = ThemeManager.get("channelMusic.music") || "";
        channelAudio.currentTime = 0;

        // If the theme wants music, try now; if blocked it will start on next gesture
        if (shouldPlay()) {
            unlock.rearm();
            unlock.tryPlay();
        } else {
            channelAudio.pause();
            channelAudio.currentTime = 0;
        }
    }

    const crtv = new ScreenEffect("#crtvLayer");
    crtv.add("vignette");
    crtv.add("scanlines");
    crtv.add("vcr");
    crtv.add("snow");
    startFluidBG({
        baseColor: [0.0, 6/255, 38/255],
        fluidColor: [0.0, 247/255, 255/255],
        targetFPS: 30,
    })

    themeSwap();
    applyThemeAudio()
    rebuildHeadRotationSet();
    startHeadRotation(10000);
    ThemeManager.subscribe(() => {
        rebuildHeadRotationSet();
        applyGitSortAndRenderFresh();
        resetHeadHistory();
        startHeadRotation(10000);
        themeSwap();
        applyThemeAudio()
    })


    sortOpts[0].classList.add("selectedSort");
    initGitRowClicks();
    await applyGitSortAndRenderFresh();

    channelmenu.style.visibility = "visible";
}



// *** Some Setup ***

for(let i = 0; i < topRowURLs.length; i++){
    topRowButtons[i].addEventListener("click", async () => {
        TVScreen.off();
        channelmenu.style.visibility = "hidden";
        fluid.style.visibility = "hidden"
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
        fluid.style.visibility = "hidden"
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
        fluid.style.visibility = "hidden"
        await sleep(650);
        TVScreen.on();
        await sleep(440);
        window.location.href = appRowURLs[i];
    });
}



// *** Export ***

export {channelmenu, backbutton, fluid, sortOpts, TVScreen,
    exitSite, backAnim, undoBackAnim, clickButton, sleep, loadPage};