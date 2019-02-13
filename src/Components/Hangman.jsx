import React from 'react';
import Alphabet from './Alphabet';
import Definition from './Definition';

// renders the hangman puzzle, alphabet list and definition
function Hangman(props) {

  let isGameOff = props.gameStatus === "off";

  const word = props.gameStatus === "lost" 
    ? props.solution.split("")
    : props.hangman.split("");

  return (
    // Hides puzzle if game is off
    // Renders puzzle if game is running
    <div className={isGameOff? "hide" : "word"}>
      <div className="hangman">

        {/* Renders solved puzzle with appropriate color styling if game is won or lost */}
        {word.map((letter, i) => {
          return (
            <h1 
              key={`hangman-${i}`}
              className={props.gameStatus === "won" 
                  ? "won" 
                  : props.gameStatus === "lost" && !props.lettersCorrect.includes(letter) 
                    ? "missed" 
                    : ""
              }
            >{letter}</h1>
          );
        })}
      </div>
      {/* an alphabet list to suggest choices and act as a reminder of used letters */}
      <Alphabet 
        gameStatus={props.gameStatus}
        lettersCorrect={props.lettersCorrect}
        lettersWrong={props.lettersWrong}
        isLoading={props.isLoading}
        handleAlphabetGuess={props.handleAlphabetGuess}
        />
      {/* replaces alphabet list upon game completion */}
      <Definition 
        gameStatus={props.gameStatus}
        definition={props.definition} 
      />
    </div>
  );
}

export default Hangman;