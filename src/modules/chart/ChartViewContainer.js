import { compose } from 'recompose';
import { connect } from 'react-redux';

import { toogleSheet, setActiveTab, setCharger } from '../../redux/actions/Custom';
import ChartView from './ChartView';

export default compose(
    connect(
      state => ({
        showSheet: state.custom.showSheet,
        activeTab: state.custom.activeTab,
        charger: state.custom.charger,
      }),
      dispatch => ({
        toogleSheet: (data) => dispatch(toogleSheet(data)),
        setActiveTab: (data) => dispatch(setActiveTab(data)),
        setCharger: (data) => dispatch(setCharger(data)),
      }),
    )
  )(
    ChartView,
  );
  