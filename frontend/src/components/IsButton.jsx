import React from 'react'
import { Button } from 'semantic-ui-react'
import PropTypes from 'prop-types';

const IsButton = ({ label, onClick, color }) => {
    return (
      <Button onClick={onClick} color={color}>
        {label} {/* The button label is set based on the passed 'label' prop */}
      </Button>
    );
  };

IsButton.propTypes = {
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    color: PropTypes.string,
    };

export default IsButton
