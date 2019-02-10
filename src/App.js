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
      {alphabet.map(letter => <h4 key={letter}>{letter}</h4>)}
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

function Loading() {
  return <p>Page is loading.</p>
}

function Error() {
  return <p>There was an error.</p>
}

// ---  APIs  ---------------------------------------------

const hangmanApi = "http://hangman-api.herokuapp.com";
const wordnikApi = "http://api.wordnik.com/v4/word.json";
const wordnikApiKey = "a0b2b713bac5c6eab030c0fb4b9026fd1afb4aade138cdc3e";


// ---  APP COMPONENT  ------------------------------------

class App extends Component {
  state = {
    gameState: "off",
    hangman: "",
    token: "",
    solution: "",
    definition: "",
    guessInput: "",
    inputError: false,
    lettersWrong: [],
    lettersCorrect: [],
    isLoading: false,
    isError: false,
    errorMessage: ""
  }

  handleNewGame = () => {
    this.setState({ gameState: "running" }, () => this.getHangman());
  }

  // ---  SERVICE WORKER  ------------------------------------
  
  send = (hangmanApi, params = null, method = "GET") => {
    this.setState({ isLoading: true });
    return axios(hangmanApi, {
      method,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      params: params || null
      // params: params ? JSON.stringify(params) : null
    }).then(response => {
      if (!response.data) {
        throw new Error("Invalid response from server.");
      } else { 
        return response.data;
      }
    })
    .catch((error)=> {
      this.setState({
        isLoading: false,
        isError: true,
        errorMessage: error.message
      }, console.log(error.message));
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

  getSolution = (token) => {
    return this.send(`${hangmanApi}/hangman`, { token })
      .then(response => {
        this.setState({
          solution: response.solution,
          token: response.token,
          isLoading: false
        }, () => this.getDefinition(wordnikApiKey));
      });
  }

  getDefinition = (api_key) => {
    return this.send(`${wordnikApi}/${this.state.solution}/definitions`, { api_key })
      .then(response => {
        console.log(response);
        this.setState({
          definition: response[0].text,
          isLoading: false
        });
      });
  }

  render() {
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
                    ? <Alphabet />
                    : <h4 className="definition">{this.state.definition}</h4>
                    }
                  </div>
                  {/* A game that's either won or lost changes the view again. */}
                  {this.state.gameState === "running"
                  ? <Guess />
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
