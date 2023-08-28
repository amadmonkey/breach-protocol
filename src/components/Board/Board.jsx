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

const Board = ({
	tiles,
	buffer,
	boardSize,
	boardStatus,
	reset,
	startTimer,
	setBufferUpdate,
	setFocused,
}) => {
	const [axis, setAxis] = useState(new Axis({}));

	const addBuffer = (newTile) => {
		if (newTile.isValid(buffer, axis)) {
			updateFocused(newTile);
			newTile.status = false;
			buffer.add(newTile);
			axis.toggle();

			// set new valid tiles
			tiles.map((tile) => tile.setActive(buffer, axis));
			buffer.getLength() === 1 && startTimer();
			setBufferUpdate();
		} else {
			newTile.clean(_STATUS_CLASSES.focused);
		}
	};

	const updateFocused = (focusedTile) =>
		setFocused(focusedTile?.isValid(buffer, axis) ? focusedTile : null);

	useEffect(() => setAxis(new Axis({})), [buffer]);

	return (
		<Container
			header={{ title: "CODE MATRIX", logo_url: codeMatrixLogo }}
			content={
				<div className="board-container">
					{(() => {
						if (boardStatus) {
							const { success, failed } = boardStatus;
							const total = success + failed;
							return (
								<div
									style={{
										display: "flex",
										flexDirection: "column",
										justifyContent: "space-around",
										gap: "20px",
										height: "400px",
										alignItems: "center",
									}}
								>
									<div>
										<h1 style={{ fontSize: "3em", margin: "20px 0" }}>{`${success}/${total}`}</h1>
									</div>
								</div>
							);
						} else {
							return (
								<ul
									className="board"
									style={{ gridTemplateColumns: `repeat(${boardSize}, 1fr)` }}
									onMouseLeave={() => updateFocused(null)}
								>
									{(() => {
										if (boardStatus) {
											return (
												<div style={{ display: "flex", justifyContent: "space-around" }}>
													<Container
														header={{ title: "SUCESS" }}
														content={<h1>{boardStatus.success}</h1>}
														customClasses={["success"]}
													></Container>
													<Container
														header={{ title: "FAILED" }}
														content={<h1>{boardStatus.failed}</h1>}
														customClasses={["fail"]}
													></Container>
												</div>
											);
										} else {
											return tiles.map((tile) => {
												return (
													<li
														key={tile.id}
														className={tile.className.board.join(" ")}
														onMouseEnter={() => updateFocused(tile)}
														onMouseLeave={() => updateFocused(null)}
														onFocus={() => updateFocused(tile)}
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
											});
										}
									})()}
								</ul>
							);
						}
					})()}
				</div>
			}
			footer={
				<div style={{ textAlign: "right" }}>
					<div className="__footer">
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
					</div>
					<button className="btn reset" onClick={() => reset()}>
						<span>{boardStatus ? "PLAY AGAIN" : "REFRESH"}</span>
					</button>
				</div>
			}
			customClasses={[boardStatus ? (boardStatus.success ? "success" : "fail") : ""]}
		></Container>
	);
};

export default Board;
