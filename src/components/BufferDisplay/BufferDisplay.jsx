import React, { useEffect, useRef, useState } from "react";
import { _STATUS_CLASSES } from "../../global.js";

import "./BufferDisplay.scss";
import TimerBar from "../Timer/TimerBar.jsx";

const BufferDisplay = ({
	buffer,
	focused,
	sequences,
	updateBufferLength,
	timeLimit,
	started,
	setStarted,
}) => {
	const tileRefs = useRef([]);
	const bufferContainer = useRef();
	const [matched, setMatched] = useState(false);
	const [dragging, setDragging] = useState(false);
	const [dragBufferCount, setDragBufferCount] = useState(buffer.maxLength);

	const handleBufferUpdate = (newLength) => {
		updateBufferLength(newLength);
		bufferContainer.current.style.width = "unset";
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

	const getContainerWidth = () => {
		const clientWidth = bufferContainer.current.clientWidth;
		const { paddingLeft, paddingRight } = getComputedStyle(bufferContainer.current);
		return clientWidth - (parseFloat(paddingLeft) + parseFloat(paddingRight));
	};

	const onDragStart = (e) => {
		const width = getContainerWidth();
		setDragging({
			width: width < 190 ? 190 : width,
			right: bufferContainer.current.getBoundingClientRect().right,
		});
		e.dataTransfer.setData("text", e.target.id);
		e.dataTransfer.effectAllowed = "move";
	};

	const onDragOver = (e) => {
		if (dragging) {
			const { width, right } = dragging;
			const toAdd = Math.floor(e.pageX - right);
			let newWidth = width + toAdd;
			newWidth += 1 * (e.target.classList.contains("right") ? -25 : 25);
			bufferContainer.current.style.width = `${newWidth}px`;
			const newBufferCount = Math.ceil(getContainerWidth() / 50);
			setDragBufferCount(newBufferCount < 4 ? 4 : newBufferCount);
		}
	};

	const onDragEnd = () => {
		handleBufferUpdate(dragBufferCount);
		setDragging(false);
	};

	return (
		<div className="buffer-container">
			<ul className="buffer-display" ref={bufferContainer}>
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
							</li>
						);
					}
					if (buffer.maxLength > 4) {
						tiles.push(
							<li className="buffer-manage __reduce" key="reduce">
								<button
									onClick={() => handleBufferUpdate(buffer.maxLength - 1)}
									draggable
									onDragStart={(e) => onDragStart(e)}
									onDragOver={(e) => onDragOver(e)}
									onDragEnd={(e) => onDragEnd(e)}
								>
									<span className="arrow left"></span>
									<span className="sr-only">Reduce Buffer Length</span>
								</button>
							</li>
						);
					}
					if (buffer.maxLength < 8) {
						tiles.push(
							<li className="buffer-manage __add" key="add">
								<button
									onClick={() => handleBufferUpdate(buffer.maxLength + 1)}
									draggable={true}
									onDragStart={(e) => onDragStart(e)}
									onDragOver={(e) => onDragOver(e)}
									onDragEnd={(e) => onDragEnd(e)}
								>
									<span className="arrow right"></span>
									<span className="sr-only">Increase Buffer Length</span>
								</button>
							</li>
						);
					}
					return tiles;
				})()}
			</ul>
			<TimerBar timeLimit={timeLimit} started={started} setStarted={() => setStarted()} />
		</div>
	);
};

export default BufferDisplay;
