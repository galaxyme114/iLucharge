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
import AsyncStorage from '@react-native-async-storage/async-storage';

import { firebase } from '../../firebase';
import { colors } from '../../styles';

const iconVisible = require('../../../assets/images/icons/eye.png')
const iconInvisible = require('../../../assets/images/icons/invisible.png')

const height = Dimensions.get('window').height;

export default function LoginView(props) {
  const [userInfo, setUserInfo] = useState({email: 'tpogorov@gmail.com', password: '123456'});
  const [validUserInfo, setValidUserInfo] = useState({emailErr: '', passwordErr: ''});
  const [visible, setVisible] = useState(false);

  const onChangeUserInfo = (type, value) => {
    let _userInfo = userInfo;
    let _validUserInfo = validUserInfo;
    _userInfo[type] = value;
    if (type === 'email') {
      let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      if (reg.test(value) === false) _validUserInfo.emailErr = 'Invalid email address';
      else _validUserInfo.emailErr = '';
    }
    else {
      if (value.length < 6) _validUserInfo.passwordErr = 'Invalid password';
      else _validUserInfo.passwordErr = '';
    }
    setUserInfo({..._userInfo});
    setValidUserInfo({..._validUserInfo});
  }

  const onChangeVisible = () => {
    let _visible = visible;
    _visible = !_visible;
    setVisible(_visible);
  }

  const onClickLogin = async () => {
    if (validUserInfo.emailErr.length || validUserInfo.passwordErr.length || userInfo.email === '' || userInfo.password === '') return;
    await firebase.auth().signInWithEmailAndPassword(userInfo.email, userInfo.password).then(async (res) => {
      try {
        await AsyncStorage.setItem('userInfo', JSON.stringify(res));
        props.navigation.navigate('Home', { screen: 'Kasteelstraat'});
      } catch (e) {
        console.log('e ===> ', e)
      }
    }).catch(error => {
      let _validUserInfo = validUserInfo;
      for (const [key, value] of Object.entries(error)) {
        console.log(`${key}: ${value}`);
      }
      if (error.code === 'auth/wrong-password') _validUserInfo.passwordErr = error.message;
      else _validUserInfo.emailErr = error.message;
      setValidUserInfo({..._validUserInfo});
    })
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
      <View style={styles.downContainer}>
        <ImageBackground
          source={require('../../../assets/images/bgdown.png')}
          style={styles.container}
          resizeMode="stretch"
        >
          <View style={styles.wrapper}>
            <View style={styles.downContent}>
              <SafeAreaView style={styles.container}>
                <ScrollView>
                  <View style={styles.scrollContent}>
                    <View style={{paddingBottom: 10}}>
                      <Text style={styles.title}>Welcome</Text>
                      <Text style={styles.description}>Sign in to continue!</Text>
                    </View>
                    
                    <View style={styles.flexItemContainer}>
                      <TextInput
                        style={[styles.textInput]}
                        placeholder="Email"
                        value={userInfo.email}
                        onChangeText={text => onChangeUserInfo('email', text)}
                      />
                      {validUserInfo.emailErr.length? <Text style={styles.errMsg}>{validUserInfo.emailErr}</Text> : null}
                    </View>

                    <View style={styles.flexItemContainer}>
                      <TextInput
                        style={styles.textInput}
                        placeholder="password"
                        secureTextEntry={visible ? false : true}
                        value={userInfo.password}
                        onChangeText={text => onChangeUserInfo('password', text)}
                      />
                      {validUserInfo.passwordErr.length? <Text style={styles.errMsg}>{validUserInfo.passwordErr}</Text> : null}
                      <View style={styles.eyeIconContainer}>
                        <TouchableOpacity onPress={onChangeVisible}>
                          <Image
                            source={visible ? iconVisible : iconInvisible}
                            style={visible ? styles.eyeIcon : styles.invisible}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>

                    <View style={styles.forgotPassword}>
                      <TouchableOpacity onPress={() => props.navigation.navigate('Home', { screen: 'ResetPassword'})}>
                        <Text style={{fontWeight: 'bold'}}>Forgot password?</Text>
                      </TouchableOpacity>
                    </View>

                    <View style={styles.flexItemContainer}>
                      <TouchableOpacity style={styles.loginButton} onPress={onClickLogin}>
                        <ImageBackground
                          source={require('../../../assets/images/icons/btn_background.png')}
                          style={styles.container}
                          resizeMode="stretch"
                        >
                          <Text style={styles.loginText}>Login</Text>
                        </ImageBackground>
                      </TouchableOpacity>
                    </View>
                  </View>
                </ScrollView>
              </SafeAreaView>
            </View>
            <View style={styles.rememberContainer}>
              <View style={styles.signupLabel}>
                <Text>Don't you have an Account?</Text>
                <TouchableOpacity onPress={() => props.navigation.navigate('Home', { screen: 'Register'})} style={styles.signupButton}>
                  <Text style={styles.signup}>Sign up</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ImageBackground>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  errMsg: {
    paddingLeft: 10,
    paddingTop: 5,
    color: 'red',
    fontSize: 12,
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
  wrapper: {
    position: 'relative',
    marginLeft: 35,
    marginRight: 35,
    flex: 1,
  },
  downContent: {
    flex: 1,
    marginBottom: 60,
    marginTop: 70,
  },
  scrollContent: {
    flex: 1,
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
    paddingBottom: 20,
  },
  textInput: {
    height: height > 600 ? 45 : 40,
    backgroundColor: colors.white,
    borderRadius: 5,
    paddingLeft: 20,
    paddingRight: 45,
  },
  loginButton: {
    height: height > 600 ? 45 : 40,
  },
  loginText: {
    textAlign: 'center',
    textAlignVertical: 'center',
    color: colors.black,
    fontWeight: 'bold',
    borderRadius: 5,
    paddingVertical: 10,
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
  },
  rememberContainer: {
    position: 'absolute',
    bottom: 30,
    width: '100%',
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  signupLabel: {
    fontWeight: 'bold',
    position: 'relative',
    flexDirection: 'row',
  },
  signupButton: {
    height: 20,
    paddingLeft: 5,
  },
  signup: {
    color: colors.yellow,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  forgotPassword: {
    flex: 1,
    flexDirection: 'row-reverse',
    marginVertical: 5,
  }
});
