import { addToArray, removeFromArray, _STATUS_CLASSES } from "./global.js";

class Sequence {
	constructor(list = []) {
		this.list = list;
		this.paddingCount = 0;
		this.isDone = false;
		this.className = [];
	}
	clean = (classList) =>
		classList && this.list.map((tile) => removeFromArray(tile.className.sequence, classList));

	update(buffer = null) {
		if (!this.isDone) {
			const { list, maxLength } = buffer;
			const bufferLength = list.length;
			let matchedCount = 0;

			this.list.map((tile, i) => {
				const { content, className } = tile;

				// check for matched
				if (content === list.slice(this.paddingCount)[i]?.content) {
					addToArray(className.sequence, _STATUS_CLASSES.matched);
					matchedCount++;
				}

				// check for highlighted / active column
				i === bufferLength - this.paddingCount &&
					addToArray(
						this.list[bufferLength - this.paddingCount].className.sequence,
						_STATUS_CLASSES.highlighted
					);
			});

			// if all tiles matched, tag as complete
			if (matchedCount === this.list.length) {
				this.isDone = _STATUS_CLASSES.success;
				addToArray(this.className, _STATUS_CLASSES.success);
			}

			// if remaining buffer length is less than remaining sequence tiles
			if (maxLength - bufferLength < this.list.length - matchedCount && !this.isDone) {
				this.isDone = _STATUS_CLASSES.failed;
				addToArray(this.className, _STATUS_CLASSES.failed);
			}

			// add paddingCount for unmatched
			this.paddingCount = bufferLength - matchedCount;
		}
	}

	match = (currentIndex, matchTo) =>
		!this.isDone && this.list[currentIndex - this.paddingCount].content === matchTo.content;
}

export default Sequence;
