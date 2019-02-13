import React from 'react';
import loader from "../img/loader.gif";

function GameLoading() {
  return (
    <div>
      <h2>Loading</h2>
      <img src={loader} alt="Loading..." />
    </div>
  );
}

export default GameLoading;