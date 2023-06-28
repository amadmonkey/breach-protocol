import React, { useMemo } from "react";
import { addToArray, _STATUS_CLASSES } from "../../global.js";

import SequenceLogo from "../../assets/img/board/sequence-logo.png";
import ft4 from "../../assets/img/board/etc-ft-4.png";
import Container from "../Container/Container";

import "./Sequences.scss";

const Sequences = ({ buffer, focusedOrigin, sequences }) => {
	useMemo(() => {
		if (focusedOrigin) {
			if (!buffer.isFull()) {
				const bufferWithFocused = [
					...buffer.list.map((tile) => tile.content),
					focusedOrigin.content,
				];

				sequences.map((sequence) => {
					sequence;
					sequence.clean(_STATUS_CLASSES.focused);
					const { list, paddingCount } = sequence;
					const isValid = bufferWithFocused
						.slice(paddingCount)
						.every((obj, i) => obj === list[i]?.content);
					if (isValid) {
						addToArray(
							list[buffer.list.length - paddingCount]?.sequenceClassName,
							_STATUS_CLASSES.focused
						);
					}
				});
			}
		}
	}, [buffer, focusedOrigin]);

	useMemo(() => sequences.map((sequence) => sequence.update(buffer)), [buffer]);

	return (
		<Container
			header={{ title: "SEQUENCE REQUIRED TO UPLOAD", logo_url: SequenceLogo }}
			content={
				<div className="sequences-container">
					{sequences.map((sequence, i) => {
						const { list, className, isDone, paddingCount } = sequence;
						return (
							<ul className="sequence" key={i}>
								{(() => {
									const tiles = [];
									tiles.push(
										<li key={`sequence-done-${i}`} className={`sequence-done ${className}`}>
											<span>
												{className.includes(_STATUS_CLASSES.success) ? "INSTALLED" : "FAILED"}
											</span>
										</li>
									);
									for (let x = 0; x < paddingCount; x++) {
										tiles.push(
											<li key={`padding-${x}${i}`}>
												<span>&nbsp;</span>
											</li>
										);
									}
									list.map((tile, i) => {
										const { id, sequenceClassName, content } = tile;
										tiles.push(
											<li
												key={`sequence-${id}${i}`}
												className={
													i === buffer.list.length - paddingCount ? _STATUS_CLASSES.highlighted : ""
												}
											>
												<span
													key={`sequence-${id}${i}`}
													className={[...sequenceClassName].join(" ")}
												>
													{content}
												</span>
											</li>
										);
									});
									// }
									return tiles;
								})()}
							</ul>
						);
					})}
				</div>
			}
			footer={
				<footer className="sequences-container__footer">
					<span>
						CUSTOM GLITCHES ON UI MAY APPEAR, BASED ON THIS ANALYSIS.
						<br />
						DOCUMENT/D/1IIJTZLABKET3JDHXCDQDTCIIHWMIZ8ZZ7VBTDESD900
						<br />
						TYPE: CYBERSPACE
					</span>
					<span>
						<img src={ft4} alt="" />
					</span>
				</footer>
			}
			dark
			styles={{ maxWidth: "800px", width: "100%" }}
		></Container>
	);
};

export default Sequences;
