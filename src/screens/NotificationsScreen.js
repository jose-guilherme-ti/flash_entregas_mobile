import React, { useState, useEffect } from 'react';
import { 
  StyleSheet,
  ImageBackground, } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import fundoImg from '../../assets/images/fundo.jpg';
//import NotificationsList from '../components/NotificationsList';
import PhoneStatus from '../components/PhoneStatus';
import Header from '../components/Header';

export default function NotificationsScreen({navigation}) {
  const [active, setActive] = useState(0);

  return (
    <ImageBackground source={fundoImg} style={{width: '100%', height: '100%', resizeMode: 'cover',}}>
      <LinearGradient style={styles.container} colors={['#FBFBFB', '#FBFBFB', '#FBFBFB']}>
        <Header navigation={navigation} statusBO={active} onValueChange={(val) => {setActive(val)}}/>
        {/*<NotificationsList />*/}
        <PhoneStatus />
    </LinearGradient>
  </ImageBackground>
  );
}

NotificationsScreen.navigationOptions = {
  header: null,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

/*
export default createStackNavigator(
  {
    NotificationsScreen: NotificationsScreen,
    PageEvent: PageEvent,
  },
  {
    initialRouteName: 'NotificationsScreen',
  }
);
*/