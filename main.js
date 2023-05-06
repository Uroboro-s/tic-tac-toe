
"use strict";

//'player' factory,,includes getSign() which returns the sign of a player 
const Player = (sign) =>{
    this.sign = sign;

    const getSign = () => {
        return sign;
    };
    return {getSign};

};


// module to show state of the board
const gameBoard = ( () => {
    const board = ["", "", "", "", "", "", "", "", ""];
    
    // changes the value of a square by taking index and sign(that
    // you want there) as parameters
    const changeSquare = (index, sign) =>{
        if(index > board.length) return;
        board[index] = sign;
        console.log(board);
    };

    //used to return what sign is at a particular index
    const getSquare = (index) =>{
        if(index > board.length) return;
        console.log(board);
        return board[index];
    };

    //used to reset the array for when game restarts
    const reset = () =>{
        for(let i=0; i< board.length; i++){
            board[i] = "";
        }
        console.log(board);
    };


    return { changeSquare, getSquare, reset};
})();


//this module updates display of the screen including
//message displays and board display
const displayController = (() => {
    
    const messageElement = document.getElementById('message-box');
    const resetButton = document.getElementById('reset-button');
    const squareElements = document.querySelectorAll('.squares');

    


    //updates the gameBoard after each turn,,also
    //used to update board when game restarts
    const updateGameboard = () =>{
        for(let i=0; i < squareElements.length; i++){
            squareElements[i].textContent = gameBoard.getSquare(i);
            updateClassList(i, gameBoard.getSquare(i));
        }
    };

    //updates classList
    //controls which color is assigned according to the sign
    const updateClassList = (index, sign) =>{
        squareElements[index].classList = `squares ${sign}`;
    }

    //specific case where a winner has beem declared
    const winnerMessage = (winnerSign) =>{
        if(winnerSign === "Draw"){
            messageOutput("It's a draw!");
        }
        else{
            messageOutput(`Player ${winnerSign} has won!`);
        }
        
    };

    //outputs any message on the 'messageElement'
    const messageOutput = (message) => {
        messageElement.textContent = message;
    };


    //adds event listeners to all the squares
    squareElements.forEach( (item) =>{
        item.addEventListener('click', (e) =>{
            if(gameController.getIsOver() || e.target.textContent !== "")   return;
            gameController.playRound(parseInt(e.target.dataset.index));
            updateGameboard();
        })
    });


    //reset function to reset all display from the screen and also reset
    //all other functions and their private variables
    resetButton.addEventListener('click', (e) => {
        console.log("hh");
        gameBoard.reset();
        gameController.reset();
        updateGameboard();
        messageOutput("Player X's turn");
    });


    
    return {messageOutput, winnerMessage};

})();

// this module will control the flow of the game
const gameController = (() => {
    const playerX = Player("X");
    const playerO = Player("O");

    let round = 1;
    let isOver = false;


    //handles the sequence of function calling and other data updation
    //whenever a round is played
    //has 3 scenarios where
    //1. person may have won :- checkWinner()
    //2.person may have drawn: round === 9
    //3.if neither is true then game is still ongoing and turn changes
    const playRound =(index) =>{
        
        gameBoard.changeSquare(index, getActivePlayerSign());  

        if(checkWinner()){
            displayController.winnerMessage(getActivePlayerSign());
            isOver = true;
            return;
        }
        if(round === 9){
            displayController.winnerMessage("Draw")
            isOver = true;
            return;
        }

        round++;
        displayController.messageOutput(
            `Player ${getActivePlayerSign()}'s turn`
        );

    };


    //player x moves first in 'odd' rounds and then player O moves at
    //'even' rounds
    const getActivePlayerSign = () =>{
        return round%2===0 ? playerO.getSign() :playerX.getSign();
    };

    //checks if player won or not,, returns true if he did
    //and false if he did not 
    const checkWinner = () =>{
        const winConditions = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ]
        const signBoard = [];
        for(let i=0; i<9; i++){
            if(gameBoard.getSquare(i) === getActivePlayerSign())
                signBoard.push(i);
        }
        
        for(let i=0; i < winConditions.length; i++){
            if(winConditions[i].every(o => signBoard.includes(o)))
                return true;
        }
        
           return false; 
            
    };

    
    //returns value of 'isOver' to check if game has ended or not
    const getIsOver = () =>{
        return isOver;
    };

    const reset = () =>{
        isOver = false;
        round = 1;
    };


    return {playRound, getIsOver, reset};
})();


console.log(displayController);
console.log(gameController);
console.log(gameBoard);


