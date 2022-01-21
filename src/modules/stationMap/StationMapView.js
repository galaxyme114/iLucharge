import React, { useState, useEffect, useRef } from 'react';
import {
  Platform,
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  StatusBar,
} from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import axios from 'axios';
import Geolocation from "react-native-geolocation-service";
import { getDistance } from 'geolib';

import Footer from '../../components/TabBar';
import { colors } from '../../styles';
import { api, GOOGLE_MAP_KEY, authKey } from '../../auth';

const iconStation = require('../../../assets/images/icons/station.png');
const iconCurrentLocation = require('../../../assets/images/icons/location.png');
const iconRoute = require('../../../assets/images/icons/route.png');
const iconUser = require('../../../assets/images/icons/user.png');
const iconPointer = require('../../../assets/images/icons/map_pointer.png');
const iconBackArrow = require('../../../assets/images/icons/back_arrow.png');


const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const headerHeight = Platform.OS === 'ios' ? 90 : 45;

export default function HomeScreen(props) {
  const [chargers, setChargers] = useState([]);
  const [location, setLocation] = useState({
    latitude: 51.0882762,
    longitude: 5.1602774,
  });
  const [destination, setDestination] = useState(null);
  const [destInfo, setDestInfo] = useState(null);

  useEffect(() => {
    getLocation();
  }, []);

  const getLocation = async () => {
    const params = new URLSearchParams();
    params.append('action', 'getChargers');
    params.append('email', 'muriel@futech.be');
    await axios.post(api, params, {
      headers: {
        'AUTH_key': authKey,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).then(async (res) => {
      const _chargers = res.data.data;
      await setChargers([..._chargers]);
      await Geolocation.watchPosition(async (position) => {
        const _location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        }
        await setLocation({ ..._location });
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
  const handleDrawRoute = async () => {
    let minDistance = 99999999999999999, idx = -1;
    let len = chargers.length;
    for (let i = 0; i < len; i++) {
      const distance = await getDistance(
        location,
        { latitude: parseFloat(chargers[i].lat), longitude: parseFloat(chargers[i].lng) }
      );
      if (distance < minDistance) {
        minDistance = distance;
        idx = i;
      }
    }
    if (idx !== -1) setDestination({ latitude: parseFloat(chargers[idx].lat), longitude: parseFloat(chargers[idx].lng) })
  }
  const handleChargerInformation = (item) => {
    props.navigation.navigate('ChargeStation', { charger: item });
  }
  const isSamePoint = (station1, station2) => {
    return station1?.latitude == station2.lat && station1?.longitude == station2.lng;
  }

  return (
    <View style={styles.dFlex}>
      <View style={styles.dFlex}>
        <ScrollView style={styles.dFlex}>
          <View style={styles.mapContainer}>
            <MapView
              region={{
                latitude: location.latitude,
                longitude: location.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
              style={styles.mapContainer}
            >
              {destination !== null ?
                <MapViewDirections
                  origin={location}
                  destination={destination}
                  apikey={GOOGLE_MAP_KEY}
                  precision="high" // low
                  timePrecision="now" // none
                  channel="ev_charge_app_direction_api"
                  strokeWidth={3}
                  strokeColor="hotpink"
                  onReady={(result) => {
                    console.log(`Distance: ${result.distance} km`)
                    console.log(`Duration: ${result.duration} min.`);
                    setDestInfo({...result});
                  }}
                />
                : null
              }

              <Marker
                coordinate={{ latitude: location.latitude, longitude: location.longitude }}
                image={iconCurrentLocation}
              />

              {chargers.map((charger, index) => {
                return (
                  <Marker
                    key={index}
                    coordinate={{ latitude: parseFloat(charger.lat), longitude: parseFloat(charger.lng) }}
                    image={iconStation}
                    onPress={() => {
                      if (!isSamePoint(destination, charger)) handleChargerInformation(charger);
                    }}
                  >
                    {isSamePoint(destination, charger) ? 
                      <Callout onPress={() => handleChargerInformation(charger)}>
                        <View>
                          <Text>Distance: {destInfo?.distance.toFixed(2) || 0} km</Text>
                          <Text>Time: {destInfo?.duration.toFixed(2) || 0} mins</Text>
                        </View>
                      </Callout>
                      : null
                    }
                  </Marker>
                )
              }
              )}
            </MapView>

            <View style={styles.mapHeaderContainer}>
              <View style={styles.mapHeaderContent}>
                <View style={styles.content}>
                  <TouchableOpacity style={styles.backIconContainer} onPress={() => props.navigation.goBack()}>
                    <Image
                      source={iconBackArrow}
                      resizeMode="contain"
                      style={styles.user}
                    />
                  </TouchableOpacity>

                  {props.charger?.charger_name ?
                    <Image
                      source={iconPointer}
                      resizeMode="contain"
                      style={styles.marker}
                    />
                    : null
                  }
                  <Text style={styles.headerTitle}>{props.charger?.charger_name}</Text>

                  <TouchableOpacity style={styles.endIconContainer}>
                    <Image
                      source={iconUser}
                      resizeMode="contain"
                      style={styles.user}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <View style={styles.connectionContainer}>
              <View style={styles.connectionContent}>
                <TouchableOpacity onPress={handleDrawRoute}>
                  <Image
                    source={iconRoute}
                    resizeMode="contain"
                    style={styles.user}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
      <Footer {...props} onChangeMode={() => {}} />
    </View>
  );
}

const styles = StyleSheet.create({
  connectionContainer: {
    position: 'absolute',
    width: width,
    top: headerHeight + StatusBar.currentHeight + 40,
    left: 30,
    height: 45,
    width: 45,
  },
  connectionContent: {
    position: 'relative',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: 45,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 10,
    opacity: 50,
  },
  dFlex: {
    flex: 1,
  },
  mapHeaderContainer: {
    position: 'absolute',
    width: width,
    height: headerHeight + StatusBar.currentHeight + 20,
    backgroundColor: 'rgba(235, 237, 237, 0.8)'
  },
  mapHeaderContent: {
    position: 'relative',
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
  backIconContainer: {
    position: 'absolute',
    marginLeft: 25,
    left: 0,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
  },
  user: {
    width: 25,
    height: 25,
    tintColor: colors.black,
  },
  mapContainer: {
    height: height - 80,
  },
});
