// game module
const gameModule = (() => {
  let gameBoard = gameBoardFactory();
  let players = [];

  const startButton = document.getElementById('start');
  startButton.addEventListener('click', startGame);

  function startGame() {
    const player1Name = document.getElementById('player1').value;
    const player2Name = document.getElementById('player2').value;
    players.push(playerFactory(player1Name, 'X'));
    players.push(playerFactory(player2Name, 'O'));

    renderBoard();
    addCellListeners();
    startButton.removeEventListener('click', startGame);
  }

  function renderBoard() {
    const board = document.getElementById('board');
    board.innerHTML = '';

    for (let i = 0; i < 9; i++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.dataset.index = i;
      cell.textContent = gameBoard.board[i];
      board.appendChild(cell);
    }
  }

  function addCellListeners() {
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
      cell.addEventListener('click', makeMove);
    });
  }

  function makeMove() {
    const index = this.dataset.index;
    const currentPlayer = players[gameBoard.currentPlayerIndex];

    if (gameBoard.isEmpty(index)) {
      gameBoard.placeMark(index, currentPlayer.mark);
      renderBoard();

      if (gameBoard.isGameOver()) {
        displayResult();
        removeCellListeners();
      } else {
        gameBoard.switchPlayer();
      }
    }
  }

  function displayResult() {
    const message = document.getElementById('message');
    const winner = gameBoard.getWinner();

    if (winner) {
      const currentPlayer = players.find(player => player.mark === winner);
      message.textContent = `Congratulations, ${currentPlayer.name}! You won!`;
    } else {
      message.textContent = "It's a tie!";
    }
  }

  function removeCellListeners() {
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
      cell.removeEventListener('click', makeMove);
    });
  }

  // player factory
  function playerFactory(name, mark) {
    return { name, mark };
  }

  // game board factory
  function gameBoardFactory() {
    let board = ['', '', '', '', '', '', '', '', ''];
    let currentPlayerIndex = 0;

    function isEmpty(index) {
      return board[index] === '';
    }

    function placeMark(index, mark) {
      board[index] = mark;
    }

    function switchPlayer() {
      currentPlayerIndex = (currentPlayerIndex === 0) ? 1 : 0;
    }

    function isGameOver() {
      return getWinner() || isTie();
    }

    function getWinner() {
      const winningCombos = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
        [0, 4, 8], [2, 4, 6] // diagonals
      ];

      for (let combo of winningCombos) {
        if (
          board[combo[0]] &&
          board[combo[0]] === board[combo[1]] &&
          board[combo[1]] === board[combo[2]]
        ) {
          return board[combo[0]];
        }
      }

      return null;
    }

    function isTie() {
      return !board.includes('');
    }

    return {
      board,
      currentPlayerIndex,
      isEmpty,
      placeMark,
      switchPlayer,
      isGameOver,
      getWinner
    };
  }
})();
