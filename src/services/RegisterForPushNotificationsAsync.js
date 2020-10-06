import React from 'react';
import { Alert } from 'react-native';
//import * as Notifications from 'expo-notifications';
import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';
import Api from './api';
import AsyncStorage from '@react-native-community/async-storage'

async function refreshTokenServer(token_device){
  //await AsyncStorage.clear()
  //await AsyncStorage.setItem('token_device', '')
  const cd_entregador = await AsyncStorage.getItem('cd_entregador');
  var tokenStorage = await AsyncStorage.getItem('token_device');
  if (tokenStorage === token_device) {
      console.log("O token atual é válido!");
      //return tokenStorage;
  } else {
    //console.log("O token não é válido!");
    //Cadastra/Atualiza o Token
    if(cd_entregador){
      try {
        var response = await Api.api.put('/entregador/token', {
          "cd_entregador": cd_entregador,
          "token": token_device
        }, {
          auth: { 
            username: Api.Auth_User, 
            password: Api.Auth_Pass 
          }
        });
        if(response.status === 200){ 
          console.log("Token atualizado com sucesso!");
          await AsyncStorage.setItem('token_device', token_device); 
        }
      } catch (error) {
        console.error(error);
      }
    }
  }
  return token_device;
}

export default async function RegisterForPushNotificationsAsync() {
  //console.log('Testing...' + Constants.isDevice);
  //Alert.alert('Testing...', Constants.isDevice);
  if (Constants.isDevice) {
    const { status: existingStatus } = await Permissions.getAsync(
      Permissions.NOTIFICATIONS
    );
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Permissions.askAsync(
        Permissions.NOTIFICATIONS
      );
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      Alert.alert('Failed to get push token for push notification!');
      return;
    }
    let token = await Notifications.getExpoPushTokenAsync();
    console.log('Testing...' + token);
    Alert.alert('Testing...', token);
    if(token !== null && token !== undefined && token.length > 0){
      refreshTokenServer(token);
    }
  } else {
    alert('Must use physical device for Push Notifications');
  }
  
}