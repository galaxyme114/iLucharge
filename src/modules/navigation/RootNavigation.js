import 'react-native-gesture-handler';
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Image, TouchableOpacity } from 'react-native';

import StackNavigationData from './stackNavigationData';
import { colors, fonts } from '../../styles';

const Stack = createStackNavigator();

const headerLeftComponent = (props) => {
  return (
    <TouchableOpacity
      onPress={props.onPress}
      style={{
        marginLeft: 10,
        paddingHorizontal: 10,
        paddingVertical: 5,
      }}
    >
      <Image
        source={require('../../../assets/images/icons/back_arrow.png')}
        resizeMode="contain"
        style={{
          height: 20,
          tintColor: 'black'
        }}
      />
    </TouchableOpacity>    
  )
}

export default NavigatorView = () => {
  return (
    <Stack.Navigator initialRouteName="Login">
      {StackNavigationData.map((item, idx) => (
        <Stack.Screen
          key={`stack_item-${idx+1}`}
          name={item.name} 
          component={item.component} 
          options={() => {
            return (
              {
                headerShown: (item.name === 'Chart' || item.name === 'Setting') ? true : false,
                headerLeft: headerLeftComponent,
                headerTitleStyle: {
                  fontFamily: fonts.primaryRegular,
                  fontSize: 18,
                  fontWeight: 'bold',
                },
                headerStyle: {
                  backgroundColor: colors.default,
                  elevation: 0,
                },
                title: item.headerTitle,
                animationEnabled: false,
              }
            )}
          }
        />
      ))}
    </Stack.Navigator>
  );
}