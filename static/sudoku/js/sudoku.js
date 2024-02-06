document.addEventListener("DOMContentLoaded", function () {
  var board = document.getElementById("sudokuBoardDummy");
  var cell_count = 0;
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const cell = document.createElement("div");
      cell.className = "sudoku-cell";
      cell.id = "cell" + cell_count;
      if (col === 2 || col === 5) cell.classList.add("bold-border-right");
      if (row === 2 || row === 5) cell.classList.add("bold-border-bottom");

      const input = document.createElement("input");
      input.className = "sudoku-input";
      input.id = "input" + cell_count;
      input.type = "text";
      // input.maxLength = 2;
      cell.appendChild(input);
      board.appendChild(cell);
      input.addEventListener("input", function () {
        if (!this.classList.contains("locked")) {
          this.value = this.value.replace(/[^1-9]/g, "");
          if (this.value.length > 1) {
            this.value = this.value.charAt(this.value.length - 1);
          }
        }
      });
      cell_count++;
    }
  }
});

const loadBoard = new Event("loadBoard");
document.addEventListener("loadBoard", function () {
  console.log("board loaded");

  function initializeSudoku() {
    const puzzleData = JSON.parse(
      document.getElementById("puzzleBoardData").textContent
    );
    const board = document.getElementById("sudokuBoard");
    board.innerHTML = ""; // Clear the board before initializing
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
    inputlisteners(); // Ensure this function is correctly handling events for dynamically created elements
  }

  let gameDuration = document.getElementById("initialTimer").innerHTML;
  console.log(gameDuration);
  let timer

  function startTimer() {
    timer = setInterval(function () {
      gameDuration++;
      document.getElementById("timer").innerHTML = formatTime(gameDuration);
      if (gameDuration % 2 === 0) {
        saveGameDuration();
      }
    }, 1000);
  }

  const pauseButton = document.getElementById("pause");
  pauseButton.addEventListener("click", function () {
    console.log("pause clicked");
    if (pauseButton.innerHTML === '<i class="fa-solid fa-pause"></i> Pause') {
      pauseButton.innerHTML = '<i class="fa-solid fa-play"></i> Resume';
      stopTimer();
      document.getElementById('boardOverlay').style.display = 'block';
    } else {
      pauseButton.innerHTML = '<i class="fa-solid fa-pause"></i> Pause';
      startTimer();
      document.getElementById('boardOverlay').style.display = 'none';
    }
  });
  function stopTimer() {
    clearInterval(timer);
    saveGameDuration();
  }

  function formatTime(seconds){
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    if (hours === 0) {
      return `${minutes < 10 ? '0' : ''}${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    }
    return `${hours}:${minutes < 10 ? '0' : ''}${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  }

  csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
  function saveGameDuration() {
    const gameId = saveButton.value;
    fetch('update_game_duration', {
        method: 'POST',
        headers: {
            'X-CSRFToken': csrftoken, // Make sure you have the CSRF token
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            game_id: gameId,
            duration: gameDuration,
        }),
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));
  }

  window.addEventListener('beforeunload', function(event) {
    saveGameDuration();  // Make sure this is a synchronous call or use navigator.sendBeacon for async
  });

  // function initializeSudoku() {
  //     const puzzleData = JSON.parse(document.getElementById('puzzleBoardData').textContent)
  //     const board = document.getElementById('sudokuBoard');
  //     var cell_count = 0;
  //     for (let row = 0; row < 9; row++) {
  //         for (let col = 0; col < 9; col++) {
  //             const cell = document.createElement('div');
  //             cell.className = 'sudoku-cell';
  //             cell.id = 'cell' + cell_count;
  //             if (col === 2 || col === 5) cell.classList.add('bold-border-right');
  //             if (row === 2 || row === 5) cell.classList.add('bold-border-bottom');

  //             const input = document.createElement('input');
  //             input.className = 'sudoku-input';
  //             input.id = 'input' + cell_count;
  //             input.type = 'text';

  //             cell.appendChild(input);
  //             board.appendChild(cell);
  //             if(puzzleData[row][col] !== 0){
  //                 input.value = puzzleData[row][col]
  //                 input.classList.add('concrete')
  //                 input.disabled = true;
  //             }
  //             input.addEventListener('input', function() {
  //                 if(!this.classList.contains('locked')) {
  //                 this.value = this.value.replace(/[^1-9]/g, '');
  //                 if (this.value.length > 1) {
  //                     this.value = this.value.charAt(this.value.length - 1);
  //                 }
  //             }
  //             });
  //             cell_count++;
  //         }
  //     }
  //     sudoku_loaded = true;
  //     console.log('sudoku loaded');
  //     inputlisteners();
  // };

  function inputlisteners() {
    const inputs = document.getElementsByClassName("sudoku-input");
    for (let i = 0; i < inputs.length; i++) {
      inputs[i].addEventListener("input", function () {
        console.log("input changed");
        console.log(this.value);
      });
    }
  }

  const lock = document.getElementById("valuelock");
  const unlock = document.getElementById("valueunlock");
  var lock_active = false;
  var unlock_active;
  lock.addEventListener("click", function () {
    lock_active = !lock_active;
    if (lock_active) {
      if (unlock_active) {
        unlock.click();
      }
    }
    lock.style.color = lock_active ? "red" : "black";
    lock.style.backgroundColor = lock_active ? "black" : "white";
    lock.style.borderColor = lock_active ? "black" : "white";
    console.log("lock clicked");
  });

  unlock.addEventListener("click", function () {
    unlock_active = !unlock_active;
    if (unlock_active) {
      if (lock_active) {
        lock.click();
      }
    }
    unlock.style.color = unlock_active ? "red" : "black";
    unlock.style.backgroundColor = unlock_active ? "black" : "white";
    unlock.style.borderColor = unlock_active ? "black" : "white";
    console.log("unlock clicked");
  });

  const board = document.getElementById("sudokuBoard"); // Assuming you have an element with this ID

  board.addEventListener("click", function (event) {
    if (event.target.classList.contains("sudoku-input")) {
      if (lock_active) {
        console.log("cell clicked");
        console.log(event.target.id);
        const input = document.getElementById(event.target.id);
        if (!input.classList.contains("concrete")) {
          const cell = input.parentElement;
          cell.style.backgroundColor = "black";
          input.style.backgroundColor = "gray";
          input.style.color = "white";
          input.style.borderColor = "gray";
          input.classList.add("locked");
          input.disabled = true;
        }
      }
    }
    if (event.target.classList.contains("sudoku-cell")) {
      if (unlock_active) {
        console.log("input clicked");
        console.log(event.target.id);
        const cell = document.getElementById(event.target.id);
        const input = cell.children[0];
        if (!input.classList.contains("concrete")) {
          cell.style.backgroundColor = "white";
          input.style.backgroundColor = "white";
          input.style.color = "black";
          input.style.borderColor = "black";
          input.classList.remove("locked");
          input.disabled = false;
        }
      }
    }
  });

  const submit = document.getElementById("submit");

  submit.addEventListener("click", function () {
    var sudoku_state = {};
    var input_list = document.getElementsByClassName("sudoku-input");
    var sudoku_rows = [];
    for (let i = 0; i < 9; i++) {
      row = Array.from(input_list)
        .slice(i * 9, i * 9 + 9)
        .map((input) => input.value);
      sudoku_rows.push(row);
    }
    sudoku_state["rows"] = sudoku_rows;
    sudoku_state["game_id"] = submit.value;
    console.log(sudoku_state);
    fetch("/sudoku/submit_solution", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "sudoku_data=" + JSON.stringify(sudoku_state),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data["is_correct"] === true) {
          toastWin();
        } else {
            console.log("incorrect");

        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });
  const saveButton = document.getElementById("save");
  saveButton.addEventListener("click", function () {
    console.log("save clicked");
    var sudoku_state = {};
    var input_list = document.getElementsByClassName("sudoku-input");
    var sudoku_rows = [];
    
    for (let i = 0; i < 9; i++) {
      row = Array.from(input_list)
        .slice(i * 9, i * 9 + 9)
        .map((input) => input.value);
      sudoku_rows.push(row);
    }
    sudoku_state["rows"] = sudoku_rows;
    sudoku_state["game_id"] = saveButton.value;
    sudoku_state["time"] = gameDuration;
    console.log(sudoku_state);
    fetch("/sudoku/save_game", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body:
        "sudoku_data=" + JSON.stringify(sudoku_state)
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        toastSave();
      })
      .catch((error) => {
        console.error("Error:", error);
        
      });
  });
  var saveToast = document.getElementById("saveToast");
  function toastSave() {
    console.log("toast");
    var toast = new bootstrap.Toast(saveToast);
    toast.show();
    }

  var winToast = document.getElementById("winToast");
  function toastWin() {
    console.log("toast");
    var toast = new bootstrap.Toast(winToast);
    toast.show();
  }

  // const giveUp = document.getElementById("giveUp");

  // giveUp.addEventListener("click", function () {

  //   fetch("/sudoku/give_up", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/x-www-form-urlencoded",
  //       'X-CSRFToken': csrftoken,
  //     },
  //     body:
  //       "game_id=" + giveUp.value
  //   })
  //     .then((response) => response.json())
  //     .then((data) => {
  //       console.log(data);
        
  //     })
  //     .catch((error) => {
  //       console.error("Error:", error);
        
  //     });
  //   });




  initializeSudoku();
  startTimer();
});

// function checkSubmission(){
//     console.log('checking submission')
//     console.log(sudoku_sect.length)
//     for(let i =0; i <9; i++){
//         console.log(sudoku_sect[i])
//         console.log("yo")
//         const uniqueSect = new Set(sudoku_sect[i]).size
//         console.log(uniqueSect)
//         if(uniqueSect != 9){
//             return false
//         }
//         else{
//             const uniqueRow = new Set(sudoku_rows[i]).size
//             if(uniqueRow != 9){
//                 return false
//             }
//             else{
//                 const uniqueCol = new Set(sudoku_cols[i]).size
//                 if(uniqueCol != 9){
//                     return false
//                 }
//                 else{

//                     console.log('check clears')
//                     return true
//                 }
//             }

//         }
//     }
// }
// console.log(checkSubmission());
