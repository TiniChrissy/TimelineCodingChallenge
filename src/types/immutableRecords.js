import immutable from "immutable";
import { MIN_HEADER_TICK_SPACING } from "../constants";

// -------------------------
// Redux Store Record Shapes
//    - Do not modify until Task 3
// -------------------------

const ItemRecord = immutable.Record({
  id: null,
  label: "",
  value: 0
});

// The items object in NumberLineRecordis an immutable.Map structure where:
// - the key is the ID for the item
// - the value is an ItemRecord object.
// This structure allows for fast O(1) lookup of items to access inside this reducer.

const NumberLineRecord = immutable.Record({
  unitsPerPixel: 2 / MIN_HEADER_TICK_SPACING,
  selectedItem: null,
  items: immutable.Map()
});

// -------------------------
// Display Record Shapes
//    - Modify at will
// -------------------------

const ItemDisplayRecord = immutable.Record({
  id: null,
  label: "",
  value: 0,
  width: 0,
  height: 0,
  left: 0,
  top: 0
});

export default {
    ItemRecord,
    NumberLineRecord,
    ItemDisplayRecord
}