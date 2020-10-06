import React, { useState, useEffect } from 'react';
import { withNavigation } from 'react-navigation';
import { ScrollView, StyleSheet, Text, View, Platform, RefreshControl, PermissionsAndroid} from 'react-native';
/* import * as Network from 'expo-network'; */
/* import * as Permissions from 'expo-permissions'; */
/* import * as Location from 'expo-location'; */
/* import * as Battery from 'expo-battery'; */
import NetInfo from "@react-native-community/netinfo";

import { getModel, getSystemVersion, getBatteryLevel , getVersion} from 'react-native-device-info';
/* import * as Device from 'expo-device'; */
/* import * as Application from 'expo-application'; */
import MaterialCommunityIcons  from 'react-native-vector-icons/MaterialCommunityIcons';
import Functions from '../services/Functions';
import Colors from '../constants/Colors';
import AsyncStorage from '@react-native-community/async-storage'

function PhoneStatus({navigation}) {
    const [user, setUser] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);  
    const [internet, setInternet] = useState(false);
    const [internetType, setInternetType] = useState(false);
    const [gps, setGPS] = useState(false);
    const [acessoGPS, setAcessoGPS] = useState(false);
    const [batteryStatus, setBatteryStatus] = useState();

    // Executa assim q a página é aberta;
    useEffect(() => {
        loadUser();
        getNetworkState();
        getGpsStatus();
        getBaterryState();
    }, []);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        loadUser();
        getNetworkState();
        getGpsStatus();
        getBaterryState();
        setTimeout(() => {
          setRefreshing(false)
        }, 1500);
      }, [refreshing]);

    async function loadUser() {
        const cd_entregador = await AsyncStorage.getItem('cd_entregador');
        var response = await Functions.loadUser(cd_entregador);
        console.log(response)
        setUser(response);
        setLoading(!loading);
    }

    async function getNetworkState(){
        NetInfo.addEventListener(state => {
          setInternetType(state.type);
          setInternet(state.isConnected);
        });
    }

    async function getGpsStatus(){
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('permissão concedida');
        setAcessoGPS(true);
      }else{
        setAcessoGPS(false);
      }  
       /*  const response = await Location.getProviderStatusAsync(); */
        /* setGPS(response.gpsAvailable); */
        setGPS(true);
    };

    async function getBaterryState(){
      getBatteryLevel().then(batteryLevel => {
        setBatteryStatus(Math.abs(parseFloat(batteryLevel*100).toFixed(0)));
      });
          
      
        
        
    }

    return(
      <ScrollView style={styles.containerTop} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />} >
        <View style={styles.body}>
          <View style={styles.list}>  

            <View style={styles.listItem}>
              <View style={styles.viewListItem}> 
                <View style={styles.viewIconList}>
                  <MaterialCommunityIcons name={internet===true ? 'check-circle' : 'close-circle'} size={26} color={internet===true ? 'green' : 'red'}  style={styles.icon}/>
                </View>
                <View style={styles.viewTextList}>            
                  <Text style={styles.titleItem}>Internet {internetType === 'CELLULAR' ? '(CELULAR)' : '('+internetType+')'}</Text>
                </View>                        
              </View>        
            </View>  

            <View style={styles.listItem}>
              <View style={styles.viewListItem}> 
                <View style={styles.viewIconList}>
                  <MaterialCommunityIcons name={gps===true ? 'check-circle' : 'close-circle'} size={26} color={gps===true ? 'green' : 'red'}  style={styles.icon}/>
                </View>
                <View style={styles.viewTextList}>            
                  <Text style={styles.titleItem}>GPS</Text>
                </View>                        
              </View>        
            </View>   
            
            <View style={styles.listItem}>
              <View style={styles.viewListItem}> 
                <View style={styles.viewIconList}>
                  <MaterialCommunityIcons name={acessoGPS===true ? 'check-circle' : 'close-circle'} size={26} color={acessoGPS===true ? 'green' : 'red'}  style={styles.icon}/>
                </View>
                <View style={styles.viewTextList}>            
                  <Text style={styles.titleItem}>Permissão de Localização</Text>
                </View>                        
              </View>        
            </View>  

            <View style={styles.listItem}>
              <View style={styles.viewListItem}> 
                <View style={styles.viewIconList}>
                  <MaterialCommunityIcons name={parseInt(user.bo_online) === 1 ? 'check-circle' : 'close-circle'} size={26} color={parseInt(user.bo_online) === 1 ? 'green' : 'red'}  style={styles.icon}/>
                </View>
                <View style={styles.viewTextList}>            
                  <Text style={styles.titleItem}> Status do Botão {parseInt(user.bo_online) === 1 ? ': Ativo' : ': Desabilitado'}</Text>
                </View>                        
              </View>        
            </View> 

            <View style={styles.listItem}>
              <View style={styles.viewListItem}> 
                <View style={styles.viewIconList}>
                  <MaterialCommunityIcons name={batteryStatus > 15 ? 'battery-60' : 'battery-alert'} size={26} color={batteryStatus > 15 ? 'green' : 'red'}  style={styles.icon}/>
                </View>
                <View style={styles.viewTextList}>            
                  <Text style={styles.titleItem}>Bateria: {batteryStatus + "%"}</Text>
                </View>                        
              </View>        
            </View> 

            <View style={styles.listItem}>
              <View style={styles.viewListItem}> 
                <View style={styles.viewIconList}>
                  <MaterialCommunityIcons name={'cellphone-android'} size={26} color={'green'} style={styles.icon}/>
                </View>
                <View style={styles.viewTextList}>            
                  <Text style={styles.titleItem}> Modelo do Aparelho: {getModel()}</Text>
                </View>                        
              </View>        
            </View> 

            <View style={styles.listItem}>
              <View style={styles.viewListItem}> 
                <View style={styles.viewIconList}>
                  <MaterialCommunityIcons name={Platform.OS === 'ios' ? 'apple' : 'android'} size={26} color={Platform.OS === 'ios' ? 'gray' : 'green'} style={styles.icon}/>
                </View>
                <View style={styles.viewTextList}>            
                  <Text style={styles.titleItem}> Versão do {Platform.OS === 'ios' ? 'iOS' : 'Android'}: {getSystemVersion()}</Text>
                </View>                        
              </View>        
            </View> 

            <View style={styles.listItem}>
              <View style={styles.viewListItem}> 
                <View style={styles.viewIconList}>
                  <MaterialCommunityIcons name={'flash'} size={26} color={Colors.tintColor} style={styles.icon}/>
                </View>
                <View style={styles.viewTextList}>            
                  <Text style={styles.titleItem}> Versão do App: {getVersion()}</Text>
                </View>                        
              </View>        
            </View> 

          </View>            
        </View>
        {/*<ScrollView>
            <Text>appOwnership: {Constants.appOwnership}</Text>
            <Text >expoVersion: {Constants.expoVersion}</Text>
            <Text >installationId: {Constants.installationId}</Text>
            <Text >deviceName: {Constants.deviceName}</Text>
            <Text >deviceYearClass: {Constants.deviceYearClass}</Text>
            <Text >isDevice: {Constants.isDevice}</Text>
            <Text >nativeAppVersion: {Constants.nativeAppVersion}</Text>
            <Text >nativeBuildVersion: {Constants.nativeBuildVersion}</Text>
            <Text >versionCode: {Constants.platform.android.versionCode}</Text>
            <Text >sessionId: {Constants.sessionId}</Text>
            <Text >manifest: {JSON.stringify(Constants.manifest)}</Text>
        </ScrollView>*/}
      </ScrollView>
    )

}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
      //backgroundColor: Colors.backgroundDefault, //'#f8f8f8',
    },
    containerTop: {
      flex: 1,
    },
  
    hidden:{
      display: 'none',
    },
    
    body: {
      //height: Layout.window.height*0.8,
      alignSelf: 'stretch',
      //alignItems: 'center',
      //justifyContent: 'space-around',
      //margin: 20,
    },
    br:{
      height:30,
      width: "100%"
    },
  
    // Phone Status
    list: {
      width:'100%',
      alignItems: 'center',
      paddingBottom: 50,
    },
    listItem: {
      backgroundColor: '#FDFDFD',
      padding: 5,
      width: '100%',
      borderBottomWidth: 1,
      borderBottomColor: '#F0F0F0',
    },
    titleItem: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#555',
      //marginLeft: 15,
      //textTransform:'uppercase'
    },
    viewListItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
    },
    viewIconList:{
      padding: 10,
      width: '13%',
    },
    viewTextList: {
      width: '87%',
    } 
});
//Necessário para funcionar a navegação/redirecionamento para outra página;
export default PhoneStatus;