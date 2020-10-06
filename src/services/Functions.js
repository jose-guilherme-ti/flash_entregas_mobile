import AsyncStorage from '@react-native-community/async-storage'
import { fcmService } from './../FCMService';
import { localNotificationService } from './../LocalNotificationService';
import Api from './api';






async function refreshTokenServer(token_device){
  console.log(token_device)
  //await AsyncStorage.clear()
  //await AsyncStorage.setItem('token_device', '')
  const cd_entregador = await AsyncStorage.getItem('cd_entregador');
  var tokenStorage = await AsyncStorage.getItem('token_device');
  if (tokenStorage === token_device) {
      console.log("O token atual é válido!");
      //return tokenStorage;
  } else {
    console.log("O token não é válido!");
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

const Functions = {
  // Valida Usuário
  loadUser: async function(cd_entregador){
    try {
      const response = await Api.api.get('entregador/entregador?cd_entregador='+cd_entregador, {
        auth: { 
          username: Api.Auth_User, 
          password: Api.Auth_Pass 
        }
      });
      if(response.data[0].hasOwnProperty("cd_entregador")){
        console.log(response.data[0]);
        return response.data[0];
      } else {
        return false
      }
    } catch (error) {
      return false
    }
  },
  registerForPushNotificationsAsync: async function() {
    
    const onRegister = async(token) => {
      if(token !== null && token !== undefined && token.length > 0){
        refreshTokenServer(token);
      }
      return token;
    }
    const onNotification = (notify) => {
      // console.log("[App] onNotification", notify);
   
    }
  
    const onOpenNotification = async (notify) => {
    
      console.log('notify', notify);
    }
   
    fcmService.register(onRegister, onNotification, onOpenNotification)
    
  }
}
export default Functions;
