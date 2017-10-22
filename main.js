let fs = require("file-system");
let reader = require("read-file");
require('./MinPriorityQueue.js');
let symbol_info = [], tree = [], huffman_code = [], symbols_sorted = [];
let forest = new MinPriorityQueue();
const INPUT_FILE = "infile.dat", OUTPUT_FILE = "outfile.dat";
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
    fs.writeFileSync(OUTPUT_FILE, frequencyTableHeader);
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
    // create a list of symbols in order of most to least frequent
    let sortable = [];
    for (var item in symbol_info) {
        sortable.push([item, symbol_info[item].frequency]);
    }
    symbols_sorted_with_freq = sortable.sort(function(a, b) {
        return b[1] - a[1];
    });
    for (item in symbols_sorted_with_freq) {
        symbols_sorted.push(symbols_sorted_with_freq[item][0]);
    }
    if (true) {
        // temp log for our benefit
    if (debug) {
        for (item in symbol_info) {
            console.log(symbol_info[item]);
        }
    }
};

let initForest = function(alphabet) {
    for (item in alphabet) {
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
    condenseForest();
};

let condenseForest = function(){
    while (forest.GetSize() > 1) {
        let min1 = forest.DeleteMin();
        if (debug) {console.log(min1.weight,'popped');}
        let min2 = forest.DeleteMin();
        if (debug) {console.log(min2.weight,'popped');}
        // create a tree node with the roots (ids) of the two min items
        treeNode = {left_child: min1.root,
                    right_child: min2.root,
                    parent: -1
        };

        // create a new forest node with the sum of the weights of the two min items
        let forestRoot = {
                  root: tree.length,
                  weight: min1.weight+min2.weight
        };

        forest.Insert(forestRoot);
        tree[min1.root].parent = tree.length;
        tree[min2.root].parent = tree.length;
        tree.push(treeNode);

        if (debug) {console.log('Priority Queue');}
        if (debug) {console.log(forest.toString());}
      }
      if (debug) {console.log('Tree');}
      if (debug) {console.log(tree);}

      traverseTree();
};
let buildFrequencyTable = function (totalSymbolCount, symbols) {
    for (item in symbols_sorted) {
        let symbolFrequencyPercentage = symbols[symbols_sorted[item]].frequency / totalSymbolCount * 100;
        writeFrequencyTable(symbols[symbols_sorted[item]].symbol, symbolFrequencyPercentage.toFixed(3));
    }
};

let writeFrequencyTable = function (symbol, frequency) {
    let tableEntry = "\n" + symbol + "," + "\t" + frequency + "%";
    fs.appendFileSync(OUTPUT_FILE, tableEntry);
};

let getNumBits = function() {
  let numBits = 0;
  for (entry in huffman_code) {
      let symbol = huffman_code[entry].character;
      let code =  huffman_code[entry].code;
      let frequency = symbol_info[symbol].frequency;
      numBits = numBits + code.length*frequency;
  }
  let bitsString = '\n\nTotal Bits: '+ numBits;
  fs.appendFile(OUTPUT_FILE, bitsString);
};

let traverseTree = function () {
    for (item in symbol_info) {
        let node = tree[symbol_info[item].leaf];
        let childIndex, parentIndex;
        console.log("Node: ", node);
        huffman_code[symbol_info[item].symbol] = {
            character: symbol_info[item].symbol,
            code: [],
        }
        // while (node && node.parent !== -1) { // reached root of tree
        //     // outerLoop ? console.log("Index: ", i) : undefined;
        //     // let childIndex = outerLoop ? i : tree.findIndex(function(obj) {
        //     //     return obj.left_child === node.left_child
        //     //     && obj.right_child === node.right_child
        //     //     && obj.parent === node.parent;
        //     // });
        //     childIndex = childIndex || i;
        //     console.log("CI :", childIndex);
        //     parentIndex = node.parent;
        //     console.log("PI: ", parentIndex);
        //     if (tree[parentIndex].left_child === childIndex) {
        //         huffman_code[i].code.unshift("0"); // generating code by traversing up from the leaf
        //     } else if (tree[parentIndex].right_child === childIndex) {
        //         huffman_code[i].code.unshift("1");
        //     }
        //     childIndex = parentIndex;
        //     node = tree[parentIndex];
        //     outerLoop = false;
        //     console.log("Next Node: ", node);
        // }

        let index = symbol_info[item].leaf;
        while (node && node.parent !== -1) {
            if (tree[node.parent].left_child === index) {
                huffman_code[symbol_info[item].symbol].code.unshift("0");
            } else {
                huffman_code[symbol_info[item].symbol].code.unshift("1");
            }
            index = node.parent;
            node = tree[node.parent];
        }
    }
    writeHuffmanCode();
};

let writeHuffmanCode = function () {
    let tableHeader = "\n\n\n" + "Symbol" + "\t" + "Huffman Codes";
    fs.appendFileSync(OUTPUT_FILE, tableHeader);
    for (entry in symbols_sorted) {
        let code = "\n" + huffman_code[symbols_sorted[entry]].character + "\t" + huffman_code[symbols_sorted[entry]].code.join("");
        fs.appendFileSync(OUTPUT_FILE, code);
    }
    getNumBits();
};

init();
