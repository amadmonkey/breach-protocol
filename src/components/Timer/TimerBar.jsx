import React, { useEffect, useState } from "react";

import "./TimerBar.scss";

const TimerBar = ({ timeLimit, started, setStarted, elapsedTime, emitElapsedTime }) => {
	const [percentage, setPercentage] = useState(100);

	useEffect(() => {
		let intervalCountdown;
		if (started) {
			const startTime = Date.now() - elapsedTime;
			intervalCountdown = setInterval(() => {
				const time = (Date.now() - startTime) / 1000;
				elapsedTime && emitElapsedTime(timeLimit - time);
				setPercentage(percentage - Math.floor((time / timeLimit) * 100));
				if (time >= timeLimit) {
					clearInterval(intervalCountdown);
					setStarted();
				}
			}, 10);
		} else {
			elapsedTime && emitElapsedTime(0);
			setPercentage(elapsedTime);
		}
		return () => clearInterval(intervalCountdown);
	}, [started]);

	return (
		<div
			className={`progress-bar ${started ? "started" : ""}`}
			style={{ "--progress_percentage": `${started ? timeLimit : 0.2}s` }}
		>
			<span className="sr-only">{`${percentage}%`}</span>
		</div>
	);
};

export default TimerBar;
