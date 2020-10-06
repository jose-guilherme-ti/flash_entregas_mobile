import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, ScrollView, TouchableHighlight } from 'react-native';

import MaterialCommunityIcons  from 'react-native-vector-icons/MaterialCommunityIcons';

import Functions from '../services/Functions';
import imgPerfil from '../../assets/images/icon-delivery-man.png';
import Header from '../components/Header';
import AsyncStorage from '@react-native-community/async-storage'
import { useNavigation } from '@react-navigation/native'
/* import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager'; */

//colors={['rgba(251, 251, 251, 0.95)', 'rgba(251, 251, 251, 0.65)', 'rgba(251, 251, 251, 0.65)']}  {//IG: colors={['#7723b8', '#c02c63', '#d89039']}}
export default function UserScreen() {
  const navigation = useNavigation()
 /*  const [active, setActive] = useState(1); */
  const [user, setUser] = useState([]);
  AsyncStorage.setItem('retorno_cadastro', '');
  
  // Executa assim q a página é aberta;
  useEffect(() => {
    loadUser();
    return () =>{
      loadUser();
    }
  }, []);

  async function loadUser() {
    const cd_entregador = await AsyncStorage.getItem('cd_entregador');
    var response = await Functions.loadUser(cd_entregador);
    setUser(response);
   /*  setActive(response.bo_online); */
  }

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('cd_entregador');
      await AsyncStorage.removeItem('token_device');
      await AsyncStorage.removeItem('bo_online');
     /*  var taskHasStart = await Location.hasStartedLocationUpdatesAsync('background-location-task');
      if(taskHasStart){
        await Location.stopLocationUpdatesAsync('background-location-task');
      }
      var taskHasRegister = await TaskManager.isTaskRegisteredAsync('background-location-task');
      if(taskHasRegister){
        await TaskManager.unregisterTaskAsync('background-location-task');
      } */
      navigation.navigate('Login');
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <View style={styles.container}>
     { <Header navigation={navigation} /* statusBO={active} */ /* onValueChange={(val) => setActive(val)} */ />}
      <ScrollView contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.body}>
          <Image 
            source={user.ds_dir_ft_rosto ? {uri: user.ds_dir_ft_rosto} : imgPerfil} 
            style={styles.imgUser}
          />
           <View style={styles.viewTitle}>
            <Text style={styles.title}>{user.nm_entregador}</Text>
           </View>
           <View style={styles.descUser}>
            {/*<MaterialCommunityIcons name="star" size={22} color={Colors.tintColor} style={styles.iconStar}/>
            <Text style={styles.titleDesc}>{user.nr_avaliacao}</Text>*/}
          </View>   
          
          <View style={styles.list}>  

            {/*<View style={styles.listItem}>
              <TouchableHighlight onPress={() => navigation.navigate('PageUserDetail', {page: "page-rating", title: 'Avaliações'})} underlayColor="'rgba(255, 255, 255, 0.0)'">
                  <View style={styles.viewListItem}> 
                    <View style={styles.notification}>            
                      <Text style={styles.titleItem}>Avaliações</Text>
                    </View>                        
                    <View style={styles.viewIcon}>
                      <MaterialCommunityIcons name="chevron-right" size={26} color="#777" style={styles.icon}/>
                    </View>
                  </View>        
              </TouchableHighlight>
            </View> */}

            <View style={styles.listItem}>
              <TouchableHighlight onPress={() => navigation.navigate('PageUserDetail',{page: 'page-vehicle', title: 'Veículo'})} underlayColor="'rgba(255, 255, 255, 0.0)'">
                  <View style={styles.viewListItem}> 
                    <View style={styles.notification}>            
                      <Text style={styles.titleItem}>Veículo</Text>
                    </View>                        
                    <View style={styles.viewIcon}>
                      <MaterialCommunityIcons name="chevron-right" size={26} color="#777" style={styles.icon}/>
                    </View>
                  </View>        
              </TouchableHighlight>
            </View>  

            <View style={styles.listItem}>
              <TouchableHighlight navigation={navigation} onPress={() => navigation.navigate('PageUserDetail', {page: "page-financial", title: 'Financeiro'})} underlayColor="'rgba(255, 255, 255, 0.0)'">
                  <View style={styles.viewListItem}> 
                    <View style={styles.notification}>            
                      <Text style={styles.titleItem}>Financeiro</Text>
                    </View>                        
                    <View style={styles.viewIcon}>
                      <MaterialCommunityIcons name="chevron-right" size={26} color="#777" style={styles.icon}/>
                    </View>
                  </View>        
              </TouchableHighlight>
            </View> 

            <View style={styles.listItem}>
              <TouchableHighlight onPress={() => navigation.navigate('PageUserDetail', {page: "page-deliverys-reports", title: 'Relatórios de Entregas'})} underlayColor="'rgba(255, 255, 255, 0.0)'">
                  <View style={styles.viewListItem}> 
                    <View style={styles.notification}>            
                      <Text style={styles.titleItem}>Relatórios de Entregas</Text>
                    </View>                        
                    <View style={styles.viewIcon}>
                      <MaterialCommunityIcons name="chevron-right" size={26} color="#777" style={styles.icon}/>
                    </View>
                  </View>        
              </TouchableHighlight>
            </View> 

            <View style={styles.listItem}>
              <TouchableHighlight onPress={() => navigation.navigate('PageUserDetail', {page: "page-user-data", title: 'Dados Cadastrais'})} underlayColor="'rgba(255, 255, 255, 0.0)'">
                  <View style={styles.viewListItem}> 
                    <View style={styles.notification}>            
                      <Text style={styles.titleItem}>Dados Cadastrais</Text>
                    </View>                        
                    <View style={styles.viewIcon}>
                      <MaterialCommunityIcons name="chevron-right" size={26} color="#777" style={styles.icon}/>
                    </View>
                  </View>        
              </TouchableHighlight>
            </View> 

            <View style={styles.listItem}>
              <TouchableHighlight onPress={() => navigation.navigate('PageUserDetail', {page: "page-pass-change", title: 'Alterar Senha'})}underlayColor="'rgba(255, 255, 255, 0.0)'">
                  <View style={styles.viewListItem}> 
                    <View style={styles.notification}>            
                      <Text style={styles.titleItem}>Alterar Senha</Text>
                    </View>                        
                    <View style={styles.viewIcon}>
                      <MaterialCommunityIcons name="chevron-right" size={26} color="#777" style={styles.icon}/>
                    </View>
                  </View>        
              </TouchableHighlight>
            </View> 

            <View style={styles.listItem}>
              <TouchableHighlight onPress={() => navigation.navigate('PageUserDetail', {page: "page-conditions", title: 'Termos e Condições'})} underlayColor="'rgba(255, 255, 255, 0.0)'">
                  <View style={styles.viewListItem}> 
                    <View style={styles.notification}>            
                      <Text style={styles.titleItem}>Termos e Condições</Text>
                    </View>                        
                    <View style={styles.viewIcon}>
                      <MaterialCommunityIcons name="chevron-right" size={26} color="#777" style={styles.icon}/>
                    </View>
                  </View>        
              </TouchableHighlight>
            </View> 

            {/*<View style={styles.listItem}>
              <TouchableHighlight onPress={() => navigation.navigate('PageUserDetail', {page: "page-phone-status", title: 'Status do Aparelho', status: active})} underlayColor="'rgba(255, 255, 255, 0.0)'">
                  <View style={styles.viewListItem}> 
                    <View style={styles.notification}>            
                      <Text style={styles.titleItem}>Status do Aparelho</Text>
                    </View>                        
                    <View style={styles.viewIcon}>
                      <MaterialCommunityIcons name="chevron-right" size={26} color="#777" style={styles.icon}/>
                    </View>
                  </View>        
              </TouchableHighlight>
            </View> */}

            <View style={styles.listItem}>
              <TouchableHighlight onPress={() => logout()} underlayColor="'rgba(255, 255, 255, 0.0)'">
                  <View style={styles.viewListItem}> 
                    <View style={styles.notification}>            
                      <Text style={styles.titleItem}>Sair</Text>
                    </View>                        
                    <View style={styles.viewIcon}>
                      <MaterialCommunityIcons name="chevron-right" size={26} color="#777" style={styles.icon}/>
                    </View>
                  </View>        
              </TouchableHighlight>
            </View> 

          </View>  
        


        </View>      
      </ScrollView>
    </View>
  )
}
/*
class LogoTitle extends React.Component {
  render() {
    return (
      <Image
        source={require('../assets/images/logo-blue.png')}
        style={{ width: 100, resizeMode:'contain' }}
      />
    );
  }
}

UserScreen.navigationOptions = {
  title: null,
  headerTitle: () => <LogoTitle />,
    headerStyle: {
      backgroundColor: Colors.backgroundDefault,
    },
    
};*/
UserScreen.navigationOptions = {
  header: null,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    //paddingTop: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  body:{
    alignSelf: 'stretch',
    alignItems: 'center',
    //marginTop: 15,
    paddingTop: 15,
  },
  imgUser: {
    width: 90, 
    height: 90, 
    resizeMode: 'cover',
    borderRadius: 150,
    backgroundColor: '#000000'
  },
  viewTitle: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginTop: 2,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#555',
  },
  descUser: {
    flexDirection: "row",
  },
  iconStar: {
    marginRight: 5,
    marginLeft: -5,
  },
  titleDesc:{
    fontSize: 18,
    fontWeight: 'bold',
    color: '#888',
  },

  list: {
    width:'100%',
    alignItems: 'center',
    //paddingBottom: 50,
    marginTop: 12,
  },
  listItem: {
    //backgroundColor: '#FDFDFD',
    padding: 5,
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  titleItem: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
    marginLeft: 15,
    //textTransform:'uppercase'
  },
  viewListItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  viewIcon:{
    padding: 10,
    width: '13%',
  },
  notification: {
    width: '87%',
    paddingRight: 10,
  } 
});