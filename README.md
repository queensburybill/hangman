# Hangman

The hangman app is designed for use with the [hangman-api](http://hangman-api.herokuapp.com/api) by [despo](https://github.com/despo/hangman) and also borrows stylistically from the despo app. THE REASON THIS APP RUNS SLOWLY: As of this writing the hangman-api includes an issue where one of the response headers doesn't set Access-Control-Allow-Origin to "*," thus causing a CORS error. My workaround for this is to prepend the API with a proxy server to avoid the browser's preflight request, however that appears to greatly influence the performance of the app. Eventually I'll build my own REST API to rectify this. Enjoy the game!

![Screen shot with game in progress ](./screenshots/hangman-sg.jpg?raw=true "Hangman")


## Getting Started

These instructions will get a copy of the project up and running on your local machine for development and testing purposes. For more information about the React framework please vist [Reactjs.org](https://reactjs.org/docs/getting-started.html).

### Prerequisites

1. Node v10.0.0+  
    Follow installation instructions at https://nodejs.org/en/download/
2. Yarn v1.10.1+ (optional)  
    From the terminal, type `npm install -g yarn`

### Installing

From the terminal, clone the repository by typing: 
```
git clone https://github.com/queensburybill/hangman.git
``` 
Then cd into the hangman directory and run `yarn install` followed by `yarn start`

Alternatively you can use `npm install` and `npm start` to start the app.

The app should open on localhost:3000. Enjoy.
