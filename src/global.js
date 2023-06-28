export const _AXES = { X: "x", Y: "y" };
export const _BUFFER_COUNTS = [4, 5, 6, 7, 8];
export const _CODES = ["1C", "55", "7A", "BD", "E9", "FF"];
export const _STATUS_CLASSES = {
	success: "success",
	failed: "failed",
	disabled: "__disabled",
	focused: "__focused",
	highlighted: "__highlighted",
	matched: "__matched",
	selected: "__selected",
	x: "__x",
	y: "__y",
};

export const rand = (list) => list[Math.floor(Math.random() * list.length)];

export const isTileValid = (lastPosition, tile, axis) =>
	isCurrentAxis(lastPosition, tile.position, axis) && tile.status;

export const addToArray = (location, list) => {
	const toPush = Array.isArray(list) ? list : [list];
	toPush.map((toPushItem) => !location.includes(toPushItem) && location.push(toPushItem));
};

export const removeFromArray = (location, list) => {
	const toRemove = Array.isArray(list) ? list : [list];
	toRemove.map((toRemoveItem) => {
		removeFromArrayByValue(location, toRemoveItem);
	});
};

export const removeFromArrayByValue = (list, value) => {
	const i = list.indexOf(value);
	return i > -1 ? list.splice(i, 1) : false;
};

export const isCurrentAxis = (lastPosition, position, axis) =>
	(lastPosition ? lastPosition[axis.active] : 0) ===
	(axis.active === _AXES.X ? position.x : position.y);

export const getClassListById = (id) => document.getElementById(id)?.classList;

export const isBoolean = (value) => value === true || value === false;
