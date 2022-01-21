import React, { useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
  Dimensions,
  BackHandler
} from 'react-native';
import Slider from 'react-native-slider';

import { colors } from '../../styles';
import Footer from '../../components/TabBar';
const iconTracker = require('../../../assets/images/icons/slider_btn.png');

const width = Dimensions.get('window').width;

export default class SettingView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      energy: 0,
      maximum: 60,
    };
    this.BackHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick.bind(this));
    this.handleChangeValue = this.handleChangeValue.bind(this);
    this.handleClickSave = this.handleClickSave.bind(this);
  }

  handleBackButtonClick() {
    this.props.setActiveTab('Setting')
  }
  componentWillUnmount() {
    this.BackHandler.remove();
  }

  handleChangeValue = (value) => {
    this.setState({
      energy: Math.floor(value)
    })
  }
  handleClickSave = () => {
    this.props.setActiveTab('Kasteelstraat');
    this.props.navigation.navigate('Home', { screen: 'Kasteelstraat'});
  }

  render() {
    const { energy, maximum } = this.state;
    const labels = [];
    for (let i = 10; i <= maximum; i += 10) labels.push(i);

    return (
      <View style={styles.container}>
        <View style={styles.wrapper}>
          <Text style={styles.question}>How much energy does your car consume?</Text>
          <View style={styles.energyContainer}>
            <Text style={styles.energy}>{energy} kWh</Text>
            <Slider
              minimumValue={0}
              maximumValue={maximum}
              minimumTrackTintColor={colors.yellow}
              maximumTrackTintColor={colors.trackBackground}
              thumbTintColor={colors.yellow}
              thumbImage={iconTracker}
              thumbStyle={{width: 0, height: 5, paddingTop: 5, justifyContent: 'center', alignItems: 'center'}}
              value={energy}
              onValueChange={(value) => this.handleChangeValue(value)}
            />
            <View style={styles.lableContainer}>
              <View style={styles.itemContainer}>
                <Text style={styles.firstItem}>0</Text>
              </View>
              {labels.map((item) => {
                return (
                  <View key={item} style={[styles.itemContainer, {width: (width-100)/Math.floor(maximum/10)}]}>
                      <Text style={styles.item}>{item}</Text>
                  </View>
                )
              })}
            </View>
          </View>

          <TouchableOpacity onPress={this.handleClickSave}>
            <ImageBackground
              source={require('../../../assets/images/icons/btn_background.png')}
              style={styles.buttonBackground}
              resizeMode="stretch"
            >
              <View style={styles.button}>
                <Text style={styles.buttonText}>Save Changes</Text>
              </View>
            </ImageBackground>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.buttonBackground, {marginTop: 20}]} onPress={this.handleClickSave}>
            <View style={styles.button}>
              <Text style={styles.cancel}>Cancel</Text>
            </View>
          </TouchableOpacity>
        </View>
        <Footer {...this.props}/>
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  wrapper: {
    flex: 1,
    paddingLeft: 30,
    paddingRight: 30,
  },
  question: {
    fontSize: 23,
    fontWeight: 'bold'
  },
  energyContainer: {
    marginVertical: 30,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  energy: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  lableContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  itemContainer: {
    position: 'relative',
  },
  item: {
    textAlign: 'right',
    marginRight: -8
  },
  firstItem: {
    position: 'absolute',
    marginLeft: -2
  },
  buttonBackground: {
    width: '100%',
    paddingVertical: 10,
  },
  button: {
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  cancel: {
    fontSize: 15,
    opacity: 0.3
  },
});