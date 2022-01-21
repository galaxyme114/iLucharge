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

import { firebase } from '../../firebase';
import { colors } from '../../styles';

const height = Dimensions.get('window').height;

export default function ResetPasswordView(props) {
  const [email, setEmail] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const onChangeEmail = (value) => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (reg.test(value) === false) setErrorMsg('Invalid email address');
    else setErrorMsg('');
    setEmail(value);
  }

  const onClickReset = () => {
    if (errorMsg.length || email === '') return;
    firebase.auth().sendPasswordResetEmail(email).then(() => {
      props.navigation.navigate('Home', { screen: 'CheckEmail'});
    }).catch(err => setErrorMsg('There is no user record corresponding to this identifier. The user may have been deleted.'));
  }

  const onClickLogin = () => {
    console.log('onClickLogin ---> ');
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
          <View style={styles.downContainer}>
            <ImageBackground
              source={require('../../../assets/images/bgdown.png')}
              style={styles.container}
              resizeMode="stretch"
            >
              <View style={styles.downContent}>
                <View style={styles.flexItemContainer}>
                  <Text style={styles.title}>Reset Password</Text>
                  <Text style={styles.description}>Enter your registered email below to receive password reset instruction</Text>
                </View>
                
                <View style={styles.flexItemContainer}>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Email"
                    value={email}
                    onChangeText={text => onChangeEmail(text)}
                  />
                  {errorMsg.length? <Text style={styles.errMsg}>{errorMsg}</Text> : null}
                </View>

                <View style={styles.flexItemContainer}>
                  <TouchableOpacity style={styles.sendButton} onPress={onClickReset}>
                    <ImageBackground
                      source={require('../../../assets/images/icons/btn_background.png')}
                      style={styles.container}
                      resizeMode="stretch"
                    >
                      <Text style={styles.sendText}>Send</Text>
                    </ImageBackground>
                  </TouchableOpacity>
                </View>

                <View style={styles.rememberContainer}>
                  <View style={styles.forgotPasswordButton}>
                    <Text >Remember password? </Text>
                    <TouchableOpacity onPress={onClickLogin} style={styles.loginButton}>
                      <Text style={styles.login}>Login</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </ImageBackground>
          </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  errMsg: {
    paddingLeft: 10,
    paddingTop: 5,
    color: 'red',
    fontSize: 12,
  },
  sendButton: {
    height: height > 600 ? 45 : 40,
  },
  sendText: {
    flex: 1,
    textAlign: 'center',
    textAlignVertical: 'center',
    color: colors.black,
    fontWeight: 'bold',
    borderRadius: 5,
    paddingVertical: 10,
  },
  rememberContainer: {
    position: 'absolute',
    bottom: 30,
    width: '100%',
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  forgotPasswordButton: {
    fontWeight: 'bold',
    position: 'relative',
    flexDirection: 'row',
  },
  remember: {
    color: 'black',
    paddingBottom: 10,
    position: 'absolute',
  },
  loginButton: {
    height: 20,
    paddingLeft: 5,
  },
  login: {
    color: colors.yellow,
    fontWeight: 'bold',
    textAlign: 'center',
  }
});
