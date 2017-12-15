import { SET_ASSETS_LIST, SET_PAGE, SET_HAS_MORE, SET_IS_PRICE_VIEW_MODE } from 'ACTIONS/home';

const initialState = {
  assetsList: null,
  page: 0,
  hasMore: true,
  isPriceViewMode: true
};

export default function home(state = initialState, action) {
  switch (action.type) {
    case SET_ASSETS_LIST:
      return {
        ...state,
        assetsList: action.assetsList
      };
    case SET_PAGE:
      return {
        ...state,
        page: action.page
      };
    case SET_HAS_MORE:
      return {
        ...state,
        hasMore: action.hasMore
      };
    case SET_IS_PRICE_VIEW_MODE:
      return {
        ...state,
        isPriceViewMode: action.isPriceViewMode
      };
    default:
      return state;
  }
}

home.reducer = 'home';
