// Initialize the board
const board = Array(9).fill(null);
const cells = document.querySelectorAll('.cell');
const boardElement = document.getElementById('board');
const resetButton = document.getElementById('reset');
let gameOver = false; // Add game state flag

// Create cells dynamically (better for SEO)
board.forEach((_, index) => {
    const cell = document.createElement('div');
    cell.className = 'cell';
    cell.dataset.index = index;
    cell.addEventListener('click', () => handleMove(index));
    boardElement.appendChild(cell);
});

// Handle player move
function handleMove(index) {
    if (gameOver || board[index] !== null) return;
    
    // Human move
    board[index] = 'X';
    updateBoard();
    
    // Check game state after human move
    const winner = checkWinner(board);
    if (winner) {
        gameOver = true;
        announceResult(winner);
        return;
    }
    
    // AI move only if game isn't over
    setTimeout(() => {
        if (!gameOver) {
            const aiMove = bestMove();
            board[aiMove] = 'O';
            updateBoard();
            
            // Check game state after AI move
            const newWinner = checkWinner(board);
            if (newWinner) {
                gameOver = true;
                announceResult(newWinner);
            }
        }
    }, 500); // Small delay for better UX
}

// Minimax + Alpha-Beta
function minimax(board, depth, isMaximizing, alpha = -Infinity, beta = Infinity) {
    const winner = checkWinner(board);
    if (winner !== null) {
        return winner === 'X' ? -10 + depth : winner === 'O' ? 10 - depth : 0;
    }

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < 9; i++) {
            if (!board[i]) {
                board[i] = 'O';
                const score = minimax(board, depth + 1, false, alpha, beta);
                board[i] = null;
                bestScore = Math.max(score, bestScore);
                alpha = Math.max(alpha, bestScore);
                if (beta <= alpha) break;
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < 9; i++) {
            if (!board[i]) {
                board[i] = 'X';
                const score = minimax(board, depth + 1, true, alpha, beta);
                board[i] = null;
                bestScore = Math.min(score, bestScore);
                beta = Math.min(beta, bestScore);
                if (beta <= alpha) break;
            }
        }
        return bestScore;
    }
}

// AI makes the best move
function bestMove() {
    let bestScore = -Infinity;
    let move;
    for (let i = 0; i < 9; i++) {
        if (!board[i]) {
            board[i] = 'O';
            const score = minimax(board, 0, false);
            board[i] = null;
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }
    return move;
}

// Check for winner
function checkWinner(board) {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
        [0, 4, 8], [2, 4, 6]             // diagonals
    ];
    
    for (let pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a]; // returns 'X' or 'O'
        }
    }
    
    if (!board.includes(null)) {
        return 'draw';
    }
    
    return null;
}

// Announce game result
function announceResult(winner) {
    setTimeout(() => {
        if (winner === 'X') {
            alert('You win!');
        } else if (winner === 'O') {
            alert('AI wins!');
        } else {
            alert('Draw!');
        }
    }, 100);
}

// Update the UI
function updateBoard() {
    board.forEach((cell, index) => {
        cells[index].textContent = cell;
    });
}

// Reset game
resetButton.addEventListener('click', () => {
    board.fill(null);
    gameOver = false;
    updateBoard();
});