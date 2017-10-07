import React from 'react';
import _ from 'lodash';
import { Grid } from 'react-bootstrap';
import { postNames, undo } from './actions';
import { connect } from 'react-redux';


const Name = (props) => (
  <button className="name text-center" onClick={() => props.onClick(props.name)}>
     <span> {props.name} </span>
  </button>
);

const Nothing = (props) => (
  <button className="nothing text-center" onClick={props.onClick}>
     <span> Nothing </span>
  </button>
);

const Back = (props => {
    const style = props.show ? {} : {display: "none"};

    return <button style={style} className="back" onClick={props.undo}>
        <span className="glyphicon glyphicon-share-alt" aria-hidden="true"></span>
    </button>;

});


const Names = (props) => {
  const onClick = props.onClick;
  const choice = _.map(props.selection,
                   name => <li className="flex-item">
                             <Name name={name} onClick={(name) => onClick(name, props.selection)}/>
                           </li>);
  return <div>
  <Grid fluid>
      <Back undo={props.undo} show={props.pastLength > 1}/>
    <div>
      <ul className="flex-container">
        {choice}
        <li className="flex-item "><Nothing onClick={(name) => onClick(name, props.selection)}/></li>
      </ul>
    </div>
  </Grid>
</div>
};

export default connect(
  state => _.extend({}, state.present, {pastLength: _.size(state.past)}),
 (dispatch) => {return {
     onClick: (name, selection) => dispatch(postNames({currentPick: name})),
     undo: () => dispatch(undo())
 }}
)(Names)



