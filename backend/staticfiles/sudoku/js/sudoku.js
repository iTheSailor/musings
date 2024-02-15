var sudoku_loaded;
document.addEventListener('DOMContentLoaded', function() {
    const board = document.getElementById('sudokuBoard');

    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            const cell = document.createElement('div');
            cell.className = 'sudoku-cell';
            if (col === 2 || col === 5) cell.classList.add('bold-border-right');
            if (row === 2 || row === 5) cell.classList.add('bold-border-bottom');

            const input = document.createElement('input');
            input.className = 'sudoku-input';
            input.type = 'text';
            // input.maxLength = 2;
            cell.appendChild(input);
            board.appendChild(cell);
            input.addEventListener('input', function() {
                this.value = this.value.replace(/[^1-9]/g, '');
                if (this.value.length > 1) {
                    this.value = this.value.charAt(this.value.length - 1);
                }
            });
        }
    }
    sudoku_loaded = true;
    console.log('sudoku loaded');
    inputlisteners();
});

// while (!sudoku_loaded) {
//     console.log('waiting for sudoku to load');
//     if (sudoku_loaded) {
//         console.log('sudoku loaded');
//         inputlisteners();
//     }
// }

function inputlisteners() {
    const inputs = document.getElementsByClassName('sudoku-input');
    for (let i = 0; i < inputs.length; i++) {
        inputs[i].addEventListener('input', function() {
            console.log('input changed');
            console.log(this.value);
        });
    }
}




