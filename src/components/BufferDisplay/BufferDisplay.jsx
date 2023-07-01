import React, { useEffect, useRef, useState } from "react";
import { _STATUS_CLASSES } from "../../global.js";

import "./BufferDisplay.scss";

const BufferDisplay = ({ buffer, focused, sequences, updateBufferLength }) => {
	const [matched, setMatched] = useState(false);
	const [showDeleteBuffer, setShowDeleteBuffer] = useState(false);
	const tileRefs = useRef([]);

	const handleBufferUpdate = (type) => {
		type === _STATUS_CLASSES.add ? buffer.maxLength++ : buffer.maxLength--;
		updateBufferLength(buffer.maxLength);
	};

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
								<span>{x === length ? matched.content : buffer.getContent(x)}</span>
								{showDeleteBuffer && x === buffer.maxLength - 1 && x >= 4 && (
									<button
										className="delete-buffer"
										onClick={() => handleBufferUpdate(_STATUS_CLASSES.subtract)}
									>
										-
									</button>
								)}
							</li>
						);
					}
					if (buffer.maxLength < 8 && showDeleteBuffer) {
						tiles.push(
							<li
								className="add-buffer"
								key="add"
								onClick={() => handleBufferUpdate(_STATUS_CLASSES.add)}
							>
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
