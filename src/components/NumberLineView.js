import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import NumberLineHeader from "./NumberLineHeader";
import NumberLineItem from "./NumberLineItem";

import immutable from "immutable";
import { valueToPixel } from "./selectors";

import calcTextSize from "../utils/calcTextSize";
import immutableRecords from "../types/immutableRecords";

import { BULLET_WIDTH_INCLUDING_MARGIN, MAX_ITEM_TEXT_WIDTH } from "../constants";

import "../styles/base.scss";
import "./NumberLine.scss";
import { getHeaderTickSpacing } from "./selectors";
import actions from "../actions";
import { MIN_HEADER_TICK_SPACING, VERTICAL_ITEM_SPACING } from "../constants";

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
      label={it.label} />;
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
        <div className="numberLineItems" style={itemsStyle}>
            {itemComponents}
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  // Task 1: Modify to derive items from redux store ("state" parameter)
  // console.log(state)
  // Need to modify the width of each of these items
  const unitsPerPixel = state.unitsPerPixel;
  const tickSpacing = getHeaderTickSpacing(unitsPerPixel);

  const itemsAsMap = [...state.items.entries()]
  // console.log(itemsAsMap);

  let items = immutable.List()  //Seems kind of dodgy that I'm trying to do something immutable on a variable that is mutable
  let usedUpXSpace = []
  let allX = []
  itemsAsMap.forEach((values) => {
    const record = values[1]
    const {id, label, value} = record
    // console.log(`${keys}, ${values}`)
    // console.log(values)
    const {width, height} = calcTextSize(label, MAX_ITEM_TEXT_WIDTH) 
    const finalWidth = width + BULLET_WIDTH_INCLUDING_MARGIN
    // console.log(`width: ${finalWidth}, height: ${height}`)

    const xCoordinate = valueToPixel(value, unitsPerPixel)
    const actualNumberLineItemRecord = immutableRecords.ItemDisplayRecord({
      id,
      label,
      value,
      width: finalWidth,
      height,
      left:xCoordinate,
      top: 0//items.last(0).height //20// valueToPixel(height, unitsPerPixel)
    })
    // console.log(finalWidth)
    items = items.push(actualNumberLineItemRecord)
    // console.log(items.last().height)
    // usedUpXSpace.push([xCoordinate, xCoordinate+finalWidth])
    allX.push(xCoordinate)
   })

  //  while (!(nextItem = items.next())) {
  //   const element = nextItem.value;
  //   console.log(element);
  // }
  
  let returnItems = immutable.List()
  let bbb = items.sort((a, b) => {
    if (a.value < b.value) { return -1; }
    if (a.value > b.value) { return 1; }
    if (a.value === b.value) { return 0; }
  });

  bbb.forEach(item => {
    console.log(item.value)
  })

  let previous
  let previousXAndWidth = 0
  bbb.forEach((item, index) => {
    console.log(`current item: ${index + 1}`)
    if (item.left <= previousXAndWidth) {
      console.log(`Previous x coordinate`)
      const newItem = item.set('top', (previous.top + previous.height + VERTICAL_ITEM_SPACING))
      returnItems = returnItems.push(newItem)
      console.log(`This is the new y coordinate: ${newItem.top}`)
      previous = newItem
    } else {
      returnItems = returnItems.push(item)
      console.log(`default y coordinate: ${item.top}`)
      previous = item
    }
    previousXAndWidth = previous.left + previous.width
  })

  returnItems.forEach(item => {
    console.log(item.top)
  })

  // Task 1: modify to calculate a correct height
  const height = 400

  items = immutable.List(returnItems)
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
    }
  };
};

NumberLineView.propTypes = {
  unitsPerPixel: PropTypes.number.isRequired,
  tickSpacing: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  items: PropTypes.any.isRequired,
  onChangeScale: PropTypes.func.isRequired
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NumberLineView);