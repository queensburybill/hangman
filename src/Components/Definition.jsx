import React from 'react';

function Definition(props) {
  let isGameOver = props.gameStatus === "won" || props.gameStatus === "lost";
  return <h4 className={isGameOver? "definition" : "hide"}>{props.definition}</h4>
}

export default Definition;