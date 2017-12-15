import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import STYLES from './styles.css';

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: this.props.show
    };
    this.pageClick = this.pageClick.bind(this);
  }

  componentDidMount() {
    if (document.addEventListener) {
      window.addEventListener('mousedown', this.pageClick, false);
    } else {
      document.attachEvent('onmousedown', this.pageClick);
    }
  }

  componentWillUnmount() {
    if (document.removeEventListener) {
      window.removeEventListener('mousedown', this.pageClick, false);
    } else {
      document.detachEvent('onmousedown', this.pageClick);
    }
  }

  componentWillReceiveProps(nextProps) {
    this.toggleShow(nextProps.show);
  }

  pageClick(e) {
    if (this.wrapper.contains(e.target)) {
      return;
    }
    this.onClose();
    this.toggleShow(false);
  }

  toggleShow(show) {
    this.setState({ show });
  }

  onClose() {
    const { onClose } = this.props;
    onClose && onClose();
  }

  onOpen() {
    const { onOpen } = this.props;
    onOpen && onOpen();
  }

  render() {
    let { show } = this.state;
    let { content, className } = this.props;
    let modalMaskClass = cx(className, show && STYLES['visible'], STYLES['modal-bottom-mask']);
    let modalWrapperClass = cx(STYLES['modal-bottom-wrapper'], show && STYLES['visible']);
    return (
      <div>
        <div
          className={`${modalMaskClass}`}
          onClick={() => {
            this.toggleShow(false);
          }}
        />
        <div className={`${modalWrapperClass}`} ref={ref => (this.wrapper = ref)}>
          {content}
        </div>
      </div>
    );
  }
}

Index.propTypes = {
  show: PropTypes.bool,
  className: PropTypes.string,
  content: PropTypes.any,
  onClose: PropTypes.func,
  onOpen: PropTypes.func
};

Index.defaultProps = {
  show: false,
  className: '',
  content: '',
  onClose: () => {},
  onOpen: () => {}
};

export default Index;
