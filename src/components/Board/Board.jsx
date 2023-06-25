import React, { useState } from "react";
import { isCurrentAxis, _AXES, _STATUS_CLASSES } from "../../global.js";

import Container from "../Container/Container.jsx";
import codeMatrixLogo from "../../assets/img/board/code-matrix-logo.png";
import ft1 from "../../assets/img/board/etc-ft-1.png";
import ft2 from "../../assets/img/board/etc-ft-2.png";
import ft3 from "../../assets/img/board/etc-ft-3.png";
import ft4 from "../../assets/img/board/etc-ft-4.png";

import "./Board.scss";

const Board = ({ boardSize, tiles, buffer, addBuffer, setFocusedOrigin }) => {
	const [axis, setAxis] = useState({ active: _AXES.X, inactive: _AXES.Y });

	const handleAddBuffer = (tileToAdd) => {
		if (buffer.getLength() < buffer.maxBuffer) {
			const hasOverflow = false;
			const newAxis = { active: axis.inactive, inactive: axis.active };

			setAxis(newAxis);
			addBuffer(tileToAdd);

			tiles.map((tile) => {
				// clean tile classes
				cleanTile(tile);

				// if tile is valid remove disabled and add highlight
				if (isCurrentAxis(tileToAdd.position, newAxis, tile.position)) {
					// enable tile
					tileToAdd.id !== tile.id && removeClass(tile, _STATUS_CLASSES.disabled);
					addClass(tile, _STATUS_CLASSES.highlighted);

					// add psuedo element for overflow
					if (!hasOverflow) {
						addClass(tile, [_STATUS_CLASSES.first, _STATUS_CLASSES[axis.inactive]]);
						Object.assign(hasOverflow, true);
					}
				}

				// if tile has already been selected
				tile.disabled && addClass(tile, [_STATUS_CLASSES.selected, _STATUS_CLASSES.disabled]);
			});
		} else {
			alert("maxBuffer");
		}
	};

	const updateFocusedOrigin = (focusedTile) => {
		setFocusedOrigin(focusedTile);
		const { position } = focusedTile;
		let first = null;
		tiles.map((tile) => {
			removeFocusedOrigin(tile);
			const ifTileNotFocused = tile.position !== position;
			const ifTileHasSameInactiveAxisAsFocused =
				position[axis.inactive] === tile.position[axis.inactive];
			if (ifTileNotFocused && ifTileHasSameInactiveAxisAsFocused) {
				addClass(tile, _STATUS_CLASSES.next);

				if (!first) {
					first = tile;
				}
			}
		});
		// add psuedo element for overflow
		first &&
			[_STATUS_CLASSES.first, _STATUS_CLASSES[axis.active]].map((className) =>
				addClass(first, className)
			);
	};

	const removeFocusedOrigin = (tile) => {
		if (!tile.className.includes(_STATUS_CLASSES.highlighted)) {
			removeClass(tile, [
				_STATUS_CLASSES.next,
				_STATUS_CLASSES.first,
				_STATUS_CLASSES.last,
				_STATUS_CLASSES.x,
				_STATUS_CLASSES.y,
			]);
		}
	};

	const addClass = (tile, classesToAdd) => {
		const className = Array.isArray(classesToAdd) ? classesToAdd : [classesToAdd];
		className.map(
			(classToAdd) => !tile.className.includes(classToAdd) && tile.className.push(classToAdd)
		);
	};

	const removeClass = (tile, classesToRemove) => {
		const className = Array.isArray(classesToRemove) ? classesToRemove : [classesToRemove];
		className.map((classToRemove) => {
			const classList = tile.className;
			const index = classList.indexOf(classToRemove);
			index > 1 && classList.splice(index, 1);
		});
	};

	const cleanTile = (tile) => {
		[
			_STATUS_CLASSES.highlighted,
			_STATUS_CLASSES.disabled,
			_STATUS_CLASSES.next,
			_STATUS_CLASSES.first,
			_STATUS_CLASSES.last,
			_STATUS_CLASSES.x,
			_STATUS_CLASSES.y,
		].map((classToClean) => {
			const classList = tile.className;
			const index = classList.indexOf(classToClean);
			index > -1 && classList.splice(index, 1);
		});
		!tile.className.includes(_STATUS_CLASSES.disabled) &&
			tile.className.push(_STATUS_CLASSES.disabled);
	};

	return (
		<Container
			header={{ title: "CODE MATRIX", logo_url: codeMatrixLogo }}
			content={
				<div className="board-container">
					<ul className="board" style={{ gridTemplateColumns: `repeat(${boardSize}, 1fr)` }}>
						{tiles.map((tile) => {
							const isValid =
								isCurrentAxis(buffer.getLastPosition(), axis, tile.position) && !tile.disabled;
							return (
								<li
									key={tile.id}
									id={tile.id}
									className={tile.className.join(" ")}
									onMouseEnter={() =>
										isValid ? updateFocusedOrigin(tile) : removeFocusedOrigin(tile)
									}
									onFocus={() => isValid && updateFocusedOrigin(tile)}
									onClick={() => isValid && !tile.disabled && handleAddBuffer(tile)}
								>
									<button>
										{tile.disabled ? (
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
