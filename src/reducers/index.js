 import combineReducersImmutable from './combineReducersImmutable';

 import { actionTypes } from "../actions";
 import immutableRecords from "../types/immutableRecords";
 import items from "./itemsReducer";
 
 const unitsPerPixel = (state, action) => {
  switch (action.type) {
    case actionTypes.CHANGE_SCALE:
      return action.newScale;
    default:
      return state;
  }
 }

const combinedReducers = combineReducersImmutable(immutableRecords.NumberLineRecord(), {
  unitsPerPixel,
  items
});

export default combinedReducers;