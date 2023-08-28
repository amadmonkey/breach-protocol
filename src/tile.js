import { rand, removeFromArray, addToArray, _CODES, _AXES, _STATUS_CLASSES } from "./global";

class Tile {
	constructor({ position = null }) {
		const { x, y } = position;
		this.id = `t-${x}${y}`;
		this.content = rand(_CODES);
		this.position = position;
		this.status = true;
		this.className = {
			board: [
				`${x !== 0 ? _STATUS_CLASSES.disabled : ""}`,
				`${x === 0 && y === 0 ? _STATUS_CLASSES.highlighted : ""}`,
				`${x === 0 ? _STATUS_CLASSES.x : ""}`,
			],
			sequence: [],
		};
	}
	isCurrentAxis = (lastPosition, axis) =>
		(lastPosition ? lastPosition[axis.active] : 0) ===
		(axis.active === _AXES.X ? this.position.x : this.position.y);

	isValid = (buffer, axis) =>
		this.isCurrentAxis(buffer.getLastPosition(), axis) && this.status && !buffer.isFull();

	clean = (classes) => {
		this.removeClass(Object.values(classes ?? _STATUS_CLASSES));
		this.addClass(_STATUS_CLASSES.disabled);
	};

	setActive = (buffer, axis) => {
		this.clean();

		if (this.isValid(buffer, axis)) {
			this.removeClass(_STATUS_CLASSES.disabled);
			this.addClass([_STATUS_CLASSES.highlighted, _STATUS_CLASSES[axis.active]]);
		}

		!this.status && this.addClass([_STATUS_CLASSES.selected, _STATUS_CLASSES.disabled]);
	};

	addClass = (classes) => addToArray(this.className.board, classes);
	removeClass = (classes) => removeFromArray(this.className.board, classes);
}

export default Tile;
