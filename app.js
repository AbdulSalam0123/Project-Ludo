/*******************************Constants**********************************/
const COORDINATES_MAP =
{
    0: [6, 13],
    1: [6, 12],
    2: [6, 11],
    3: [6, 10],
    4: [6, 9],
    5: [5, 8],
    6: [4, 8],
    7: [3, 8],
    8: [2, 8],
    9: [1, 8],
    10: [0, 8],
    11: [0, 7],
    12: [0, 6],
    13: [1, 6],
    14: [2, 6],
    15: [3, 6],
    16: [4, 6],
    17: [5, 6],
    18: [6, 5],
    19: [6, 4],
    20: [6, 3],
    21: [6, 2],
    22: [6, 1],
    23: [6, 0],
    24: [7, 0],
    25: [8, 0],
    26: [8, 1],
    27: [8, 2],
    28: [8, 3],
    29: [8, 4],
    30: [8, 5],
    31: [9, 6],
    32: [10, 6],
    33: [11, 6],
    34: [12, 6],
    35: [13, 6],
    36: [14, 6],
    37: [14, 7],
    38: [14, 8],
    39: [13, 8],
    40: [12, 8],
    41: [11, 8],
    42: [10, 8],
    43: [9, 8],
    44: [8, 9],
    45: [8, 10],
    46: [8, 11],
    47: [8, 12],
    48: [8, 13],
    49: [8, 14],
    50: [7, 14],
    51: [6, 14],
    // HOME ENTRANCE
    // P1
    100: [7, 13],
    101: [7, 12],
    102: [7, 11],
    103: [7, 10],
    104: [7, 9],
    105: [7, 8],
    // P2
    200: [7, 1],
    201: [7, 2],
    202: [7, 3],
    203: [7, 4],
    204: [7, 5],
    205: [7, 6],

    // BASE POSITIONS
    // P1
    500: [1.5, 10.58],
    501: [3.57, 10.58],
    502: [1.5, 12.43],
    503: [3.57, 12.43],
    // P2
    600: [10.5, 1.58],
    601: [12.54, 1.58],
    602: [10.5, 3.45],
    603: [12.54, 3.45],
};

const STEP_LENGTH = 6.66;
const PLAYERS = ['P1', 'P2'];
const BASE_POSITIONS = 
{
    P1: [500, 501, 502, 503],
    P2: [600, 601, 602, 603],
};

const START_POSITIONS = 
{
    P1: 0,
    P2: 26
};

const HOME_ENTRANCE = 
{
    P1: [100, 101, 102, 103, 104],
    P2: [200, 201, 202, 203, 204]
};

const HOME_POSITIONS = 
{
    P1: 105,
    P2: 205
};

const TURNING_POINTS = 
{
    P1: 50,
    P2: 24
};

const SAFE_POSITIONS = [0, 8, 13, 21, 26, 34, 39, 47];
const STATE =
{
    DICE_NOT_ROLLED: 'DICE_NOT_ROLLED',
    DICE_ROLLED: 'DICE_ROLLED',
};


const diceButtonElement = document.querySelector('#dice-btn');
const playerPiecesElements = 
{
    P1: document.querySelectorAll('[player-id="P1"].player-piece'),
    P2: document.querySelectorAll('[player-id="P2"].player-piece'),
};


/*****************Classes, Functions and EventListeners***********************/
class UI
{
    static listenDiceClick = (callback) =>
    {
        diceButtonElement.addEventListener('click', callback);
    }

    static listenResetClick = (callback) =>
    {
        document.querySelector('button#reset-btn').addEventListener('click', callback);
    }

    static listenPieceClick = (callback) => 
    {
        document.querySelector('.player-pieces').addEventListener('click', callback);
    }

    static setPiecePosition = (player, piece, newPosition) =>
    {
        if(!playerPiecesElements[player] || !playerPiecesElements[player][piece])
        {
            console.error(`Player element of given player: ${player} and piece: ${piece} not found`);
            return;
        }

        const [x, y] = COORDINATES_MAP[newPosition];

        const pieceElement = playerPiecesElements[player][piece];
        pieceElement.style.top = y * STEP_LENGTH + '%';
        pieceElement.style.left = x * STEP_LENGTH + '%';
    }

    static setTurn = (index) => 
        {
        if(index < 0 || index >= PLAYERS.length) 
        {
            return;
        }

        const player = PLAYERS[index];
        // Display player ID
        document.querySelector('.active-player span').innerText= player;

        const activePlayerBase = document.querySelector('.player-base.highlight');
        if(activePlayerBase) 
        {
            activePlayerBase.classList.remove('highlight');
        }

        // highlight
        document.querySelector(`[player-id="${player}"].player-base`).classList.add('highlight');
    }

    static enableDice = () =>
    {
        diceButtonElement.removeAttribute('disabled');
    }

    static disableDice = () =>
    {
        diceButtonElement.setAttribute('disabled', '');
    }

    static highlightPieces = (player, pieces) =>
    {
        pieces.forEach(piece =>
        {
            const pieceElement = playerPiecesElements[player][piece];
            pieceElement.classList.add('highlight');
        });
    }

    static unhighlightPieces = () =>
    {
        document.querySelectorAll('.player-piece.highlight').forEach(ele =>
        {
            ele.classList.remove('highlight');
        });
    }

    static setDiceValue = (value) =>
    {
        document.querySelector('.dice-value').innerText = value;
    }
}

// Ludo Class
class Ludo
{
    currentPositions =
    {
        P1: [],
        P2: []
    }

    _diceValue;
    get diceValue()
    {
        return this._diceValue;
    }
    set diceValue(value)
    {
        this._diceValue = value;
        UI.setDiceValue(value);
    }

    _turn;
    get turn()
    {
        return this._turn;
    }
    set turn(value)
    {
        this._turn = value;
        UI.setTurn(value);
    }

    _state;
    get state()
    {
        return this._state;
    }
    set state(value)
    {
        this._state = value;

        if(value === STATE.DICE_NOT_ROLLED)
        {
            UI.enableDice();
            UI.unhighlightPieces();
        }
        else
        {
            UI.disableDice();
        }
    }

    constructor()
    {
        this.listenDiceClick();
        this.listenResetClick();
        this.listenPieceClick();
        this.resetGame();
    }

    listenDiceClick = () =>
    {
        UI.listenDiceClick(this.onDiceClick);
    }

    onDiceClick = () =>
    {
        this.diceValue = 1 + Math.floor(Math.random() * 6);
        this.state = STATE.DICE_ROLLED;

        this.checkForEligiblePieces();
    }

    checkForEligiblePieces = () =>
    {
        const player = PLAYERS[this.turn];
        // Eligible pieces of given player
        const eligiblePieces = this.getEligiblePieces(player);
        if(eligiblePieces.length) 
        {
            // Highlight the pieces
            UI.highlightPieces(player, eligiblePieces);
        }
        else
        {
            this.incrementTurn();
        }
    }

    incrementTurn = () =>
    {
        this.turn = this.turn === 0 ? 1 : 0;
        this.state = STATE.DICE_NOT_ROLLED;
    }

    getEligiblePieces = (player) =>
    {
        return [0, 1, 2, 3].filter(piece =>
        {
            const currentPosition =
             this.currentPositions[player][piece];

            if(currentPosition === HOME_POSITIONS[player])
            {
                return false;
            }

            if(BASE_POSITIONS[player].includes(currentPosition) && this.diceValue !== 6)
            {
                return false;
            }

            if( HOME_ENTRANCE[player].includes(currentPosition) && this.diceValue > HOME_POSITIONS[player]  - currentPosition)
            {
                return false;
            }

            return true;
        });
    }

    listenResetClick = () =>
    {
        UI.listenResetClick(this.resetGame);
    }

    resetGame = () =>
    {
        this.currentPositions = structuredClone(BASE_POSITIONS);

        PLAYERS.forEach(player =>
        {
            [0, 1, 2, 3].forEach(piece =>
            {
                this.setPiecePosition(player, piece, this.currentPositions[player][piece]);
            });
        });

        this.turn = 0;
        this.state = STATE.DICE_NOT_ROLLED;
    }

    listenPieceClick = () =>
    {
        UI.listenPieceClick(this.onPieceClick);
    }

    onPieceClick = (event) =>
    {
        const target = event.target;

        if(!target.classList.contains('player-piece') || !target.classList.contains('highlight')) 
        {
            return;
        }

        const player = target.getAttribute('player-id');
        const piece = target.getAttribute('piece');
        this.handlePieceClick(player, piece);
    }

    handlePieceClick = (player, piece) =>
    {
        const currentPosition =
        this.currentPositions[player][piece];

        if(BASE_POSITIONS[player].includes(currentPosition))
        {
            this.setPiecePosition(player, piece,START_POSITIONS[player]);
            this.state = STATE.DICE_NOT_ROLLED;
            return;
        }

        UI.unhighlightPieces();
        this.movePiece(player, piece, this.diceValue);
    }

    setPiecePosition = (player, piece, newPosition) =>
    {
        this.currentPositions[player][piece] = newPosition;
        UI.setPiecePosition(player, piece, newPosition);
    }

    movePiece = (player, piece, moveBy) =>
    {
        const interval = setInterval(() =>
        {
            this.incrementPiecePosition(player, piece);
            moveBy--;

            if(moveBy === 0)
            {
                clearInterval(interval);

                // check if player won
                if(this.hasPlayerWon(player))
                {
                    document.querySelector('.Player-won span').innerText= `${player} has won.`;
                    this.resetGame();
                    return;
                }

                const isKill = this.checkForKill(player, piece);

                if(isKill || this.diceValue === 6)
                {
                    this.state = STATE.DICE_NOT_ROLLED;
                    return;
                }

                this.incrementTurn();
            }
        }, 200);
    }

    checkForKill = (player, piece) =>
    {
        const currentPosition = this.currentPositions[player][piece];
        const opponent = player === 'P1' ? 'P2' : 'P1';

        let kill = false;

        [0, 1, 2, 3].forEach(piece =>
            {
            const opponentPosition = this.currentPositions[opponent][piece];

            if(currentPosition === opponentPosition && !SAFE_POSITIONS.includes(currentPosition))
            {
                this.setPiecePosition(opponent, piece,
                BASE_POSITIONS[opponent][piece]);
                kill = true;
            }
        });

        return kill;
    }

    hasPlayerWon = (player) =>
    {
        return [0, 1, 2, 3].every(piece =>
        this.currentPositions[player][piece] === HOME_POSITIONS[player]);
    }

    incrementPiecePosition = (player, piece) =>
    {
        this.setPiecePosition(player, piece, this.getIncrementedPosition(player, piece));
    }

    getIncrementedPosition = (player, piece) =>
    {
        const currentPosition = this.currentPositions[player][piece];

        if(currentPosition === TURNING_POINTS[player])
        {
            return HOME_ENTRANCE[player][0];
        }
        else if(currentPosition === 51)
        {
            return 0;
        }
        return currentPosition + 1;
    }
}

const game = new Ludo();