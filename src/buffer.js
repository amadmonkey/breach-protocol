class Buffer {
    constructor({list = [], maxBuffer = 4}){
        this.list = list;
        this.maxBuffer = maxBuffer;
    }
    add (newBuffer) {
        if(newBuffer){
            if(this.list.length < this.maxBuffer) {
                this.list.push(newBuffer);
            } else {
                console.error('maxBuffer');
            }
        } else {
            console.error('no buffer selected');
        }
    }
    setList (list) {
        this.list = list;
    }
    isFull = () => this.getLength() >= this.maxBuffer;
    getLength = () => this.list.length;
    getByProperty = (property) => this.list.map(tile => tile[property])
    getLastTile = () => this.getLength() && this.list.at(-1);
    getLastPosition = () => this.getLength() && this.list.at(-1).position;
    getLastIndex = () => this.getLength() ? this.getLength() - 1 : null;

}

export default Buffer;