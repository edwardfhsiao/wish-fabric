import { fetch } from 'API/request-utils';

export const SET_USER = 'SET_USER';
export const setUser = user => ({
  type: SET_USER,
  user
});

export const SET_TOKEN = 'SET_TOKEN';
export const setToken = token => ({
  type: SET_TOKEN,
  token
});

export const SET_IS_FETCHING = 'SET_IS_FETCHING';
export const setIsFetching = isFetching => ({
  type: SET_IS_FETCHING,
  isFetching
});

export const SET_IS_POSTING = 'SET_IS_POSTING';
export const setIsPosting = isPosting => ({
  type: SET_IS_POSTING,
  isPosting
});

export const SET_IS_NOT_FOUND = 'SET_IS_NOT_FOUND';
export const setIsNotFound = isNotFound => ({
  type: SET_IS_NOT_FOUND,
  isNotFound
});

export const SET_COLOR_MODE = 'SET_COLOR_MODE';
export const setColorMode = colorMode => ({
  type: SET_COLOR_MODE,
  colorMode
});

export const SET_CURRENT_CURRENCY = 'SET_CURRENT_CURRENCY';
export const setCurrentCurrency = currentCurrency => ({
  type: SET_CURRENT_CURRENCY,
  currentCurrency
});

export const fetchUser = () => dispatch => {
  fetch('/users/me')
    .then(res => {
      let user = -1;
      if (res.data) {
        let result = res.data;
        if (result.api_token && result.api_token != '') {
          user = result;
        }
        // user = -1;
      }
      dispatch(setUser(user));
    })
    .catch(err => {
      console.log(err);
      dispatch(setUser(-1));
      localStorage._cid = null;
    });
};
