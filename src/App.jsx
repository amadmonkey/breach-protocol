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

import logo from "../src/assets/logo.png";

import "./App.scss";

// TODO:
// 1. add instructions
// 2. add diversions

function App() {
	const [tiles, setTiles] = useState([]);
	const [buffer, setBuffer] = useState(new Buffer({}));
	const [started, setStarted] = useState(null); // null: new game, true: timer start, false: game end
	const [focused, setFocused] = useState({});
	const [boardSize, setBoardSize] = useState(5);
	const [boardStatus, setBoardStatus] = useState(null);
	const [timeLimit, setTimeLimit] = useState(8);
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

	const generateSequence = (tiles) => {
		const sequenceList = [];
		const createSequenceLength = () => Math.floor(Math.random() * (4 - 2 + 1) + 2);

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

	const showResults = (stats) => {
		setStarted(false);
		setBoardStatus(stats);
	};

	const updateBufferLength = (newLength) => {
		setStarted(false);
		switch (newLength) {
			default:
			case 4:
			case 5:
				setBoardSize(5);
				setTimeLimit(8);
				break;
			case 6:
				setBoardSize(6);
				setTimeLimit(11);
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
		setStarted(null);
		setBoardStatus(null);
		initializeBoard().then((tiles) => {
			generateSequence(tiles);
		});
	}, [buffer]);

	return (
		<div className="main">
			<header className="main-header grid">
				<div>
					<h1>BREACH PROTOCOL</h1>
				</div>
				<div>
					<h1>BUFFER</h1>
				</div>
			</header>
			<div className="header grid">
				<div>
					<Timer timeLimit={timeLimit} started={started} setStarted={() => setStarted(false)} />
				</div>
				<div className="buffer-float">
					<BufferDisplay
						buffer={buffer}
						focused={focused}
						sequences={sequences}
						updateBufferLength={(newLength) => updateBufferLength(newLength)}
						timeLimit={timeLimit}
						started={started}
						setStarted={() => setStarted(false)}
					/>
				</div>
			</div>
			<div className="body grid">
				<div>
					<Board
						tiles={tiles}
						buffer={buffer}
						boardSize={boardSize}
						boardStatus={boardStatus}
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
						showResults={(stats) => showResults(stats)}
					/>
				</div>
			</div>
			<footer className="main-footer">
				<p>
					This site is not affiliated with
					<a href="https://www.cdprojektred.com/en" target="_blank">
						<img
							src="https://www.cdprojektred.com/build/images/img/logo-black-5c590770.svg"
							alt="CD PROJEKT RED"
							title="CD PROJEKT RED"
						/>
					</a>
					or
					<a href="https://www.cyberpunk.net/ph/en/" target="_blank">
						<img
							src="https://www.cyberpunk.net/build/images/home8/logo-franchise-black-en@1x-567991b0.png"
							alt="CYBERPUNK 2077"
							title="CYBERPUNK 2077"
						/>
					</a>
				</p>
			</footer>
		</div>
	);
}

export default App;
