import { TOOGLESHEET, SETACTIVETAB, SETCHARGER, SETSERVER, SETDEVICE } from '../actionTypes';

export const toogleSheet = (value) => ({
   type: TOOGLESHEET,
   payload: value,
});

export const setActiveTab = (value) => ({
   type: SETACTIVETAB,
   payload: value,
});

export const setCharger = (value) => ({
   type: SETCHARGER,
   payload: value,
});

export const setServer = (value) => ({
   type: SETSERVER,
   payload: value,
});

export const setDevice = (value) => ({
   type: SETDEVICE,
   payload: value,
});