import { useEffect, useState } from "react";
import { isCurrentAxis, rand, _STATUS_CLASSES, _CODES, _AXES } from "./global.js";
import Board from "./components/board/board";
import Buffer from "./buffer.js";
import Sequences from "./components/Sequences/Sequences.jsx";
import Timer from "./components/Timer/Timer.jsx";
import BufferDisplay from "./components/BufferDisplay/BufferDisplay.jsx";

import "./App.scss";

function App() {
	const sequenceCount = 2;
	const sequenceLength = 4;
	const maxBuffer = 4;
	const [boardSize, setBoardSize] = useState(5);
	const [tiles, setTiles] = useState([]);
	const [sequences, setSequences] = useState([]);
	const [focusedOrigin, setFocusedOrigin] = useState({});
	const [buffer, setBuffer] = useState(
		new Buffer({
			list: [],
			maxBuffer: maxBuffer,
		})
	);

	const addBuffer = (tile) => {
		tile.disabled = true;
		buffer.add(tile);

		const { list, maxBuffer } = buffer;
		const tempBuffer = new Buffer({ list, maxBuffer });

		setBuffer(tempBuffer);
	};

	const initializeBoard = async () => {
		const tiles = [];
		for (let x = 0; x < boardSize; x++) {
			for (let y = 0; y < boardSize; y++) {
				tiles.push({
					id: `t-${x}${y}`,
					content: rand(_CODES),
					position: { x, y },
					disabled: false,
					className: [
						`${x === 0 ? _STATUS_CLASSES.highlighted : _STATUS_CLASSES.disabled}`,
						`${x === 0 && y === 0 ? _STATUS_CLASSES.first : ""}`,
						`${x === 0 && y === boardSize - 1 ? _STATUS_CLASSES.last : ""}`,
						`${x === 0 || y === boardSize - 1 ? _STATUS_CLASSES.x : ""}`,
					],
				});
			}
		}
		setTiles(tiles);
		return tiles;
	};

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
					if (
						!tile.disabled &&
						isCurrentAxis(tempBuffer.getLastPosition(), tempAxis, tile.position)
					) {
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
						buffer={buffer}
						boardSize={boardSize}
						tiles={tiles}
						addBuffer={addBuffer}
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
