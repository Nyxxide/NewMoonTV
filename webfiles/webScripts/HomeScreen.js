// *** Imports ***

import { homepage, glitchdiv, glitchlayerdiv, glitchlayer1, glitchlayer2, glitchlayer3, TVScreen, sleep, moonHoverStart, moonHoverEnd, enterSite} from "./HomeScreenStaticContent.js";



// *** Logic ***

document.addEventListener("DOMContentLoaded", async () => {
    TVScreen.on();
    await sleep(440);
    homepage.style.visibility = "visible";

})

glitchdiv.addEventListener("mouseenter", moonHoverStart);
glitchdiv.addEventListener("mouseleave", moonHoverEnd);
glitchdiv.addEventListener("click", enterSite);

window.addEventListener("pageshow", async (e) => {
    const restoredFromBFCache = e.persisted;

    // Some browsers also expose navigation type:
    const nav = performance.getEntriesByType?.("navigation")?.[0];
    const isBackForward = nav?.type === "back_forward";

    if (restoredFromBFCache || isBackForward) {
        TVScreen.on();
        await sleep(440);

        homepage.style.visibility = "visible";
    }
});

