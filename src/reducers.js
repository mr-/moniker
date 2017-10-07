import {
    POST_NAMES,
    RECEIVE_NAMES,
    UNDO_NAMES
} from './actions'
import undoable, { excludeAction } from 'redux-undo';



const initialState = {
    selection: [],
    ranking: [],
    currentPick: null
};

function moniker(state = initialState, action) {
  switch (action.type) {
    case POST_NAMES:
    case RECEIVE_NAMES:
      return Object.assign({}, {selection: action.selection, ranking: action.ranking, currentPick: action.currentPick});
    default:
      return state;
  }
}


export default undoable(moniker, { filter: excludeAction([UNDO_NAMES])});
