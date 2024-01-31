
document.addEventListener('DOMContentLoaded', function() {
    var board = document.getElementById('sudokuBoard');
    var cell_count = 0;
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            const cell = document.createElement('div');
            cell.className = 'sudoku-cell';
            cell.id = 'cell' + cell_count;
            if (col === 2 || col === 5) cell.classList.add('bold-border-right');
            if (row === 2 || row === 5) cell.classList.add('bold-border-bottom');

            const input = document.createElement('input');
            input.className = 'sudoku-input';
            input.id = 'input' + cell_count;
            input.type = 'text';
            // input.maxLength = 2;
            cell.appendChild(input);
            board.appendChild(cell);
            input.addEventListener('input', function() {
                if(!this.classList.contains('locked')) {
                this.value = this.value.replace(/[^1-9]/g, '');
                if (this.value.length > 1) {
                    this.value = this.value.charAt(this.value.length - 1);
                }
            }
            });
            cell_count++;
        }
    }

});


// function inputlisteners() {
//     const inputs = document.getElementsByClassName('sudoku-input');
//     for (let i = 0; i < inputs.length; i++) {
//         inputs[i].addEventListener('input', function() {
//             console.log('input changed');
//             console.log(this.value);
//         });
//     }
// }

// const lock = document.getElementById('valuelock');
// const unlock = document.getElementById('valueunlock');
// var lock_active = false;
// var unlock_active;
// lock.addEventListener('click', function() {
//     lock_active = !lock_active;
//     if (lock_active) {
//         if (unlock_active) {
//             unlock.click();
//         }
//     }
//     lock.style.color = lock_active ? 'red' : 'black';
//     lock.style.backgroundColor = lock_active ? 'black' : 'white';
//     lock.style.borderColor = lock_active ? 'black' : 'white';
//     console.log('lock clicked');
// });



// unlock.addEventListener('click', function() {
//     unlock_active = !unlock_active;
//     if (unlock_active) {
//         if (lock_active) {
//             lock.click();
//         }
      
//     }
//     unlock.style.color = unlock_active ? 'red' : 'black';
//     unlock.style.backgroundColor = unlock_active ? 'black' : 'white';
//     unlock.style.borderColor = unlock_active ? 'black' : 'white';
//     console.log('unlock clicked');
// }
// );

// const board = document.getElementById('sudokuBoard'); // Assuming you have an element with this ID

// board.addEventListener('click', function(event) {
//     if (event.target.classList.contains('sudoku-input')) {
//         if (lock_active) {
//             console.log('cell clicked');
//             console.log(event.target.id);
//             const input = document.getElementById(event.target.id);
//             const cell = input.parentElement;
//             cell.style.backgroundColor='black';
//             input.style.backgroundColor='gray';
//             input.style.color='white';
//             input.style.borderColor='gray';
//             input.classList.add('locked');
//             input.disabled = true;
//         }
//     }
//     if (event.target.classList.contains('sudoku-cell')) {
//         if (unlock_active) {
//             console.log('input clicked');
//             console.log(event.target.id);
//             const cell = document.getElementById(event.target.id);
//             const input = cell.children[0];
//             cell.style.backgroundColor='white';
//             input.style.backgroundColor='white';
//             input.style.color='black';
//             input.style.borderColor='black';
//             input.classList.remove('locked');
//             input.disabled = false;
//         }
//     }
// });

// const submit = document.getElementById('submit');

// submit.addEventListener('click', function(){
//     var sudoku_state = {}
//     var input_list = document.getElementsByClassName('sudoku-input')
//     var sudoku_rows = {}
//     var sudoku_cols = {}
//     var sudoku_sect = {}
//     for(let i = 0; i < 9; i ++){
//         sudoku_rows[i] = Array.from(input_list).slice(i*9, (i*9)+9).map(input => input.value)
//         sudoku_cols[i] = []
//         sudoku_sect[i] = []
//         for(let j = 0; j<9; j++){
//             sudoku_cols[i][j] = input_list[i+j*9].value
//         }
//         let rowStart = Math.floor(i / 3) * 3;
//         let colStart = (i % 3) * 3;
//         for (let row = rowStart; row < rowStart + 3; row++) {
//             for (let col = colStart; col < colStart + 3; col++) {
//                 sudoku_sect[i].push(input_list[row * 9 + col].value);
//             }
//         }
//     }
//     // sudoku_state.push(sudoku_cols).push(sudoku_rows).push(sudoku_sect)
//     sudoku_state['rows'] = sudoku_rows
//     sudoku_state['cols'] = sudoku_cols
//     sudoku_state['sects'] = sudoku_sect
//     console.log(sudoku_state)
//     fetch('/sudoku/submit_solution',{
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/x-www-form-urlencoded',
//         },
//         body: 'sudoku_data=' + JSON.stringify(sudoku_state)
//     })
//     .then(response => response.json())
//     .then(data =>{  
//         console.log(data)
//     })
//     .catch((error) => {
//         console.error('Error:', error);
//     });
// });

// const mymodal = document.getElementById('modal')

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
    

