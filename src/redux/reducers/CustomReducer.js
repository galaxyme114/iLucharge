import { TOOGLESHEET, SETACTIVETAB, SETCHARGER, SETSERVER, SETDEVICE } from '../actionTypes';

const defaultState = {
  showSheet: false,
  activeTab: 'Kasteelstraat',
  charger: {
    state: 'disConnected'
  },
  server: {
    power: 0,
  },
  device: null,
};

export default function CustomStateReducer(state = { ...defaultState }, action) {
  switch (action.type) {
    case TOOGLESHEET:
      return {
        ...state,
        showSheet: action.payload,
      };
    case SETACTIVETAB:
      return {
        ...state,
        activeTab: action.payload,
      };
    case SETCHARGER:
      return {
        ...state,
        charger: action.payload,
      };
    case SETSERVER:
      return {
        ...state,
        server: action.payload,
      };
    case SETDEVICE:
      return {
        ...state,
        device: action.payload,
      };
    default:
      return state;
  }
}
