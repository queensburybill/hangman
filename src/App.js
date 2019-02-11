import React, { Component } from 'react';
import axios from 'axios';
import './App.css';


// ---  VIEWS  -------------------------------------------

function NewGame(props) {
  return (
    <div className="start">
      <button onClick={() => props.handleNewGame()}>start a new game</button>
    </div>
  );
}

function Hangman(props) {
  const word = props.hangman.split("");
  return (
    <div className="hangman">
      {word.map((letter, i) => <h1 key={i}>{letter}</h1>)}
    </div>
  );
}

function Alphabet(props) {
  const alphabet = [...Array(26).keys()].map(num => String.fromCharCode(num + 97));
  return (
    <div className="alphabet">
      {alphabet.map(letter => {
        let classname = "";
        if (props.lettersCorrect.includes(letter)) classname = "correct";
        if (props.lettersWrong.includes(letter)) classname = "wrong";
        return (
          <h4 
            key={letter} 
            id={letter}
            onClick={e => props.handleAlphabetGuess(e)}
            className={classname}
          >
            {letter}
          </h4>
        );
      })}
    </div>
  );
}

function Guess(props) {
  return (
    <div className="guess">
      <form onSubmit={e => props.handleSubmitGuess(e)}>
        <input 
          type="text" 
          value={props.guessInput}
          id="guess-input"
          onChange={e => props.handleUserGuess(e)}
          className={props.inputError ? "repeat" : ""}
        />
        <button type="submit">guess</button>
      </form>
      <h4 className="hint" onClick={props.getHint}>give me a hint!</h4>
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

function Loading() {
  return <p>Page is loading.</p>
}

function Error() {
  return <p>There was an error.</p>
}

// ---  APIs  ---------------------------------------------

const hangmanApi = "https://cors-anywhere.herokuapp.com/http://hangman-api.herokuapp.com";
const wordnikApi = "http://api.wordnik.com/v4/word.json";
// const wordnikApiKey = "a0b2b713bac5c6eab030c0fb4b9026fd1afb4aade138cdc3e";


// ---  APP COMPONENT  ------------------------------------

class App extends Component {
  state = {
    gameState: "off",
    hangman: "",
    token: "",
    solution: "",
    definition: "Here's a placeholder definition.",
    guessInput: "",
    inputError: false,
    lettersWrong: [],
    lettersCorrect: [],
    isLoading: false,
    isError: false,
    errorMessage: ""
  }

  handleNewGame = () => {
    this.setState({ 
      gameState: "running",
      guessInput: "",
      lettersCorrect: [],
      lettersWrong: [],
      inputError: false,
    }, () => this.getHangman());
  }

  handleUserGuess = (e) => {
    let guessInput = e.target.value;
    this.setState({ guessInput });
  }

  handleAlphabetGuess = (e) => {
    let guessInput = e.target.textContent;
    this.setState({ guessInput });
  }

  handleSubmitGuess = (e) => {
    e.preventDefault();
    this.submitGuess();
    this.setState({ 
      inputError: false,
      guessInput: ""
    });
  }

  handleGuessResponse = (letter, correct, status = null) => {
    if (status === 304) {
      this.setState({ inputError: true });
    } else if (correct) {
      let newLettersCorrect = this.state.lettersCorrect.concat(letter);
      this.setState({ lettersCorrect: newLettersCorrect });
    } else {
      let newLettersWrong = this.state.lettersWrong.concat(letter);
      this.setState({ lettersWrong: newLettersWrong });
    }
  }

  // ---  SERVICE WORKER  ------------------------------------
  
  send = (url, params = null, method = "GET") => {
    this.setState({ isLoading: true });
    return axios(url, {
      method,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded"
      },
      params: params || null
    }).then(response => {
      if (!response.data) {
        throw new Error("Invalid response from server.");
      } else { 
        return response.data;
      }
    })
    .catch((error)=> {
      if (error.response.status === 304) {
        return error.response.status;
      } else {
        this.setState({
          isLoading: false,
          isError: true,
          errorMessage: error.message
        }, console.log(error.message));
      }
    });
  };

  // ---  AJAX REQUESTS  ------------------------------------

  getHangman = () => {
    return this.send(`${hangmanApi}/hangman`, null, "POST")
      .then(response => {
        this.setState({
          hangman: response.hangman,
          token: response.token,
          isLoading: false
        }, () => this.getSolution(this.state.token));
      });
  }

  getHint = () => {
    let token = this.state.token;
    return this.send(`${hangmanApi}/hangman/hint`, { token })
      .then(response => {
        this.setState({
          guessInput: response.hint,
          token: response.token,
          isLoading: false
        });
      });
  }

// Don't get definition during development
  getSolution = (token) => {
    return this.send(`${hangmanApi}/hangman`, { token })
      .then(response => {
        this.setState({
          solution: response.solution,
          token: response.token,
          isLoading: false
        } //, () => this.getDefinition(wordnikApiKey)
        );
      });
  }

  getDefinition = (api_key) => {
    return this.send(`${wordnikApi}/${this.state.solution}/definitions`, { api_key })
      .then(response => {
        this.setState({
          definition: response[0] ? response[0].text : "",
          isLoading: false
        });
      });
  }

  submitGuess = () => {
    let token = this.state.token;
    let letter = this.state.guessInput;
    return this.send(`${hangmanApi}/hangman`, { token, letter }, "PUT")
      .then(response => {
        if (response === 304) {
          this.setState({ isLoading: false });
          return this.handleGuessResponse(letter, null, response);
        } else {
          let correct = response.correct;
          this.setState({
            hangman: response.hangman,
            token: response.token,
            isLoading: false
          }, () => this.handleGuessResponse(letter, correct));
        }
      });
  }

  // ---  RENDER  -----------------------------------------------

  render() {
    let misses = this.state.lettersWrong.length;
    return (
      this.state.isLoading 
      ? <Loading />
      : this.state.isError
        ? <Error />
        : (
        <div className="container">
          <div className="canvas">
            <div className="gallows gallows-a"></div>
            <div className="gallows gallows-b"></div>
            <div className="gallows gallows-c"></div>
            <div className="gallows gallows-d"></div>
            <div className={`gallows body-leg-r${misses < 6 ? " hide" : ""}${misses === 7 ? " red" : ""}`}></div>
            <div className={`gallows body-leg-l${misses < 5 ? " hide" : ""}${misses === 7 ? " red" : ""}`}></div>
            <div className={`gallows body-arm-r${misses < 4 ? " hide" : ""}${misses === 7 ? " red" : ""}`}></div>
            <div className={`gallows body-arm-l${misses < 3 ? " hide" : ""}${misses === 7 ? " red" : ""}`}></div>
            <div className={`gallows body-torso${misses < 2 ? " hide" : ""}${misses === 7 ? " red" : ""}`}></div>
            <div className={`body-head${misses < 1 ? " hide" : ""}${misses === 7 ? " red" : ""}`}></div>
          </div>
          <div className="interface">
            <main>
              {/* A new instance of the game displays the title and new game button. */}
              {this.state.gameState === "off" 
              ? (
                <div>
                  <h1>hangman</h1>
                  <NewGame handleNewGame={this.handleNewGame}/>
                </div>
              ) : (
                // A game that's running changes the view.
                <div>
                  <div className="word">
                    <Hangman hangman={this.state.hangman} />
                    {this.state.gameState === "running"
                    ? <Alphabet 
                        handleAlphabetGuess={this.handleAlphabetGuess}
                        lettersCorrect={this.state.lettersCorrect}
                        lettersWrong={this.state.lettersWrong}
                      />
                    : <h4 className="definition">{this.state.definition}</h4>
                    }
                  </div>
                  {/* A game that's either won or lost changes the view again. */}
                  {this.state.gameState === "running"
                  ? <Guess
                    token={this.state.token}
                    guessInput={this.state.guessInput}
                    inputError={this.state.inputError}
                    handleUserGuess={this.handleUserGuess}
                    getHint={this.getHint}
                    handleSubmitGuess={this.handleSubmitGuess}
                   />
                  : <WonLostMessage />
                  }
                  <NewGame handleNewGame={this.handleNewGame}/>
                </div>
              )}
            </main>
          </div>
        </div>
        )
    );
  }
}

export default App;
