document.addEventListener("DOMContentLoaded", function () {

const loadBoard = new Event("loadBoard");
document.addEventListener("loadBoard", function () {
  console.log("board loaded");

    const puzzleData = JSON.parse(
      document.getElementById("puzzleBoardData").textContent
    );
    const board = document.getElementById("sudokuBoard"); // Clear the board before initializing
    var cell_count = 0;

    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        const cellData = puzzleData[row][col]; // Access the cell data
        const cell = document.createElement("div");
        cell.className = "sudoku-cell";
        cell.id = "cell" + cell_count;
        if (col === 2 || col === 5) cell.classList.add("bold-border-right");
        if (row === 2 || row === 5) cell.classList.add("bold-border-bottom");

        const input = document.createElement("input");
        input.className = "sudoku-input";
        input.id = "input" + cell_count;
        input.type = "text";

        if (cellData.value !== 0) {
          // Check the value
          input.value = cellData.value;
          if (cellData.clue) {
            // If it's a clue, make it immutable
            input.classList.add("concrete");
            input.disabled = true;
          }
        }

        input.addEventListener("input", function () {
          if (!this.classList.contains("locked")) {
            this.value = this.value.replace(/[^1-9]/g, "");
            if (this.value.length > 1) {
              this.value = this.value.charAt(0); // Keep only the first digit
            }
          }
        });

        cell.appendChild(input);
        board.appendChild(cell);
        cell_count++;
      }
    }
    sudoku_loaded = true; // Ensure this variable is used or removed appropriately
    console.log("sudoku loaded");

    var time = document.getElementById("initialTimer").innerHTML;
    var timer = document.getElementById("timer")
    timer.innerHTML = formatTime(Number(time));

    function formatTime(seconds){
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const remainingSeconds = seconds % 60;
      if (hours === 0) {
        return `${minutes < 10 ? '0' : ''}${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
      }
      return `${hours}:${minutes < 10 ? '0' : ''}${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    }
  }


);
document.dispatchEvent(loadBoard);
}
);