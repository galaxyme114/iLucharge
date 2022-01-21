import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ImageBackground,
  Linking
} from 'react-native';

import { colors } from '../../styles';

const height = Dimensions.get('window').height;

export default function CheckEmailView(props) {

  const onClickReset = () => {
    // Linking.openURL('https://www.google.co.in/')
    props.navigation.navigate('Home', { screen: 'NewPassword'});
  }

  const onClickLogin = () => {
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
        <ScrollView style={styles.container}>
          <View style={styles.downContainer}>
            <ImageBackground
              source={require('../../../assets/images/bgdown.png')}
              style={styles.container}
              resizeMode="stretch"
            >
              <View style={styles.downContent}>
                <View style={styles.inboxContainer}>
                  <View style={styles.inboxContent}>
                    <Image
                      source={require('../../../assets/images/icons/email.png')}
                      style={styles.inboxIcon}
                      resizeMode="stretch"
                    />
                  </View>
                </View>

                <View style={styles.flexItemContainer}>
                  <Text style={styles.title}>Check your email</Text>
                  <Text style={styles.description}>Please check your inbox and click in the received link to reset the password.</Text>
                </View>
                
                <View style={styles.flexItemContainer}>
                  <TouchableOpacity style={styles.sendButton} onPress={onClickReset}>
                    <ImageBackground
                      source={require('../../../assets/images/icons/btn_background.png')}
                      style={styles.container}
                      resizeMode="stretch"
                    >
                      <Text style={styles.sendText}>Open Email APP</Text>
                    </ImageBackground>
                  </TouchableOpacity>
                </View>

                <View style={styles.rememberContainer}>
                  <Text style={styles.forgotPasswordButton}>
                    <TouchableOpacity>
                      <Text style={{fontWeight: 'bold'}}>Go to </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={onClickLogin} style={styles.loginButton}>
                      <Text style={styles.login}>Login</Text>
                    </TouchableOpacity>
                  </Text>
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
  inboxContainer: {
    marginBottom: 25,
    textAlign: 'center',
    width: '100%',
    height: '25%',
    textAlignVertical: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inboxContent: {
    width: 90,
    height: 90,
  },
  inboxIcon: {
    width: '100%',
    height: '100%',
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
    fontSize: 25,
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
  sendButton: {
    height: 45,
  },
  sendText: {
    flex: 1,
    textAlign: 'center',
    textAlignVertical: 'center',
    color: colors.black,
    fontWeight: 'bold',
    borderRadius: 5,
  },
  rememberContainer: {
    position: 'absolute',
    bottom: 30,
    width: '100%',
    height: 30,
  },
  forgotPasswordButton: {
    textAlign: 'center',
    fontWeight: 'bold',
    position: 'relative'
  },
  remember: {
    color: 'black',
    paddingBottom: 10,
    position: 'absolute',
  },
  loginButton: {
    position: 'absolute',
    width: 50,
    height: 20,
  },
  login: {
    color: colors.yellow,
    fontWeight: 'bold',
    textAlign: 'center',
  }
});
