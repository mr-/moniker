import React  from 'react';
import {Grid, Form, FormGroup, Col, ControlLabel, FormControl, Button} from 'react-bootstrap';
import GoogleLogin from 'react-google-login';
import Cookies from 'universal-cookie';
import { connect } from 'react-redux'
import { login } from './actions'


const failure = () => {
  console.error("Could not log in");
}


const Home = (props) => (
<Grid>
  <GoogleLogin
    clientId="30112827782-3e039uoc8r78iu1sbgc9o8s0live6e7d.apps.googleusercontent.com"
    buttonText="Login"
    onSuccess={props.login}
    onFailure={failure}
  />
</Grid>)


export default connect(state => state, (dispatch) => {return {login: (data) => dispatch(login(data))}}) (Home)
