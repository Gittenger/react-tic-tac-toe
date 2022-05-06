import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'

//function component
const Square = props => {
	return (
		<button className="square" onClick={props.onClick}>
			{props.value}
		</button>
	)
}

class Board extends React.Component {
	renderSquare(i) {
		return (
			<Square
				value={this.props.squares[i]}
				onClick={() => this.props.onClick(i)}
			/>
		)
	}

	render() {
		const boardSize = 3
		let squares = []

		for (let i = 0; i < boardSize; ++i) {
			let row = []
			for (let j = 0; j < boardSize; ++j) {
				row.push(this.renderSquare(i * boardSize + j))
			}
			squares.push(
				<div key={i} className="board-row">
					{row}
				</div>
			)
		}
		return <div>{squares}</div>
	}
}

class Game extends React.Component {
	constructor(props) {
		super(props)
		//initial state of board
		this.state = {
			history: [
				{
					squares: Array(9).fill(null),
				},
			],
			stepNumber: 0,
			xIsNext: true,
		}
	}

	handleClick(i) {
		const history = this.state.history.slice(0, this.state.stepNumber + 1)
		const current = history[history.length - 1]
		const squares = current.squares.slice()

		if (calculateWinner(squares) || squares[i]) return // end if (winner) or square != null

		squares[i] = this.state.xIsNext ? 'X' : 'O'

		this.setState({
			history: history.concat([{ squares: squares, latestMoveSquare: i }]),
			stepNumber: history.length,
			xIsNext: !this.state.xIsNext,
		})
	}

	jumpTo(step) {
		this.setState({
			stepNumber: step,
			xIsNext: step % 2 === 0,
		})
	}

	render() {
		const history = this.state.history
		const current = history[this.state.stepNumber]
		const winner = calculateWinner(current.squares)
		const stepNumber = this.state.stepNumber

		const moves = history.map((step, move) => {
			const latestMoveSquare = step.latestMoveSquare
			const col = 1 + (latestMoveSquare % 3)
			const row = 1 + Math.floor(latestMoveSquare / 3)
			const desc = move
				? `Go to move ${move}: (${col}, ${row})`
				: 'Go to game start'
			return (
				<li key={move}>
					<button
						className={move === stepNumber ? 'move-list-item-selected' : ''}
						onClick={() => this.jumpTo(move)}
					>
						{desc}
					</button>
				</li>
			)
		})

		let status
		if (winner) status = 'Winner: ' + winner
		else status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O')

		return (
			<div className="game">
				<div className="game-board">
					<Board squares={current.squares} onClick={i => this.handleClick(i)} />
				</div>
				<div className="game-info">
					<div>{status}</div>
					<ol>{moves}</ol>
				</div>
			</div>
		)
	}
}

const calculateWinner = squares => {
	const lines = [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8],
		[2, 4, 6],
	]
	for (let i = 0; i < lines.length; i++) {
		const [a, b, c] = lines[i] // creates an array for one "line" for each iteration
		//checks values of squares at each position of the line in this iteration
		if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c])
			return squares[a]
	}
	return null
}
// ========================================

ReactDOM.render(
	<React.StrictMode>
		<Game />
	</React.StrictMode>,
	document.getElementById('root')
)
