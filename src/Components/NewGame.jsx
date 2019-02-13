import React from 'react';

function NewGame(props) {
  let isGameOff = props.gameStatus === "off";
  return (
    <div>
      <h1>{isGameOff? "hangman" : ""}</h1>
      <div className="start">
        <button 
          onClick={() => props.handleNewGame()}
        >start a new game</button>
      </div>
    </div>
  );
}

export default NewGame;