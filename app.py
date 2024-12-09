from flask import Flask, render_template, jsonify, request
import sudoku as su

app = Flask(__name__)

global_sudoku_solver = None

DIFFICULTY_LEVELS = {
    'easy': 30,
    'medium': 45,
    'hard': 60
}

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/new-puzzle')
def new_puzzle():

    global global_sudoku_solver

    difficulty = request.args.get('difficulty', 'medium')
    num_remove = DIFFICULTY_LEVELS.get(difficulty, 45)

    puzzle, sudokuSolver, _ = su.getPuzzle(num_remove)
    global_sudoku_solver = sudokuSolver

    return jsonify({
        'puzzle': puzzle.tolist()
    })

@app.route('/check-solution', methods=['POST'])
def check_solution():

    global global_sudoku_solver

    data = request.get_json()
    current_grid = data['grid']

    is_valid = su.check_solution(current_grid, global_sudoku_solver)
    return jsonify({'valid': is_valid})

if __name__ == '__main__':
    app.run(debug=True)
