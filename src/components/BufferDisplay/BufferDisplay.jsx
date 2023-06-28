import React, { useMemo } from "react";
import { getClassListById, _STATUS_CLASSES } from "../../global.js";

import "./BufferDisplay.scss";

const BufferDisplay = ({ buffer, focusedOrigin, sequences }) => {
	// const [matched, setMatched] = useState(false);
	let matched = false;
	const setMatched = (value) => (matched = value);
	const bufferContent = buffer.getByProperty("content");
	const bufferLength = bufferContent.length;

	useMemo(() => {
		let timeoutAddClass;
		const classList = getClassListById(`display-${bufferLength}`);
		classList?.remove(_STATUS_CLASSES.focused);
		if (focusedOrigin) {
			const isValid = sequences.some((sequence) => {
				const { list, paddingCount, isDone } = sequence;
				if (!isDone) {
					const { status, content } = list[bufferLength - paddingCount];
					return status && focusedOrigin.content === content;
				}
			});
			// hack to sync animations. quickly remove and re-add class find other way
			timeoutAddClass =
				isValid && classList && setTimeout(() => classList.add(_STATUS_CLASSES.focused), 30);
			setMatched(isValid);
		}
		return () => clearTimeout(timeoutAddClass);
	}, [focusedOrigin]);

	return (
		<>
			<div className="buffer-container">
				<ul className="buffer-display">
					{(() => {
						const tiles = [];
						for (let x = 0; x < buffer.maxBuffer; x++) {
							const isCurrentIndex = x === bufferLength && matched;
							tiles.push(
								<li
									id={`display-${x}`}
									key={`display-${x}`}
									className={[
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
			</div>
		</>
	);
};

export default BufferDisplay;
