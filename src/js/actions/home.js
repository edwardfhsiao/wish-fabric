import _ from 'lodash';
import { fetch } from 'API/request-utils';
import { setIsFetching } from 'ACTIONS/app';

export const SET_PAGE = 'SET_PAGE';
export const setPage = page => ({
  type: SET_PAGE,
  page
});

export const SET_HAS_MORE = 'SET_HAS_MORE';
export const setHasMore = hasMore => ({
  type: SET_HAS_MORE,
  hasMore
});

export const SET_ASSETS_LIST = 'SET_ASSETS_LIST';
export const setAssetsList = assetsList => ({
  type: SET_ASSETS_LIST,
  assetsList
});

export const SET_IS_PRICE_VIEW_MODE = 'SET_IS_PRICE_VIEW_MODE';
export const setIsPriceViewMode = isPriceViewMode => ({
  type: SET_IS_PRICE_VIEW_MODE,
  isPriceViewMode
});

export const fetchAssetsList = (url, oriList) => (dispatch, getState) => {
  dispatch(setIsFetching(true));
  dispatch(setHasMore(true));
  fetch(url)
    .then(res => {
      if (res.data) {
        if (res.data.length) {
          if (_.isEqual(res.data.sort(), oriList.sort())) {
            dispatch(setIsFetching(false));
            return;
          }
          // dispatch(setAssetsList(_.sortBy([...oriList, ...res.data], 'id').reverse()));
          dispatch(setAssetsList(_.sortBy([...oriList, ...res.data], 'priority')));
          dispatch(setPage(getState().home.page + 1));
        } else {
          if (oriList.length) {
            dispatch(setHasMore(false));
          } else {
            dispatch(setAssetsList([]));
          }
        }
        dispatch(setIsFetching(false));
      }
    })
    .catch(err => {
      dispatch(setIsFetching(false));
      console.log(err);
    });
};
