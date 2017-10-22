let fs = require("file-system");
let reader = require("read-file");
require('./MinPriorityQueue.js');
let symbol_info = [], tree = [], huffman_code = [];
let forest = new MinPriorityQueue();
const INPUT_FILE = "infile.dat", OUTPUT_FILE = "outfile.dat";

let debug = false;

// used to bootstrap the application
let init = function () {
    let readBuffer = reader.sync(INPUT_FILE, "utf-8");
    let allSymbols = readBuffer.replace(/[^0-9a-zA-Z]/g, ''); // get rid of everything except letters and numbers
    createSymbolInfo(allSymbols);
    initForest(symbol_info);
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
    if (debug) {
        // temp log for our benefit
        for (item in symbol_info) {
            console.log(symbol_info[item]);
        }
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
    //console.log(forest);
    condenseForest();
};

let condenseForest = function(){
    while (forest.GetSize() > 1){
        let min1 = forest.DeleteMin();
        if (debug) {console.log(min1.weight,'popped');}
        let min2 = forest.DeleteMin();
        if (debug) {console.log(min2.weight,'popped');}
        // create a tree node with the roots (ids) of the two min items

        treeNode = {left_child:min1.root,
                    right_child:min2.root,
                    parent:-1
        };
        // create a new forest node with the sum of the weights of the two min items

        let forestRoot = {
                  root:tree.length,
                  weight:min1.weight+min2.weight
        };
        forest.Insert(forestRoot);
        tree[min1.root].parent= tree.length;
        tree[min2.root].parent= tree.length;

        tree.push(treeNode);

        if (debug) {console.log('Priority Queue');}
        if (debug) {console.log(forest.toString());}
      }
      if (true) {console.log('Tree');}
      if (true) {console.log(tree);}

      traverseTree();
};

let buildFrequencyTable = function (totalSymbolCount, symbols) {
    for (item in symbols) {
        let symbolFrequencyPercentage = symbols[item].frequency / totalSymbolCount * 100;
        writeFrequencyTable(symbols[item].symbol, symbolFrequencyPercentage.toFixed(3));
    }
};

let writeFrequencyTable = function (symbol, frequency) {
    let tableEntry = "\n" + symbol + "," + "\t" + frequency + "%";
    fs.appendFile(OUTPUT_FILE, tableEntry);
};

let traverseTree = function () {
    let i = 0;
    for (item in symbol_info) {
        let node = tree[symbol_info[item].leaf];
        console.log("Node: ", node);
        huffman_code[i] = {
            character: symbol_info[item].symbol,
            code: [],
        }
        while (node && node.parent !== -1) { // reached root of tree
            let childIndex = tree.findIndex(function(obj) {
                return obj.left_child === node.left_child
                && obj.right_child === node.right_child
                && obj.parent === node.parent;
            });
            console.log("CI :", childIndex);
            let parentIndex = node.parent;
            console.log("PI: ", parentIndex);
            if (tree[parentIndex].left_child === childIndex) {
                huffman_code[i].code.unshift("0"); // generating code by traversing up from the leaf
            } else if (tree[parentIndex].right_child === childIndex) {
                huffman_code[i].code.unshift("1");
            }
            if (parentIndex === childIndex) {
                break;
            }
            node = tree[parentIndex];
            console.log("Next Node: ", node);
        }
        i++;
    }
    console.log(huffman_code);
    writeHuffmanCode();
};

let writeHuffmanCode = function () {
    //console.log("Wwriting code....");
    let tableHeader = "\n\n\n" + "Symbol" + "\t" + "Huffman Codes";
    fs.appendFile(OUTPUT_FILE, tableHeader);
    for (entry in huffman_code) {
        let code = "\n" + huffman_code[entry].character + "\t" + huffman_code[entry].code;
        fs.appendFile(OUTPUT_FILE, code);
    }
};

init();
