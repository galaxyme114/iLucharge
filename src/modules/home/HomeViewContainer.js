import { compose } from 'recompose';
import { connect } from 'react-redux';

import { toogleSheet, setActiveTab, setCharger, setServer, setDevice } from '../../redux/actions/Custom';
import HomeScreen from './HomeView';

export default compose(
  connect(
    state => ({
      showSheet: state.custom.showSheet,
      activeTab: state.custom.activeTab,
      charger: state.custom.charger,
      server: state.custom.server,
      device: state.custom.device,
    }),
    dispatch => ({
      toogleSheet: (data) => dispatch(toogleSheet(data)),
      setActiveTab: (data) => dispatch(setActiveTab(data)),
      setCharger: (data) => dispatch(setCharger(data)),
      setServer: (data) => dispatch(setServer(data)),
      setDevice: (data) => dispatch(setDevice(data)),
    }),
  )
)(
  HomeScreen,
);
