const getLocalStorageToken = () => {
  const accessToken = localStorage.getItem('accessToken');
  if (accessToken && accessToken != '') {
    return accessToken;
  }
  return false;
};

const getParameterByName = (name, url) => {
  if (!url) url = window.location.href;
  name = name.replace(/\[\]]/g, '\\$&');
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
};

const logout = () => {
  localStorage.removeItem('accessToken');
  window.location.reload();
};

const scroll = () => {
  setTimeout(() => {
    window.scrollTo(0, 0.1);
  }, 100);
};

const getUniqueItemList = itemList => {
  if (!itemList || !itemList.length) {
    return [];
  }
  let obj = {};
  let arr = [];
  itemList.map(i => {
    obj[i.id] = i;
  });
  Object.keys(obj).map(k => {
    arr.push(obj[k]);
  });
  return arr;
};

const formattedNumber = val => fixedNumber => {
  if (isValidPriceNumber(val)) {
    return parseFloat(val.toFixed(fixedNumber));
  }
  return '-';
};

const formatDecimal = (value, config) => {
  if (!Number.isFinite(value)) {
    throw new TypeError(`You MUST specify a finite number, not [${typeof value} = ${value}]`);
  }
  if (!config) {
    config = {};
  }
  //------------------------------------------------------------------------------
  // Configuración del resultado.
  //------------------------------------------------------------------------------
  var _decimal = typeof config.decimal === 'string' ? config.decimal : ',';
  var _precision = typeof config.precision === 'number' ? config.precision : 2;
  var _thousands = typeof config.thousands === 'string' ? config.thousands : '.';
  //------------------------------------------------------------------------------
  // Obtención del resultado.
  //------------------------------------------------------------------------------
  var _parts = value.toFixed(_precision).split('.');
  _parts[0] = _parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, _thousands);
  //
  return _parts.join(_decimal);
};

const isIOS = () => {
  var iDevices = ['iPad Simulator', 'iPhone Simulator', 'iPod Simulator', 'iPad', 'iPhone', 'iPod'];

  if (!!navigator.platform) {
    while (iDevices.length) {
      if (navigator.platform === iDevices.pop()) {
        return true;
      }
    }
  }

  return false;
};

const isValidPriceNumber = num => {
  if ((num !== '' && num != null && num != 'null') || num === 0) {
    return true;
  }
  return false;
};

const fomatDecimalNumberByCurrency = (num, currency, precision = '') => {
  if (precision === '') {
    precision = window.SIX_NUMBER_PRECISION_LIST.indexOf(currency) != -1 ? 6 : 2;
  }
  let res = formatDecimal(num, {
    decimal: '.',
    precision: precision,
    thousands: ''
  });
  return res;
};

const getDotNumber = val => {
  let res = 0;
  val = String(val);
  if (val.indexOf('.') !== -1) {
    res = val.substring(val.indexOf('.') + 1, val.length).length;
  }
  return res;
};

const isEmptyString = val => {
  if (val === '') {
    return true;
  } else {
    return false;
  }
};

export {
  getLocalStorageToken,
  getParameterByName,
  logout,
  scroll,
  getUniqueItemList,
  formattedNumber,
  formatDecimal,
  isIOS,
  isValidPriceNumber,
  fomatDecimalNumberByCurrency,
  isEmptyString,
  getDotNumber
};
