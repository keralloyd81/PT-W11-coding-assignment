$(function () {
  // Keeps track of the current player (either 'X' or 'O')
  let currentPlayer = 'X';

  // Boolean to determine if the game is over (win or draw)
  let isGameOver = false;

  // Scoreboard object to keep track of wins for X, O, and draws
  let score = {
    X: 0,
    O: 0,
    draw: 0
  };

  // Cache frequently used DOM elements for performance
  const $cells = $('.cell'); // All 9 cells of the game grid
  const $turn = $('#turn-indicator'); // Heading that displays whose turn it is
  const $alertContainer = $('#alert-container'); // Container to hold Bootstrap alerts
  const $scoreX = $('#score-x'); // Display area for Player X's score
  const $scoreO = $('#score-o'); // Display area for Player O's score
  const $scoreDraw = $('#score-draw'); // Display area for draw count

  /**
   * Updates the turn display above the board to show the current player.
   */
  function updateTurnDisplay() {
    $turn.text(`Player ${currentPlayer}'s turn`);
  }

  /**
   * Updates the scoreboard in the UI with the current scores from the score object.
   */
  function updateScoreboard() {
    $scoreX.text(score.X);
    $scoreO.text(score.O);
    $scoreDraw.text(score.draw);
  }

  /**
   * Displays a Bootstrap alert message in the alert container.
   * @param {string} message - The message to show in the alert.
   * @param {string} type - The Bootstrap alert type (e.g., 'success', 'warning', 'info').
   */
  function showAlert(message, type = 'info') {
    const alert = `
      <div class="alert alert-${type} alert-dismissible fade show mt-3" role="alert">
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>`;
    $alertContainer.html(alert); // Replace any existing alert with the new one
  }

  /**
   * Checks to see if a player has won or if the game is a draw.
   * If there is a winner or a draw, it ends the game and updates the scoreboard.
   */
  function checkWinner() {
    // All possible winning combinations (rows, columns, diagonals)
    const winCombos = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6]             // diagonals
    ];

    // Create an array to tell the current state of each cell
    const board = $cells.map(function () {
      return $(this).text(); // Gets the text (either 'X', 'O', or '') of each cell
    }).get();

    // Check each winning combination to see if the same player occupies all three cells
    for (let combo of winCombos) {
      const [a, b, c] = combo;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        // A winning combination is found
        isGameOver = true;
        showAlert(`🎉 Player ${board[a]} wins! Huzzah!`, 'success'); // Show success alert

        // Update the winner's score and refresh scoreboard display
        score[board[a]]++;
        updateScoreboard();
        return; // Exit early since the game is over
      }
    }

    // If all cells are filled and there's no winner, it's a draw
    if (board.every(cell => cell !== '')) {
      isGameOver = true;
      showAlert("🤝 It's a draw! Better luck next time.", 'warning'); // Show draw alert
      score.draw++; // Increase draw count
      updateScoreboard(); // Update the scoreboard display
    }
  }

  /**
   * Handles the click event on each cell.
   * Fills the cell with the current player's mark, checks for a win or draw,
   * and switches turns if the game is still ongoing.
   */
  $cells.on('click', function () {
        // Ignore clicks if the game is over or if the cell is already filled
    if (isGameOver || $(this).text()) return;

    // Mark the cell with the current player's symbol
    $(this).text(currentPlayer);

    // Check for a winner or draw after the move
    checkWinner();

    // If no one has won and it's not a draw, switch turns
    if (!isGameOver) {
      currentPlayer = currentPlayer === 'X' ? 'O' : 'X'; // Toggle player
      updateTurnDisplay(); // Show the new player's turn
    }
  });

  /**
   * Resets the board for a new round but keeps the scoreboard as is.
   * Clears all cells, resets game, and clears any alerts.
   */
  $('#reset').on('click', function () {
    $cells.text(''); // Clears the text in all cells
    currentPlayer = 'X'; // Reset to starting player
    isGameOver = false; // Allow new moves
    $alertContainer.empty(); // Remove any alerts
    updateTurnDisplay(); // Update UI to reflect turn
  });

  // Initialize the UI on page load
  updateTurnDisplay();
  updateScoreboard();
});
