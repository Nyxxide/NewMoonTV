import {TVScreen, sleep} from './ChannelsStaticContent.js';
import ThemeManager from "../Fancy/ThemeHandler.js";

let gitItemsCache = [];
let gitCacheStamp = null;

var channelmenu = document.getElementById("channelMenu");
var fluid = document.getElementById("fluidBg");
var gitRowButtons = document.getElementsByClassName("gitRow");
var sortOpts = document.getElementsByClassName("sortOpt");

const GIT_JSON_URL = "/webJsonData/GIT_ITEMS.json";
const TRANSPARENT_PIXEL =
    "data:image/gif;base64,R0lGODlhAQABAAAAACwAAAAAAQABAAA=";


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

    imgEl.src = themedGitImgPath(item.img)|| TRANSPARENT_PIXEL;
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

function capitalize(s) {
    return s ? s[0].toUpperCase() + s.slice(1) : s;
}

function themedGitImgPath(imgPath) {
    if (!imgPath) return imgPath;

    const themeFolder = capitalize(ThemeManager.getThemeName()); // "Base" / "Egypt"

    // Replace only the GHRepo folder segment, not random "Base" elsewhere
    // Example: /images/GHRepo/Base/GHBloonsRepo.webp -> /images/GHRepo/Egypt/...
    return imgPath.replace(/\/GHRepo\/Base\//, `/GHRepo/${themeFolder}/`);
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

export {applyGitSortAndRenderFresh, initGitRowClicks};