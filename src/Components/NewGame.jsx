import React from 'react';

// The NewGame component renders the "Hangman" title if the game status
// is "running" and the "start a new game" button at all times.

function NewGame(props) {
  let isGameOff = props.gameStatus === "off";
  return (
    <div>
      <h1 className="title">{isGameOff? "hangman" : ""}</h1>
      <div className="start">
        <button 
          onClick={() => props.handleNewGame()}
        >start a new game</button>
      </div>
    </div>
  );
}

export default NewGame;