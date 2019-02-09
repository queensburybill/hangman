import React, { Component } from 'react';
import './App.css';

function NewGame(props) {
  return (
    <div className="start">
      {/* <h1>hangman</h1> */}
      <button>start a new game</button>
    </div>
  );
}

function Alphabet(props) {
  const alphabet = [...Array(26).keys()].map(num => String.fromCharCode(num + 97));
  return (
    <div className="alphabet">
      {alphabet.map(letter => {
        return (
          <h4>{letter}</h4>
        );
      })}
    </div>
  );
}

function Guess(props) {
  return (
    <div className="guess">
      <form>
        <input type="text" />
        <button type="submit">guess</button>
        <h4 className="hint">give me a hint!</h4>
      </form>
    </div>
  );
}

function WonLostMessage(props) {
  return (
    <div className="won-lost">
      <h1 className="won">You Win!</h1>
    </div>
  );
}

class App extends Component {
  state = {
    gameState: "won",
    word: "s_p___i_ii___s__ss",
    guessInput: "",
    inputError: false,
    lettersWrong: [],
    lettersCorrect: [],
    definition: "Haughtily disdainful or contemptuous, as a person or a facial expression.",
    token: "",
    isLoading: false,
    isError: false
  }

  render() {
    return (
      <div className="container">
        <div className="canvas">
          <div className="gallows gallows-a"></div>
          <div className="gallows gallows-b"></div>
          <div className="gallows gallows-c"></div>
          <div className="gallows gallows-d"></div>
        </div>
        <div className="interface">
          <main>
            {this.state.gameState === "off" 
            ? (
              <div>
                <h1>hangman</h1>
                <NewGame />
              </div>
            ) : (
              <div>
                <div className="word">
                  <h1>{this.state.word}</h1>
                  <Alphabet />
                </div>
                {this.state.gameState === "running"
                ? <Guess />
                : <WonLostMessage />
                }
                <NewGame />
              </div>
              )
           }
          </main>
        </div>
      </div>
    );
  }
}

export default App;
