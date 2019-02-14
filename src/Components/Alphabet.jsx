import React from 'react';

// The Alphabet component enders the letters of the alphabet as clickable elements
// for the user and indicates previous correct & incorrect choices.
// CSS causes the component display only when the game status is "running".

function Alphabet(props) {

  // It would be cheaper to do "abcd...".split(""), but I'm trying to look clever here.
  const alphabet = [...Array(26).keys()].map(num => String.fromCharCode(num + 97));

  return (
    <div className="alphabet">
      {alphabet.map(letter => {
        // letters are checked against previously used correct/wrong letters
        // in state and styled accordingly.
        let classname = "";
        if (props.lettersCorrect.includes(letter)) classname = "correct";
        if (props.lettersWrong.includes(letter)) classname = "wrong";
        return (
          <h4 
            key={letter} 
            id={letter}
            onClick={e => props.handleAlphabetGuess(e)}
            className={`${classname}${props.isLoading ? " alphabet-prevent" : ""}`}
          >
            {letter}
          </h4>
        );
      })}
    </div>
  );
}

export default Alphabet;