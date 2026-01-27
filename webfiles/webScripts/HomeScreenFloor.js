// TODO: FIX THIS MESS. PROBABLY REDO FROM SCRATCH


let floor = document.getElementById("floor");
var screenWidthCheck;
var numTiles;

window.onload = function() {
    if(window.innerWidth>0) {
        screenWidthCheck = Math.floor(window.innerWidth/100);
        if(Math.floor(window.innerHeight/50)>=19){
            numTiles = Math.floor(window.innerHeight/50);
        }
        else{
            numTiles = 19;
        }
        let centerCol = 10;
        let hcalc = window.innerWidth - 600;
        let hloop = hcalc / 100;
        for(let i = 0; i < Math.ceil(hloop); i++){
            centerCol += 1;
        }
        let leftCol = Math.ceil(centerCol * 1.4) //was 0.8;
        let rightCol = Math.ceil(centerCol * 1.4) //was 0.8;
        let totalCols = leftCol + rightCol + centerCol;
        for (let i = 1; i <= totalCols; i++) {
            //1.14285714286 more columns on left/right of however many are necessary to take up the center
            let col = document.createElement("div");
            col.classList.add(i % 2 === 0 ? "col-even" : "col");
            for (let ii = 0; ii < (i % 2 === 0 ? numTiles-1 : numTiles); ii++) {
                let timing = Math.floor(Math.random() * (500 - 1)) + 1;
                let tile = document.createElement("div");
                tile.classList.add("tile");
                col.appendChild(tile);
            }
            floor.appendChild(col);
        }
        let translateXBy = -1025;
        if (window.innerWidth >= 600) {
            let calc = window.innerWidth - 600;
            let loop = calc / 400;
            for (let i = 1; i <= Math.floor(loop); i++) {
                translateXBy -= 300;
            }
        }
        let translateYBy = -1100;
        let scaleYBy = 1.0;
        let rotateXBy = 65;
        if (window.innerHeight >= 950) {
            let calc = window.innerHeight - 950;
            let loop = calc / 50;
            let subrotate = 0.6;
            for (let i = 1; i <= Math.floor(loop); i++) {
                translateYBy -= 17.7;
                scaleYBy += 0.012;
                rotateXBy -= subrotate;
                // if(i%40===0){
                //     subrotate -= 0.2;
                // }
            }
        }
        if (window.innerHeight < 950) {
            // let calc = 950 - window.innerHeight;
            // let loop = calc / 50;
            // for (let i = 1; i <= Math.floor(loop); i++) {
            //     translateYBy -= 140;
            //     scaleYBy -= 0.0278;
            //     rotateXBy += 0.556;
            // }
        }
        floor.style.transform = `rotateX(${rotateXBy}deg) translateX(${translateXBy}px) translateY(${translateYBy}px) scale(${scaleYBy})`
    }
    else{
        screenWidthCheck = 5;
    }
};


window.addEventListener("resize", function(){
    if(window.innerWidth>0){
        if(Math.floor(window.innerWidth/100)!==screenWidthCheck || Math.floor(window.innerHeight/50)!==numTiles){
            if(Math.floor(window.innerHeight/50)>=19){
                numTiles = Math.floor(window.innerHeight/50);
            }
            else{
                numTiles = 19;
            }
            let cols = document.getElementsByClassName("col");
            let colevens = document.getElementsByClassName("col-even");
            let colnum = cols.length;
            let colevenum = colevens.length;
            for(let i = colnum-1; i >= 0; i--){
                cols[i].remove();
            }
            for(let i = colevenum-1; i >= 0; i--){
                colevens[i].remove();
            }
            let centerCol = 10;
            let calc = window.innerWidth - 600;
            let loop = calc / 100;
            for(let i = 0; i < Math.ceil(loop); i++){
                centerCol += 1;
            }
            let leftCol = Math.ceil(centerCol*1.4) //was 0.8;
            let rightCol = Math.ceil(centerCol*1.4) //was 0.8;
            let totalCols = leftCol + rightCol + centerCol;
            for(let i = 1; i <= totalCols; i++){
                let col = document.createElement("div");
                col.classList.add(i % 2 === 0 ? "col-even" : "col");
                for (let ii = 0; ii < (i % 2 === 0 ? numTiles-1 : numTiles); ii++) {
                    let tile = document.createElement("div");
                    tile.classList.add("tile");
                    tile.style.opacity = `1`;
                    col.appendChild(tile);
                }
                floor.appendChild(col);
            }
        }
        screenWidthCheck = Math.floor(window.innerWidth/100);
        let translateXBy = -1025;
        if (window.innerWidth >= 600) {
            let calc = window.innerWidth - 600;
            let loop = calc / 400;
            let subtr = 300;
            for (let i = 1; i <= Math.floor(loop); i++) {
                translateXBy -= subtr;
            }
        }
        let translateYBy = -1100;
        let scaleYBy = 1.0;
        let rotateXBy = 65;
        if (window.innerHeight >= 950) {
            let calc = window.innerHeight - 950;
            let loop = calc / 50;
            let subrotate = 0.6;
            for (let i = 1; i <= Math.floor(loop); i++) {
                translateYBy -= 17.7;
                scaleYBy += 0.012;
                rotateXBy -= subrotate;
                // if(i%40===0){
                //     subrotate -= 0.2;
                // }
            }
        }
        if (window.innerHeight < 950) {
            //change perspective, translateY, rotate, scale

            // let calc = 950 - window.innerHeight;
            // let loop = calc / 50;
            // for (let i = 1; i <= Math.floor(loop); i++) {
            //     translateYBy -= 140;
            //     scaleYBy -= 0.0278;
            //     rotateXBy += 0.556;
            // }
        }
        floor.style.transform = `rotateX(${rotateXBy}deg) translateX(${translateXBy}px) translateY(${translateYBy}px) scale(${scaleYBy})`
    }
    else{
        screenWidthCheck = 5;
        let cols = document.getElementsByClassName("col");
        let colevens = document.getElementsByClassName("col-even");
        let colnum = cols.length;
        let colevenum = colevens.length;
        if(cols.length!==0) {
            for (let i = colnum-1; i >= 0; i--) {
                cols[i].remove();
            }
        }
        if(colevens.length) {
            for (let i = colevenum-1; i >= 0; i--) {
                colevens[i].remove();
            }
        }
    }
})
