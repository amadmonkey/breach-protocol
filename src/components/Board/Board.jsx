import React, { useEffect, useState } from "react";
import { _AXES, _CODES, _STATUS_CLASSES } from "../../global.js";

import Axis from "../../axis.js";

import Container from "../Container/Container.jsx";
import codeMatrixLogo from "../../assets/img/board/code-matrix-logo.png";
import ft1 from "../../assets/img/board/etc-ft-1.png";
import ft2 from "../../assets/img/board/etc-ft-2.png";
import ft3 from "../../assets/img/board/etc-ft-3.png";
import ft4 from "../../assets/img/board/etc-ft-4.png";

import "./Board.scss";

const Board = ({ tiles, buffer, boardSize, startTimer, setFocusedOrigin }) => {
	const [axis, setAxis] = useState(new Axis({}));

	const addBuffer = (newTile) => {
		if (newTile.isValid(buffer, axis)) {
			newTile.status = false;
			buffer.add(newTile);
			axis.toggle();

			// set new valid tiles
			tiles.map((tile) => tile.setActive(buffer, axis));
			buffer.getLength() === 1 && startTimer();
			setFocusedOrigin(null);
		} else {
			newTile.clean(_STATUS_CLASSES.focused);
		}
	};

	const updateFocusedOrigin = (focusedTile) =>
		setFocusedOrigin(focusedTile?.isValid(buffer, axis) ? focusedTile : null);

	useEffect(() => setAxis(new Axis({})), [buffer]);

	return (
		<Container
			header={{ title: "CODE MATRIX", logo_url: codeMatrixLogo }}
			content={
				<div className="board-container">
					<ul
						className="board"
						style={{ gridTemplateColumns: `repeat(${boardSize}, 1fr)` }}
						onMouseLeave={() => updateFocusedOrigin(null)}
					>
						{tiles.map((tile) => {
							return (
								<li
									key={tile.id}
									className={tile.className.board.join(" ")}
									onMouseEnter={() => updateFocusedOrigin(tile)}
									onMouseLeave={() => updateFocusedOrigin(null)}
									onFocus={() => updateFocusedOrigin(tile)}
									onClick={() => addBuffer(tile)}
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
