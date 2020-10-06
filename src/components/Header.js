import React, { useState, useEffect } from 'react';
import { View, Switch,  Platform, Image, Text,  TouchableOpacity, StyleSheet, Alert, Modal, PermissionsAndroid } from 'react-native';
import { showMessage, hideMessage } from "react-native-flash-message";
/* import { TextInputMask } from 'react-native-masked-text'
import { MaterialCommunityIcons } from 'react-native-ionicons'; */
import { withNavigation } from 'react-navigation';
/* import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager'; */
import { WebView } from 'react-native-webview';
import { CheckBox } from 'react-native-elements';
import Api from '../services/api';
import Functions from '../services/Functions';
import logo from '../../assets/images/logo.jpg';
import Colors from '../constants/Colors';
import Layout from '../constants/Layout';
import AsyncStorage from '@react-native-community/async-storage'
//import Tasks from '../services/tasks';
import Geolocation from 'react-native-geolocation-service';
import BackgroundTimer from 'react-native-background-timer';

/* const INTERVAL_TASKS = 3; // aproximadamente 10s;
const BACKGROUND_STATUS_TASK = 'background-status-task';
const LOCATION_TASK = 'background-location-task'; */

function Header({navigation, statusBO, tpStatus, switchVisible, onValueChange}) {
  const [active, setActive] = useState(statusBO || 0);
  const [switchDisabled, setSwitchdisabled] = useState(true);
  const [user, setUser] = useState([]);
  const [modalTermos, setModalTermos] = useState(false);
  const [termos, setTermos] = useState(false);
  const [latitude, setLatitude] = useState();
  const [longitude, setLongitude] = useState();
  const [latitude2, setLatitude2] = useState();
  const [longitude2, setLongitude2] = useState();
  const [background, setBackground] = useState();

  //Ao abrir a tela
  useEffect(() => {
    loadUser();
    
  },[active, tpStatus, statusBO]);

  //Ao abrir a tela
  useEffect(() => {
    loadUser();
    (async () => {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          //console.log('permissão concedida');
         /*  setHasLocationPermission(true); */
        } else {
          //console.error('permissão negada');
         /*  setHasLocationPermission(false); */
        }
      } catch (err) {
        console.warn(err);
      }
      
      if(active === 1){
        console.log("Rodando Background Geolocation!")
       /*  BackgroundTimer.stopBackgroundTimer(background) */
        setBackground(BackgroundTimer.setTimeout(() => {
          Geolocation.watchPosition(
            (position) => {
              var loc = {
                position,
                user: {
                  nome: 'React Native',
                },
              };

              setLatitude(position.coords.latitude)
              setLongitude(position.coords.longitude)

              //console.log(loc)
               updateCurrentPosition(loc);
            },
            (error) => {
              console.log(error.code, error.message);
            },
            { enableHighAccuracy: true,
              maximumAge: 1000,
              distanceFilter: 1
            },
          );
        }, 10000))
     /*     Geolocation.watchPosition(
             (position) => {
              console.log(position)
              setLatitude2(position.coords.latitude)
              setLongitude2(position.coords.longitude)
            },(error) => {
              console.log("Erro code:",error.code, "Erro localizacão:", error.message);
            },
            { enableHighAccuracy: true,
              timeout: 2000,
              maximumAge: 1000,
              distanceFilter: 1}
          );
        console.log(background); */
      } else {
       
          console.log("Parando Geolocalização");
          BackgroundTimer.clearTimeout(background)
          console.log("Parou Geolocalização");
      
      }
    })();
  },[active]);

  // Executa assim q a página é aberta;
 /*  */
/* 
  TaskManager.defineTask(LOCATION_TASK, async ({ data, error }) => {
    if (error) {
      console.log(error.message);
      return;
    }
    if (data) {
      const { locations } = data;
      //console.log(locations);
      if(active === 1){
        console.log("Update Location with task mode!");
        await updateCurrentPosition(locations[0]);
      } else {
        await Location.stopLocationUpdatesAsync(LOCATION_TASK);
        console.log("Entregador Off");
      }
    }
  }); */

  async function loadUser() {
    const cd_entregador = await AsyncStorage.getItem('cd_entregador');
    var response = await Functions.loadUser(cd_entregador);
    setUser(response);
    setActive(parseInt(response.bo_online));
    if(parseInt(response.bo_aceite_termos) === 0) {
      setModalTermos(true);
    }
    //FC - Falta finalizar o cadastro
    if(response.tp_status === "FC"){
      if(parseInt(response.bo_online) === 1){
        changeStatusEntregador(0);      
      }
      setSwitchdisabled(true);
    //AT - aguardando treinamento
    } else if(response.tp_status === "AT"){
      if(parseInt(response.bo_online) === 1){
        changeStatusEntregador(0);
      }
      setSwitchdisabled(true);
    //SN - suspenso por negar corrida
    } else if(response.tp_status === "SN"){
      if(parseInt(response.bo_online) === 1){
        changeStatusEntregador(0);
      }
      setSwitchdisabled(true);
    //SF - suspenso por questões financeiras
    } else if(response.tp_status === "SF"){
      if(parseInt(response.bo_online) === 1){
        changeStatusEntregador(0);
      }
      setSwitchdisabled(true);
    //A - liberado para trabalhar
    } else if(response.tp_status === "A"){
      setSwitchdisabled(false);
    } else {
      if(parseInt(response.bo_online) === 1){
        changeStatusEntregador(0);
      }
      setSwitchdisabled(true);
    }
  }

  async function updateCurrentPosition(loc) {
    const cd_entregador = await AsyncStorage.getItem('cd_entregador');
    if(loc !== null){
      try {
        const response = await Api.api.post('/entregador/localizacao', {
          "cd_entregador": cd_entregador,
          "nr_latitude": loc.position.coords.latitude,
          "nr_longitude": loc.position.coords.longitude,
          },{ auth: { 
            username: Api.Auth_User, 
            password: Api.Auth_Pass 
          }
        });
        if(response.status === 200){

          console.log(loc.position.coords)
          console.table("Retorno da api",response.data)
          //console.log(loc.position.timestamp);
          console.log("Localização enviada...");
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  async function updateCurrentStatus() {
    const cd_entregador = await AsyncStorage.getItem('cd_entregador');
    try {
      const response = await Api.api.put('/entregador/online', {
        "cd_entregador": cd_entregador
        },{ auth: { 
          username: Api.Auth_User, 
          password: Api.Auth_Pass 
        }
      });
      if(response.status === 200){
        console.log("Status em background enviado com sucesso! " + new Date().toISOString().substr(11,8));
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function confirmTerms() {
    if(termos){
      try {
        const response = await Api.api.put('/entregador/aceiteTermos', {
          "cd_entregador": user.cd_entregador,
          "bo_aceite_termos": 1,
          },{ auth: {
            username: Api.Auth_User, 
            password: Api.Auth_Pass 
          }
        });
        if(response.status === 200){
          setModalTermos(false);
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      Alert.alert('Aviso', 'Você precisa aceitar os termos para continuar!')
    }
  }

  async function changeStatusEntregador(bo_online){
    try {
      setActive(bo_online);
      
     
   

      const response = await Api.api.put('/entregador/onOff', {
        "cd_entregador": user.cd_entregador,
        },{ auth: {
          username: Api.Auth_User, 
          password: Api.Auth_Pass 
        }
      });
      if(response.status === 200){
        onValueChange(bo_online);
        console.log("Rota onOff =", bo_online);
      } else {
        setActive(bo_online === 1 ? 0 : 1);
        console.log("Rota else onOff =", bo_online)
      }
      //loadUser();
    } catch (error) {
      console.log(error);
      showMessage({
        message: "Falha ao alterar o status!",
        type: "danger",
        color: "#fff",
      });
      setActive(bo_online === 1 ? 0 : 1);
      onValueChange(bo_online === 1 ? 0 : 1);
    }
    /*if(bo_online === 0) {
      location.remove();
    }*/
  }
  return (
    <>
      <View style={styles.welcomeContainer}>
        <Image
          source={logo}
          style={styles.logoImg}
        />
        {/* <Text style={styles.homologa}>Lo: {longitude} La:{latitude}</Text> */}
        <Text style={styles.homologa}></Text>
        <Switch
          value={active === 1 ? true : false}
          disabled={switchDisabled}
          style={switchVisible ? styles.switch : styles.hidden}
          //ios_backgroundColor="#fbfbfb"
          //thumbColor={Colors.secondColor}
          thumbColor={"#fff"}
          trackColor={{false: "#A1A1A1" , true: Colors.tintColor}}
          onValueChange={(val) => {
            var bo_online = val === true ? 1 : 0;
            changeStatusEntregador(bo_online);
            //setActive(bo_online);
            //onValueChange(bo_online);
          }}
        />
      </View>
      <Modal
        //Modal termos
        animationType="slide"
        transparent={true}
        visible={modalTermos}
        style={styles.modal}>
        <View style={styles.bodyModal}> 
          <Text style={styles.titleModal}>Termos e Condições</Text>
          <Text style={styles.subTitleModal}>Aceite os termos para continuar!</Text>
          <View style={styles.viewWebView}> 
            <WebView
              //originWhitelist={['*']}
              //source={{ uri: "https://www.flashentregas.com.br/termos/termos_condicoes_privacidade.pdf"}} 
              //source={{ uri: "https://drive.google.com/viewerng/viewer?embedded=true&url=https://www.flashentregas.com.br/termos/termos_condicoes_privacidade.pdf"}} 
              source={{ uri: "https://www.flashentregas.com.br/appweb/termos/termos_condicoes_privacidade.html"}}   
              style={styles.webview}
              mediaPlaybackRequiresUserAction={true}
            />
          </View>
          <CheckBox
            title="Declaro que li e aceito os termos apresentados acima"
            checked={termos}
            checkedColor={Colors.tintColor}
            onPress={() => setTermos(!termos)}
            containerStyle={{backgroundColor: Colors.transparent, borderWidth: 0}}
            textStyle={{color: "#fff",}}
          />
          <TouchableOpacity onPress={() => confirmTerms()} style={styles.btnModal}>
            <Text style={styles.buttonTextModal}>Confirmar</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  welcomeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: Colors.backgroundDefault,
    ...Platform.select({
      ios: {
        shadowColor: "#999",
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.35,
        shadowRadius:7.11,
      },
      android: {
          elevation: 10,
      },
    }),
  },
  logoImg: {
    maxWidth: 100,
    height: 39,
    //marginLeft: 'auto',
    resizeMode: 'contain',
  },
  switch: {
    marginLeft: 'auto',
    color: '#f8f8f8',
    borderBottomWidth: 1,
    borderColor: Colors.tintColor,
  },
  hidden:{
    display: 'none',
  },

  // MODAL
  modal: {
    //margin: 15
  },
  bodyModal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.backgroundDefault,
    paddingHorizontal: 15,
    //marginTop: 30,
  },
  btnCloseModal: {
    textAlign: "right",
    paddingTop: 7,
    paddingRight: 7,
    backgroundColor: Colors.backgroundDefault,
    //marginTop: 50,
  },
  titleModal: {
    fontWeight: 'bold',
    color: "#fff",
    marginTop: 15,
    fontSize: 20,
    paddingHorizontal: 20,
    textAlign: "center"
  },
  subTitleModal: {
    color: "#fff",
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
    display: 'none'
  },
  btnModal: {
    height: 42,
    backgroundColor: Colors.tintColor,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 55,
    marginHorizontal:15,
  },
  buttonTextModal: {
    color: "#fff",
    fontWeight: 'bold',
    fontSize: 16,
    paddingHorizontal: 20,
  },
  viewWebView: {
    width: Layout.window.width*0.95,
    maxWidth: 550,
    height: 350,
    marginTop: 15,
  },
  webview:{
    //flex: 1,
  },
  homologa:{
    backgroundColor: Colors.tintColor,
    fontWeight: 'bold',
    fontStyle: 'italic',
    fontSize: 12,
  }
});
//Necessário para funcionar a navegação/redirecionamento para outra página;
export default Header;