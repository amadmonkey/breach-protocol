import React, { useEffect, useMemo } from "react";
import { addToArray, _STATUS_CLASSES } from "../../global.js";

import SequenceLogo from "../../assets/img/board/sequence-logo.png";
import ft4 from "../../assets/img/board/etc-ft-4.png";
import Container from "../Container/Container";

import "./Sequences.scss";

const Sequences = ({ buffer, started, focused, sequences, bufferUpdate, callFinished }) => {
	useMemo(() => {
		sequences.map((sequence) => {
			const { list, paddingCount } = sequence;
			sequence.clean([_STATUS_CLASSES.focused, _STATUS_CLASSES.highlighted]);
			if (focused) {
				const bufferWithFocused = [...buffer.list.map((tile) => tile.content), focused.content];
				const isValid = bufferWithFocused
					.slice(paddingCount)
					.every((content, i) => content === list[i]?.content);
				if (isValid) {
					addToArray(
						list[buffer.list.length - paddingCount]?.className.sequence,
						_STATUS_CLASSES.focused
					);
				}
			}
			sequence.update(buffer);
		});
	}, [bufferUpdate, focused]);

	useEffect(() => {
		if (started) {
			const stats = { success: 0, failed: 0 };
			sequences.map((sequence) => {
				switch (sequence.isDone) {
					case _STATUS_CLASSES.success:
						stats.success++;
						break;
					case _STATUS_CLASSES.failed:
						stats.failed++;
						break;
				}
			});
			stats.success + stats.failed === sequences.length && callFinished(stats);
		}
	}, [bufferUpdate]);

	return (
		<Container
			header={{ title: "SEQUENCE REQUIRED TO UPLOAD", logo_url: SequenceLogo }}
			content={
				<div className="sequences-container">
					{sequences.map((sequence, i) => {
						const { list, isDone, className, paddingCount } = sequence;
						return (
							<ul className="sequence" key={i}>
								{(() => {
									const tiles = [];
									// curtains
									tiles.push(
										<li key={`sequence-done-${i}`} className={`sequence-done ${className}`}>
											<span>
												{className.includes(_STATUS_CLASSES.success) ? "INSTALLED" : "FAILED"}
											</span>
										</li>
									);
									// paddings
									for (let x = 0; x < paddingCount; x++) {
										tiles.push(
											<li key={`padding-${x}${i}`}>
												<span>&nbsp;</span>
											</li>
										);
									}
									// data
									if (!isDone) {
										list.map((tile, i) => {
											const { id, className, content } = tile;
											tiles.push(
												<li
													key={`sequence-${id}${i}`}
													className={[...className.sequence].join(" ")}
												>
													<span
														key={`sequence-${id}${i}`}
														className={[...className.sequence].join(" ")}
													>
														{content}
													</span>
												</li>
											);
										});
									}
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
