// *** Imports ***

import {channelmenu, headDisplay, tvbox, backbutton, settingsbutton, icon, fluid, topRowURLs, gitRowURLs, webRowURLs, appRowURLs, topRowButtons, gitRowButtons, webRowButtons, appRowButtons, sortOpts, headImgs, alphabet, alph2egy, TVScreen,
        startHeadRotation, exitSite, backAnim, undoBackAnim, clickButton, sleep, applyGitSortAndRenderFresh, initGitRowClicks} from "./ChannelsStaticContent.js"

import {ScreenEffect} from "./CRTVStatic.js";

import {startFluidBG} from "./FluidBG.js";

// *** Logic ***

document.addEventListener("DOMContentLoaded", async () => {
    TVScreen.on();
    await sleep(440);

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
    startHeadRotation(10000);
    sortOpts[0].classList.add("selectedSort");
    initGitRowClicks();
    await applyGitSortAndRenderFresh();

    channelmenu.style.visibility = "visible";
});

for(let i = 0; i <sortOpts.length; i++) {
    sortOpts[i].addEventListener("click", clickButton);
}

backbutton.addEventListener("mouseenter", backAnim);
backbutton.addEventListener("mouseleave", undoBackAnim);
backbutton.addEventListener("click", exitSite);

window.addEventListener("pageshow", async (e) => {
    const restoredFromBFCache = e.persisted;

    // Some browsers also expose navigation type:
    const nav = performance.getEntriesByType?.("navigation")?.[0];
    const isBackForward = nav?.type === "back_forward";

    if (restoredFromBFCache || isBackForward) {
        // TVScreen.on();
        // await sleep(440);
        channelmenu.style.visibility = "visible";
        fluid.style.visibility = "visible";
    }
});

