import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import immutable from "immutable";

import NumberLineHeader from "./NumberLineHeader";
import NumberLineItem from "./NumberLineItem";

import { valueToPixel , getHeaderTickSpacing } from "./selectors";
import actions from "../actions";
import { BULLET_WIDTH_INCLUDING_MARGIN, MAX_ITEM_TEXT_WIDTH , MIN_HEADER_TICK_SPACING, VERTICAL_ITEM_SPACING } from "../constants";
import calcTextSize from "../utils/calcTextSize";
import immutableRecords from "../types/immutableRecords";

import "../styles/base.scss";
import "./NumberLine.scss";

const NumberLineView = props => {
  // Convert the passed in props.items into NumberLineItem
  // and also calculate the maximumValue so we know how far
  // to render the header.
  let maximumValue = 0;
  const itemComponents = props.items.map(it => {
    maximumValue = Math.max(maximumValue, it.value);
    return <NumberLineItem 
      key={it.id} 
      id={it.id} 
      value={it.value} 
      left={it.left} 
      width={it.width} 
      top={it.top} 
      label={it.label} 
    />;
  });
  maximumValue += props.tickSpacing;

  // Work out the scale drop down value based on unitsPerPixel
  const dropdownValue = props.unitsPerPixel * MIN_HEADER_TICK_SPACING;

  // Manually set the height of the items canvas
  const itemsStyle = {
    height: `${props.height + VERTICAL_ITEM_SPACING}px`
  };

  // Render the view, including:
  //  - scale dropdown at the top
  //  - number line header along the top
  //  - calculated items (above)
  return (
    <div className="numberLineView">
      <div className="numberLineSettings">
        <span>Scale:</span>
        <select value={dropdownValue} onChange={e => props.onChangeScale(e.target.value / MIN_HEADER_TICK_SPACING)}>
          <option>1</option>
          <option>2</option>
          <option>5</option>
          <option>10</option>
        </select>
      </div>
      <div className="numberLineCanvas">
        <NumberLineHeader maximum={maximumValue} unitsPerPixel={props.unitsPerPixel} tickSpacing={props.tickSpacing} onChangeScale={props.onChangeScale} />
        {/* <div className="numberLineItems" style={itemsStyle} onClick={e => props.onDelete(e.target)}> */}
        <div className="numberLineItems" style={itemsStyle} >
            {itemComponents} 
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  // Task 1: Modify to derive items from redux store ("state" parameter)
  // Need to modify the width of each of these items
  const unitsPerPixel = state.unitsPerPixel;
  const tickSpacing = getHeaderTickSpacing(unitsPerPixel);

  const itemsAsMap = [...state.items.entries()]

  let extractedItems = immutable.List()  //Seems kind of dodgy that I'm trying to do something immutable on a variable that is mutable

  let maxHeight = 0
  itemsAsMap.forEach((values) => {
    const {id, label, value} = values[1]
    const {width, height} = calcTextSize(label, MAX_ITEM_TEXT_WIDTH) 

    if (height > maxHeight) {
      maxHeight = height
    }
    const finalWidth = width + BULLET_WIDTH_INCLUDING_MARGIN
    const xCoordinate = valueToPixel(value, unitsPerPixel)
    const numberLineItem = immutableRecords.ItemDisplayRecord({
      id,
      label,
      value,
      width: finalWidth,
      height,
      left:xCoordinate,
      top: 0
    })
    extractedItems = extractedItems.push(numberLineItem)
   })
  
  
  //Sort list by lowest to highest number value
  let sortedItems = extractedItems.sort((a, b) => {
    if (a.value < b.value) { return -1; }
    if (a.value > b.value) { return 1; }
    if (a.value === b.value) { return 0; }
  });

  //Calculations for x coordinate
  let previous
  let previousXMaxWidth = 0
  let maxTop = 0
  let maxTopHeight = 0
  let nextEmptySpaceAtZeroY = 0

  let returnItems = immutable.List()
  //Need to calculate the correct 'top' (y coordinate) of each item
  sortedItems.forEach(item => {
    //Bring item to top if possible
    if(item.left > nextEmptySpaceAtZeroY) {
      nextEmptySpaceAtZeroY = item.left + item.width
    }
    
    //Otherwise the item needs to cascade down. 
    else if (item.left <= previousXMaxWidth) {
      item = item.set('top', (previous.top + previous.height + VERTICAL_ITEM_SPACING))
    } 

    previous = item
    returnItems = returnItems.push(item)
    previousXMaxWidth = previous.left + previous.width

    // Search for max depth/top and height for dynamic canvas size
    if (previous.top > maxTop) {
      maxTop = previous.top
      maxTopHeight = previous.height
    }
  })

  // Task 1: modify to calculate a correct height
  const height = maxTop + maxTopHeight + VERTICAL_ITEM_SPACING

  const items = immutable.List(returnItems)
  return {
      items,
      unitsPerPixel,
      tickSpacing,
      height
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onChangeScale: scale => {
      dispatch(actions.changeScale(scale));
      
    },
    // onDelete: idk => {
      // dispatch(actions.deleteItem(idk))
    //   console.log("dispatch tried to call delete item")
    // }

  };

};

NumberLineView.propTypes = {
  unitsPerPixel: PropTypes.number.isRequired,
  tickSpacing: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  items: PropTypes.any.isRequired,
  onChangeScale: PropTypes.func.isRequired,
  // onDelete: PropTypes.func.isRequired
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NumberLineView);