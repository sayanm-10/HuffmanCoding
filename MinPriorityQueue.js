class MinPriorityQueue{
<<<<<<< HEAD
    constructor(){
        this.items = [];
        this.n = 0;
    }
    IsEmpty(){
        return this.n===0;
    }
    GetSize(){
        return this.n;
    }
    Insert(newItem){
=======
    constructor() {
        this.items = [];
        this.n = 0;
    }

    IsEmpty(){
        return this.n === 0;
    }

    GetSize(){
        return this.n;
    }

    Insert(newItem) {
>>>>>>> 11ce876b1a2e73f0ac34b3082899a4f6f89e5b9a
        this.items[++this.n] = newItem;
        let i = this.n;
       // while we haven't reached the beginning of the items and
       // the parent is greater than the child
<<<<<<< HEAD
        while(i > 1 && this.greater(Math.floor(i/2),i)===1) {
=======
        while(i > 1 && this.greater(Math.floor(i/2), i)) {
>>>>>>> 11ce876b1a2e73f0ac34b3082899a4f6f89e5b9a
            this.swap(i, Math.floor(i/2));
            i = Math.floor(i/2);
        }
    }
<<<<<<< HEAD
    DeleteMin(){
        if(this.IsEmpty()) {
            throw new Error('No items in the queue.');
        }
        this.swap(1,this.n);
        let min = this.items[this.n--];
        let i = 1;
        while(2*i <= this.n){
             let child = 2*i;
             // swap with the smaller child
             if(child<this.n && this.greater(child,child+1)===1){
                 child++;
             }
             // if the parent is not larger than the parent, stop swapping
             if(!this.greater(i,child)){
                  break;
             }
             this.swap(i,child);
             i = child;
        }
        return min;

    }
    swap(j,k){
=======

    DeleteMin() {
        if(this.IsEmpty()) {
            throw new Error('No items in the queue.');
        }
        this.swap(1, this.n);
        //let min = this.items[this.n--];
        let min = this.items.pop();
        this.n = this.n - 1;
        let i = 1;
        while(2*i <= this.n) {
             let child = 2*i;
             // swap with the smaller child
             if(child < this.n && this.greater(child, child + 1)) {
                 child++;
             }
             // if the parent is not larger than the parent, stop swapping
             if(!this.greater(i, child)) {
                  break;
             }
             this.swap(i, child);
             i = child;
        }
        return min;
    }

    swap(j, k) {
>>>>>>> 11ce876b1a2e73f0ac34b3082899a4f6f89e5b9a
       let temp = this.items[j];
       this.items[j] = this.items[k];
       this.items[k] = temp;
    }

<<<<<<< HEAD
    greater(j,k){
        if(this.items[j].weight>this.items[k].weight){
          return 1;
        }
       return 0;
    }
    toString(){
        let array = [];
        for (var index = 1; index < this.n+1; index++) {
=======
    greater(j, k) {
        return this.items[j].weight > this.items[k].weight;
    }

    toString() {
        let array = [];
        for (let index = 1; index < this.n + 1; index++) {
>>>>>>> 11ce876b1a2e73f0ac34b3082899a4f6f89e5b9a
          array.push(this.items[index].weight);
        }
        return array;
    }
};

global.MinPriorityQueue = MinPriorityQueue;
