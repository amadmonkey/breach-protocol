import React, { useEffect, useRef, useState } from "react";
import { _STATUS_CLASSES } from "../../global.js";

import "./BufferDisplay.scss";

const BufferDisplay = ({ buffer, focused, sequences, updateBufferLength }) => {
	const tileRefs = useRef([]);
	const [matched, setMatched] = useState(false);
	const [showDeleteBuffer, setShowDeleteBuffer] = useState(false);

	const handleBufferUpdate = (isAdd) =>
		updateBufferLength(isAdd ? buffer.maxLength + 1 : buffer.maxLength - 1);

	useEffect(() => {
		setMatched(false);
		if (buffer.isFull()) return;

		const { classList } = tileRefs.current[buffer.getLength()];
		classList.remove(_STATUS_CLASSES.focused);

		if (!focused) return;

		const hasMatch = sequences.filter((sequence) =>
			sequence.match(buffer.getLength(), focused)
		).length;

		// hack to sync animations. quickly remove and re-add class
		const timeoutAddClass =
			hasMatch && setTimeout(() => classList.add(_STATUS_CLASSES.focused), 10);
		setMatched(hasMatch ? focused : false);

		return () => clearTimeout(timeoutAddClass);
	}, [focused]);

	return (
		<div className="buffer-container">
			<ul
				className="buffer-display"
				onMouseEnter={() => setShowDeleteBuffer(true)}
				onMouseLeave={() => setShowDeleteBuffer(false)}
			>
				{(() => {
					const tiles = [];
					for (let x = 0; x < buffer.maxLength; x++) {
						const length = buffer.getLength();
						tiles.push(
							<li
								key={`display-${x}`}
								ref={(elem) => (tileRefs.current[x] = elem)}
								className={[x < length ? _STATUS_CLASSES.matched : "", "display-tile"].join(" ")}
							>
								<span>{x === length && matched ? matched.content : buffer.getContent(x)}</span>
								{showDeleteBuffer && x === buffer.maxLength - 1 && x >= 4 && (
									<button className="delete-buffer" onClick={() => handleBufferUpdate(false)}>
										-
									</button>
								)}
							</li>
						);
					}
					if (buffer.maxLength < 8 && showDeleteBuffer) {
						tiles.push(
							<li className="add-buffer" key="add" onClick={() => handleBufferUpdate(true)}>
								<span>+</span>
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
