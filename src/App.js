import 'babel-polyfill'

import React from 'react';
import {  Nav, NavItem, Grid, Navbar} from 'react-bootstrap'
import { Provider } from 'react-redux'
import { fetchNames } from './actions'
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'

import Names from "./Names"
import Ranking from "./Ranking"
import Home from "./Home"
import configureStore from './configureStore'


const store = configureStore();
store.dispatch(fetchNames());


const BasicExample = () => (
<Provider store={store}>
  <Router>
    <div>
      <hr/>
      <Navbar inverse collapseOnSelect fixedTop>
        <Grid>
          <Navbar.Header>
            <Navbar.Brand>
               <Link to="/">Home</Link>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
          <Nav>
               <NavItem> <Link to="/names">Names</Link> </NavItem>
               <NavItem> <Link to="/ranking">Ranking</Link> </NavItem>
          </Nav>
          </Navbar.Collapse>
        </Grid>
      </Navbar>
      <hr/>
      <Route exact path="/" component={Home}/>
      <Route path="/names" component={Names}/>
      <Route path="/ranking" component={Ranking}/>
    </div>
  </Router>
</Provider>
);

export default BasicExample
