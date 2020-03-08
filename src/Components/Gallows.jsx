import React from 'react';
import './Gallows.css';

// The Gallows component renders the gallows artwork using DOM elements.

function Gallows(props) {
  let misses = props.lettersWrong.length;
  return (
  <div className="canvas">
    <div className="gallows-wrap">
      <div className="gallows gallows-a"></div>
      <div className="gallows gallows-b"></div>
      <div className="gallows gallows-c"></div>
      <div className="gallows gallows-d"></div>
      <div className={`body-leg-r${misses < 6 ? " hide" : ""}`}></div>
      <div className={`body-leg-l${misses < 5 ? " hide" : ""}`}></div>
      <div className={`body-arm-r${misses < 4 ? " hide" : ""}`}></div>
      <div className={`body-arm-l${misses < 3 ? " hide" : ""}`}></div>
      <div className={`body-torso${misses < 2 ? " hide" : ""}`}></div>
      <div className={`body-head${misses < 1 ? " hide" : ""}`}></div>
    </div>
  </div>
  );
}

export default Gallows;