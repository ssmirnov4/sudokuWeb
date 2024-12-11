function createGrid(puzzle) {
    const gridContainer = document.getElementById('sudoku-grid');
    gridContainer.innerHTML = '';

    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            const cell = document.createElement('div');
            cell.className = 'cell';

            if (puzzle[i][j] !== 0) {
                cell.classList.add('original');
                cell.textContent = puzzle[i][j];
            } else {
                const input = document.createElement('input');
                input.type = 'number';
                input.min = 1;
                input.max = 9;
                input.addEventListener('input', function() {
                    if (this.value.length > 1) {
                        this.value = e.target.value.slice(0, 1);
                    }
                    if (parseInt(this.value) > 9) {
                        this.value = 9;
                    }
                    if (parseInt(this.value) === 0){
                        this.value = '';
                    }
                });
                cell.appendChild(input);
            }
            gridContainer.appendChild(cell);
        }
    }
}

function getCurrentGrid() {
    const grid = [];
    const cells = document.querySelectorAll('.cell');
    let row = [];

    cells.forEach((cell, index) => {
        if (cell.classList.contains('original')) {
            row.push(parseInt(cell.textContent));
        } else {
            const value = cell.querySelector('input').value;
            row.push(value === '' ? 0 : parseInt(value));
        }

        if ((index + 1) % 9 === 0) {
            grid.push(row);
            row = [];
        }
    });

    return grid;
}

function getNewPuzzle() {
    const difficulty = document.getElementById('difficulty').value;
    fetch(`/new-puzzle?difficulty=${difficulty}`)
        .then(response => response.json())
        .then(data => {
            createGrid(data.puzzle);
        });
}

document.getElementById('new-puzzle-btn').addEventListener('click', function() {
    getNewPuzzle();
});

document.getElementById('difficulty').addEventListener('change', function() {
    getNewPuzzle();
});


document.getElementById('check-btn').addEventListener('click', function() {
    const currentGrid = getCurrentGrid();

    fetch('/check-solution', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            grid: currentGrid
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.valid) {
            alert('Поздравляем! Решение верное!');
        } else {
            alert('Решение неверное. Попробуйте еще раз!');
        }
    });
});

window.onload = function() {
    getNewPuzzle();
};