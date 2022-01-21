import Login from '../login/LoginViewContainer';
import Register from '../register/RegisterViewContainer';
import NewPassword from '../newPassword/NewPasswordViewContainer';
import ResetPassword from '../resetPassword/ResetPasswordViewContainer';
import CheckEmail from '../checkEmail/CheckEmailViewContainer';
import ChargeStation from '../chargeStation/ChargeStationViewContainer';
import StationMap from '../stationMap/StationMapViewContainer';

import HomeScreen from '../home/HomeViewContainer';
import ChartScreen from '../chart/ChartViewContainer';
import SettingScreen from '../setting/SettingViewContainer';

const StackNavigationData = [
  {
    name: 'Kasteelstraat',
    component: HomeScreen,
    headerTitle: 'Kasteelstraat',
  },
  {
    name: 'Chart',
    component: ChartScreen,
    headerTitle: 'Lastest Charging',
  },
  {
    name: 'Setting',
    component: SettingScreen,
    headerTitle: 'Setting',
  },
  {
    name: 'Login',
    component: Login,
  },
  {
    name: 'Register',
    component: Register,
  },
  {
    name: 'NewPassword',
    component: NewPassword,
  },
  {
    name: 'ResetPassword',
    component: ResetPassword,
  },
  {
    name: 'CheckEmail',
    component: CheckEmail,
  },
  {
    name: 'ChargeStation',
    component: ChargeStation,
  },
  {
    name: 'StationMap',
    component: StationMap,
  },
]

export default StackNavigationData;
