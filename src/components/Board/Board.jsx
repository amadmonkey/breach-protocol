import React, { useState } from "react";
import {
	addToArray,
	isTileValid,
	removeFromArray,
	_AXES,
	_CODES,
	_STATUS_CLASSES,
} from "../../global.js";

import Container from "../Container/Container.jsx";
import codeMatrixLogo from "../../assets/img/board/code-matrix-logo.png";
import ft1 from "../../assets/img/board/etc-ft-1.png";
import ft2 from "../../assets/img/board/etc-ft-2.png";
import ft3 from "../../assets/img/board/etc-ft-3.png";
import ft4 from "../../assets/img/board/etc-ft-4.png";

import "./Board.scss";

const Board = ({ tiles, buffer, boardSize, updateBuffer, setFocusedOrigin }) => {
	const [axis, setAxis] = useState({ active: _AXES.X, inactive: _AXES.Y });

	const updateFocusedOrigin = (focusedTile) => setFocusedOrigin(focusedTile);
	const addClass = (tile, classesToAdd) => addToArray(tile.className, classesToAdd);
	const removeClass = (tile, classesToRemove) => removeFromArray(tile.className, classesToRemove);

	const cleanTile = (tile) => {
		removeClass(tile, Object.values(_STATUS_CLASSES));
		addClass(tile, _STATUS_CLASSES.disabled);
	};

	const handleAddBuffer = (newBuffer) => {
		if (!buffer.isFull()) {
			const newAxis = { active: axis.inactive, inactive: axis.active };
			newBuffer.status = false;
			tiles.map((tile) => {
				cleanTile(tile);
				if (isTileValid(newBuffer.position, tile, newAxis)) {
					removeClass(tile, _STATUS_CLASSES.disabled);
					addClass(tile, [_STATUS_CLASSES.highlighted, _STATUS_CLASSES[axis.inactive]]);
				}
				!tile.status && addClass(tile, [_STATUS_CLASSES.selected, _STATUS_CLASSES.disabled]);
			});
			setAxis(newAxis);
			buffer.add(newBuffer);
			updateBuffer(buffer);
		}
	};

	return (
		<Container
			header={{ title: "CODE MATRIX", logo_url: codeMatrixLogo }}
			content={
				<div className="board-container">
					<ul
						className="board"
						style={{ gridTemplateColumns: `repeat(${buffer.boardSize}, 1fr)` }}
						onMouseLeave={() => updateFocusedOrigin(null)}
					>
						{tiles.map((tile) => {
							const isValid = isTileValid(buffer.getLastPosition(), tile, axis);
							return (
								<li
									key={tile.id}
									className={tile.className.join(" ")}
									onMouseEnter={() => updateFocusedOrigin(isValid ? tile : null)}
									onFocus={() => isValid && updateFocusedOrigin(tile)}
									onClick={() => isValid && handleAddBuffer(tile)}
								>
									<button>
										{!tile.status ? (
											<>
												<span>[</span>
												<span>]</span>
											</>
										) : (
											tile.content
										)}
									</button>
								</li>
							);
						})}
					</ul>
				</div>
			}
			footer={
				<footer className="__footer">
					<span>
						<img src={ft1} alt="" />
					</span>
					<span>
						<img src={ft2} alt="" />
					</span>
					<span>
						<img src={ft3} alt="" />
					</span>
					<span>
						<img src={ft4} alt="" />
					</span>
				</footer>
			}
			styles={{ width: "600px" }}
		></Container>
	);
};

export default Board;
