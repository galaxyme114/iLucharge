import * as React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { 
  createDrawerNavigator,
  DrawerItem,
  DrawerContentScrollView,
} from '@react-navigation/drawer';
import NavigatorView from './RootNavigation';

const iconChart = require('../../../assets/images/icons/chart.png');
const iconCalendar = require('../../../assets/images/icons/calendar.png');
const iconSettings = require('../../../assets/images/icons/setting.png');

const drawerData = [
  {
    name: 'Chart',
    icon: iconChart,
  },
  {
    name: 'Kasteelstraat',
    icon: iconCalendar,
  },
  {
    name: 'Setting',
    icon: iconSettings,
  },
];

const Drawer = createDrawerNavigator();

function CustomDrawerContent(props) {
  return (
    <DrawerContentScrollView {...props} style={{padding: 0}}>
      <View style={styles.avatarContainer}>
        <Image
          style={styles.avatar}
          source={require('../../../assets/images/user.png')}
        />
        <View style={{ paddingLeft: 15 }}>
          <Text style={styles.userName}>John Doe</Text>
          <Text style={{ color: '#4BC1FD' }}>Johndoe@gmail.com</Text>
        </View>
      </View>

      <View style={styles.divider} />
      
      {drawerData.map((item, idx) => (
        <DrawerItem
          key={`drawer_item-${idx+1}`}
          label={() => (
            <View style={styles.menuLabelFlex}>
              <Image
                style={{
                  width: item.name === 'Setting' ? 23 : 20,
                  height: item.name === 'Setting' ? 23 : 20,
                  tintColor: 'white',
                  marginLeft: item.name === 'Setting' ? -3 : 0,
                }}
                source={item.icon}
              />
              <Text style={styles.menuTitle}>{item.name}</Text>
            </View>
          )}
          onPress={() => props.navigation.navigate('Home', {screen: item.name})}
        />
      ))}
    </DrawerContentScrollView>
  );
}

export default function App() {

  return (
    <Drawer.Navigator
      drawerStyle={{
        backgroundColor: '#3C38B1',
      }}
      drawerContent={props => <CustomDrawerContent {...props} />}
      initialRouteName="Home"
    >
      <Drawer.Screen name="Home" component={NavigatorView} />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  menuTitle: {
    marginLeft: 10,
    color: '#fff'
  },
  menuLabelFlex: {
    display: 'flex',
    flexDirection: 'row',
  },
  userName: {
    color: '#fff',
    fontSize: 18
  },
  divider: {
    borderBottomColor: 'white',
    opacity: 0.2,
    borderBottomWidth: 1,
    margin: 15,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  avatarContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    margin: 20,
    marginBottom: 10
  },
});
