import React from 'react';

function Guess(props) {
  let isGameRunning = props.gameStatus === "running";
  return (
    <div className={isGameRunning ? "guess" : "hide"}>
      <form onSubmit={e => props.handleSubmitGuess(e)}>
        <input 
          type="text" 
          value={props.guessInput}
          id="guess-input"
          maxLength={1}
          onChange={e => props.handleUserGuess(e)}
          className={props.inputError ? "repeat" : ""}
        />
        <button type="submit">guess</button>
      </form>
      <h4 className="hint" onClick={props.getHint}>give me a hint!</h4>
    </div>
  );
}

export default Guess;