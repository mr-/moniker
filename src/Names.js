import React, { Component } from 'react';
import _ from 'lodash';
import { Grid, Button } from 'react-bootstrap';
import { postNames } from './actions';
import { connect } from 'react-redux'
import {
  Link
} from 'react-router-dom'


const Name = (props) => (
  <div className="name text-center" onClick={() => props.onClick(props.name)}>
     <span> {props.name} </span>
  </div>
)

const Nothing = (props) => (
  <div className="nothing text-center" onClick={props.onClick}>
     <span> Nothing </span>
  </div>
)


const Names = (props) => {
  const onClick = props.onClick;
  const choice = _.map(props.selection,
                   name => <li className="flex-item">
                             <Name name={name} onClick={(name) => onClick(name, props.selection)}/>
                           </li>);
  return <Grid fluid>
    <div>
      <ul className="flex-container">
        {choice}
        <li className="flex-item "><Nothing onClick={(name) => onClick(name, props.selection)}/></li>
      </ul>
    </div>
  </Grid>
}


const makeResult = (pick, names) => _.map(names,
	(name) => pick === name ? {name: name, score:1} : {name: name, score: 0})

export default connect(
  state => state,
 (dispatch) => {return {onClick: (name, selection) => dispatch(postNames(makeResult(name, selection)))}}
)(Names)



