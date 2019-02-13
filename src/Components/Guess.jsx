import React from 'react';

function Guess(props) {
  let isGameRunning = props.gameStatus === "running";
  return (
    <div className={isGameRunning ? "guess" : "hide"}>
      <form onSubmit={e => props.handleSubmitGuess(e)}>
      {console.log(props.isLoading)}
        <input 
          type="text" 
          value={props.guessInput}
          id="guess-input"
          maxLength={1}
          onChange={e => props.handleUserGuess(e)}
          className={props.inputError ? "repeat" : ""}
        />
        <button 
          type="submit"
          disabled={props.isLoading}
        >
          {props.isLoading ? "loading" : "guess"}
        </button>
      </form>
      <h4 
        className={`hint${props.isLoading ? " hint-prevent" : ""}`} 
        onClick={(e) => props.handleGetHint(e)}
      >give me a hint!</h4>
    </div>
  );
}

export default Guess;