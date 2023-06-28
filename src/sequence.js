import { addToArray, removeFromArray, _STATUS_CLASSES } from "./global.js";

class Sequence {
	constructor(list = []) {
		this.list = list;
		this.paddingCount = 0;
		this.isDone = false;
		this.className = [];
	}
	clean(classList = null) {
		classList && this.list.map((tile) => removeFromArray(tile.sequenceClassName, classList));
	}
	update(buffer = null) {
		if (!this.isDone) {
			const { list, maxBuffer } = buffer;
			const bufferLength = list.length;
			let matchedCount = 0;
			// check for matched
			this.list.map((tile, i) => {
				const { content, sequenceClassName } = tile;
				if (content === list.slice(this.paddingCount)[i]?.content) {
					addToArray(sequenceClassName, _STATUS_CLASSES.matched);
					matchedCount++;
				}
				// add bg to current column
				// debugger;
				// bufferLength - this.paddingCount === i &&
				// 	addToArray(sequenceClassName, _STATUS_CLASSES.highlighted);
			});
			// if all tiles matched, tag as complete
			if (matchedCount === this.list.length) {
				this.isDone = true;
				addToArray(this.className, _STATUS_CLASSES.success);
			}
			// if remaining buffer length is less than remaining sequence tiles
			if (maxBuffer - bufferLength < this.list.length - matchedCount && !this.isDone) {
				this.isDone = true;
				addToArray(this.className, _STATUS_CLASSES.failed);
			}
			// add paddingCount for unmatched
			this.paddingCount = bufferLength - matchedCount;
		}
	}
}

export default Sequence;
