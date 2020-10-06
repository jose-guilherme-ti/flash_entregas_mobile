import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, KeyboardAvoidingView, TextInput, SafeAreaView, ScrollView, TouchableOpacity, FlatList, Platform, Alert} from 'react-native';
import { WebView } from 'react-native-webview';
import { showMessage } from "react-native-flash-message";
import Colors from '../constants/Colors';
import Layout from '../constants/Layout';
import Loading from './Loading';
import Api from '../services/api';
import TabInvoices from '../components/TabInvoices';
import PhoneStatus from '../components/PhoneStatus';
import TabDeliversReports from '../components/TabDeliversReports';
import DataUser from '../components/DataUser';
import AsyncStorage from '@react-native-community/async-storage'
import { useNavigation } from '@react-navigation/native'
import {Picker} from '@react-native-community/picker'
function PageUserDetail({route}) {
  const navigation = useNavigation()
  const [loading, setLoading] = useState(true);  
  //EDIT PASS
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmNewPass, setConfirmNewPass] = useState('');

  //pega o parametro 'page' enviado junto na rota;
  const page = route.params.page;
  /* const status = navigation.getParam('status'); */
  // Executa assim q a página é aberta;
  useEffect(() => {
      setLoading(!loading);
  }, []);
  
  //Update PASS
  async function submitNewPass() {
    if(oldPass && newPass && confirmNewPass ){
      if(newPass === confirmNewPass){
        try {
          const cd_entregador = await AsyncStorage.getItem('cd_entregador');
          const response = await Api.api.post('/entregador/alteraSenha', {
            "cd_entregador": cd_entregador,
            "ds_senha_antiga": oldPass,
            "ds_senha_nova": newPass
          },{
            auth: { 
              username: Api.Auth_User, 
              password: Api.Auth_Pass 
            }
          });
          if(response.status === 200){
            showMessage({
              message: "Sua senha foi alterada com sucesso!",
              backgroundColor: Colors.tintColor,
              color: "#000",
            });
            navigation.navigate('UserScreen');
          } else {
            showMessage({
              message: response.data,
              type: "danger",
              color: "#fff",
            });
          }
        } catch (error) {
          console.log(error);
          showMessage({
            message: 'Falha ao atualizar sua senha!',
            type: "danger",
            color: "#fff",
          });
        }
      } else{
        showMessage({
          message: 'As senhas não conferem!',
          type: "danger",
          color: "#fff",
        });
      }
    } else{
      showMessage({
        message: 'Preencha todos os campos!',
        type: "danger",
        color: "#fff",
      });
    }
  }

  if(page === "page-rating"){
    return (
      <>
        <Loading visible={loading}/> 
        <View style={loading ? styles.hidden : styles.container}>
          <View style={styles.body}>
            <Text style={styles.avisoBody}>Não há avaliações disponíveis!</Text>
          </View>
        </View>
      </>
    )
  } else if(page === "page-vehicle"){
    return(
      <View style={styles.container}>
        <View style={styles.body}>
          <Text style={styles.title}>Escolha seu transporte: </Text>
          <View style={styles.itensVehicle}>
            {/*<View style={styles.itemVehicle}>
              <Text style={styles.textVehicle}>Bike</Text>
            </View> */}
            <View style={[styles.itemVehicle, styles.itemVehicleActive]}>
              <Text style={[styles.textVehicle, styles.textVehicleActive]}>Moto</Text>
            </View>
            {/*<View style={styles.itemVehicle}>
              <Text style={styles.textVehicle}>Carro</Text>
            </View>
            <View style={styles.itemVehicle}>
              <Text style={styles.textVehicle}>Picape</Text>
            </View>
            <View style={styles.itemVehicle}>
              <Text style={styles.textVehicle}>Van</Text>
            </View>*/}
          </View>
          <View style={styles.br}></View>
          <Text style={styles.title}>Escolha um compartimento: </Text>
          <View style={styles.itensVehicle}>
            <View style={[styles.itemVehicle, styles.itemVehicleActive]}>
              <Text style={[styles.textVehicle, styles.textVehicleActive]}>Bag</Text>
            </View>
            {/*<View style={styles.itemVehicle}>
              <Text style={styles.textVehicle}>Baú</Text>
            </View>*/}
          </View>
        </View>
      </View>
    )
  } else if(page === "page-pass-change"){
    return(
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
          <View style={styles.form}>
            <KeyboardAvoidingView enabled={true} behavior="padding">
              <Text style={styles.label}>SENHA ATUAL</Text>
              <TextInput
                style={styles.input}
                placeholder="Informe sua senha atual"
                placeholderTextColor="#666"
                autoCapitalize="none"
                secureTextEntry={true}
                autoCorrect={false}
                value={oldPass}
                onChangeText={setOldPass}
              />
              <Text style={styles.label}>NOVA SENHA</Text>
              <TextInput
                style={styles.input}
                placeholder="Informe sua nova senha"
                placeholderTextColor="#666"
                autoCapitalize="none"
                secureTextEntry={true}
                autoCorrect={false}
                value={newPass}
                onChangeText={setNewPass}
              />
              <Text style={styles.label}>CONFIRMAR SENHA</Text>
              <TextInput
                style={styles.input}
                placeholder="Confirme a nova senha"
                placeholderTextColor="#666"
                autoCapitalize="none"
                secureTextEntry={true}
                autoCorrect={false}
                value={confirmNewPass}
                onChangeText={setConfirmNewPass}
              />
              <TouchableOpacity onPress={submitNewPass} style={styles.button}>
                <Text style={styles.buttonText}> Alterar Senha </Text>
              </TouchableOpacity>
            </KeyboardAvoidingView>
          </View>
        </ScrollView>
    )
  } else if(page === "page-financial"){
    return(
      <TabInvoices />
    )
  } else if(page === "page-deliverys-reports"){
    return(
      <TabDeliversReports />
    )
  } else if(page === "page-user-data"){
    return(
      <DataUser action="update"/>
    )
  } else if(page === "page-phone-status"){
    return(
      <PhoneStatus />
    )
  } else if(page === "page-conditions"){
    return(
      <View style={styles.container}>
        <WebView
          originWhitelist={['*']}
          //source={{ uri: "https://drive.google.com/viewerng/viewer?embedded=true&url=https://www.flashentregas.com.br/termos/termos_condicoes_privacidade.pdf"}} 
          source={{ uri: "https://www.flashentregas.com.br/appweb/termos/termos_condicoes_privacidade.html"}} 
          style={{width: Layout.window.width}}
          mediaPlaybackRequiresUserAction={true}
          startInLoadingState={true}
          renderLoading={() => <Loading visible={true}/>}
        />
      </View>
    )
  } else {
    return(
        <View style={styles.container}>
          <View style={styles.body}>
            <Text style={styles.avisoBody}>Aguarde! Estará disponível em breve!</Text>
          </View>
        </View>
    )
  }

}
PageUserDetail.navigationOptions = ({ navigation }) => ({
  title: navigation.getParam('title'),
  headerStyle: {
    backgroundColor: Colors.backgroundDefault,
    //paddingTop: 10,
    marginTop: -30,
    borderBottom: 0,
    borderBottomColor: 'rgba(0,0,0,0.0)',
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
  headerTintColor: '#ffffff',
});


export default  PageUserDetail
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
  avisoBody: {
    //marginTop: 20,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    color:'#333',
  },
  viewTitle: {
    paddingHorizontal: 25,
    paddingVertical: 15,
    //marginTop: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'left',
    maxWidth: 700,
    margin: 15,
  },
  br:{
    height:30,
    width: "100%"
  },
  itensVehicle:{
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: 15,
  },
  itemVehicle:{
    backgroundColor: "#E8E8E8",
    margin: 5,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  itemVehicleActive:{
    backgroundColor: "#000",
  },
  textVehicle:{
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    color:'#777',
  },
  textVehicleActive:{
    color: Colors.tintColor,
  },

  // FORMS e INPUT
  form: {
    alignSelf: 'stretch',
    paddingHorizontal: 20,
    marginVertical: 20,
  },
  label: {
    fontWeight: 'bold',
    color: "#333",
    marginBottom: 8,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 20,
    fontSize: 16,
    color: '#555',
    height: 44,
    marginBottom: 20,
    borderRadius: 5
  },
  button: {
    height: 42,
    backgroundColor: Colors.tintColor,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 25,
    marginHorizontal:15,
    marginBottom:15,
  },
  button2: {
    backgroundColor: Colors.secondColor,
  },
  buttonText: {
    color: Colors.backgroundDefault,
    fontWeight: 'bold',
    fontSize: 16,
  },
  buttonUpload: {
    height: 30,
    backgroundColor: Colors.tintColor,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 10,
    marginHorizontal:20,
    marginBottom:20,
  },
  uploadImage: {
    width: Layout.window.width*0.9,
    maxWidth: 400,
    paddingHorizontal: 20,
    height: 180,
    resizeMode: 'cover',
    borderRadius: 5,
    //borderColor: 'gray',
    //borderWidth: 2,
  },
});