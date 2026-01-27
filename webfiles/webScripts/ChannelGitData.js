const GIT_ITEMS = [
    {
        id: "bloonsfarm",
        title: "BloonsFarm",
        img: "/images/GHBloonsRepo.webp",
        url: "https://github.com/Nyxxide/BloonsFarm",
        lastUpdated: 0,          // lower = more recent (manual for now)
        stars: 0,       // lower = more popular (manual for now)
        status: "in_progress",   // "finished" | "in_progress"
    },
];

async function populateLastUpdated() {
    for (let i = 0; i < GIT_ITEMS.length; i++) {
        let urlSplit = GIT_ITEMS[i].url.split("/");
        let urlSwp = "https://api.github.com/repos/" + urlSplit[3] + "/" + urlSplit[4];
        let jsonReturn = await fetch(urlSwp).then((response) => response.json());
        GIT_ITEMS[i].lastUpdated = new Date(jsonReturn.updated_at).getTime();
    }
}

(async () => {
    await populateLastUpdated();
    console.log(GIT_ITEMS);
})();




// export { GIT_ITEMS };