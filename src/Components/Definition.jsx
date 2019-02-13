import React from 'react';

// The Definition component renders a definition provided by the wordnik API 
// and only appears when game status is "won" or "lost"

function Definition(props) {
  let isGameOver = props.gameStatus === "won" || props.gameStatus === "lost";
  return <h4 className={isGameOver? "definition" : "hide"}>{props.definition}</h4>
}

export default Definition;