import {
  POST_NAMES,
  RECEIVE_NAMES
} from './actions'
import undoable from 'redux-undo';


const initialState = {
  selection: [],
  ranking: []
};

function moniker(state = initialState, action) {
  switch (action.type) {
    case POST_NAMES:
    case RECEIVE_NAMES:
      return Object.assign({}, {selection: action.selection, ranking: action.ranking});
    default:
      return state;
  }
}


export default undoable(moniker);
