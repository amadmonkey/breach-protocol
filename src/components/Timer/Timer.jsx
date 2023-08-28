import React, { useEffect, useState } from "react";

import "./Timer.scss";
import TimerBar from "./TimerBar";

const Timer = ({ timeLimit, started, setStarted }) => {
	const [elapsedTime, setElapsedTime] = useState(0);

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
			<TimerBar
				timeLimit={timeLimit}
				started={started}
				setStarted={() => setStarted()}
				elapsedTime={elapsedTime}
				emitElapsedTime={(elapsedTime) => setElapsedTime(elapsedTime)}
			/>
		</div>
	);
};

export default Timer;
