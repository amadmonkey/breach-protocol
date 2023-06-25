import React, { useEffect, useState } from "react";
import { _STATUS_CLASSES } from "../../global.js";

import "./BufferDisplay.scss";

const BufferDisplay = ({ buffer, focusedOrigin, sequences }) => {
	const [matched, setMatched] = useState(false);

	useEffect(() => {
		if (!buffer.isFull) {
			const bufferLength = buffer.getLength();
			const validTile = sequences.some((sequence) => {
				const sequenceArray = sequence.slice(0, bufferLength).map((tile) => tile.content);
				const bufferArray = buffer.list.map((tile) => tile.content);

				const isSameBuffer = sequenceArray.length
					? sequenceArray.map((obj, i) => obj === bufferArray[i])[0]
					: true;

				const tile = sequence[bufferLength];
				return !tile.disabled && isSameBuffer && focusedOrigin.content === tile.content;
			});
			setMatched(validTile ? focusedOrigin.content : false);
		}
	}, [focusedOrigin]);

	return (
		<>
			<div className="buffer-container">
				<ul className="buffer-display">
					{(() => {
						const tiles = [];
						for (let x = 0; x < buffer.maxBuffer; x++) {
							const isCurrentIndex = x === buffer.getLength() && matched;
							tiles.push(
								<li key={x} className={isCurrentIndex ? "__matched" : ""}>
									<span>{isCurrentIndex ? matched : buffer.getByProperty("content")[x]}</span>
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
