import { useEffect, useState } from "react";
import { rand, addToArray, _STATUS_CLASSES, _CODES, _AXES } from "./global.js";
import Axis from "./axis.js";
import Tile from "./tile.js";
import Buffer from "./buffer.js";
import Sequence from "./sequence.js";
import Board from "./components/Board/Board";
import Timer from "./components/Timer/Timer.jsx";
import Sequences from "./components/Sequences/Sequences.jsx";
import BufferDisplay from "./components/BufferDisplay/BufferDisplay.jsx";

import "./App.scss";

function App() {
	const [tiles, setTiles] = useState([]);
	const [buffer, setBuffer] = useState(new Buffer({}));
	const [started, setStarted] = useState(false);
	const [focused, setFocused] = useState({});
	const [boardSize, setBoardSize] = useState(5);
	const [timeLimit, setTimeLimit] = useState(11);
	const [sequences, setSequences] = useState([]);
	const [hasDiversion, setHasDiversion] = useState(false);
	const [bufferUpdate, setBufferUpdate] = useState(0);

	const initializeBoard = async () => {
		const tiles = [];
		for (let x = 0; x < boardSize; x++) {
			for (let y = 0; y < boardSize; y++) {
				addToArray(tiles, new Tile({ status: true, position: { x, y } }));
			}
		}
		setTiles(tiles);
		return tiles;
	};

	const createSequenceBuffer = (tiles, maxLength) => {
		const tempAxis = new Axis({});
		const tempBuffer = new Buffer({ maxLength });
		for (let x = 0; x < tempBuffer.maxLength; x++) {
			const validTiles = tiles.filter((tile) => tile.isValid(tempBuffer, tempAxis)); // get valid tiles
			const randomTile = rand(validTiles); // select a tile randomly from the valid tiles
			randomTile.status = false;
			tempBuffer.add(randomTile);
			tempAxis.toggle();
		}
		return tempBuffer.list;
	};

	const createSequenceLength = () => Math.floor(Math.random() * (4 - 2 + 1) + 2);

	const generateSequence = (tiles) => {
		const sequenceList = [];

		// create continuous sequence then divide with connections
		const continuousList = createSequenceBuffer(tiles, buffer.maxLength);
		while (continuousList.length) {
			const newSequence = continuousList.splice(0, createSequenceLength());
			addToArray(newSequence[0].className.sequence, _STATUS_CLASSES.highlighted);
			continuousList.length &&
				continuousList.unshift(JSON.parse(JSON.stringify(newSequence[newSequence.length - 1])));
			sequenceList.push(new Sequence(newSequence));
		}

		// randomly add diversion
		if (hasDiversion) {
			if (Math.random() < 0.5) {
				const diversionList = createSequenceBuffer(tiles, createSequenceLength());
				addToArray(diversionList[0].className.sequence, _STATUS_CLASSES.highlighted);
				sequenceList.push(new Sequence(diversionList));
			}
		}

		// push to newSequence into the sequenceList
		setSequences(sequenceList.sort((a, b) => a.list.length - b.list.length));
		tiles.map((tile) => (tile.status = true));
	};

	const finished = (data) => {
		setStarted(false);
		switch (data.type) {
			case "timer":
				alert("done choom");
				break;
			case "sequence":
				alert(JSON.stringify(data.stats));
				break;
		}
	};

	const updateBufferLength = (newLength) => {
		setStarted(false);
		switch (newLength) {
			default:
			case 4:
			case 5:
				setBoardSize(5);
				setTimeLimit(11);
				break;
			case 6:
				setBoardSize(6);
				setTimeLimit(14);
				break;
			case 7:
			case 8:
				setBoardSize(7);
				setTimeLimit(14);
				break;
		}
		setBuffer(new Buffer({ maxLength: newLength }));
	};

	useEffect(() => {
		initializeBoard().then((tiles) => {
			generateSequence(tiles);
		});
	}, [buffer]);

	return (
		<div className="main">
			<header className="main-header grid">
				<div></div>
				<div>
					<h1>BUFFER</h1>
				</div>
			</header>
			<div className="header grid">
				<div>
					<Timer
						timeLimit={timeLimit}
						started={started}
						callFinished={() => finished({ type: "timer" })}
					/>
				</div>
				<div>
					<BufferDisplay
						buffer={buffer}
						focused={focused}
						sequences={sequences}
						updateBufferLength={(newLength) => updateBufferLength(newLength)}
					/>
				</div>
			</div>
			<div className="body grid">
				<div>
					<Board
						tiles={tiles}
						buffer={buffer}
						started={started}
						boardSize={boardSize}
						reset={() => setBuffer(new Buffer({ maxLength: buffer.maxLength }))}
						startTimer={() => !started && setStarted(true)}
						setBufferUpdate={() => setBufferUpdate(bufferUpdate + 1)}
						setFocused={(focused) => setFocused(focused)}
					/>
				</div>
				<div>
					<Sequences
						buffer={buffer}
						started={started}
						focused={focused}
						sequences={sequences}
						bufferUpdate={bufferUpdate}
						callFinished={(stats) => finished({ type: "sequence", stats })}
					/>
				</div>
			</div>
			<footer className="main-footer">
				<p>
					DISCLAIMER: This site is not affiliated with{" "}
					<a href="https://www.cdprojektred.com/en"> CD PROJEKT RED</a> or{" "}
					<a href="https://www.cyberpunk.net/ph/en/">CYBERPUNK 2077</a>.
				</p>
			</footer>
		</div>
	);
}

export default App;
