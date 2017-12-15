import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { connect } from 'react-redux';
import { withRouter, Route, Switch } from 'react-router-dom';
import asyncRoute from './asyncRoute';
// import { isClientSide } from '../common/utils.js';
import APP_STYLES from '../../css/index.css';

import { setUser } from '../actions/app.js';
import { HOME_PATH, NOT_FOUND_PATH, toCamelCase } from '../consts/index.js';

const getComponentFile = name => require(`./pages/${toCamelCase(name)(true)}/index.jsx`).default;

const getReducerFile = name => require(`../reducers/${toCamelCase(name)()}.js`).default;

const getComponent = (component, reducerList) => asyncRoute(component, reducerList);

const Home = getComponent(getComponentFile(HOME_PATH), [getReducerFile(HOME_PATH)]);
const NotFound = getComponent(getComponentFile(NOT_FOUND_PATH), [getReducerFile(NOT_FOUND_PATH)]);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const { locale } = this.props.app;
    return (
      <div style={{ height: '100%' }}>
        <Switch>
          <Route exact path={`/`} component={Home} />
          <Route component={NotFound} />
        </Switch>
      </div>
    );
  }
}

function mapStateToProps({ app }) {
  return { app };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchUser: () => {
      dispatch(fetchUser());
    },
    setUser: val => {
      dispatch(setUser(val));
    }
  };
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
