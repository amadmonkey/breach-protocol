import React, { useEffect, useState } from "react";

import "./Timer.scss";

const Timer = ({ timeLimit, started, setStarted }) => {
	const [percentage, setPercentage] = useState(100);
	const [elapsedTime, setElapsedTime] = useState(0);

	useEffect(() => {
		let intervalCountdown;
		if (started) {
			const startTime = Date.now() - elapsedTime;
			intervalCountdown = setInterval(() => {
				const time = (Date.now() - startTime) / 1000;
				setElapsedTime(timeLimit - time);
				setPercentage(percentage - Math.floor((time / timeLimit) * 100));
				if (time >= timeLimit) {
					clearInterval(intervalCountdown);
					setStarted();
				}
			}, 10);
		} else {
			setElapsedTime(0);
			setPercentage(elapsedTime);
		}
		return () => clearInterval(intervalCountdown);
	}, [started]);

	return (
		<div className="time-limit">
			<header>
				<span>
					ONLY CC35 CERTIFIED AND DHSF 5TH CLASS OFFICERS ARE ALLOWED TO MANIPULATE, ACCESS, OR
					DISABLE THIS DEVICE.
				</span>
			</header>
			<div className="content">
				<h1>BREACH TIME REMAINING</h1>
				<div className="timer">
					{(elapsedTime ? (elapsedTime < 0 ? 0 : elapsedTime) : timeLimit).toFixed(2)}
				</div>
			</div>
			<div
				className={`progress-bar ${started ? "started" : ""}`}
				style={{ "--progress_percentage": `${started ? timeLimit : 0.2}s` }}
			>
				<span className="sr-only">{`${percentage}%`}</span>
			</div>
		</div>
	);
};

export default Timer;
