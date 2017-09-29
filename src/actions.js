import fetch from 'isomorphic-fetch'
import Cookies from 'universal-cookie';


const myHeaders = new Headers();

const myInit = { method: 'GET',
               headers: myHeaders,
               mode: 'cors',
               cache: 'default' };


export const POST_NAMES = 'POST_NAMES'
export const RECEIVE_NAMES = 'RECEIVE_NAMES'
export const LOGIN = 'LOGIN'

const host = 'localhost:3000';

export function login(googleUser) {
  return dispatch => {
    console.log("LOGIN!", googleUser.getBasicProfile().getEmail())
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

export function postNames(result) {
  console.log("got results ", result);
  return (dispatch) => {
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
