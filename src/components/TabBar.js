import React from 'react';
import {
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  Image,
} from 'react-native';

import { colors } from '../styles';
const iconChart = require('../../assets/images/icons/chart.png');
const iconElectricity = require('../../assets/images/icons/electricity.png');
const iconSetting = require('../../assets/images/icons/setting.png');
const iconConnected = require('../../assets/images/icons/connected.png');

const TabBar = (props) => {

  const handleClickTab = (value) => {
    if (props.activeTab === 'Kasteelstraat' && value === 'Kasteelstraat') {
      props.onChangeMode();
    }
    props.setActiveTab(value);
    props.navigation.navigate('Home', { screen: value});
  }

  return (
    <View style={styles.tabbarContainer}>
      <View style={styles.tabbarWrapper}>
        <View style={styles.tabbarContent}>
          <TouchableWithoutFeedback onPress={() => handleClickTab('Chart')}>
            <View style={styles.tabbarItem}>
              <Image
                source={iconChart}
                resizeMode="stretch"
                style={[styles.tabbarLeftIcon, {tintColor: props.activeTab === 'Chart' ? colors.yellow : 'black'}]}
              />
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={() => handleClickTab('Kasteelstraat')}>
            <View style={styles.tabbarCenterItem}>
              <Image
                source={props.charger.state == 'connected' ? iconConnected : iconElectricity}
                resizeMode="stretch"
                style={[styles.tabbarCenterIcon, {tintColor: props.activeTab === 'Kasteelstraat' ? colors.yellow : 'black'}]}
              />
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={() => handleClickTab('Setting')}>
            <View style={styles.tabbarItem}>
              <Image
                source={iconSetting}
                resizeMode="stretch"
                style={[styles.tabbarRightIcon, {tintColor: props.activeTab === 'Setting' ? colors.yellow : 'black'}]}
              />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  tabbarContainer: {
    width: '100%',
    height: 80,
    paddingVertical: 17,
    paddingHorizontal: 50,
    backgroundColor: '#f2f2f2',
  },
  tabbarWrapper: {
    position: 'relative',
    height: '100%',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 50,
    shadowOffset: {
      width: 1,
      height: 3
    },
    shadowRadius: 5,
    shadowOpacity: 1.0,
    elevation: 4,
  },
  tabbarContent: {
    height: 35,
    paddingHorizontal: 25,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  tabbarItem: {
    width: 35,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
  },
  tabbarCenterItem: {
    width: 60,
    height: 60,
    marginTop: -12.5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    backgroundColor: 'white',
    shadowOffset: {
      width: 1,
      height: 3
    },
    shadowRadius: 5,
    shadowOpacity: 1.0,
    elevation: 4
  },
  tabbarLeftIcon: {
    width: 18,
    height: 18,
  },
  tabbarCenterIcon: {
    width: 35,
    height: 35,
  },
  tabbarRightIcon: {
    width: 25,
    height: 25,
  },
});

export default TabBar;