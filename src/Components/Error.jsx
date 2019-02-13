import React from 'react';

function Error(props) {
  return (
    <div>
      <p>{props.errorMessage}</p>
      <p>Please try again later.</p>
    </div>
  );
}

export default Error;