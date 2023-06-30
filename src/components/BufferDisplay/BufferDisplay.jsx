import React, { useEffect, useRef, useState } from "react";
import { _STATUS_CLASSES } from "../../global.js";

import "./BufferDisplay.scss";

const BufferDisplay = ({ buffer, focusedOrigin, sequences }) => {
	const [focused, setFocused] = useState(false);
	const tileRefs = useRef([]);

	useEffect(() => {
		if (buffer.isFull()) return;

		const { classList } = tileRefs.current[buffer.getLength()];
		classList.remove(_STATUS_CLASSES.focused);

		if (!focusedOrigin) return;

		const hasMatch = sequences.some((sequence) =>
			sequence.match(buffer.getLength(), focusedOrigin)
		);

		// hack to sync animations. quickly remove and re-add class
		const timeoutAddClass =
			hasMatch && setTimeout(() => classList.add(_STATUS_CLASSES.focused), 30);

		setFocused(hasMatch);

		return () => clearTimeout(timeoutAddClass);
	}, [focusedOrigin]);

	return (
		<div className="buffer-container">
			<ul className="buffer-display">
				{(() => {
					const tiles = [];
					for (let x = 0; x < buffer.maxLength; x++) {
						const length = buffer.getLength();
						const content = x === length && focused ? focusedOrigin?.content : buffer.getContent(x);
						tiles.push(
							<li
								key={`display-${x}`}
								ref={(elem) => (tileRefs.current[x] = elem)}
								className={x < length ? _STATUS_CLASSES.matched : ""}
							>
								<span>{content}</span>
							</li>
						);
					}
					return tiles;
				})()}
			</ul>
		</div>
	);
};

export default BufferDisplay;
