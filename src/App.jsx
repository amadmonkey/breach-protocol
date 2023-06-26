import { useEffect, useState } from "react";
import {
	isTileValid,
	isCurrentAxis,
	_STATUS_CLASSES,
	_CODES,
	_AXES,
	rand,
	addToArray,
} from "./global.js";
import Board from "./components/board/board";
import Buffer from "./buffer.js";
import Sequences from "./components/Sequences/Sequences.jsx";
import Timer from "./components/Timer/Timer.jsx";
import BufferDisplay from "./components/BufferDisplay/BufferDisplay.jsx";

import "./App.scss";

function App() {
	const maxBuffer = 4;
	const sequenceCount = 2;
	const sequenceLength = 4;
	const [tiles, setTiles] = useState([]);
	const [boardSize, setBoardSize] = useState(5);
	const [sequences, setSequences] = useState([]);
	const [focusedOrigin, setFocusedOrigin] = useState({});
	const [buffer, setBuffer] = useState(
		new Buffer({
			list: [],
			maxBuffer: 4,
		})
	);

	const initializeBoard = async () => {
		const tiles = [];
		for (let x = 0; x < boardSize; x++) {
			for (let y = 0; y < boardSize; y++) {
				addToArray(tiles, {
					id: `t-${x}${y}`,
					content: rand(_CODES),
					position: { x, y },
					disabled: false,
					className: [
						`${x !== 0 ? _STATUS_CLASSES.disabled : ""}`,
						`${x === 0 && y === 0 ? _STATUS_CLASSES.highlighted : ""}`,
						`${x === 0 || y === boardSize - 1 ? _STATUS_CLASSES.x : ""}`,
					],
					sequenceClassName: [],
				});
			}
		}
		setTiles(tiles);
		return tiles;
	};

	// generate sequences
	const generateSequence = (tiles) => {
		const sequenceList = [];
		for (let x = 0; x < sequenceCount; x++) {
			const tempAxis = { active: _AXES.X, inactive: _AXES.Y };
			const tempBuffer = new Buffer({
				list: [],
				max: maxBuffer,
			});
			for (let y = 0; y < sequenceLength; y++) {
				const validTiles = [];
				// compile valid tiles
				tiles.map((tile) => {
					if (isTileValid(tempBuffer.getLastPosition(), tile, tempAxis)) {
						validTiles.push(tile);
					}
				});
				// select a tile randomly from the valid tiles
				const randomTile = rand(validTiles);
				tempBuffer.add(randomTile);
				randomTile.disabled = true;
				Object.assign(tempAxis, { active: tempAxis.inactive, inactive: tempAxis.active });
			}
			// push to newSequence into the sequenceList
			sequenceList.push(tempBuffer.list);
		}
		setSequences(sequenceList);
		tiles.map((tile) => (tile.disabled = false));
	};

	useEffect(() => {
		initializeBoard().then((tiles) => {
			generateSequence(tiles);
		});
	}, [boardSize]);

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
						boardSize={boardSize}
						updateBuffer={(buffer) => setBuffer(new Buffer(buffer))}
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
