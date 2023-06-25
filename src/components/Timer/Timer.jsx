import React from "react";

import "./Timer.scss";

const Timer = () => {
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
				<div className="timer">70.50</div>
			</div>
			<div className="progress-bar">
				<span className="sr-only">100%</span>
			</div>
		</div>
	);
};

export default Timer;
