import React, { useMemo, useState } from "react";
import { isArrayEquals, addToArray, removeFromArray, _STATUS_CLASSES } from "../../global.js";

import "./BufferDisplay.scss";

const BufferDisplay = ({ buffer, focusedOrigin, sequences }) => {
	const [matched, setMatched] = useState(false);
	const bufferContent = buffer.getByProperty("content");
	const bufferLength = bufferContent.length;

	useMemo(() => {
		if (focusedOrigin) {
			if (!buffer.isFull()) {
				const bufferArray = buffer.list.map((tile) => tile.content);
				const validTile = sequences.some((sequence) => {
					const tile = sequence[bufferLength];
					const sequenceArray = sequence.slice(0, bufferLength).map((tile) => tile.content);
					const isSameBuffer = isArrayEquals(sequenceArray, bufferArray);
					const isSameContent = focusedOrigin.content === tile.content;

					// hack to sync animations. quickly remove and add of class find other way
					if (!tile.disabled && isSameBuffer && isSameContent) {
						const classList = document.getElementById(`display-${bufferLength}`).classList;
						setTimeout(() => classList.remove(_STATUS_CLASSES.focused), 10);
						setTimeout(() => classList.add(_STATUS_CLASSES.focused), 15);
						return true;
					}
					return false;
				});
				setMatched(validTile);
			}
		} else {
			setMatched(false);
		}
	}, [focusedOrigin]);

	return (
		<>
			<div className="buffer-container">
				<ul className="buffer-display">
					{(() => {
						const tiles = [];
						for (let x = 0; x < buffer.maxBuffer; x++) {
							const isCurrentIndex = x === bufferLength && matched;
							console.log(x < bufferLength && !isCurrentIndex);
							tiles.push(
								<li
									key={x}
									id={`display-${x}`}
									className={[
										isCurrentIndex ? _STATUS_CLASSES.focused : "",
										x < bufferLength && !isCurrentIndex ? _STATUS_CLASSES.matched : "",
									].join(" ")}
								>
									<span>
										{isCurrentIndex && focusedOrigin ? focusedOrigin.content : bufferContent[x]}
									</span>
								</li>
							);
						}
						return tiles;
					})()}
				</ul>
				<pre style={{ position: "absolute", bottom: "200px", fontSize: "20px" }}>
					{JSON.stringify(matched, null, 2)}
				</pre>
			</div>
		</>
	);
};

export default BufferDisplay;
