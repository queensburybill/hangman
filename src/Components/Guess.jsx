import React from 'react';

// The Guess component renders the guess input field, and guess/hint buttons
// It displays via CSS whenever the game status is "running".

function Guess(props) {
  return (
    <div className="guess">
      <form onSubmit={e => props.handleSubmitGuess(e)}>
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
        className={`hint ${props.isLoading ? "hint-prevent" : ""}`} 
        onClick={(e) => props.handleGetHint(e)}
      >give me a hint!</h4>
    </div>
  );
}

export default Guess;