import { useEffect, useState } from "react";
import { rand, addToArray, _STATUS_CLASSES, _CODES, _AXES } from "./global.js";
import Axis from "./axis.js";
import Buffer from "./buffer.js";
import Sequence from "./sequence.js";
import Tile from "./tile.js";
import Board from "./components/Board/Board";
import BufferDisplay from "./components/BufferDisplay/BufferDisplay.jsx";
import Sequences from "./components/Sequences/Sequences.jsx";
import Timer from "./components/Timer/Timer.jsx";

import "./App.scss";

function App() {
	const [tiles, setTiles] = useState([]);
	const [buffer, setBuffer] = useState(new Buffer({}));
	const [boardSize, setBoardSize] = useState(5);
	const [timeLimit, setTimeLimit] = useState(11);
	const [sequences, setSequences] = useState([]);
	const [started, setStarted] = useState(false);
	const [focusedOrigin, setFocusedOrigin] = useState({});

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

	const generateSequence = (tiles) => {
		const sequenceList = [];
		const tempAxis = new Axis({});
		const tempBuffer = new Buffer({});
		for (let x = 0; x < tempBuffer.maxLength; x++) {
			const validTiles = tiles.filter((tile) => tile.isValid(tempBuffer, tempAxis)); // get valid tiles
			const randomTile = rand(validTiles); // select a tile randomly from the valid tiles
			randomTile.status = false;
			tempBuffer.add(randomTile);
			tempAxis.toggle();
		}

		// divide sequence with connections
		const { list } = Object.assign({}, tempBuffer);
		while (list.length) {
			// random sequence length between 2 - 4
			const maxSequenceLength = Math.floor(Math.random() * (4 - 2 + 1) + 2);
			const newSequence = list.splice(0, maxSequenceLength);
			newSequence[0].className.sequence = [_STATUS_CLASSES.highlighted];
			// push back last tile so they have connection
			list.length && list.unshift(JSON.parse(JSON.stringify(newSequence[newSequence.length - 1])));
			sequenceList.push(new Sequence(newSequence));
		}

		// push to newSequence into the sequenceList
		setSequences(sequenceList.sort((a, b) => a.list.length - b.list.length));
		tiles.map((tile) => (tile.status = true));
	};

	useEffect(() => {
		initializeBoard().then((tiles) => {
			generateSequence(tiles);
		});
		setStarted(false);
		setTimeLimit(11);
	}, [buffer]);

	return (
		<div className="main">
			<button onClick={() => setBuffer(new Buffer({}))}>reset</button>
			<div className="header grid">
				<div>
					<Timer timeLimit={timeLimit} started={started} />
				</div>
				<div>
					<BufferDisplay buffer={buffer} focusedOrigin={focusedOrigin} sequences={sequences} />
				</div>
			</div>
			<div className="body grid">
				<div>
					<Board
						tiles={tiles}
						buffer={buffer}
						boardSize={boardSize}
						startTimer={() => !started && setStarted(true)}
						setFocusedOrigin={(focusedOrigin) => setFocusedOrigin(focusedOrigin)}
					/>
				</div>
				<div>
					<Sequences buffer={buffer} focusedOrigin={focusedOrigin} sequences={sequences} />
				</div>
			</div>
		</div>
	);
}

export default App;
