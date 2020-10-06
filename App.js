/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  StatusBar,
  Platform,
  SafeAreaView,
} from 'react-native';
import PushNotification from 'react-native-push-notification';
/* import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen'; */
import Geolocation from 'react-native-geolocation-service';

import io from 'socket.io-client';

import {fcmService} from './src/FCMService';
import {localNotificationService} from './src/LocalNotificationService';
import AsyncStorage from '@react-native-community/async-storage';

import AppNavigator from './src/navigation/AppNavigator';
import Colors from './src/constants/Colors';
import FlashMessage from 'react-native-flash-message';
import {decode, encode} from 'base-64';
/* import AnimatedLoader from "react-native-animated-loader"; */

const App = () => {
  
  /*   const [hasLocationPermission, setHasLocationPermission] = useState(false);
  const [userPosition, setUserPosition] = useState(false); */
  const [isLoadingComplete, setLoadingComplete] = useState(false);
  
  /*  const [clienteSocket, setClienteSocket] = useState(
    io('http://192.168.15.5:4000', {
      transports: ['websocket'],
      forceNew: true,
    }),
  ); */

  Object.size = function (obj) {
    var size = 0,
      key;
    for (key in obj) {
      if (obj.hasOwnProperty(key)) size++;
    }
    return size;
  };

  //For resolve axios bug (Basic Auth)
  if (!global.btoa) {
    global.btoa = encode;
  }
  if (!global.atob) {
    global.atob = decode;
  }

  useEffect(() => {
    setInterval(() => {
      setLoadingComplete(true);
    }, 2000);

  
    
   
  }, []);

  PushNotification.createChannel(
    {
      channelId: 'id_channel_flash', // (required)
      channelName: 'Custom channel', // (required)
      channelDescription:
        'A custom channel to categorise your custom notifications', // (optional) default: undefined.
      soundName: 'notification_sound', // (optional) See `soundName` parameter of `localNotification` function
      importance: 4, // (optional) default: 4. Int value of the Android notification importance
      vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
    },
    (created) => console.log(`createChannel returned '${created}'`), // (optional) callback returns whether the channel was created, false means it already existed.
  );

  if (Platform.OS !== 'ios') {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        <AppNavigator />

        <FlashMessage position="top" />
      </SafeAreaView>
    );
  } else {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        <View style={styles.noData}>
          <Text style={styles.avisoNoData}>Platform not Supported!</Text>
        </View>
      </SafeAreaView>
    );
  }
};

/* async function loadResourcesAsync() {
  await Promise.all([
    Asset.loadAsync([
      //require('./assets/images/robot-dev.png'),
      //require('./assets/images/robot-prod.png'),
    ]),
    Font.loadAsync({
      // This is the font that we are using for our tab bar
      ...Ionicons.font,
      // We include SpaceMono because we use it in HomeScreen.js. Feel free to
      // remove this if you are not using it in your app
      'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
    }),
  ]);
}
 */

// backgroundColor: '#72B8F2', - azul #F0F0F0
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundDefault, //'#FBFBFB', //Colors.backgroundDefault,
    fontFamily: 'space-mono',
  },
  noData: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 20,
  },
  avisoNoData: {
    //marginTop: 20,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});

/*  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          <Header />
          {global.HermesInternal == null ? null : (
            <View style={styles.engine}>
              <Text style={styles.footer}>Engine: Hermes</Text>
            </View>
          )}
          <View style={styles.body}>
            <Text>Latitude: {userPosition.latitude}</Text>
            <Text>Longitude: {userPosition.longitude}</Text>
            <Button onPress={()=>sendMessage()} title="Click here to send"> </Button>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  ); */
/* }; */

export default App;
