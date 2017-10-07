import React  from 'react';
import _ from 'lodash';
import { Grid } from 'react-bootstrap';
import { connect } from 'react-redux'

const Name = (props) => (
  <div className="name text-center">
     <span> {props.name}: {props.score} </span>
  </div>
);


const Rankings = (props) => {
 const els = _.map(props.ranking, (e) => <li className="flex-item"><Name name={e.name} score={e.score}/></li>);
 return (<Grid fluid>
  <div>
    <ul className="flex-container">
	{els}
    </ul>
  </div>
</Grid>)
};

export default connect( state => state.present )(Rankings)

