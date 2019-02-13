import React from 'react';
import './Gallows.css';

// The Gallows component renders the gallows artwork using DOM elements.

function Gallows(props) {
  let misses = props.lettersWrong.length;
  return (
  <div className="canvas">
    <div className="gallows gallows-a"></div>
    <div className="gallows gallows-b"></div>
    <div className="gallows gallows-c"></div>
    <div className="gallows gallows-d"></div>
    <div className={`gallows body-leg-r${misses < 6 ? " hide" : ""}${misses === 6 ? " red" : ""}`}></div>
    <div className={`gallows body-leg-l${misses < 5 ? " hide" : ""}${misses === 6 ? " red" : ""}`}></div>
    <div className={`gallows body-arm-r${misses < 4 ? " hide" : ""}${misses === 6 ? " red" : ""}`}></div>
    <div className={`gallows body-arm-l${misses < 3 ? " hide" : ""}${misses === 6 ? " red" : ""}`}></div>
    <div className={`gallows body-torso${misses < 2 ? " hide" : ""}${misses === 6 ? " red" : ""}`}></div>
    <div className={`body-head${misses < 1 ? " hide" : ""}${misses === 6 ? " red" : ""}`}></div>
  </div>
  );
}

export default Gallows;