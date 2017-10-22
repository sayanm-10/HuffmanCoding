let fs = require("file-system");
let reader = require("read-file");
require('./MinPriorityQueue.js');
const INPUT_FILE = "infile.dat", OUTPUT_FILE = "outfile.dat";
let symbol_info = [], tree = [], huffman_code = [];
let forest = new MinPriorityQueue();

let debug = false;

// used to bootstrap the application
let init = function () {
    let readBuffer = reader.sync(INPUT_FILE, "utf-8");
    let allSymbols = readBuffer.replace(/[^0-9a-zA-Z]/g, ''); // get rid of everything except letters and numbers
    createSymbolInfo(allSymbols);
    initWriteFile();
    buildFrequencyTable(allSymbols.length, symbol_info);
    initForest(symbol_info);
};

let initWriteFile = function () {
    let frequencyTableHeader = "Symbol" + "\t" + "Frequency";
    fs.writeFile(OUTPUT_FILE, frequencyTableHeader);
};

let createSymbolInfo = function (symbols) {
    let index = 0;
    for (let i = 0; i < symbols.length; i++) {
        let character = symbols[i];
        if (!symbol_info[character]) { // newly encountered symbol
            let details = {
                symbol: character,
                frequency: 1,
                leaf: index++
            };
            symbol_info[character] = details;
        } else { // repetition of a symbol
            symbol_info[character].frequency += 1;
        }
    }
    // temp log for our benefit
    //console.log(symbol_info);
    if (debug) {
        for (item in symbol_info) {
            console.log(item);
        }
    }

};

let initForest = function(alphabet) {
    for (item in alphabet){
        let forestRoot = {
                  root: alphabet[item].leaf,
                  weight: alphabet[item].frequency
        };
        forest.Insert(forestRoot);
        let treeNode = {
                left_child: -1,
                right_child: -1,
                parent: -1
        };
        tree[alphabet[item].leaf] = treeNode;
    }
    console.log(forest);
    condenseForest();
};

let condenseForest = function() {
    while (forest.GetSize() > 1) {
        let min1 = forest.DeleteMin();
        if (debug) {console.log(min1.weight, ' popped');}
        let min2 = forest.DeleteMin();
        if (debug) {console.log(min2.weight, ' popped');}

        treeNode = {
            left_child: min1.root,
            right_child: min2.root,
            parent: -1
        };

        tree[tree.length] = treeNode; // tree.push?
        let forestRoot = {
                  root: tree.length,
                  weight: min1.weight + min2.weight
        };
        forest.Insert(forestRoot);
        tree[min1.root].parent= tree.length - 1;
        tree[min2.root].parent= tree.length - 1;
        if (debug) {console.log('Priority Queue');}
        if (debug) {console.log(forest.toString());}
      }
      let array = [];
      for (let index = 0; index < tree.length; index++) {
          array.push([index,tree[index].parent]);
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
    for (item in symbol_info) {
        let i = 0;
        let node = tree[symbol_info[item].leaf];
        //console.log(node);
        huffman_code[i] = {
            character: symbol_info[item].symbol,
            code: [],
        }
        while (node.parent !== -1) { // reached root of tree
            let childIndex = tree.findIndex(function(obj) {
                return obj.left_child === node.left_child
                && obj.right_child === node.right_child
                && obj.parent === node.parent;
            });
            let parentIndex = node.parent;
            if (tree[parentIndex].left_child === childIndex) {
                huffman_code[i].code.unshift("0");
            } else if (tree[parentIndex].right_child === childIndex) {
                huffman_code[i].code.unshift("1");
            }
            node = tree[parentIndex]; 
        }
        i++;
    }
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
