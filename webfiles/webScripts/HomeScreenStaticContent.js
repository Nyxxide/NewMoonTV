// *** Variables ***

var homepage = document.getElementById("homepage");
var glitchdiv = document.getElementById("GlitchDiv")
var glitchlayerdiv = document.getElementById("GlitchLayerDiv")
var glitchlayer1 = document.getElementById("GlitchLayer1")
var glitchlayer2 = document.getElementById("GlitchLayer2")
var glitchlayer3 = document.getElementById("GlitchLayer3")

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

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function moonHoverStart() {
    glitchdiv.classList.add("glitch__tear");
    glitchlayerdiv.classList.add("glitch__layers");
    glitchlayer1.classList.add("glitch__layer");
    glitchlayer2.classList.add("glitch__layer");
    glitchlayer3.classList.add("glitch__layer");
}

function moonHoverEnd() {
    glitchdiv.classList.remove("glitch__tear");
    glitchlayerdiv.classList.remove("glitch__layers");
    glitchlayer1.classList.remove("glitch__layer");
    glitchlayer2.classList.remove("glitch__layer");
    glitchlayer3.classList.remove("glitch__layer");
}

async function enterSite() {
    TVScreen.off()
    homepage.style.visibility = "hidden";
    await sleep(650)
    window.location.href = "/channels"
}



// *** Export ***

export { homepage, glitchdiv, glitchlayerdiv, glitchlayer1, glitchlayer2, glitchlayer3, TVScreen, sleep, moonHoverStart, moonHoverEnd, enterSite};