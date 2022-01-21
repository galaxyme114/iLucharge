import { LOGINED, LOGOUT } from '../actionTypes';

const defaultState = {
  userId: '',
  username: '',
  fullname: '',
  email: '',
  avatar: '',
  phonenumber: '',
  isLogined: false,
};

export default function AuthStateReducer(state = {...defaultState}, action) {
  switch (action.type) {
    case LOGINED:
    //   return Object.assign({}, state, {
    //     ...action.payload
    //   });
        return {
            ...state,
            ...action.payload,
            isLogined: true,
        };
    
    case LOGOUT:
        return {
            ...defaultState
        };
    default:
      return state;
  }
}
