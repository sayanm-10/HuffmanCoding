let fs = require("file-system");
let reader = require("read-file");
require('./MinPriorityQueue.js');
let symbol_info = [];
let tree = [];
let forest = new MinPriorityQueue();

let debug = false;

// used to bootstrap the application
let init = function () {
    let readBuffer = reader.sync("infile.dat", "utf-8");
    let allSymbols = readBuffer.replace(/[^0-9a-zA-Z]/g, ''); // get rid of everything except letters and numbers
    createSymbolInfo(allSymbols);
    initForest(symbol_info);
    condenseForest();
    //console.log(inputString);
};

let createSymbolInfo = function (symbols) {
    let index = 0;
    for (let i = 0; i < symbols.length; i++) {
        let character = symbols[i];
        if (!symbol_info[character]) { // newly encountered symbol
            let details = {
                symbol: character,
                frequency: 1,
                leaf: index++ // TODO: fill this
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

let initForest = function(alphabet){
    for (item in alphabet){
        let forestRoot = {
                  root:alphabet[item].leaf,
                  weight:alphabet[item].frequency
        };
        forest.Insert(forestRoot);
        let treeNode = {
                left_child:-1,
                right_child:-1,
                parent:-1
        };
        tree[alphabet[item].leaf]=treeNode;
    }
}

let condenseForest = function(){
    while (forest.GetSize() > 1){
        let min1 = forest.DeleteMin();
        if (debug) {console.log(min1.weight,'popped');}
        let min2 = forest.DeleteMin();
        if (debug) {console.log(min2.weight,'popped');}

        treeNode = {left_child:min1.root,
                    right_child:min2.root,
                    parent:-1
        };
        tree[tree.length]=treeNode;
        let forestRoot = {
                  root:tree.length,
                  weight:min1.weight+min2.weight
        };
        forest.Insert(forestRoot);
        tree[min1.root].parent=tree.length-1;
        tree[min2.root].parent=tree.length-1;
        if (debug) {console.log('Priority Queue');}
        if (debug) {console.log(forest.toString());}
        let array = [];
        for (var index = 0; index < tree.length; index++) {
            array.push([index,tree[index].parent]);
        }
        if (debug) {console.log('Tree');}
        if (debug) {console.log(array);}
      }
}

init();
