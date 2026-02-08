// *** Imports ***

import {
    channelmenu,
    backbutton,
    fluid,
    sortOpts,
    TVScreen,
    exitSite,
    backAnim,
    undoBackAnim,
    clickButton,
    sleep,
    loadPage
} from "../Static/ChannelsStaticContent.js"

import ThemeManager from "../Fancy/ThemeHandler.js";



// *** Logic ***

// Preload all images
const preload = ["/images/GHRepo/Base/GHBloonsRepo.webp", "/images/GHRepo/Base/GHMCTagRepo.webp", "/images/GHRepo/Base/GHNewMoonRepo.webp", "/images/GHRepo/Base/GHYT2Repo.webp",
                        "/images/GHRepo/Egypt/GHBloonsRepo.webp", "/images/GHRepo/Egypt/GHMCTagRepo.webp", "/images/GHRepo/Egypt/GHNewMoonRepo.webp", "/images/GHRepo/Egypt/GHYT2Repo.webp",

                        "/images/HeadDisplay/Base/BTDFarmHead.webp", "/images/HeadDisplay/Base/GithubHead.webp", "/images/HeadDisplay/Base/MCTagHead.webp", "/images/HeadDisplay/Base/YT2Head.webp",
                        "/images/HeadDisplay/Egypt/Pharaoh1Head.webp", "/images/HeadDisplay/Egypt/Pharaoh2Head.webp", "/images/HeadDisplay/Egypt/Pharaoh3Head.webp", "/images/HeadDisplay/Egypt/Pharaoh4Head.webp",

                        "/images/LinkImg/Base/BTDFarmImg.webp", "/images/LinkImg/Base/GithubImg.webp", "/images/LinkImg/Base/MCTagImg.webp", "/images/LinkImg/Base/YT2Img.webp",
                        "/images/LinkImg/Egypt/BTDFarmImg.webp", "/images/LinkImg/Egypt/GithubImg.webp", "/images/LinkImg/Egypt/MCTagImg.webp", "/images/LinkImg/Egypt/YT2Img.webp",

                        "/images/SiteUI/Base/BackFinal.webp", "/images/SiteUI/Base/BackStep1.webp", "/images/SiteUI/Base/BackStep2.webp", "/images/SiteUI/Base/BackStep3.webp",
                        "/images/SiteUI/Base/Coggers.webp", "/images/SiteUI/Base/Moon.webp", "/images/SiteUI/Base/NewMoon.ico",
                        "/images/SiteUI/Egypt/BackFinal.webp", "/images/SiteUI/Egypt/BackStep1.webp", "/images/SiteUI/Egypt/BackStep2.webp", "/images/SiteUI/Egypt/BackStep3.webp",
                        "/images/SiteUI/Egypt/Coggers.webp", "/images/SiteUI/Egypt/Eye.webp", "/images/SiteUI/Egypt/markings.webp", "/images/SiteUI/Egypt/sand.webp",
                        "/images/SiteUI/Egypt/slope.webp", "/images/SiteUI/Egypt/wall.webp", "/images/SiteUI/Egypt/Pyramid.webp", "/images/SiteUI/Egypt/PyramidAlt.webp",
                        "/images/SiteUI/Egypt/Eye.ico", ];


var images = [];
for (let i = 0; i < preload.length; i++) {
    images[i] = new Image();
    images[i].src = preload[i];
}

document.addEventListener("DOMContentLoaded", async () => {
    await loadPage()
});

for(let i = 0; i <sortOpts.length; i++) {
    sortOpts[i].addEventListener("click", clickButton);
}

backbutton.addEventListener("mouseenter", backAnim);
backbutton.addEventListener("mouseleave", undoBackAnim);
backbutton.addEventListener("click", exitSite);

document.getElementById("settings").addEventListener("click", () => {
    if(window.innerWidth < 600){
        if(ThemeManager.getThemeName()==="base"){
            ThemeManager.setTheme("egypt");
        }
        else if(ThemeManager.getThemeName()==="egypt"){
            ThemeManager.setTheme("base");
        }
    }
    else{
        if(ThemeManager.getThemeName()==="egypt"){
            ThemeManager.setTheme("base");
        }
    }


});

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

