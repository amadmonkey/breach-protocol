import { useEffect, useState } from "react";
import { isTileValid, _STATUS_CLASSES, _CODES, _AXES, rand, addToArray } from "./global.js";
import Board from "./components/Board/Board";
import Buffer from "./buffer.js";
import Sequence from "./sequence.js";
import Sequences from "./components/Sequences/Sequences.jsx";
import Timer from "./components/Timer/Timer.jsx";
import BufferDisplay from "./components/BufferDisplay/BufferDisplay.jsx";

import "./App.scss";

function App() {
	const maxSequence = 3;
	const [tiles, setTiles] = useState([]);
	const [maxBuffer, setMaxBuffer] = useState(4);
	const [sequences, setSequences] = useState([]);
	const [focusedOrigin, setFocusedOrigin] = useState({});
	const [buffer, setBuffer] = useState(new Buffer([], maxBuffer));

	const initializeBoard = async () => {
		const tiles = [];
		for (let x = 0; x < buffer.boardSize; x++) {
			for (let y = 0; y < buffer.boardSize; y++) {
				addToArray(tiles, {
					id: `t-${x}${y}`,
					content: rand(_CODES),
					position: { x, y },
					status: true,
					className: [
						`${x !== 0 ? _STATUS_CLASSES.disabled : ""}`,
						`${x === 0 && y === 0 ? _STATUS_CLASSES.highlighted : ""}`,
						`${x === 0 || y === buffer.boardSize - 1 ? _STATUS_CLASSES.x : ""}`,
					],
					sequenceClassName: [],
				});
			}
		}
		setTiles(tiles);
		return tiles;
	};

	const generateSequence = (tiles) => {
		const sequenceList = [];
		const tempAxis = { active: _AXES.X, inactive: _AXES.Y };
		const tempBuffer = new Buffer([], maxBuffer);
		for (let x = 0; x < maxBuffer; x++) {
			const validTiles = [];
			// get all valid tiles
			tiles.map(
				(tile) => isTileValid(tempBuffer.getLastPosition(), tile, tempAxis) && validTiles.push(tile)
			);
			// select a tile randomly from the valid tiles
			const randomTile = rand(validTiles);
			randomTile.status = false;
			tempBuffer.add(randomTile);
			Object.assign(tempAxis, { active: tempAxis.inactive, inactive: tempAxis.active });
		}

		// divide sequence with connections
		const { list } = Object.assign({}, tempBuffer);
		while (list.length) {
			const maxSequenceLength = Math.floor(Math.random() * (4 - 2 + 1) + 2);
			const newSequence = list.splice(0, maxSequenceLength);
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
	}, [maxBuffer]);

	return (
		<div className="main">
			<div className="header grid">
				<div>
					<Timer />
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
						updateBuffer={(newBuffer) => setBuffer(new Buffer(newBuffer.list, newBuffer.maxBuffer))}
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
