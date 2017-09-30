import React, { Component } from 'react';
import _ from 'lodash';
import { Grid } from 'react-bootstrap';
import { postNames } from './actions';
import { connect } from 'react-redux'
import {
  Link
} from 'react-router-dom'


const Name = (props) => (
  <button className="name text-center" onClick={() => props.onClick(props.name)}>
     <span> {props.name} </span>
  </button>
)

const Nothing = (props) => (
  <button className="nothing text-center" onClick={props.onClick}>
     <span> Nothing </span>
  </button>
)


const Names = (props) => {
  const onClick = props.onClick;
  const choice = _.map(props.selection,
                   name => <li className="flex-item">
                             <Name name={name} onClick={(name) => onClick(name, props.selection)}/>
                           </li>);
  return <div>
  <Grid fluid>
    <button className="back">
      <span className="glyphicon glyphicon-share-alt" aria-hidden="true"></span>
    </button>
    <div>
      <ul className="flex-container">
        {choice}
        <li className="flex-item "><Nothing onClick={(name) => onClick(name, props.selection)}/></li>
      </ul>
    </div>
  </Grid>
</div>
}


const makeResult = (pick, names) => _.map(names,
	(name) => pick === name ? {name: name, score:1} : {name: name, score: 0})

export default connect(
  state => state,
 (dispatch) => {return {onClick: (name, selection) => dispatch(postNames(makeResult(name, selection)))}}
)(Names)



