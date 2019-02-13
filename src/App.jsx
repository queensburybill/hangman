import React, { Component } from 'react';
import axios from 'axios';
import NewGame from './Components/NewGame';
import Gallows from './Components/Gallows';
import Hangman from './Components/Hangman';
import Guess from './Components/Guess';
import WonLostMessage from './Components/WonLostMessage';
import Loading from './Components/Loading';
import Error from './Components/Error';
import './App.css';

// ---  APIs  ---------------------------------------------

const hangmanApi = "http://hangman-api.herokuapp.com";
// const hangmanApi = "https://cors-anywhere.herokuapp.com/http://hangman-api.herokuapp.com";
const wordnikApi = "http://api.wordnik.com/v4/word.json";
// const wordnikApiKey = "a0b2b713bac5c6eab030c0fb4b9026fd1afb4aade138cdc3e";


// ---  MAIN APP COMPONENT  ---------------------------------

class App extends Component {
  state = {
    gameStatus: "off",
    hangman: "",
    token: "",
    solution: "",
    definition: "Here's a placeholder definition.", // remember to change this back to ""
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
      gameStatus: "running",
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
    let guessInput = e.target.id;
    let alreadyUsedCorrect = this.state.lettersCorrect.includes(guessInput);
    let alreadyUsedWrong = this.state.lettersWrong.includes(guessInput);
    if (alreadyUsedCorrect || alreadyUsedWrong) return;
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

  // ---  REQUEST WORKER  ------------------------------------
  
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
    });
  }

  // ---  AJAX REQUESTS  ------------------------------------

  getHangman = () => {
    return this.send(`${hangmanApi}/hangman`, null, "POST")
      .then(response => {
        this.setState({
          hangman: response.hangman,
          token: response.token,
          isLoading: false
        }, () => this.getSolution(this.state.token));
      })
      .catch((error)=> {
        this.handleError(error);
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
      })
      .catch((error)=> {
        this.handleError(error);
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
      })
      .catch((error)=> {
        this.handleError(error);
      });
  }

  getDefinition = (api_key) => {
    return this.send(`${wordnikApi}/${this.state.solution}/definitions`, { api_key })
      .then(response => {
        this.setState({
          definition: response[0] ? response[0].text : "",
          isLoading: false
        });
      })
      .catch((error)=> {
        this.handleError(error);
      });
  }

  submitGuess = () => {
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
            {this.state.isLoading 
            ? <Loading />
            : this.state.isError
              ? <Error errorMessage={this.state.errorMessage} />
              : (
                <div>
                  <Hangman 
                    gameStatus={this.state.gameStatus}
                    hangman={this.state.hangman} 
                    solution={this.state.solution}
                    lettersCorrect={this.state.lettersCorrect}
                    lettersWrong={this.state.lettersWrong}
                    definition={this.state.definition} 
                    handleAlphabetGuess={this.handleAlphabetGuess}
                  />
                  <Guess
                    gameStatus={this.state.gameStatus} 
                    token={this.state.token}
                    guessInput={this.state.guessInput}
                    inputError={this.state.inputError}
                    handleUserGuess={this.handleUserGuess}
                    getHint={this.getHint}
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
        </div>
      </div>
    );
  }
}

export default App;
