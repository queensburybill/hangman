import React from 'react';
import loader from "../img/loader.gif";

// The GameLoading component renders an animated loading gif
// while an HTTP request is getting the hangman puzzle, solution and definition.

function GameLoading() {
  return (
    <div>
      <h2>Loading</h2>
      <img src={loader} alt="Loading..." />
    </div>
  );
}

export default GameLoading;