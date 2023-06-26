export const _AXES = { X: "x", Y: "y" }
export const _BUFFER_COUNTS = [4, 5, 6, 7, 8];
export const _CODES = ["1C", "E9", "BD", "55"];
export const _STATUS_CLASSES = {
    disabled: "__disabled",
    focused: "__focused",
    highlighted: "__highlighted",
    matched: "__matched",
    selected: "__selected",
    x: "__x",
    y: "__y",
};

export const rand = (list) => list[Math.floor(Math.random() * list.length)];

export const isArrayEquals = (a1, a2) => a1.every((obj, i) => obj === a2[i]);

export const isTileValid = (lastPosition, tile, axis) => isCurrentAxis(lastPosition, tile.position, axis) && !tile.disabled

export const addToArray = (location, list) => {
    const toPush = Array.isArray(list) ? list : [list];
    toPush.map(
        (toPushItem) => !location.includes(toPushItem) && location.push(toPushItem)
    );
};

export const removeFromArray = (location, list) => {
    const toRemove = Array.isArray(list) ? list : [list];
    toRemove.map((toRemoveItem) => {
        removeFromArrayByValue(location, toRemoveItem)
    })
}

export const removeFromArrayByValue = (list, value) => {
    const i = list.indexOf(value);
    return i > -1 ? list.splice(i, 1) : false;
};

export const isCurrentAxis = (lastPosition, position, axis) =>
    (lastPosition ? lastPosition[axis.active] : 0) ===
    (axis.active === _AXES.X ? position.x : position.y);
