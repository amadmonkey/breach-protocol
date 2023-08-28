class Buffer {
	constructor({ list = [], maxLength = 4 }) {
		this.list = list;
		this.maxLength = maxLength;
	}
	add = (newBuffer) => {
		if (!newBuffer) return;
		this.list.length < this.maxLength && this.list.push(newBuffer);
	};
	isFull = () => this.getLength() >= this.maxLength;
	getLength = () => this.list.length;
	getContent = (index) => this.list[index]?.content ?? "";
	getLastTile = () => this.getLength() && this.list.at(-1);
	getLastIndex = () => (this.getLength() ? this.getLength() - 1 : null);
	getByProperty = (property) => this.list.map((tile) => tile[property]);
	getLastPosition = () => this.list.at(-1)?.position ?? 0;
}

export default Buffer;
