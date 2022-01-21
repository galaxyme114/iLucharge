import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  Dimensions,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';

import { colors } from '../../styles';

const iconVisible = require('../../../assets/images/icons/eye.png')
const iconInvisible = require('../../../assets/images/icons/invisible.png')


const height = Dimensions.get('window').height;

export default function NewPasswordView(props) {
  const [password, setPassword] = useState({
    oldPassword: {
      value: '',
      show: false,
    },
    newPassword: {
      value: '',
      show: false,
    }
  });

  const onChangePassword = (type, value) => {
    let _password = password;
    _password[type].value = value;
    setPassword({..._password});
  }

  const onChangeVisible = (type) => {
    let _password = password;
    _password[type].show = !_password[type].show;
    setPassword({..._password});
  }

  const onClickReset = () => {
    console.log('user password data ---> ', password);
    props.navigation.navigate('Home', { screen: 'Login'});
  }

  return (
    <ImageBackground
      source={require('../../../assets/images/background.png')}
      style={styles.container}
      resizeMode="stretch"
    >
      <View style={styles.topContainer}>
        <View style={styles.topContent}>
          <Image
            source={require('../../../assets/images/logo.png')}
            style={styles.logoImage}
            resizeMode="stretch"
          />
        </View>
      </View>
      <SafeAreaView style={styles.downContainer}>
        <ScrollView>
          <View style={styles.downContainer}>
            <ImageBackground
              source={require('../../../assets/images/bgdown.png')}
              style={styles.container}
              resizeMode="stretch"
            >
              <View style={styles.downContent}>
                <View style={styles.flexItemContainer}>
                  <Text style={styles.title}>Create new password</Text>
                  <Text style={styles.description}>Please choose your new password</Text>
                </View>
                
                <View style={styles.flexItemContainer}>
                  <TextInput
                    style={styles.textInput}
                    placeholder="New Password"
                    secureTextEntry={password.oldPassword.show ? false : true}
                    value={password.oldPassword.value}
                    onChangeText={text => onChangePassword('oldPassword', text)}
                  />
                  <View style={styles.eyeIconContainer}>
                    <TouchableOpacity onPress={() => onChangeVisible('oldPassword')}>
                      <Image
                        source={password.oldPassword.show ? iconVisible : iconInvisible}
                        style={password.oldPassword.show ? styles.eyeIcon : styles.invisible}
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.flexItemContainer}>
                  <TextInput
                    style={styles.textInput}
                    placeholder="confirm Password"
                    secureTextEntry={password.newPassword.show ? false : true}
                    value={password.newPassword.value}
                    onChangeText={text => onChangePassword('newPassword', text)}
                  />
                  <View style={styles.eyeIconContainer}>
                    <TouchableOpacity onPress={() => onChangeVisible('newPassword')}>
                      <Image
                        source={password.newPassword.show ? iconVisible : iconInvisible}
                        style={password.newPassword.show ? styles.eyeIcon : styles.invisible}
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.flexItemContainer}>
                  <TouchableOpacity style={styles.resetButton} onPress={onClickReset}>
                    <ImageBackground
                      source={require('../../../assets/images/icons/btn_background.png')}
                      style={styles.container}
                      resizeMode="stretch"
                    >
                      <Text style={styles.resetText}>Reset</Text>
                    </ImageBackground>
                  </TouchableOpacity>
                </View>
              </View>
            </ImageBackground>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  topContainer: {
    flex: 1,
    height: height * (height > 680 ? 0.35 : 0.3),
    textAlignVertical: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topContent: {
    width: '50%',
    height: '28%',
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  downContainer: {
    height: height * (height > 680 ? 0.65 : 0.7),
  },
  downContent: {
    flex: 1,
    position: 'relative',
    marginLeft: 35,
    marginRight: 35,
    marginTop: 80,
  },
  title: {
    color: colors.black,
    fontSize: height > 600 ? 27 : 22,
    fontWeight: 'bold',
  },
  description: {
    color: colors.black,
    fontSize: 15,
    opacity: 0.5,
    paddingBottom: 10,
  },
  flexItemContainer: {
    paddingBottom: 25,
  },
  textInput: {
    height: height > 600 ? 45 : 40,
    backgroundColor: colors.white,
    borderRadius: 5,
    paddingLeft: 20,
    paddingRight: 45,
  },
  resetButton: {
    height: height > 600 ? 45 : 40,
  },
  resetText: {
    flex: 1,
    textAlign: 'center',
    textAlignVertical: 'center',
    color: colors.black,
    fontWeight: 'bold',
    borderRadius: 5,
  },
  nerdImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'stretch'
  },
  eyeIconContainer: {
    position: 'absolute',
    right: 0,
    width: 45,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center'
  },
  eyeIcon: {
    width: 35,
    height: 35,
  },
  invisible: {
    width: 23,
    height: 23,
  }
});
