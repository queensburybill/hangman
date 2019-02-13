import React, { Component } from 'react';
import axios from 'axios';
import NewGame from './Components/NewGame';
import Gallows from './Components/Gallows';
import Hangman from './Components/Hangman';
import Guess from './Components/Guess';
import WonLostMessage from './Components/WonLostMessage';
import GameLoading from './Components/GameLoading';
import Error from './Components/Error';
import ErrorModal from './Components/ErrorModal';
import './App.css';

// ---  APIs  ---------------------------------------------

// hangman api:
// const hangmanApi = "http://hangman-api.herokuapp.com";

// hangman api prepended with proxy server to circumvent CORS error:
const hangmanApi = "https://cors-anywhere.herokuapp.com/http://hangman-api.herokuapp.com";

// wordnik api and api key to provide definitions
const wordnikApi = "http://api.wordnik.com/v4/word.json";
// const wordnikApiKey = "a0b2b713bac5c6eab030c0fb4b9026fd1afb4aade138cdc3e";


// ---  MAIN APP COMPONENT  ---------------------------------

class App extends Component {
  state = {
    gameStatus: "off",
    hangman: "",
    token: "",
    solution: "",
    definition: "Here's a much much longer placeholder definition for now", // switch this to ""
    guessInput: "",
    inputError: false,
    lettersWrong: [],
    lettersCorrect: [],
    isGameLoading: false,
    isLoading: false,
    isGameError: false,
    isError: false,
    errorMessage: ""
  }

  // start a new game
  handleNewGame = () => {
    this.setState({ 
      gameStatus: "running",
      guessInput: "",
      inputError: false,
      lettersCorrect: [],
      lettersWrong: [],
      isGameLoading: false,
      isLoading: false,
      isGameError: false,
      isError: false,
      errorMessage: ""
    }, () => this.getHangman());
  }

  // add user-typed letter to input field via state
  handleUserGuess = (e) => {
    let guessInput = e.target.value;
    this.setState({ guessInput });
  }

  // add chosen alphabet-list letter to input field via state - disallow repeat selection
  handleAlphabetGuess = (e) => {
    e.preventDefault();
    if (this.state.isLoading) return;
    let guessInput = e.target.id;
    let alreadyUsed = this.state.lettersCorrect.concat(this.state.lettersWrong);
    if (alreadyUsed.includes(guessInput)) return;
    this.setState({ 
      guessInput,
      inputError: false
    });
  }

  handleGetHint = (e) => {
    e.preventDefault();
    if (this.state.isLoading) return;
    this.setState({
      inputError: false
    }, () => this.getHint());
  }

  // send http request for guess - disallow empty guess
  handleSubmitGuess = (e) => {
    e.preventDefault();
    if (!this.state.guessInput) {
      this.setState({ inputError: true });
      return;
    }
    this.submitGuess();
    this.setState({ 
      inputError: false,
      guessInput: ""
    });
  }

  // handle repeat letter error (status code 304)
  // add correctly/incorrectly guessed letters to corresponding props in state
  handleGuessResponse = (letter, correct, status = null) => {
    if (status === 304) {
      this.setState({ inputError: true });
    } else if (correct) {
      let newLettersCorrect = this.state.lettersCorrect.concat(letter);
      let gameStatus = this.state.hangman === this.state.solution ? "won" : "running";
      this.setState({ 
        lettersCorrect: newLettersCorrect,
        gameStatus
      });
    } else {
      let newLettersWrong = this.state.lettersWrong.concat(letter);
      let gameStatus = newLettersWrong.length >= 6 ? "lost" : "running";
      this.setState({ 
        lettersWrong: newLettersWrong,
        gameStatus
      });
    }
  }

  // handle new game & get solution errors
  handleGameError = (err) => {
    this.setState({
      isGameLoading: false,
      isGameError: true,
      errorMessage: err.message
    }, console.log(err.message));
  }

  // handle all other errors - status code 304 gets forwarded to handleGuessResponse
  handleError = (err) => {
    if (err.response && err.response.status === 304) {
      this.setState({
        isLoading: false,
        errorMessage: err.message
      }, () => {
        this.handleGuessResponse(null, null, 304);
        console.log(err.message);
      });
      ;
    } else {
      this.setState({
        isLoading: false,
        isError: true,
        errorMessage: err.message
      }, console.log(err.message));
    }
  }

  closeErrorModal = () => {
    this.setState({ isError: false });
  }

  // ---  REQUESTS WORKER  ------------------------------------
  
  send = (url, params = null, method = "GET") => {
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
    });
  }

  // ---  HTTP REQUESTS  ------------------------------------

  getHangman = () => {
    this.setState({ isGameLoading: true });
    return this.send(`${hangmanApi}/hangman`, null, "POST")
      .then(response => {
        this.setState({
          hangman: response.hangman,
          token: response.token,
          isGameLoading: false
        }, () => this.getSolution(this.state.token));
      })
      .catch((error)=> {
        this.handleGameError(error);
      });
  }

  getHint = () => {
    this.setState({ isLoading: true });
    let token = this.state.token;
    return this.send(`${hangmanApi}/hangman/hint`, { token })
      .then(response => {
        this.setState({
          guessInput: response.hint,
          token: response.token,
          isLoading: false
        });
      })
      .catch((error)=> {
        this.handleError(error);
      });
  }

  getSolution = (token) => {
    this.setState({ isGameLoading: true });
    return this.send(`${hangmanApi}/hangman`, { token })
      .then(response => {
        this.setState({
          solution: response.solution,
          token: response.token,
          isGameLoading: false
        },// () => this.getDefinition(wordnikApiKey)   TURN THIS BACK ON WHEN READY!!!
        );
      })
      .catch((error)=> {
        this.handleGameError(error);
      });
  }

  // gets a definition from the wordnik API
  getDefinition = (api_key) => {
    this.setState({ isGameLoading: true });
    return this.send(`${wordnikApi}/${this.state.solution}/definitions`, { api_key })
      .then(response => {
        this.setState({
          definition: response[0] ? response[0].text : "",
          isGameLoading: false
        });
      })
      // Errors caught here result in the game proceeding without a definition
      .catch((error)=> {
        console.log(error);
      });
  }

  // submits guesses from all guess handlers
  submitGuess = () => {
    this.setState({ isLoading: true });
    let token = this.state.token;
    let letter = this.state.guessInput;
    return this.send(`${hangmanApi}/hangman`, { token, letter }, "PUT")
      .then(response => {
        let correct = response.correct;
          this.setState({
            hangman: response.hangman,
            token: response.token,
            isLoading: false
          }, () => this.handleGuessResponse(letter, correct));
      })
      .catch((error)=> {
        this.handleError(error);
      });
  }

  // ---  RENDER  -----------------------------------------------

  render() {
    return (
      <div className="container">
        <Gallows 
          lettersWrong={this.state.lettersWrong}
        />
        <div className="interface">
          <main>
            {this.state.isGameLoading 
            // shows loading widget while a new game is loading
            ? <GameLoading />
            : this.state.isGameError
              // shows an error widget if there's a problem creating a new game
              ? <Error errorMessage={this.state.errorMessage} />
              : (
                // views are shown or hidden based on the state of the game and CSS
                <div>
                  <Hangman 
                    gameStatus={this.state.gameStatus}
                    hangman={this.state.hangman} 
                    solution={this.state.solution}
                    lettersCorrect={this.state.lettersCorrect}
                    lettersWrong={this.state.lettersWrong}
                    definition={this.state.definition} 
                    isLoading={this.state.isLoading}
                    handleAlphabetGuess={this.handleAlphabetGuess}
                  />
                  <Guess
                    gameStatus={this.state.gameStatus} 
                    token={this.state.token}
                    guessInput={this.state.guessInput}
                    inputError={this.state.inputError}
                    isLoading={this.state.isLoading}
                    handleUserGuess={this.handleUserGuess}
                    handleGetHint={this.handleGetHint}
                    handleSubmitGuess={this.handleSubmitGuess}
                  />
                  <WonLostMessage
                    gameStatus={this.state.gameStatus} 
                  />
                  <NewGame 
                    gameStatus={this.state.gameStatus}
                    handleNewGame={this.handleNewGame}
                  />
                </div>
              )}
          </main>
          {this.state.isError && 
          // a pop-up which allows one to possibly keep playing after an error
          <ErrorModal 
            errorMessage={this.state.errorMessage} 
            closeErrorModal={this.closeErrorModal}
          />}
        </div>
      </div>
    );
  }
}

export default App;
