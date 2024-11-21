/*******************************Constants**********************************/

const stepLength = 6.66;
const players = ['P1', 'P2'];
const basePositions = 
{
    P1: [81, 82, 83, 84],
    P2: [96, 97, 98, 99],
};

const startPositions = 
{
    P1: 0,
    P2: 26
};

const homeEntrance = 
{
    P1: [60, 61, 62, 63, 64],
    P2: [75, 76, 77, 78, 79]
};

const homePositions = 
{
    P1: 65,
    P2: 80
};

const turningPoints = 
{
    P1: 50,
    P2: 24
};

const safePositions = [0, 8, 13, 21, 26, 34, 39, 47];
const states =
{
    diceNotRolled: 'Dice Not Rolled',
    diceRolled: 'Dice Rolled',
};


const diceButtonElement = document.querySelector('#dice-btn');
const playerPiecesElements = 
{
    P1: document.querySelectorAll('[player-id="P1"].player-piece'),
    P2: document.querySelectorAll('[player-id="P2"].player-piece'),
};


const coordinatesMapping =
{
    // Steps
    0: [6, 13], 1: [6, 12], 2: [6, 11], 3: [6, 10], 4: [6, 9], 5: [5, 8], 6: [4, 8], 7: [3, 8], 8: [2, 8], 9: [1, 8], 10: [0, 8], 11: [0, 7], 12: [0, 6], 13: [1, 6], 14: [2, 6], 15: [3, 6], 16: [4, 6], 17: [5, 6], 18: [6, 5], 19: [6, 4], 20: [6, 3], 21: [6, 2], 22: [6, 1], 23: [6, 0], 24: [7, 0], 25: [8, 0], 26: [8, 1], 27: [8, 2], 28: [8, 3], 29: [8, 4], 30: [8, 5], 31: [9, 6], 32: [10, 6], 33: [11, 6], 34: [12, 6], 35: [13, 6], 36: [14, 6], 37: [14, 7], 38: [14, 8], 39: [13, 8], 40: [12, 8], 41: [11, 8], 42: [10, 8], 43: [9, 8], 44: [8, 9], 45: [8, 10], 46: [8, 11], 47: [8, 12], 48: [8, 13], 49: [8, 14], 50: [7, 14], 51: [6, 14],
    // Homes
    // For Player1
    60: [7, 13], 61: [7, 12], 62: [7, 11], 63: [7, 10], 64: [7, 9], 65: [7, 8],
    // For Player2
    75: [7, 1], 76: [7, 2], 77: [7, 3], 78: [7, 4], 79: [7, 5], 80: [7, 6],

    // Bases
    // For Player1
    81: [1.5, 10.58], 82: [3.57, 10.58], 83: [1.5, 12.43], 84: [3.57, 12.43],
    // For Player2
    96: [10.5, 1.58], 97: [12.54, 1.58], 98: [10.5, 3.45], 99: [12.54, 3.45],
};

/*****************Classes, Functions and EventListeners***********************/
class frontEnd
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

        const [x, y] = coordinatesMapping[newPosition];

        const pieceElement = playerPiecesElements[player][piece];
        pieceElement.style.top = y * stepLength + '%';
        pieceElement.style.left = x * stepLength + '%';
    }

    static setTurn = (index) => 
    {

        const player = players[index];
        document.querySelector('.active-player span').innerText= player;

        const activePlayerBase = document.querySelector('.player-base.highlight');
        if(activePlayerBase) 
        {
            activePlayerBase.classList.remove('highlight');
        }

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


class ludoGame
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
        frontEnd.setDiceValue(value);
    }

    _turn;
    get turn()
    {
        return this._turn;
    }
    set turn(value)
    {
        this._turn = value;
        frontEnd.setTurn(value);
    }

    _state;
    get state()
    {
        return this._state;
    }
    set state(value)
    {
        this._state = value;

        if(value === states.diceNotRolled)
        {
            frontEnd.enableDice();
            frontEnd.unhighlightPieces();
        }
        else
        {
            frontEnd.disableDice();
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
        frontEnd.listenDiceClick(this.onDiceClick);
    }

    onDiceClick = () =>
    {
        this.diceValue = 1 + Math.floor(Math.random() * 6);
        this.state = states.diceRolled;

        this.checkForEligiblePieces();
    }

    checkForEligiblePieces = () =>
    {
        const player = players[this.turn]
        const eligiblePieces = this.getEligiblePieces(player);
        if(eligiblePieces.length) 
        {
            frontEnd.highlightPieces(player, eligiblePieces);
        }
        else
        {
            this.incrementTurn();
        }
    }

    incrementTurn = () =>
    {
        this.turn = this.turn === 0 ? 1 : 0;
        this.state = states.diceNotRolled;
    }

    getEligiblePieces = (player) =>
    {
        return [0, 1, 2, 3].filter(piece =>
        {
            const currentPosition =
             this.currentPositions[player][piece];

            if(currentPosition === homePositions[player])
            {
                return false;
            }

            if(basePositions[player].includes(currentPosition) && this.diceValue !== 6)
            {
                return false;
            }

            if( homeEntrance[player].includes(currentPosition) && this.diceValue > homePositions[player]  - currentPosition)
            {
                return false;
            }

            return true;
        });
    }

    listenResetClick = () =>
    {
        frontEnd.listenResetClick(this.resetGame);
    }

    resetGame = () =>
    {
        this.currentPositions = structuredClone(basePositions);

        players.forEach(player =>
        {
            [0, 1, 2, 3].forEach(piece =>
            {
                this.setPiecePosition(player, piece, this.currentPositions[player][piece]);
            });
        });

        this.turn = 0;
        this.state = states.diceNotRolled;
    }

    listenPieceClick = () =>
    {
        frontEnd.listenPieceClick(this.onPieceClick);
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

        if(basePositions[player].includes(currentPosition))
        {
            this.setPiecePosition(player, piece,startPositions[player]);
            this.state = states.diceNotRolled;
            return;
        }

        frontEnd.unhighlightPieces();
        this.movePiece(player, piece, this.diceValue);
    }

    setPiecePosition = (player, piece, newPosition) =>
    {
        this.currentPositions[player][piece] = newPosition;
        frontEnd.setPiecePosition(player, piece, newPosition);
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
                if(this.hasPlayerWon(player))
                {
                    document.querySelector('.Player-won span').innerText= `${player} has won.`;
                    this.resetGame();
                    return;
                }

                const isKill = this.checkForKill(player, piece);
                if(isKill || this.diceValue === 6)
                {
                    this.state = states.diceNotRolled;
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

            if(currentPosition === opponentPosition && !safePositions.includes(currentPosition))
            {
                this.setPiecePosition(opponent, piece,
                basePositions[opponent][piece]);
                kill = true;
            }
        });

        return kill;
    }

    hasPlayerWon = (player) =>
    {
        return [0, 1, 2, 3].every(piece =>
        this.currentPositions[player][piece] === homePositions[player]);
    }

    incrementPiecePosition = (player, piece) =>
    {
        this.setPiecePosition(player, piece, this.getIncrementedPosition(player, piece));
    }

    getIncrementedPosition = (player, piece) =>
    {
        const currentPosition = this.currentPositions[player][piece];

        if(currentPosition === turningPoints[player])
        {
            return homeEntrance[player][0];
        }
        else if(currentPosition === 51)
        {
            return 0;
        }
        return currentPosition + 1;
    }
}

const game = new ludoGame();
