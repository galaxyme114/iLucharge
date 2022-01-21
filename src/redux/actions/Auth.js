import { LOGINED, LOGOUT } from '../actionTypes';

 export const loginUser = (user) => ({
    type: LOGINED,
    payload: user
 });
 
 export const logoutUser = () => ({
    type: LOGOUT,
 });
 