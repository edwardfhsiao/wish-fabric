import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import STYLES from './styles.css';
import APP_STYLES from 'STYLES/index.css';
import { ROOT_PATH } from 'CONSTS';
import { setIsNotFound } from 'ACTIONS/app';

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.goToHome = this.goToHome.bind(this);
  }

  componentWillMount() {
    this.props.setIsNotFound(false);
  }

  go(path) {
    this.props.history.push(path);
  }

  goToHome() {
    this.go(ROOT_PATH);
  }

  render() {
    return (
      <div className={`${STYLES['content']}`}>
        <div style={{ padding: '50px' }}>
          <div>很抱歉，您好像走丢了</div>
          <div onClick={this.goToHome} className={`${APP_STYLES['highlight-blue']}`}>
            返回首页吧
          </div>
        </div>
      </div>
    );
  }
}

Index.propTypes = {
  app: PropTypes.object,
  history: PropTypes.object,
  setIsNotFound: PropTypes.func,
};

function mapStateToProps({ app }) {
  return {
    app
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setIsNotFound: bool => {
      dispatch(setIsNotFound(bool));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Index);
