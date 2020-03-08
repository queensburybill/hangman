import React from 'react';

function WonLostMessage(props) {
  let message = props.gameStatus === "won" ? "You Won!" : "Game Over";
  return (
    <div className="won-lost">
      <h1>{message}</h1>
    </div>
  );
}

export default WonLostMessage;