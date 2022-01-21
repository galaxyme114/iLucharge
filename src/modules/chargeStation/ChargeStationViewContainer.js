import { compose } from 'recompose';
import { connect } from 'react-redux';

import { setCharger, setServer, setDevice } from '../../redux/actions/Custom';
import ChargeStationView from './ChargeStationView';

export default compose(
    connect(
      state => ({
        charger: state.custom.charger,
        server: state.custom.server,
        device: state.custom.device,
      }),
      dispatch => ({
        setCharger: (data) => dispatch(setCharger(data)),
        setServer: (data) => dispatch(setServer(data)),
        setDevice: (data) => dispatch(setDevice(data)),
      }),
    )
  )(
    ChargeStationView,
  );
  