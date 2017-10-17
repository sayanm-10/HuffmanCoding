let fs = require("file-system");
let reader = require("read-file");
let symbol_info = [];

// used to bootstrap the application
let init = function () {
    let readBuffer = reader.sync("infile.dat", "utf-8");
    let allSymbols = readBuffer.replace(/[^0-9a-zA-Z]/g, ''); // get rid of everything except letters and numbers
    createSymbolInfo(allSymbols);
    //console.log(inputString);
};

let createSymbolInfo = function (symbols) {
    for (let i = 0; i < symbols.length; i++) {
        let character = symbols[i];
        if (!symbol_info[character]) { // newly encountered symbol
            let details = { 
                symbol: character,
                frequency: 1,
                leaf: '' // TODO: fill this
            };
            symbol_info[character] = details;
        } else { // repetition of a symbol
            symbol_info[character].frequency += 1; 
        }
    }

    // temp log for our benefit
    for (item in symbol_info) {
        console.log(symbol_info[item]);
    }
    
};

init();