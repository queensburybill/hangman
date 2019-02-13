import React from 'react';
import Alphabet from './Alphabet';
import Definition from './Definition';

function Hangman(props) {
  // Hide if game is off, but if game is running show either
  // hangman puzzle or solution with appropriate color styling
  let isGameOff = props.gameStatus === "off";
  const word = props.gameStatus === "lost" 
    ? props.solution.split("")
    : props.hangman.split("");
  return (
    <div className="word">
      <div className={isGameOff? "hide" : "hangman"}>
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
      <Alphabet 
        gameStatus={props.gameStatus}
        lettersCorrect={props.lettersCorrect}
        lettersWrong={props.lettersWrong}
        handleAlphabetGuess={props.handleAlphabetGuess}
        />
      <Definition 
        gameStatus={props.gameStatus}
        definition={props.definition} 
      />
    </div>
  );
}

export default Hangman;