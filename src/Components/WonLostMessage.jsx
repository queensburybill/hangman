import React from 'react';

function WonLostMessage(props) {
  let isGameOver = props.gameStatus === "won" || props.gameStatus === "lost";
  let message = props.gameStatus === "won" ? "You Won!" : "Game Over";
  return (
    <div className={isGameOver ? "won-lost" : "hide"}>
      <h1 className={props.gameStatus === "won" ? "won" : "lost"}>
        {message}
      </h1>
    </div>
  );
}

export default WonLostMessage;