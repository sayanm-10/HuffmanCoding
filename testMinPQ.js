
require('./MinPriorityQueue.js');

let alphabet = {
  b:{leaf:0, frequency:20},
    a:{leaf:1, frequency:10},
    c:{leaf:2, frequency:4},
    d:{leaf:3, frequency:6},
    e:{leaf:4, frequency:3},
    f:{leaf:5, frequency:15},
    g:{leaf:6, frequency:6},
    h:{leaf:7, frequency:2},

};

let forest = new MinPriorityQueue();
for (key in alphabet){
    let forest_root = {
              root:alphabet[key].leaf,
              weight:alphabet[key].frequency
    };
    forest.Insert(forest_root);
<<<<<<< HEAD
    console.log(forest.toString());
=======
    console.log("MinQ: ", forest.toString());
>>>>>>> 11ce876b1a2e73f0ac34b3082899a4f6f89e5b9a

}

while (!forest.IsEmpty()){
  let min = forest.DeleteMin();
<<<<<<< HEAD
  console.log(forest.toString());
=======
  console.log("DeleteMin: ", min.weight + " ", forest.toString());
>>>>>>> 11ce876b1a2e73f0ac34b3082899a4f6f89e5b9a
}
