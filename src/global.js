export const _AXES = { X: "x", Y: "y" }
export const _BUFFER_COUNTS = [4, 5, 6, 7, 8];
export const _CODES = ["1C", "E9", "BD", "55"];
export const _STATUS_CLASSES = {
    disabled: "__disabled",
    first: "__first",
    highlighted: "__highlighted",
    last: "__last",
    matched: "__matched",
    next: "__next",
    selected: "__selected",
    x: "__x",
    y: "__y",
};

export const rand = (list) => list[Math.floor(Math.random() * list.length)]

export const isCurrentAxis = (lastPosition, axis, position) =>
    (lastPosition ? lastPosition[axis.active] : 0) ===
    (axis.active === _AXES.X ? position.x : position.y);
