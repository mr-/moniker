import fetch from 'isomorphic-fetch'
import Cookies from 'universal-cookie';
import _ from 'lodash';


export const POST_NAMES = 'POST_NAMES';
export const RECEIVE_NAMES = 'RECEIVE_NAMES';
export const UNDO_NAMES = 'UNDO_NAMES';
export const LOGIN = 'LOGIN';

const host = 'localhost:3000';

export function login(googleUser) {
  return dispatch => {
    console.log("LOGIN!", googleUser.getBasicProfile().getEmail());
    const token = googleUser.getAuthResponse().id_token;
    const cookies = new Cookies();
    cookies.set("token ", token, { path: '/' });
    return getNames().then(json => dispatch(receiveNames(json)))
  }
}

function receiveNames(json) {
  return {
      type: RECEIVE_NAMES,
      selection: json.selection,
      currentPick: json.currentPick,
      ranking: json.ranking,
  }
}

function getNames() {
  return fetch(`http://${host}/api/names`, {credentials: 'include'})
         .then(response => response.json())
}

export function fetchNames() {
  return dispatch => {
    return getNames().then(json => dispatch(receiveNames(json)))
  }
}

export function undo() {
    return (dispatch) => {
        fetch(`http://${host}/api/undo`,
            {
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                method: "POST",
            })
            .then(response => response.json())
            .then(json => dispatch(receiveNames(json)))
    };
}

const makeResult = (pick, names) => _.map(names,
    (name) => pick === name ? {name: name, score: 1} : {name: name, score: 0});

export function postNames(pick) {
  return (dispatch, getState) => {
      const state = getState();
      const result = makeResult( pick.currentPick, state.selection );
      fetch(`http://${host}/api/names`,
      {credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        method: "POST",
        body: JSON.stringify(result)
      }).then(response => response.json())
        .then(json => dispatch(receiveNames(json)))
  }
}
