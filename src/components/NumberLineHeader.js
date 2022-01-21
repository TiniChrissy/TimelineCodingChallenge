import React from "react";
import PropTypes from "prop-types";
import { valueToPixel } from "./selectors";

// Display the number line header along the top of the view.
// You shouldn't need to edit this file.

const NumberLineHeader = props => {
  const tickMarks = [];
  
  const width = props.maximum / props.unitsPerPixel;

  for (let i=0; i<props.maximum; i+=props.tickSpacing) {
    let text = String(i);
    let tickStyle = {
        left: valueToPixel(i, props.unitsPerPixel)
    };
    tickMarks.push(<div className="numberLineTick" key={i} style={tickStyle}>{text}</div>);
  }

  const headerStyle = {
    width
  };

  return (
    <div className="numberLineHeader" style={headerStyle}>
      <div className="numberLineHeaderCanvas">
        {tickMarks}
      </div>
    </div>
  );
};

NumberLineHeader.propTypes = {
  tickSpacing: PropTypes.number.isRequired,
  unitsPerPixel: PropTypes.number.isRequired,
  maximum: PropTypes.number.isRequired
};

export default NumberLineHeader;
