import React, { useEffect, useState } from "react";
import { _STATUS_CLASSES } from "../../global.js";

import SequenceLogo from "../../assets/img/board/sequence-logo.png";
import ft4 from "../../assets/img/board/etc-ft-4.png";
import Container from "../Container/Container";

import "./Sequences.scss";

const Sequences = ({ buffer, focusedOrigin, sequences }) => {
	const [withClasses, setWithClasses] = useState(sequences);

	useEffect(() => {
		// console.log(sequences);
		// setWithClasses(sequences);
	}, [focusedOrigin]);

	return (
		<Container
			header={{ title: "SEQUENCE REQUIRED TO UPLOAD", logo_url: SequenceLogo }}
			content={
				<div className="sequences-container">
					{sequences.map((sequence, i) => {
						return (
							<ul className="sequence" key={i}>
								{sequence.map((tile, i) => {
									return (
										<li
											key={`sequence-${tile.id}`}
											id={`sequence-${tile.id}`}
											className={buffer.getLength() === i ? _STATUS_CLASSES.highlighted : ""}
										>
											<span>{tile.content}</span>
										</li>
									);
								})}
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
