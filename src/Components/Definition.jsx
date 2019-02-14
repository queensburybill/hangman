import React from 'react';

// The Definition component renders a definition provided by the wordnik API. 
// It displays via CSS when game status is "won" or "lost"

function Definition(props) {
  return <h4 className="definition">{props.definition}</h4>
}

export default Definition;