import {
    POST_NAMES,
    RECEIVE_NAMES,
    UNDO_NAMES
} from './actions'



const initialState = {
    selection: [],
    ranking: [],
    currentPick: null
};

function moniker(state = initialState, action) {
    switch (action.type) {
        case POST_NAMES:
        case RECEIVE_NAMES:
        case UNDO_NAMES:
            return Object.assign({}, {selection: action.selection, ranking: action.ranking, currentPick: action.currentPick});
        default:
            return state;
  }
}

export default moniker;
