import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  StatusBar
} from 'react-native';
import { Rating, AirbnbRating } from 'react-native-ratings';
import Geocoder from 'react-native-geocoding';

import { GOOGLE_MAP_KEY } from '../../auth';
import { colors } from '../../styles';

const background = require('../../../assets/images/projects.jpg');
const iconTime = require('../../../assets/images/icons/time.png');
const iconConnect = require('../../../assets/images/icons/connected.png');
const iconlocation = require('../../../assets/images/icons/location.png');
const iconPhone = require('../../../assets/images/icons/phone.png');
const iconCost = require('../../../assets/images/icons/sm_cost.png');
const iconPlug = require('../../../assets/images/icons/sm_plug.png');
const iconPower = require('../../../assets/images/icons/sm_power.png');
const iconSetting = require('../../../assets/images/icons/setting.png');
const iconPointer = require('../../../assets/images/icons/map_pointer.png');
const iconBackArrow = require('../../../assets/images/icons/back_arrow.png');

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;
const headerHeight = Platform.OS === 'ios' ? 90 : 45;

export default function ChargeStationView(props) {
  const [station, setStation] = useState({})
  const { charger } = props.route.params;

  useEffect(() => {
    Geocoder.init(GOOGLE_MAP_KEY);
    let addressInfo = {};
    Geocoder.from(charger.lat, charger.lng).then(json => {
      const addressArr = json.results[0].address_components;
      for (let i = 0, length = addressArr.length; i < length; i++) {
        switch (addressArr[i].types[0]) {
          case 'establishment':
            addressInfo.establishment = addressArr[i].long_name;
            break;
          case 'street_number':
            addressInfo.street_number = addressArr[i].long_name;
            break;
          case 'route':
            addressInfo.route = addressArr[i].long_name;
            break;
          case 'locality':
            addressInfo.locality = addressArr[i].long_name;
            break;
          case 'administrative_area_level_2':
            addressInfo.political = addressArr[i].long_name;
            break;
          case 'country':
            addressInfo.country = addressArr[i].long_name;
            break;
          case 'postal_code':
            addressInfo.postal_code = addressArr[i].long_name;
            break;
          default:
            break;
        }
      }

      let _station = {...props.charger};
      _station = {..._station, ...charger, address: addressInfo};
      setStation({..._station})
		}).catch(error => console.warn(error));
  }, [charger?.charger_name])

  const ratingCompleted = (rating) => {
    console.log("Rating is: " + rating)
  }
  const handleGoBack = () => {
    props.navigation.goBack();
  }
  const handleGoSettingPage = () => {
    props.navigation.navigate('Home', { screen: 'Setting' });
  }
  const handleConnect = () => {
    props.setCharger({...station})
  }

  return (
    <View style={styles.container}>
      <View style={styles.mapHeaderContainer}>
        <View style={styles.mapHeaderContent}>
          <View style={styles.content}>
            <TouchableOpacity style={styles.backIconContainer} onPress={handleGoBack}>
              <Image
                source={iconBackArrow}
                resizeMode="contain"
                style={styles.user}
              />
            </TouchableOpacity>
            
            {station?.charger_name ? 
              <Image
                source={iconPointer}
                resizeMode="contain"
                style={styles.marker}
              />
              : null
            }
            <Text style={styles.headerTitle}>{station?.charger_name}</Text>

            <TouchableOpacity style={styles.endIconContainer} onPress={handleGoSettingPage}>
              <Image
                source={iconSetting}
                resizeMode="contain"
                style={styles.user}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView>
        <View style={styles.body}>
          <View style={styles.stationContainer}>
            <Image
              source={background}
              resizeMode="stretch"
              style={styles.stationImage}
            />
            <View style={styles.stationContent}>
              <View style={styles.fit}>
                <View style={styles.stationLeft}>
                  <Text style={styles.stationTitle}>{station?.charger_name}</Text>
                  <View style={{ width: 80 }}>
                    <Rating
                      onFinishRating={ratingCompleted}
                      imageSize={16}
                      style={styles.starStyle}
                      fractions={2}
                      ratingColor={colors.rating}
                      selectedColor={colors.rating}
                      reviewColor={colors.rating}
                    />
                  </View>
                </View>
                <View style={styles.stationRight}>
                  <TouchableOpacity style={styles.connectionContainer} onPress={handleConnect}>
                    <Image
                      source={iconConnect}
                      resizeMode="stretch"
                      style={styles.user}
                      tintColor={colors.yellow}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.chargerInfoContainer}>
            <View style={styles.leftContainer}>
              <View style={styles.leftContent}>
                <Image
                  source={iconlocation}
                  resizeMode="contain"
                  style={styles.chargerInfoIcon}
                />
              </View>
            </View>
            <View>
              <Text style={styles.topInfo}>{(station?.address?.route || '') + (station?.address?.route ? ' ' : '') + (station?.address?.street_number || '')}</Text>
              <Text style={styles.downInfo}>{(station?.address?.postal_code || '') + (station?.address?.postal_code ? ' ' : '') + (station?.address?.locality || '')}</Text>
            </View>
          </View>

          <View style={styles.chargerInfoContainer}>
            <View style={styles.leftContainer}>
              <View style={styles.leftContent}>
                <Image
                  source={iconPhone}
                  resizeMode="contain"
                  style={styles.chargerInfoIcon}
                />
              </View>
            </View>
            <View>
              <Text style={styles.topInfo}>+32 329 08817</Text>
            </View>
          </View>

          <View style={styles.chargerInfoContainer}>
            <View style={styles.leftContainer}>
              <View style={styles.leftContent}>
                <Image
                  source={iconTime}
                  resizeMode="contain"
                  style={styles.chargerInfoIcon}
                />
              </View>
            </View>
            <View>
              <Text style={styles.topInfo}>Open: 600 am - 11:00 pm</Text>
            </View>
          </View>

          <View style={styles.slotContainer}>
            <Text style={styles.slotTitle}>Slots</Text>
            <View style={styles.slotContent}>
              <View style={styles.slotHeader}>
                <View style={styles.slotHeaderImage}>
                  <View>
                    <Image
                      source={iconPlug}
                      resizeMode="contain"
                      style={styles.slotIcon}
                    />
                  </View>
                </View>
                <Text style={styles.slotHeaderTitle}>PLUG</Text>
              </View>

              <View style={styles.slotHeader}>
                <View style={styles.slotHeaderImage}>
                  <View>
                    <Image
                      source={iconPower}
                      resizeMode="contain"
                      style={styles.slotIcon}
                    />
                  </View>
                </View>
                <Text style={styles.slotHeaderTitle}>MAX POWER</Text>
              </View>

              <View style={styles.slotHeader}>
                <View style={styles.slotHeaderImage}>
                  <View>
                    <Image
                      source={iconCost}
                      resizeMode="contain"
                      style={styles.slotIcon}
                    />
                  </View>
                </View>
                <Text style={styles.slotHeaderTitle}>PRICE/KWH</Text>
              </View>
            </View>

            <View style={styles.slotContent}>
              <View style={styles.slotHeader}>
                <Text style={styles.slotItemText}>Type 1</Text>
              </View>
              <View style={styles.slotHeader}>
                <Text style={styles.slotItemText}>{station?.p_max || 0} amp</Text>
              </View>
              <View style={styles.slotHeader}>
                <Text style={styles.slotItemText}>€ 0</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapHeaderContainer: {
    width: width,
    height: headerHeight + StatusBar.currentHeight + 20,
    backgroundColor: 'white'
  },
  mapHeaderContent: {
    marginTop: StatusBar.currentHeight,
    height: headerHeight + 20,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIconContainer: {
    position: 'absolute',
    marginLeft: 25,
    left: 0,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  user: {
    width: 25,
    height: 25,
    tintColor: colors.black,
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
  body: {
    paddingHorizontal: 30,
  },
  stationContainer: {
    borderRadius: 15,
    height: 300,
    paddingTop: 20,
    position: 'relative',
  },
  stationImage: {
    width: '100%',
    height: 200,
    borderRadius: 15,
  },
  stationContent: {
    height: 80,
    justifyContent: 'center',
    borderRadius: 15,
    paddingHorizontal: 15,
    backgroundColor: 'white',
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  fit: {
    flexDirection: 'row',
  },
  stationLeft: {
    width: '80%',
    flexDirection: 'column',
  },
  stationRight: {
    width: '20%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stationTitle: {
    fontSize: 25,
    fontWeight: 'bold'
  },
  connectionContainer: {
    width: 45,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.default,
    borderRadius: 10,
  },
  starStyle: {
    paddingTop: 10,
    margin: 0,
    marginHorizontal: 0,
    justifyContent: 'flex-start',
  },
  ratingContainer: {
    borderWidth: 1,
    borderColor: 'red'
  },
  chargerInfoContainer: {
    paddingTop: 20,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  leftContainer: {
    width: 45,
  },
  leftContent: {
    backgroundColor: 'white',
    width: 30,
    height: 30,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center'
  },
  chargerInfoIcon: {
    height: 15,
    tintColor: colors.black,
  },
  topInfo: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  downInfo: {
    fontSize: 12,
    opacity: 0.5,
  },
  slotContainer: {
    marginVertical: 20,
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 15,
    backgroundColor: 'white'
  },
  slotTitle: {
    fontSize: 25,
    fontWeight: 'bold',
  },
  slotContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 6,
  },
  slotHeader: {
    width: '33.333333333333%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  slotHeaderImage: {
    justifyContent: 'center',
  },
  slotHeaderTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    paddingLeft: 5,
    opacity: 0.5,
  },
  slotIcon: {
    width: 16,
    height: 16,
    tintColor: 'black',
    opacity: 0.5,
  },
  slotItemText: {
    fontSize: 17,
    fontWeight: 'bold',
  },
});
