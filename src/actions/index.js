import uniqueId from "../utils/uniqueId";

// Note: most of these actions are not actually used in this sample application,
// but are provided as examples.

const CREATE_ITEM = "object:CREATE_ITEM";
const EDIT_LABEL = "object:EDIT_LABEL";
const EDIT_POSITION = "object:EDIT_POSITION";
const CHANGE_SCALE = "numberLine:CHANGE_SCALE";

export const actionTypes = {
    CREATE_ITEM,
    EDIT_LABEL,
    EDIT_POSITION,
    CHANGE_SCALE
};

const createItem = (label, position) => {
  return {
    type: CREATE_ITEM,
    id: uniqueId(),
    label,
    position
  };
};

const editLabel = (id, label) => {
  return {
    type: EDIT_LABEL,
    id,
    label
  };
};

const editPosition = (id, position) => {
    return {
      type: EDIT_POSITION,
      id,
      position
    };
  };  

  const changeScale = newScale => {
    return {
      type: CHANGE_SCALE,
      newScale
    };
  };
  
export default {
  createItem,
  editLabel,
  editPosition,
  changeScale
};
