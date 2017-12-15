import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Textarea } from 'react-inputs-validation';
import _ from 'lodash';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import { post } from '../../../api/request-utils';
import { setPortfolioType, setSlideModalContentName } from '../../../actions/home.js';

import APP_STYLES from '../../../../css/index.css';
import STYLES from './styles.css';
import Modal from '../../components/Modal/index.jsx';

import { fabric } from 'fabric';

import moment from 'moment';

const WIDTH = window.innerWidth;
const TEXT_WIDTH = WIDTH * 7 / 10;
class Index extends Component {
  constructor(props) {
    super(props);
    this.state = { src: '', isShowModal: false, text: '', isReady: false };
    this.submit = this.submit.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleTextBlur = this.handleTextBlur.bind(this);
    this.previewFile = this.previewFile.bind(this);
    this.cropImage = this.cropImage.bind(this);
    this.crop = this.crop.bind(this);
  }

  componentDidMount() {
    this.initCanvas();
  }

  componentDidUpdate({}, { text, src }) {
    if (src != this.state.src) {
      this.canvas.getObjects().forEach(o => {
        if (o.type === 'image' && o.id && o.id == 'image') {
          this.canvas.remove(o);
        }
      });
      this.canvas.renderAll();
    }
    // if (text != this.state.text) {
    //   this.canvas.getObjects().forEach(o => {
    //     if (o.type === 'text' && o.id && o.id == 'text') {
    //       let text = this.state.text;
    //       // text = this.addTextBreaks(this.state.text, TEXT_WIDTH);
    //       // console.log(`${o.width}, ${WIDTH - 250}`);
    //       // console.log(text.split(''));
    //       // console.log(text.lastIndexOf('\n'));
    //       if (o.width > WIDTH - 250) {
    //         console.log(text);
    //         if (text.indexOf('\n') === -1) {
    //           //initial line
    //           let textArr = text.split('');
    //           textArr.splice(text.length - 2, 0, '\n');
    //           text = textArr.join('');
    //         }
    //         else{
    //           console.log(1);
    //         }
    //       }
    //       // console.log(text.lastIndexOf('\n'));
    //       o.text = `${text}`;
    //       o.left = this.canvasWidth / 2 - o.width / 2 - 5;
    //       o.width = TEXT_WIDTH;
    //     }
    //   });
    //   this.canvas.renderAll();
    // }
  }

  toggleIsShowModal(isShowModal) {
    this.setState({ isShowModal });
  }

  renderModal() {
    return (
      <div>
        {/*<ReactCrop {...this.state} src={this.state.src} onImageLoaded={this.onImageLoaded} onComplete={this.onCropComplete} onChange={this.onCropChange} />*/}
        <Cropper
          ref={ref => {
            this.cropper = ref;
          }}
          src={this.state.src}
          style={{ height: 400, width: '100%' }}
          // Cropper.js options
          // aspectRatio={16 / 9}
          aspectRatio={1 / 1}
          guides={false}
          crop={this.crop}
        />
        <div className={`${APP_STYLES['button-group']}`} onClick={this.cropImage}>
          确定
        </div>
      </div>
    );
  }

  initCanvas() {
    this.canvas = new fabric.StaticCanvas('canvas');
    this.canvasHeight = this.canvas.height;
    this.canvasWidth = this.canvas.width;
    let rect = new fabric.Rect({ width: this.canvasWidth, height: this.canvasHeight, fill: '#fff', hasControls: false, selectable: false, lockMovementX: true, lockMovementY: true });
    this.canvas.add(rect);
    let text = new fabric.Text('', {
      breakWords: true,
      id: 'text',
      width: TEXT_WIDTH,
      fontFamily: 'PingFang SC',
      fill: '#4a4a4a',
      textAlign: 'left',
      fontSize: 14,
      left: 20,
      top: WIDTH,
      selectable: false,
      lockMovementX: true,
      lockMovementY: true
    });
    let { years, months, date } = moment().toObject();
    let timeText = `${years}.${months}.${date} ${moment.weekdays()[moment().weekday()].substring(0, 3)}`;
    // console.log(dateTime);
    // let time = dateTime.getTime();
    // let timeText = String(time);
    let dateText = new fabric.Text(timeText, {
      width: TEXT_WIDTH,
      fontFamily: 'PingFang SC',
      fill: '#4a4a4a',
      textAlign: 'center',
      fontSize: 12,
      left: 20,
      top: 15,
      selectable: false,
      lockMovementX: true,
      lockMovementY: true
    });
    // this.canvas.centerObject(text);

    // let imgObj = new Image();
    // imgObj.src = require('../../../../image/qr.jpg');
    // imgObj.src = this.qr.src;

    let image = new fabric.Image(this.qr);
    // image.set({
    //   // // left: this.canvasWidth / 2, //coord.left,
    //   // // top: this.canvasHeight / 2, //coord.top,
    //   // // angle: 0,
    //   // // padding: 10,
    //   // // cornersize: 10,
    //   // // scaleX: this.canvasWidth / 3,
    //   // // width: this.canvasWidth - 100
    //   // // scaleX: 20 / imgObj.width,
    //   // // scaleY: 20 / imgObj.height
    //   // hasControls: false,
    //   // selectable: false,
    //   // lockMovementX: true,
    //   // lockMovementY: true,
    //   // width: 30,
    //   // height: 30
    // });
    this.canvas.add(dateText);
    this.canvas.add(text);
    fabric.Image.fromURL(require('../../../../image/qr.jpg'), image => {
      image.set({
        left: this.canvasWidth - 60,
        top: this.canvasHeight - 60,
        scaleX: 0.1,
        scaleY: 0.1,
        hasControls: false,
        selectable: false,
        lockMovementX: true,
        lockMovementY: true
      });
      this.canvas.add(image);
    });
  }

  previewFile() {
    let file = this.file.files[0]; //sames as here
    let reader = new FileReader();

    reader.onloadend = () => {
      this.setState({ src: reader.result, isShowModal: true });
    };

    if (file) {
      reader.readAsDataURL(file); //reads the data as a URL
    }
    // else {
    //   this.setState({ src: '' });
    // }
    this.file.value = '';
  }

  handleTextBlur() {
    // this.canvas.getObjects().forEach(o => {
    //   if (o.type === 'text' && o.id && o.id == 'text') {
    //     let text = this.state.text;
    //     // text = this.addTextBreaks(this.state.text, TEXT_WIDTH);
    //     o.text = `${text}`;
    //     console.log(o.width);
    //     o.left = this.canvasWidth / 2 - o.width / 2 - 5;
    //     // o.width = TEXT_WIDTH;
    //   }
    // });
    // this.canvas.renderAll();
  }

  insertNewline(text) {
    let textArr = text.split('');
    textArr.splice(text.length - 2, 0, '\n');
    text = textArr.join('');
    return text;
  }

  handleTextChange(text) {
    this.canvas.getObjects().forEach(o => {
      if (o.type === 'text' && o.id && o.id == 'text') {
        // if (o.width > TEXT_WIDTH) {
        //   console.log(text);
        //   if (text.indexOf('\n') === -1) {
        //     //initial line
        //     text = this.insertNewline(text);
        //   } else {
        //     if (text.length - text.lastIndexOf('\n') >= text.indexOf('\n')) {
        //       text = this.insertNewline(text);
        //     }
        //   }
        // }
        // o.text = `${text}`;
        let wrap = require('jp-wrap')(Math.round(TEXT_WIDTH / 6.2) - 2);
        // o.text = `${wrap(
        //   text,
        //   { width: Math.round(TEXT_WIDTH / 6.2) }
        // )}`;
        if (text !== '') {
          o.text = `${wrap(text)}`;
        } else {
          o.text = `${text}`;
        }
        // o.left = this.canvasWidth / 2 - o.width / 2 - 7;
        o.width = TEXT_WIDTH;
      }
    });
    this.canvas.renderAll();
    this.setState({ text });
  }

  submit(e) {
    this.setState({
      src: this.canvas.toDataURL({
        format: 'png',
        quality: 1
        // left: 2,
        // right: 2,
        // top: 2,
        // bottom: 2
      }),
      isReady: true
    });
    e.preventDefault();
  }

  crop() {}

  cropImage() {
    if (typeof this.cropper.getCroppedCanvas() === 'undefined') {
      return;
    }
    this.setState({
      src: this.cropper.getCroppedCanvas().toDataURL(),
      isShowModal: false
    });
    let imgObj = new Image();
    imgObj.src = this.cropper.getCroppedCanvas().toDataURL();
    imgObj.onload = () => {
      let image = new fabric.Image(imgObj);
      image.set({
        id: 'image',
        left: 20,
        top: 30,
        // angle: 0,
        // padding: 10,
        // cornersize: 10,
        // scaleX: this.canvasWidth / 3,
        // width: this.canvasWidth - 100
        // scaleX: 20 / imgObj.width,
        // scaleY: 20 / imgObj.height
        hasControls: false,
        selectable: false,
        lockMovementX: true,
        lockMovementY: true
        // width: this.canvasWidth
        // height: this.canvasHeight / imgObj.height
      });
      image.scaleToWidth(this.canvasWidth - 40);
      // image.centerH();
      // this.canvas.centerObject(image);
      this.canvas.add(image);
      this.canvas.renderAll();
    };
  }

  render() {
    const { src, text, isShowModal, isReady } = this.state;
    let content;
    let modalHtml;
    let imagePreview;
    if (isReady) {
      if (!_.isEmpty(src)) {
        imagePreview = <img src={src} style={{ width: '100%', height: '100%' }} />;
      }
      content = (
        <div>
          <div style={{ width: WIDTH, margin: '0 auto' }}>{imagePreview}</div>
          <div style={{ height: '10px', width: '100%' }} />
          <div
            style={{
              padding: '15px'
            }}
            onClick={() => {
              // console.log(this.canvas);
              // this.canvas.dispose();
              // console.log(this.canvas);
              // this.initCanvas();
              this.setState({ isReady: false, src: '', text: '' });
            }}
          >
            <div
              className={`${APP_STYLES['button-group']}`}
              style={{
                width: '100%',
                height: '20px',
                margin: '0 auto 30px',
                color: '#fff',
                textAlign: 'center',
                borderRadius: '4px'
              }}
              onClick={this.submit}
            >
              <div
                style={{
                  padding: '15px',
                  backgroundColor: '#ff5a5e',
                  color: '#fff',
                  textAlign: 'center',
                  borderRadius: '4px',
                  width: '100%'
                }}
              >
                重新制作
              </div>
            </div>
          </div>
        </div>
      );
    }
    if (!_.isEmpty(src)) {
      modalHtml = <Modal show={isShowModal} content={this.renderModal()} onClose={() => {}} />;
      // imagePreview = <img src={src} style={{ width: '100%', height: '100%' }} />;
      // imagePreview = <ReactCrop {...this.state} src={src} onImageLoaded={this.onImageLoaded} onComplete={this.onCropComplete} onChange={this.onCropChange} />;
    }

    return (
      <div style={{ height: '100%', backgroundColor: '#f8f8f8', textAlign: 'center', fontSize: '12px' }}>
        <form onSubmit={this.submit} style={{ display: isReady ? 'none' : 'block' }}>
          <div>
            <div>
              <div style={{ width: '100%', margin: '0 auto' }}>
                <canvas id="canvas" width={WIDTH} height={WIDTH * 1.2} />
              </div>
            </div>
            <div style={{ padding: '15px 15px 0' }}>
              <input ref={ref => (this.file = ref)} type="file" onChange={this.previewFile} accept="image/*" style={{ display: 'none' }} />
              <div style={{ width: WIDTH, margin: '0 auto' }}>
                <div onClick={() => this.file.click()} style={{ padding: '10px', backgroundColor: '#4a4a4a', width: '50px', color: '#fff', textAlign: 'center', borderRadius: '4px' }}>
                  选择图片
                </div>
              </div>
            </div>
            <div style={{ padding: '15px' }}>
              <Textarea
                customStyleWrapper={{ width: '100%', margin: '0 auto' }}
                value={text}
                type={`text`}
                placeholder="我的2018愿望是..."
                onChange={this.handleTextChange}
                onBlur={this.handleTextBlur}
                validationOption={{
                  check: false,
                  type: `number`,
                  required: true,
                  showMsg: true,
                  locale: 'zh-CN'
                }}
              />
            </div>
            <div style={{ padding: '15px', backgroundColor: '#f8f8f8' }}>
              <input type="submit" style={{ display: 'none' }} />
              <div
                style={{
                  // position: 'fixed',
                  bottom: '0',
                  left: '0',
                  right: '0'
                }}
                onClick={this.submit}
              >
                <div
                  className={`${APP_STYLES['button-group']}`}
                  style={{
                    width: '100%',
                    height: '20px',
                    margin: '0 auto 30px',
                    color: '#fff',
                    textAlign: 'center',
                    borderRadius: '4px'
                  }}
                  onClick={this.submit}
                >
                  <div
                    style={{
                      padding: '15px',
                      backgroundColor: '#ff5a5e',
                      color: '#fff',
                      textAlign: 'center',
                      borderRadius: '4px',
                      width: '100%'
                    }}
                  >
                    生成愿望
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
        {content}
        {modalHtml}
      </div>
    );
  }
}

function mapStateToProps({ app, home }) {
  return {
    app,
    home
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setPortfolioType: val => {
      dispatch(setPortfolioType(val));
    },
    setSlideModalContentName: val => {
      dispatch(setSlideModalContentName(val));
    }
  };
}

Index.contextTypes = {
  router: PropTypes.object
};

Index.propTypes = {
  app: PropTypes.object,
  home: PropTypes.object,
  setPortfolioType: PropTypes.func,
  setSlideModalContentName: PropTypes.func,
  locale: PropTypes.string
};

export default connect(mapStateToProps, mapDispatchToProps)(Index);
