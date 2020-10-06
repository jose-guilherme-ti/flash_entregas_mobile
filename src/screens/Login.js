//AsyncStorage para armazenar no banco local do dispositivo;
//KeyboardAvoidingView para não ocultar elementos no iOS ao abrir o teclado;
//TouchableOpacity para alterar a opacidade de um botão ao clicar;
import React, {useState, useEffect} from 'react';
import {
  View,
  KeyboardAvoidingView,
  Platform,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {showMessage, hideMessage} from 'react-native-flash-message';
import {TextInputMask} from 'react-native-masked-text';
/* import { MaterialCommunityIcons } from 'react-native-ionicons'; */
import Api from '../services/api';
import Functions from '../services/Functions';
import logo from '../../assets/images/logo.jpg';
import Colors from '../constants/Colors';

import BackgroundTimer from 'react-native-background-timer';
import { createIconSetFromFontello } from 'react-native-vector-icons';

export default function Login({navigation}) {
  const [cpf, setCpf] = useState('');
  const [pass, setPass] = useState('');
  const [servidor, setServidor] = useState('');
  const [
    backgroundNoticaticionFrontOn,
    setBackgroundNoticaticionFrontOn,
  ] = useState('');
  const [timerFrontOn, setTimerFrontOn] = useState(60);
  const [counter, setCounter] = useState(1)

  //Ao abrir a tela
  useEffect(() => {
    validaLogin();

   /*  setBackgroundNoticaticionFrontOn(
      BackgroundTimer.setInterval(() => {
        updateTimerRecusaPassivaFrontOn();
      }, 1000),
    ); */

  }, []); // Array de depêndencias. Se está vazio executa apenas uma vez;

  


  async function validaLogin() {
    const cd_entregador = await AsyncStorage.getItem('cd_entregador');
    if (cd_entregador) {
      var response = await Functions.loadUser(cd_entregador);
      if (response) {
        navigation.navigate('Main');
      }
    }
  }

  async function handleSubmit() {
    if (cpf && pass) {
      try {
        const response = await Api.api.post(
          '/entregador/login',
          {
            nm_usuario: cpf.split('.').join('').replace('-', ''),
            ds_senha: pass,
          },
          {
            auth: {
              username: Api.Auth_User,
              password: Api.Auth_Pass,
            },
          },
        );
        if (response.data[0].hasOwnProperty('cd_entregador')) {
          await AsyncStorage.setItem(
            'cd_entregador',
            response.data[0].cd_entregador,
          );
          //Redireciona o usuário;
          navigation.navigate('Main');
        } else {
          showMessage({
            message: 'Falha ao logar com as credenciais informadas!',
            type: 'danger',
            color: '#fff',
          });
        }
        //console.log(response.data[0]);
      } catch (error) {
        console.table(error.response.status)
        if (error.response.status === 404){
          showMessage({
            message: error.response.data,
            type: 'danger',
            color: '#fff',
            duration: 5850
          });
        }
      }
    } else {
      showMessage({
        message: 'É necessário informar usuário e senha',
        type: 'danger',
        color: '#fff'
      });
    }
  }

  return (
    <KeyboardAvoidingView
      enabled={true}
      behavior="padding"
      style={styles.container}>
      <Text style={styles.homologa}></Text>
      <Image source={logo} style={styles.logo} />
      <View style={styles.form}>
        <Text style={styles.label}>CPF</Text>
        <TextInputMask
          type={'cpf'}
          style={styles.input}
          placeholder="Seu CPF"
          placeholderTextColor="#666"
          keyboardType="numeric"
          autoCapitalize="none"
          autoCorrect={false}
          value={cpf}
          onChangeText={(text) => {
            setCpf(text);
          }}
        />
        <Text style={styles.label}>SENHA</Text>
        <TextInput
          style={styles.input}
          placeholder="Sua Senha"
          placeholderTextColor="#666"
          autoCapitalize="none"
          secureTextEntry={true}
          autoCorrect={false}
          value={pass}
          onChangeText={setPass}
        />
        <TouchableOpacity onPress={handleSubmit} style={styles.button}>
          <Text style={styles.buttonText}>
            {' '}
            Entrar 
          </Text>
        </TouchableOpacity>
        <View style={styles.divider}></View>
        <TouchableOpacity
          onPress={() => navigation.navigate('RegisterScreen')}
          style={[styles.button, styles.button2]}>
          <Text style={styles.buttonText}> Cadastrar-se </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

// Cria os Styles. Os styles não são herdados da classe pai e são em formato de json.
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
  },

  logo: {
    width: 200,
    height: 78,
    resizeMode: 'contain',
  },

  form: {
    alignSelf: 'stretch',
    paddingHorizontal: 30,
    marginTop: 60,
  },

  label: {
    fontWeight: 'bold',
    color: '#f8f8f8',
    marginBottom: 8,
  },

  input: {
    borderBottomWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 20,
    fontSize: 16,
    color: '#DBDBDB',
    height: 44,
    marginBottom: 20,
    borderRadius: 5,
  },

  button: {
    height: 42,
    backgroundColor: Colors.tintColor,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 25,
    marginHorizontal: 15,
  },
  button2: {
    backgroundColor: Colors.secondColor,
  },
  buttonText: {
    color: Colors.backgroundDefault,
    fontWeight: 'bold',
    fontSize: 16,
  },
  divider: {
    marginTop: 40,
    marginBottom: 10,
    marginHorizontal: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  homologa: {
    backgroundColor: Colors.tintColor,
    fontWeight: 'bold',
    fontStyle: 'italic',
    fontSize: 12,
  },
});
