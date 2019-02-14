import React from 'react';
import Alphabet from './Alphabet';
import Definition from './Definition';

// The Hangman component renders the hangman puzzle, alphabet list and definition.
// It only display via CSS if the status of the game is not "off".

function Hangman(props) {

  // decides whether to show the puzzle or the solution
  const word = props.gameStatus === "lost" 
    ? props.solution.split("")
    : props.hangman.split("");

  return (
    <div className="word">
      <div className="hangman">

        {/* renders solved puzzle with appropriate color styling if game is won or lost */}
        {word.map((letter, i) => {
          return (
            <h1 
              key={`hangman-${i}`}
              className={props.gameStatus === "lost" && !props.lettersCorrect.includes(letter) 
                    ? "missed" 
                    : ""
              }
            >{letter}</h1>
          );
        })}
      </div>
      {/* an alphabet list to suggest choices and act as a reminder of used letters */}
      <Alphabet 
        lettersCorrect={props.lettersCorrect}
        lettersWrong={props.lettersWrong}
        isLoading={props.isLoading}
        handleAlphabetGuess={props.handleAlphabetGuess}
        />
      {/* replaces alphabet list upon game completion */}
      <Definition 
        definition={props.definition} 
      />
    </div>
  );
}

export default Hangman;