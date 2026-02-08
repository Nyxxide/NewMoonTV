// *** Imports ***

import ThemeManager from "../Fancy/ThemeHandler.js";



// *** Variables ***

let headImgs = []
let randImgsArray = []
let recentHeadUrls = [];
let currentUrl = null;
let timerId = null;

var headDisplay = document.getElementById("headDisplay");
var gradients;



// *** Functions ***

function preload(url) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(url);
        img.onerror = reject;
        img.src = url;
    });
}

function pickRandomAvoiding(arr, avoidSet) {
    if (!arr || arr.length === 0) return null;

    // If everything is avoided (possible when arr is small), just allow any.
    const candidates = arr.filter(x => !avoidSet.has(x));
    const pool = candidates.length ? candidates : arr;

    return pool[Math.floor(Math.random() * pool.length)];
}

function pickUnique(arr, count) {
    const copy = arr.slice();
    // Fisher-Yates shuffle then take first N
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy.slice(0, count);
}

function rebuildHeadRotationSet() {
    // Pull from theme (this returns the egypt/base list depending on active theme)
    const themed = ThemeManager.get("headDisplay.images", []);
    headImgs = Array.isArray(themed) ? themed.slice() : [];
    gradients = ThemeManager.get("headDisplay.gradients", []);

    // If you ALWAYS want exactly 4 for rotation:
    // - If theme list has 4, it uses those
    // - If theme list has more than 4, it picks 4 unique
    // - If theme list has less than 4, it just uses what exists
    randImgsArray = pickUnique(headImgs, Math.min(4, headImgs.length));
}

async function setHeadBackgroundFade(url) {
    if (!url || url === currentUrl) return;

    try { await preload(url); } catch (e) { console.warn("Image failed:", url, e); return; }

    headDisplay.classList.add("is-fading");

    await new Promise(r => setTimeout(r, 400));

    headDisplay.style.backgroundImage = `${gradients} url("${url}")`;
    headDisplay.classList.remove("is-fading");

    currentUrl = url;
    recentHeadUrls.push(url)
    if (recentHeadUrls.length > 2) recentHeadUrls.shift();
}

function startHeadRotation(intervalMs = 10000) {
    stopHeadRotation();

    const avoid = new Set(recentHeadUrls);
    const first = pickRandomAvoiding(randImgsArray, avoid);
    if (first) setHeadBackgroundFade(first);

    // rotate
    timerId = setInterval(() => {
        const avoid2 = new Set(recentHeadUrls);
        const next = pickRandomAvoiding(randImgsArray, avoid2);
        if (next) setHeadBackgroundFade(next);
    }, intervalMs);
}

function stopHeadRotation() {
    if (timerId) {
        clearInterval(timerId);
        timerId = null;
    }
}

function resetHeadHistory() {
    currentUrl = null;
    recentHeadUrls = [];
}



// *** Export ***

export {rebuildHeadRotationSet, startHeadRotation, resetHeadHistory}