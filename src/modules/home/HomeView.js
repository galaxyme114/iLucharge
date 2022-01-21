import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ImageBackground,
  Image,
  Dimensions,
  StatusBar,
  PermissionsAndroid,
  Platform
} from 'react-native';
import { Circle } from 'react-native-svg';
import Carousel, { ParallaxImage } from 'react-native-snap-carousel';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import BottomSheet from 'reanimated-bottom-sheet';
import VerticalSlider from 'rn-vertical-slider'
import axios from 'axios';
import Modal from 'react-native-modal';
import Geolocation from "react-native-geolocation-service";
import { getDistance } from 'geolib';
import MQTT from 'sp-react-native-mqtt';

import Footer from '../../components/TabBar';
import { colors } from '../../styles';
import { api, authKey, email, mqttApi, clientId } from '../../auth';

const dashboardBackground = require('../../../assets/images/dashboard_background.png');
const iconCharging = require('../../../assets/images/icons/power_charging_smart_mode.png');
const iconCharged = require('../../../assets/images/icons/power.png');
const iconLastestCharging = require('../../../assets/images/icons/lastest_charging.png');
const iconSetting = require('../../../assets/images/icons/setting.png');
const iconTime = require('../../../assets/images/icons/time.png');
const iconCost = require('../../../assets/images/icons/cost.png');
const iconPointer = require('../../../assets/images/icons/map_pointer.png');


const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const headerHeight = Platform.OS === 'ios' ? 90 : 45;

export default function HomeScreen(props) {
  const [nearByCharger, setNearByCharger] = useState(null);
  const [locationCoords, setLocationCoords] = useState(null);
  const [showPowerBar, setShowPowerBar] = useState(false);
  const [powerPercentage, setPowerPercentage] = useState(0);
  const animatedCircularBar = useRef(null);
  const sheetRef = useRef(null);
  const carouselRef = useRef(null);
  const [renderItem, setRenderItem] = useState(0);
  const [carouselItems, setCarouselItems] = useState({
    disConnected: [
      {
        title: "Lastest charging",
        iconUp: iconLastestCharging,
        value: "0kW",
        width: '60%'
      },
      {
        title: "Time",
        iconUp: iconTime,
        value: "00:00",
        width: '40%'
      },
      {
        title: "Cost (euro/kWh)",
        iconUp: iconCost,
        value: "0.00",
        iconCoin: true,
        width: '50%'
      },
    ],
    connected: [
      {
        title: "Time",
        iconUp: iconTime,
        value: "00:00",
        width: '50%'
      },
      {
        title: "Cost",
        iconUp: iconCost,
        value: "0.00",
        iconCoin: true,
        width: '50%'
      },
    ],
  });
  const [showModal, setShowModal] = useState({show: false, msg: ''});

  useEffect(() => {
    props.navigation.addListener('focus', () => {
      props.setActiveTab('Kasteelstraat');
    });
    getNearByCharger();
    getMqttClientInformation();
    const minPower = props.charger?.p_min || 0;
    const maxPower = props.charger?.p_max || 0;
    const power = props.server?.power || 0;

    if (power - minPower == 0) return;
    const _percentage = (power - minPower) / (maxPower - minPower) * 100;
    setPowerPercentage(_percentage);
  }, []);

  useEffect(() => {
    getNearByCharger();
  }, [locationCoords]);

  useEffect(() => {
    getlatestSession();
  }, [props.charger?.ilucharge_id]);

  const getMqttClientInformation = async () => {
    const { charger } = props;
    const username = charger?.field1;
    const password = charger?.field2;
    if (!username) return;

    MQTT.createClient({
      uri: mqttApi,
      clientId: clientId + (new Date()).getTime(),
      tls: false,
      auth: true,
      user: username,
      pass: password,
      keepalive: 60,
      automaticReconnect: true,
    }).then(function(client) {
      client.on('closed', function() {
        console.log('Closed event ====> ');
      });
      client.on('error', function(msg) {
        console.log('Error event ====> ', msg);
      });
  
      client.on('message', function(response) {
        const stationInfo = JSON.parse(response?.data);
        let arrData = {};
        for (let [key, value] of Object.entries(stationInfo)) arrData[key] = value;

        if (response.topic == `ilucharge/${username}/server`) props.setServer({...arrData});
        if (response.topic == `ilucharge/${username}/device`) props.setDevice({...arrData});
        if (response.topic == `ilucharge/announce/${username}`) {
          _station = {...charger, ...arrData};
          props.setCharger({..._station});
        }
      });
  
      client.on('connect', function(e) {
        client.subscribe('#', 0);
        client.subscribe('$SYS/#', 0);
      });
  
      client.connect();
    }).catch(function(err){
      console.log('err ===> ', err);
    });
  }
  const getlatestSession = async () => {
    const chargerId = props.charger?.ilucharge_id;
    if (!chargerId) return;

    let sessionData, cnt = 0;
    let _carouselItems = carouselItems;
    while (true) {
      let flag = 0;
      let params = new URLSearchParams();
      params.append('action', 'sessions_day');
      params.append('ilu_id', chargerId);
      params.append('date', formatDate(cnt));
      await axios.post(api, params, {
        headers: {
          'AUTH_key': authKey,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).then(async (response) => {
        sessionData = response.data;
        if (Array.isArray(sessionData.data)) flag = 1;
        else cnt = cnt + 1;
      }).catch((err) => { console.log(err) });

      if (flag) break;
    }

    const fromDate = new Date(sessionData.data[0].from.replace(' ', 'T'));
    const toDate = new Date(sessionData.data[0].to.replace(' ', 'T'));

    _carouselItems.disConnected[0].value = (sessionData?.data[0]?.kwh * sessionData?.data[0]?.euro).toFixed(2) + 'kW';
    let chargingTime = Math.abs(toDate - fromDate);

    let hours = Math.floor(chargingTime / (1000 * 3600));
    let minutes = Math.floor((chargingTime - hours * 3600000) / (1000 * 60));
    let time = (hours < 10 ? '0' + hours.toString() : hours.toString()) + ':' + (minutes < 10 ? '0' + minutes.toString() : minutes.toString());
    _carouselItems.disConnected[1].value = time;
    _carouselItems.disConnected[2].value = sessionData?.data[0]?.euro;

    carouselItems.connected[0].value = time;
    carouselItems.connected[1].value = sessionData?.data[0]?.euro;

    setCarouselItems({..._carouselItems});
  }
  const getNearByCharger = async () => {
    const params = new URLSearchParams();
    params.append('action', 'getChargers');
    params.append('email', email);
    await axios.post(api, params, {
      headers: {
        'AUTH_key': authKey,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).then(async (res) => {
      const chargers = res.data.data;

      if (Platform.OS === 'ios') {
        await Geolocation.requestAuthorization('always');
        await Geolocation.setRNConfiguration({
          skipPermissionRequests: false,
          authorizationLevel: 'whenInUse',
        });
      }
      if (Platform.OS === 'android') {
        await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
      }

      await Geolocation.watchPosition(async (position) => {
        const location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        }
        await setLocationCoords({...location});
        
        let minDistance = 99999999999999999, idx = -1;
        for (let i = 0, len = chargers.length; i < len; i++) {
          const distance = await getDistance(
            location,
            { latitude: parseFloat(chargers[i].lat), longitude: parseFloat(chargers[i].lng) }
          );
          if (distance < minDistance) {
            minDistance = distance;
            idx = i;
          }
        }
        if (idx !== -1) setNearByCharger(chargers[idx].charger_name)
      }, error => {
        console.log("station map ====> ", error);
      }, {
        showLocationDialog: true,
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 0
      });
    }).catch(err => console.log('err ===> ', err));
  }

  const formatDate = (pre) => {
    var today = new Date();
    var yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - pre);
    var realDay = yesterday;
    
    var month = '' + (realDay.getMonth() + 1);
    var day = '' + realDay.getDate();
    var year = realDay.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  }
  const onSwitchPower = async (mode) => {
    const chargerId = props.charger?.ilucharge_id;
    const params = new URLSearchParams();
    params.append('action', 'switch_power');
    params.append('ilu_id', chargerId);
    params.append('switch', mode);
    await axios.post(api, params, {
      headers: {
        'AUTH_key': authKey,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).then((response) => {
      let _charger = {...props.charger};
      _charger.state = mode ? 'connected' : 'disConnected';
      props.setCharger({..._charger});
    }).catch((err) => { console.log(err) });
  }
  const onSwitchMode = async (mode) => {
    const chargerId = props.charger?.ilucharge_id;
    const params = new URLSearchParams();
    params.append('action', 'switch_mode');
    params.append('ilu_id', chargerId);
    params.append('mode', mode);
    axios.post(api, params, {
      headers: {
        'AUTH_key': authKey,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).then(() => {
      let _charger = {...props.charger};
      _charger.mode = mode;
      props.setCharger({..._charger});
    })
    .catch((err) => { console.log(err) });
  }
  const onPowerSlideComplete = (percentage) => {
    const minPower = props.charger.p_min;
    const maxPower = props.charger.p_max;
    const power = (maxPower - minPower) / 100 * percentage + minPower;
    const chargerId = props.charger?.ilucharge_id;

    const params = new URLSearchParams();
    params.append('action', 'slide_power');
    params.append('ilu_id', chargerId);
    params.append('power', power);
    axios.post(api, params, {
      headers: {
        'AUTH_key': authKey,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).then(res => {
      console.log('res ===> ', res.data);
    }).catch(err => console.log('err ===> ', err));
  }

  const _renderBarChart = ({ item, index }) => {
    const data = props.charger.state === 'connected' ? carouselItems.connected : carouselItems.disConnected;
    return (
      <View style={styles.sliderContent}>
        <View style={{ width: data.length === 3 && !index ? '60%' : '50%' }}>
          <TouchableOpacity style={[styles.sliderItem, { marginRight: 5 }]}>
            <View style={styles.itemContainer}>
              <Image
                source={data[index].iconUp}
                style={styles.chargingIcon}
                resizeMode="stretch"
              />
              <Text style={styles.itemTitle}>{data[index].title}</Text>
            </View>
            <Text style={styles.connectedText}>{data[index].value}</Text>
          </TouchableOpacity>
        </View>

        <View style={{ width: data.length === 3 && !index ? '40%' : '50%' }}>
          <TouchableOpacity style={[styles.sliderItem, { marginLeft: 5 }]}>
            <View style={styles.itemContainer}>
              <Image
                source={data[index + 1].iconUp}
                style={styles.chargingIcon}
                resizeMode="stretch"
              />
              <Text style={styles.itemTitle}>{data[index + 1].title}</Text>
            </View>
            <Text style={styles.connectedText}>{data[index + 1].iconCoin ? '€ ' : ''}{data[index + 1].value}</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
  const handleShowSheet = () => {
    sheetRef.current.snapTo(2)
    props.toogleSheet(true)
  }
  const handleCharge = (value) => {
    setRenderItem(value);
  }
  const handleChangeShowPower = async () => {
    if (props.charger?.mode != 'smart') return;
    if (props.charger.state != 'connected') await onSwitchPower(1);
    setShowPowerBar(!showPowerBar);
  }
  const handleGoSettingPage = () => {
    props.navigation.navigate('Home', { screen: 'Setting' });
  }
  const onResetDashboard = () => {
    sheetRef.current.snapTo(4);
    carouselRef.current.snapToItem(0);
    handleCharge(0);
  }
  const onNormalCharging = async () => {
    await onResetDashboard();
    await onSwitchMode('standalone');
  }
  const onSmartCharging = async () => {
    await onResetDashboard();
    await onSwitchMode('smart');
  }
  const onChangeMode = async () => {
    const state = props.charger?.state;
    if (props.charger?.ilucharge_id) onSwitchPower(state == 'connected' ? 0 : 1);
    else {
      setShowModal({show: true, msg: 'There is no connected Charging Station.'})
    }
  }
  const handleShowMap = () => {
    sheetRef.current.snapTo(4);
    props.navigation.navigate('Home', { screen: 'StationMap' });
  }
  const renderSheetContent = () => {
    if (!renderItem) {
      return (
        <View style={styles.modalContainer}>
          <ImageBackground
            source={require('../../../assets/images/bgdown.png')}
            style={styles.modalBackground}
            resizeMode="stretch"
          >
            <View style={styles.modalContent}>
              <View style={styles.nearByContainer}>
                <View style={styles.nearByText}>
                  <Text style={styles.nearByDescription}>{nearByCharger || 'An iLucharge'} is near you</Text>
                  <TouchableOpacity onPress={handleShowMap}>
                    <Text style={styles.nearByShowMap}>show map</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.nearByMap}>
                  <TouchableOpacity style={styles.nearByMapContent} />
                </View>
              </View>
              <Text style={styles.question}>Do you want to charge?</Text>
              <View style={styles.buttonGroup}>
                <TouchableOpacity style={styles.chargeLeftButton} onPress={() => { handleCharge(0); sheetRef.current.snapTo(4) }}>
                  <Text style={styles.chargeButtonText}>No</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.chargeRightButton} onPress={() => handleCharge(1)}>
                  <Text style={styles.chargeButtonText}>Yes</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ImageBackground>
        </View>
      )
    }
    else {
      return (
        <View style={styles.modalContainer}>
          <ImageBackground
            source={require('../../../assets/images/bgdown.png')}
            style={styles.modalBackground}
            resizeMode="stretch"
          >
            <View style={styles.modalContent}>
              <Text style={styles.chargingAsk}>Do you want?</Text>
              <TouchableOpacity onPress={onSmartCharging}>
                <View style={[styles.chargingButton, { backgroundColor: colors.yellow }]}>
                  <Image
                    source={require('../../../assets/images/icons/lastest_charging.png')}
                    resizeMode="stretch"
                    style={styles.mapPointer}
                  />
                  <Text style={styles.chargingText}>Smart Charging</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={onNormalCharging}>
                <View style={[styles.chargingButton, { borderWidth: 1, borderColor: colors.yellow }]}>
                  <Image
                    source={require('../../../assets/images/icons/power.png')}
                    resizeMode="stretch"
                    style={styles.mapPointer}
                  />
                  <Text style={styles.chargingText}>Normal Charging</Text>
                </View>
              </TouchableOpacity>
            </View>
          </ImageBackground>
        </View>
      )
    }
  }

  let power = props.server?.power || 0;

  return (
    <View style={styles.dFlex}>
      <Modal isVisible={showModal.show} backdropOpacity={0.5} useNativeDriver={true}>
        <View style={styles.modalStyle}>
          <Text style={styles.modalMsgContent}>{showModal.msg}</Text>
          <TouchableOpacity style={styles.modalCloseContainer} onPress={() => setShowModal({show: false, msg: ''})}>
            <Text style={styles.modalCloseBtn}>X</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      
      <View style={styles.dFlex}>
        <ScrollView style={styles.dFlex}>
          <View style={styles.graphContainer}>
            <View style={styles.dFlex}>
              <ImageBackground
                source={dashboardBackground}
                style={styles.dFlex}
                resizeMode="stretch"
              >
                <View style={styles.headerContainer}>
                  <View style={styles.content}>
                    {props.charger?.charger_name ? 
                      <Image
                        source={iconPointer}
                        resizeMode="contain"
                        style={styles.marker}
                      />
                      : null
                    }
                    <Text style={styles.headerTitle}>{props.charger?.charger_name}</Text>
                    <TouchableOpacity style={styles.endIconContainer} onPress={handleGoSettingPage}>
                      <Image
                        source={iconSetting}
                        resizeMode="contain"
                        style={styles.user}
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.graphInformation}>
                  <View style={styles.graphContent}>
                    <AnimatedCircularProgress
                      ref={animatedCircularBar}
                      size={250}
                      width={6}
                      fill={powerPercentage}
                      tintColor={props.charger.state === 'connected' ? colors.yellow : colors.chargedTintColor}
                      backgroundColor={colors.default}
                      lineCap="round"
                      padding={15}
                      renderCap={({ center }) => {
                        if (props.charger.state === 'connected') {
                          return (
                            <Circle
                              cx={center.x}
                              cy={center.y}
                              r="7"
                              fill="white"
                              stroke={colors.yellow}
                              strokeWidth="4"
                            />
                          )
                        }
                        return null;
                      }}
                      children={() => {
                        return (
                          <View style={styles.innerContainer}>
                            <TouchableWithoutFeedback onPress={handleShowSheet}>
                              <View style={styles.innerContent}>
                                <View style={styles.iconContainer}>
                                  <Image
                                    source={props.charger.state == 'connected' ? iconCharging : iconCharged}
                                    style={props.charger.state == 'connected' ? styles.connectedIcon : styles.chargingIcon}
                                    resizeMode="stretch"
                                  />
                                  <Text style={styles.smartCharge}>
                                    {props.charger.state != 'connected' ? 'CHARGED' : props.charger?.mode == 'smart' ? 'SMART CHARGING' : 'NORMAL CHARGING'}
                                  </Text>
                                </View>
                                <TouchableOpacity onPress={handleChangeShowPower}>
                                  <Text style={styles.chargePower}>{power}W</Text>
                                </TouchableOpacity>
                              </View>
                            </TouchableWithoutFeedback>
                          </View>
                        )
                      }}
                    />
                  </View>
                  {showPowerBar ? 
                    <View style={{position: 'absolute', right: 30, width: 10, height: 250}}>
                      <VerticalSlider
                        value={powerPercentage}
                        width={10}
                        height={250}
                        min={0}
                        max={100}
                        step={1}
                        onChange={(value) => setPowerPercentage(value)}
                        onComplete={(value) => onPowerSlideComplete(value)}
                        minimumTrackTintColor="#dce775"
                        maximumTrackTintColor={colors.yellow}
                        shadowProps={{
                          shadowOffsetWidth: 1,
                          shadowOffsetHeight: 1,
                          shadowOpacity: 1,
                          shadowRadius: 2.22,
                          elevation: 3,
                          shadowColor: 'red',
                        }}
                      />
                    </View>
                    : null
                  }
                </View>
              </ImageBackground>
            </View>
          </View>

          <View style={styles.sliderContainer}>
            <View style={styles.connected}>
              <Image
                source={iconCharging}
                style={styles.connectedIcon}
                resizeMode="stretch"
              />
              <Text style={styles.connectedText}>{props.charger.state == 'connected' ? 'Connected' : 'Disconnected'}</Text>
            </View>

            <Carousel
              layout={"default"}
              ref={carouselRef}
              data={carouselItems[props.charger.state == 'connected' ? "connected" : "disConnected"].slice(0, Math.ceil(carouselItems[props.charger.state == 'connected' ? "connected" : "disConnected"].length / 2))}
              sliderWidth={width - 50}
              itemWidth={width - 50}
              renderItem={_renderBarChart}
            />
          </View>
        </ScrollView>
      </View>
      <BottomSheet
        ref={sheetRef}
        snapPoints={[500, 280, 250, 100, 0]}
        initialSnap={4}
        enabledContentTapInteraction={false}
        enabledGestureInteraction={false}
        renderContent={renderSheetContent}
      />
      <Footer {...props} onChangeMode={onChangeMode} />
    </View>
  );
}

const styles = StyleSheet.create({
  modalStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 5,
    position: 'relative',
  },
  modalMsgContent: {
    paddingVertical: 20,
    paddingHorizontal: 30,
    color: 'black',
    borderRadius: 5
  },
  modalCloseContainer: {
    position: 'absolute',
    right: 0,
    top: 0,
  },
  modalCloseBtn: {
    paddingVertical: 3,
    paddingHorizontal: 7,
    backgroundColor: 'red',
    borderBottomLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  dFlex: {
    flex: 1,
  },
  chargingButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    marginVertical: 7,
    borderRadius: 10,
  },
  chargingText: {
    fontSize: 15,
    fontWeight: 'bold',
    paddingLeft: 10,
  },
  chargingAsk: {
    fontSize: 22,
    fontWeight: 'bold',
    paddingBottom: 10,
  },
  modalContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  modalBackground: {
    width: '100%',
    height: '100%',
  },
  modalContent: {
    paddingHorizontal: 30,
    paddingTop: 60,
    flex: 1,
  },
  nearByContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nearByText: {
    width: '80%',
  },
  nearByDescription: {
    fontSize: 15,
    opacity: 0.5,
    fontWeight: 'bold'
  },
  nearByShowMap: {
    fontSize: 12,
    color: colors.yellow
  },
  nearByMap: {
    height: 20,
    width: '20%',
    justifyContent: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  nearByMapContent: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  mapPointer: {
    width: 20,
    height: 20,
    tintColor: colors.black,
  },
  question: {
    fontSize: 25,
    fontWeight: 'bold',
    paddingTop: 10,
    paddingBottom: 20,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chargeLeftButton: {
    width: '50%',
    marginRight: 5,
    height: 40,
    borderColor: colors.yellow,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  chargeRightButton: {
    width: '50%',
    marginLeft: 5,
    height: 40,
    backgroundColor: colors.yellow,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  chargeButtonText: {
    fontSize: 15,
    fontWeight: 'bold'
  },
  headerContainer: {
    position: 'absolute',
    top: StatusBar.currentHeight + 20,
    width: width,
    height: headerHeight - 20,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  marker: {
    height: 25,
    tintColor: colors.black,
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  endIconContainer: {
    position: 'absolute',
    marginRight: 25,
    right: 0,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
  },
  user: {
    height: 25,
    tintColor: colors.black,
  },
  graphContainer: {
    // height: height - 190, // (bottom: 80, bottomSlider: 160)
    minHeight: 480,
  },
  graphInformation: {
    minHeight: 420 - headerHeight,
    height: height - 160 - headerHeight - StatusBar.currentHeight, // (header: headerHeight + StatusBar.currentHeight)
    marginTop: headerHeight + 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sliderContainer: {
    height: 160,
    alignItems: 'center',
    backgroundColor: colors.default,
  },
  graphContent: {
    width: 280,
    height: 280,
    borderRadius: 500,
    transform: [
      { rotateZ: '-90deg' },
    ],
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerContainer: {
    position: 'relative',
    transform: [
      { rotateZ: '90deg' },
    ],
  },
  innerContent: {
    width: 150,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  chargePower: {
    fontSize: 32,
    fontWeight: 'bold'
  },
  chargingIcon: {
    width: 15,
    height: 15,
    marginRight: 5,
  },
  smartCharge: {
    fontSize: 13,
  },
  connected: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: 15,
  },
  connectedIcon: {
    width: 23,
    height: 23,
    marginRight: 5,
  },
  connectedText: {
    fontSize: 25,
    fontWeight: 'bold',
  },
  sliderContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sliderItem: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
  },
  itemContainer: {
    alignItems: 'center',
    flexDirection: 'row'
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: 'bold',
  }
});
