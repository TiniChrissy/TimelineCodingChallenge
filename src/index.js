// This is the application entry point.
// You should not need to touch this file.

import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import immutable from "immutable";
import configureStore from "./store/configureStore";
import sampleData from "./store/sampleData";
import NumberLineView from "./components/NumberLineView";
import immutableRecords from "./types/immutableRecords";
import uniqueId from "./utils/uniqueId";


// Convert the sampleData into our Immutable.Record structure.
let itemRecords = immutable.Map();
sampleData.forEach(d => {
    const id = uniqueId();
    itemRecords = itemRecords.set(id, immutableRecords.ItemRecord({
        id: id,
        value: d.value,
        label: d.label
    }));
});

// The initial state of our redux store
const initialState = immutableRecords.NumberLineRecord({
    items: itemRecords
});

// And get react/redux going.

let store = configureStore(initialState);

render(
  <Provider store={store}>
    <NumberLineView />
  </Provider>,
  document.getElementById("app")
);
