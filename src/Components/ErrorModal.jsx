import React from 'react';
import Error from './Error';

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