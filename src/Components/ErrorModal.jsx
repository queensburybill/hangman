import React from 'react';
import Error from './Error';

// The ErrorModal component renders a pop-up that contains an error message when 
// there's a problem with HTTP requests for a guess or hint (isError === true).

function ErrorModal(props) {
  return (
    <div className="error-modal-background">
      <div className="error-modal">
        <Error errorMessage={props.errorMessage} />
        <i 
          class="fas fa-times error-modal-close"
          onClick={props.closeErrorModal}
        ></i>
      </div>
    </div>
  );
}

export default ErrorModal;