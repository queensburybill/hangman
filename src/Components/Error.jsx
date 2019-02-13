import React from 'react';

// The Error component renders an error message.

function Error(props) {
  return (
    <div>
      <p>{props.errorMessage}</p>
      <p>Please try again later.</p>
    </div>
  );
}

export default Error;