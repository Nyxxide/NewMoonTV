// *** Imports ***

import {getRandomInt} from "../Fancy/CRTVStatic.js";



// *** Variables ***

let randImgsArray = []
let randImgTmp = [];
let gitItemsCache = [];
let gitCacheStamp = null;
let currentUrl = null;
let timerId = null;


var channelmenu = document.getElementById("channelMenu");
var headDisplay = document.getElementById("headDisplay");
var tvbox = document.getElementById("TVBlock");
var backbutton = document.getElementById("back");
var settingsbutton = document.getElementById("settings");
var icon = document.getElementById("favicon");
var fluid = document.getElementById("fluidBg");
var topRowURLs = ["https://github.com/Nyxxide/", "https://yt2.nyxxusnovum.tv/", "https://github.com/Nyxxide/BloonsFarm/releases/", "https://mctag.nyxxusnovum.tv/"]
var gitRowURLs = ["https://github.com/Nyxxide/BloonsFarm", "https://github.com/Nyxxide/YTConvo", "https://github.com/Nyxxide/MCDataTagger", "https://github.com/Nyxxide/NewMoonTV"]
var webRowURLs = ["https://yt2.nyxxusnovum.tv/", "https://mctag.nyxxusnovum.tv/", ""]
var appRowURLs = ["https://github.com/Nyxxide/BloonsFarm/releases/", "", ""]
var topRowButtons = document.getElementsByClassName("topRow");
var gitRowButtons = document.getElementsByClassName("gitRow");
var webRowButtons = document.getElementsByClassName("webRow");
var appRowButtons = document.getElementsByClassName("appRow");
var sortOpts = document.getElementsByClassName("sortOpt");


var headImgs = ["/images/HeadDisplay/Base/GithubHead.webp", "/images/HeadDisplay/Base/YT2Head.webp", "/images/HeadDisplay/Base/BTDFarmHead.webp", "/images/HeadDisplay/Base/MCTagHead.webp"];

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


const GIT_JSON_URL = "/webJsonData/GIT_ITEMS.json";

const TRANSPARENT_PIXEL =
    "data:image/gif;base64,R0lGODlhAQABAAAAACwAAAAAAQABAAA=";

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

async function setHeadBackgroundFade(url) {
    if (!url || url === currentUrl) return;

    try { await preload(url); } catch (e) { console.warn("Image failed:", url, e); return; }

    headDisplay.classList.add("is-fading");

    await new Promise(r => setTimeout(r, 400));


    headDisplay.style.backgroundImage = `${gradients} url("${url}")`;


    headDisplay.classList.remove("is-fading");
}



for(let i = 0; i < 4; i++) {
    let randint = getRandomInt(0, headImgs.length - 1);
    if(randImgTmp.includes(randint)){
        while(randImgTmp.includes(randint)){
            randint = getRandomInt(0, headImgs.length - 1);
        }
        randImgTmp.push(randint);
        randImgsArray[i] = headImgs[randint];
    }
    else{
        randImgTmp.push(randint);
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
    fluid.style.visibility = "hidden"
    await sleep(650);
    window.location.href = "/"
}

async function backAnim(){
    backbutton.src = "/images/SiteUI/Base/BackStep2.png";
    await sleep(150);
    backbutton.src = "/images/SiteUI/Base/BackStep3.png";
    await sleep(150);
    backbutton.src = "/images/SiteUI/Base/BackFinal.png";
    backbutton.style.animation = "imgGlitch 2s infinite";
}

function undoBackAnim(){
    backbutton.src = "/images/SiteUI/Base/BackStep1.png";
    backbutton.style.animation = "none";
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// *** Git Repo Display Functions ***

async function refreshGitItemsIfChanged() {
    try {
        const head = await fetch(GIT_JSON_URL, { method: "HEAD", cache: "no-store" });
        if (!head.ok) throw new Error(`HEAD ${head.status}`);

        const etag = head.headers.get("etag");
        const lastMod = head.headers.get("last-modified");
        const stamp = etag || lastMod || null;

        // unchanged -> keep cache
        if (stamp && gitCacheStamp === stamp && gitItemsCache.length) return false;

        const res = await fetch(GIT_JSON_URL, { cache: "no-store" });
        if (!res.ok) throw new Error(`GET ${res.status}`);

        const data = await res.json();
        const items = Array.isArray(data) ? data : (Array.isArray(data.items) ? data.items : []);

        gitItemsCache = items
            .filter(x => x && typeof x === "object")
            .filter(x => typeof x.url === "string" && x.url.length)
            .map(x => ({
                title: x.title ?? "",
                img: x.img ?? "",
                url: x.url,
                lastUpdated: Number(x.lastUpdated) || 0,
                stars: Number(x.stars) || 0,
                status: (x.status ?? "").toLowerCase(),
            }));

        gitCacheStamp = stamp;
        return true;
    } catch (err) {
        console.warn("refreshGitItemsIfChanged failed; using existing cache if any:", err);
        return false;
    }
}

function getSelectedSortIndex() {
    for (let i = 0; i < sortOpts.length; i++) {
        if (sortOpts[i].classList.contains("selectedSort")) return i;
    }
    return 0;
}

function sortAndFilterGitItems(items, sortIndex) {
    let arr = [...items];

    switch (sortIndex) {
        case 0: // Recently Updated
            arr.sort((a, b) => b.lastUpdated - a.lastUpdated);
            break;

        case 1: // Most Popular
            arr.sort((a, b) => b.stars - a.stars);
            break;

        case 2: // Finished ONLY
            arr = arr.filter(x => x.status === "finished");
            arr.sort((a, b) => b.lastUpdated - a.lastUpdated);
            break;

        case 3: // In Progress ONLY
            arr = arr.filter(x => x.status === "in_progress");
            arr.sort((a, b) => b.lastUpdated - a.lastUpdated);
            break;
    }

    return arr;
}

function clearGitSlot(imgEl) {
    // imgEl.removeAttribute("src");          **INCASE I WANT THEM ALL TO BE INVISIBLE AGAIN
    // imgEl.style.opacity = "0";             **INCASE I WANT THEM ALL TO BE INVISIBLE AGAIN
    // imgEl.style.pointerEvents = "none";    **INCASE I WANT THEM ALL TO BE INVISIBLE AGAIN
    imgEl.src = TRANSPARENT_PIXEL;
    imgEl.style.opacity = "1";
    imgEl.dataset.url = "";
    imgEl.alt = "";

}

function fillGitSlot(imgEl, item) {
    // hide slot if no image path (avoid broken image icon)
    if (!item.img) {
        clearGitSlot(imgEl);
        return;
    }

    imgEl.src = item.img || TRANSPARENT_PIXEL;
    imgEl.dataset.url = item.url;
    imgEl.alt = item.title || "";
    // imgEl.style.pointerEvents = "auto" || "none";    **INCASE I WANT THEM ALL TO BE INVISIBLE AGAIN
    imgEl.style.opacity = "1";
}

function renderGitRow(sortedItems) {
    for (let i = 0; i < gitRowButtons.length; i++) {
        const imgEl = gitRowButtons[i];
        const item = sortedItems[i];

        if (!item) clearGitSlot(imgEl);
        else fillGitSlot(imgEl, item);
    }
}

// The one function you call from anywhere (load + click):
async function applyGitSortAndRenderFresh() {
    await refreshGitItemsIfChanged();
    const sortIndex = getSelectedSortIndex();
    const sorted = sortAndFilterGitItems(gitItemsCache, sortIndex);
    renderGitRow(sorted);
}

function initGitRowClicks() {
    for (let i = 0; i < gitRowButtons.length; i++) {
        const imgEl = gitRowButtons[i];
        if (imgEl.dataset.gitBound === "1") continue;
        imgEl.dataset.gitBound = "1";

        imgEl.addEventListener("click", async () => {
            const url = imgEl.dataset.url;
            if (!url) return;

            TVScreen.off();
            channelmenu.style.visibility = "hidden";
            fluid.style.visibility = "hidden"
            await sleep(650);
            TVScreen.on();
            await sleep(440);
            window.location.href = url;
        });
    }
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



// *** Export ***

export {channelmenu, headDisplay, tvbox, backbutton, settingsbutton, icon, fluid, topRowURLs, gitRowURLs, webRowURLs, appRowURLs, topRowButtons, gitRowButtons, webRowButtons, appRowButtons, sortOpts, headImgs, alphabet, alph2egy, TVScreen,
        startHeadRotation, exitSite, backAnim, undoBackAnim, clickButton, sleep, applyGitSortAndRenderFresh, initGitRowClicks};