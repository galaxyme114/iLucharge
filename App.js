import { Provider } from 'react-redux';
import React from 'react';
import { View, ActivityIndicator, StyleSheet, StatusBar } from 'react-native';
import { PersistGate } from 'redux-persist/integration/react';
import { NavigationContainer } from '@react-navigation/native';
import { colors } from './src/styles';

import { store, persistor } from './src/redux/store';

import AppView from './src/modules/AppViewContainer';
import Geolocation from "react-native-geolocation-service";

export default function App() {
  Geolocation.requestAuthorization('whenInUse');
  return (
    <Provider store={store}>
      <StatusBar translucent backgroundColor={'transparent'} barStyle="dark-content" />
      <NavigationContainer>
        <PersistGate
          loading={
            // eslint-disable-next-line react/jsx-wrap-multilines
            <View style={styles.container}>
              <ActivityIndicator color={colors.red} />
            </View>
          }
          persistor={persistor}
        >
          <AppView />
        </PersistGate>
      </NavigationContainer>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
});
