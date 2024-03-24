class PriorityQueue {
    constructor(comparator) {
        this.queue = [];
        this.comparator = comparator;
    }

    enqueue(item) {
        this.queue.push(item);
        this.queue.sort(this.comparator);
    }

    dequeue() {
        if (!this.isEmpty()) {
            return this.queue.shift();
        }
        return null;
    }

    removeById(orderID) {
        const index = this.queue.findIndex(item => item._id === orderID);
        
        if (index !== -1) {
            this.queue.splice(index, 1);
        }
    }

    peek() {
        if (!this.isEmpty()) {
            return this.queue[0];
        }
        return null;
    }

    isEmpty() {
        return this.queue.length === 0;
    }
}

module.exports = PriorityQueue;
