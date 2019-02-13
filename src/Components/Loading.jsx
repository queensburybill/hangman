import React from 'react';
import loader from "../img/loader.gif";

function Loading() {
  return (
    <div>
      <h2>Loading</h2>
      <img src={loader} alt="Loading..." />
    </div>
  );
}

export default Loading;