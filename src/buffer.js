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
	getByProperty = (property) => this.list.map((tile) => tile[property]);
	getLastTile = () => this.getLength() && this.list.at(-1);
	getLastPosition = () => this.list.at(-1)?.position ?? 0;
	getLastIndex = () => (this.getLength() ? this.getLength() - 1 : null);
	getContent = (index) => this.list[index]?.content ?? "";
}

export default Buffer;
