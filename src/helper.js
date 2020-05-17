let Timer = class {
    constructor() {
        this.startTime = 0;
        this.endTime = 0;
    }

    start() {
        this.startTime = Date.now();
    }

    end() {
        this.endTime = Date.now();
    }

    get seconds() { return (this.endTime - this.startTime) / 1000; }
    get milliseconds() { return (this.endTime - this.startTime); }
}

module.exports = { Timer }