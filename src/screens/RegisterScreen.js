//AsyncStorage para armazenar no banco local do dispositivo;
//KeyboardAvoidingView para não ocultar elementos no iOS ao abrir o teclado;
//TouchableOpacity para alterar a opacidade de um botão ao clicar;
import React, {useState, useEffect} from 'react';
import {
  View,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableHighlight,
  StyleSheet,
  Modal
} from 'react-native';
import {showMessage, hideMessage} from 'react-native-flash-message';
import {TextInputMask} from 'react-native-masked-text';
/* import * as ImagePicker from 'expo-image-picker'; */
import ImagePicker from 'react-native-image-picker';
import AsyncStorage from '@react-native-community/async-storage';
import Api from '../services/api';
import logo from '../../assets/images/logo.jpg';
import Colors from '../constants/Colors';
import Layout from '../constants/Layout';
import {Picker} from '@react-native-community/picker';
import Spinner from 'react-native-loading-spinner-overlay';
import RNPicker from 'rn-modal-picker';

export default function Register({navigation}) {
  const [name, setName] = useState('');
  //const [nameUser, setNameUser] = useState('');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [passConfirm, setPassConfirm] = useState('');
  const [cpf, setCpf] = useState('');
  const [celular, setCelular] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [estados, setEstados] = useState([]);
  /* const [estado, setEstado] = useState('-'); */
  const [estado, setEstado] = useState('');
  const [cidades, setCidades] = useState([]);
  const [cidade, setCidade] = useState('');
  const [cidadeSelecionada, setCidadeSelecionada] = useState('');
  const [fotoCnh, setFotoCnh] = useState({uri: ''});
  const [fotoComprovante, setFotoComprovante] = useState({uri: ''});
  const [fotoRosto, setFotoRosto] = useState({uri: ''});

  /* const [modalVisible, setModalVisible] = useState(false); */
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [retornoErrorImagens, setRetornoErrorImagens] = useState(false);

  //Ao abrir a tela
  useEffect(() => {
    getEstados();
   /*  showMessage({
      message: "Erro ao salvar imagem da CNH. A imagem que você está tentando fazer upload excede as dimensões máximas permitidas. Tamanho máximo da imagem: 3MB. Dimensões máximas da imagem: 2048x1280. Após o login, acesse o seu perfil e tente salvar a imagem novamente.",
      type: 'danger',
      color: '#fff',
      duration: 10850,
    }); */
  }, []);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
    navigation.navigate('Main');
  };
 

  //Promise primaria para varios seTimeout com await
/*   const setAsyncTimeout = (cb, timeout = 0) => new Promise(resolve => {
    setTimeout(() => {
        cb();
        resolve();
    }, timeout);  
  }); */
  //Loading de mensagem e redirecionamento para tela Main
/*   const grupoAcoesSetimeOut = async (mensagem = null) => {
    var timer = 5000;
    if(mensagem !==null){
      await setAsyncTimeout(() => {
        
        showMessage({
          message: mensagem,
          type: 'danger',
          color: '#fff',
          duration: 5850,
        });
      }, 500);
    }else{
      timer = 500;
    }

    await setAsyncTimeout(() => {
     
      navigation.navigate('Main');
    }, timer);
}; */

  function validateEmail(mail) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
      return true;
    } else {
      return false;
    }
  }
  async function getEstados() {
    try {
      const response = await Api.api.get('/entregador/estados', {
        auth: {
          username: Api.Auth_User,
          password: Api.Auth_Pass,
        },
      });
      if (response.status === 200) {
        /*   console.log(response.data); */
        /* response.data.unshift({cd_estado: '', nm_estado: '-'}); */

        setEstados(
          response.data.map((val) => {
            return {id: val.cd_estado, name: val.nm_estado};
          }),
        );
      }
    } catch (error) {
      console.log(error);
    }
  }
  async function onchangeEstado(index, valor) {
    setEstado(valor.name);
    try {
      const response = await Api.api.get('/entregador/cidades', {
        auth: {
          username: Api.Auth_User,
          password: Api.Auth_Pass,
        },
      });
      var arrCidades = await response.data.filter(function (item) {
        return item.cd_estado === valor.id;
      });
      if (response.status === 200) {
        /*  arrCidades.unshift({cd_cidade: '', nm_cidade: '-'}); */
        setCidades(
          arrCidades.map((val) => {
            return {id: val.cd_cidade, name: val.nm_cidade};
          }),
        );
      }
    } catch (error) {
      console.log(error);
    }
  }

  function onchangeCidade(index, item) {
    setCidade(item.id);
    setCidadeSelecionada(item.name);
  }

  // UPLOAD CNH
  async function uploadCNH() {
    try {
      await ImagePicker.launchImageLibrary(
        {
          title: 'Select Avatar',
          storageOptions: {
            skipBackup: true,
            path: 'images',
          },
          noData: true,
        },
        (result) => {
          if (!result.didCancel) {
            /*  result.type =
              result.type + '/' + result.uri.split('.').reverse()[0];
            result.name = result.uri.split('/').reverse()[0]; */
            const uri = result.uri;
            const type = result.type;
            const name = result.fileName;
            const data = result.data;
            const source = {
              uri,
              type,
              name,
              data,
            };
            setFotoCnh(source);
          }
        },
      );
    } catch (E) {
      console.log(E);
    }
  }
  // UPLOAD COMPROVANTE DE RESIDÊNCIA
  async function uploadComprovante() {
    try {
      await ImagePicker.launchImageLibrary(
        {
          title: 'Select Avatar',
          storageOptions: {
            skipBackup: true,
            path: 'images',
          },
          noData: true,
        },
        (result) => {
          if (!result.didCancel) {
            /* result.type =
              result.type + '/' + result.uri.split('.').reverse()[0];
            result.name = result.uri.split('/').reverse()[0]; */
            const uri = result.uri;
            const type = result.type;
            const name = result.fileName;
            const data = result.data;
            const source = {
              uri,
              type,
              name,
              data,
            };
            setFotoComprovante(source);
          }
        },
      );
    } catch (E) {
      console.log(E);
    }
  }
  // UPLOAD IMAGEM PERFIL
  async function uploadFotoPerfil() {
    try {
      await ImagePicker.launchImageLibrary(
        {
          title: 'Select Avatar',
          storageOptions: {
            skipBackup: true,
            path: 'images',
          },
          noData: true,
        },
        (result) => {
          if (!result.didCancel) {
            console.log(result);
            /* result.type =
              result.type + '/' + result.uri.split('.').reverse()[0];
            result.name = result.uri.split('/').reverse()[0]; */
            const uri = result.uri;
            const type = result.type;
            const name = result.fileName;
            const data = result.data;
            const source = {
              uri,
              type,
              name,
              data,
            };
            setFotoRosto(source);
          }
        },
      );
    } catch (E) {
      console.log(E);
    }
  }

  async function handleSubmit() {
    setLoading(true);
    if (
      name &&
      email &&
      cpf &&
      celular &&
      dataNascimento &&
      cidade &&
      pass &&
      passConfirm
    ) {
      if (validateEmail(email)) {
        if (pass === passConfirm) {
          var formData = new FormData();
          formData.append('nm_entregador', name);
          formData.append('ds_email', email);
          formData.append('nr_cpf', cpf.split('.').join('').replace('-', ''));
          formData.append(
            'nr_celular',
            celular
              .replace('(', '')
              .replace(')', '')
              .replace(' ', '')
              .replace('-', ''),
          );
          formData.append(
            'dt_nascimento',
            dataNascimento.split('/').reverse().join('-'),
          );
          formData.append('cd_cidade', cidade);
          formData.append('tp_opcao_princ_entrega', 'M');
          formData.append('tp_compartimento_entrega', 'B');
          formData.append('ds_senha', pass);
          //formData.append('ds_dir_ft_rosto', null);
          //formData.append('ds_dir_ft_cnh', null);
          //formData.append('ds_dir_ft_comp_res', null);
          if (fotoRosto.hasOwnProperty('type')) {
            formData.append('ds_dir_ft_rosto', fotoRosto);
          }
          if (fotoCnh.hasOwnProperty('type')) {
            formData.append('ds_dir_ft_cnh', fotoCnh);
          }
          if (fotoComprovante.hasOwnProperty('type')) {
            formData.append('ds_dir_ft_comp_res', fotoComprovante);
          }
          Api.api({
            method: 'post',
            url: Api.baseURL + '/entregador/entregador',
            data: formData,
            headers: {
              Accept: 'application/json',
              'Content-Type': 'multipart/form-data',
            },
            auth: {
              username: Api.Auth_User,
              password: Api.Auth_Pass,
            },
            onUploadProgress: function (progressEvent) {
              console.log(progressEvent);
              setProgress(Math.round( (progressEvent.loaded * 100) / progressEvent.total ))
            },
          })
            .then(function (response) {
              console.log(response);
              if (response.status === 200) {
                showMessage({
                  message: 'Seu cadastro foi realizado com sucesso!',
                  backgroundColor: Colors.tintColor,
                  color: '#000',
                });
                if (
                  response.data !== null &&
                  response.data.hasOwnProperty('cd_entregador')
                ) {
                  AsyncStorage.setItem(
                    'cd_entregador',
                    response.data.cd_entregador,
                  );

                  //Redireciona o usuário;
                  
                var erros_imagens = null;
                
                if(response.data.hasOwnProperty('erros_imagem')){
                  Object.keys(response.data.erros_imagem).forEach((item, index)=> {
                    erros_imagens += response.data.erros_imagem[item];
                  })

                }
                setRetornoErrorImagens(erros_imagens);

                //Loading de mensagem e redirecionamento para tela Main
                setLoading(false);
                if(erros_imagens === null){
                  navigation.navigate('Main');
                }else{
                  setModalVisible(!isModalVisible);
                }
                //grupoAcoesSetimeOut(erros_imagens);
                } else {
                  setLoading(false);
                  //Redireciona o usuário;
                  navigation.navigate('Login');
                }
              } else {
                setLoading(false);
                showMessage({
                  message:
                    'Falha ao realizar o cadastro! Tente novamente em breve!',
                  type: 'danger',
                  color: '#fff',
                });
              }
            })
            .catch(function (error) {
              setLoading(false);
              /* console.log(error); */
              if (error.response.status === 400) {
                showMessage({
                  message: error.response.data,
                  type: 'danger',
                  color: '#fff',
                  duration: 5850,
                });
              }
              if (error.response.status === 409) {
                showMessage({
                  message: error.response.data,
                  type: 'danger',
                  color: '#fff',
                  duration: 5850,
                });
              }
            });
        } else {
          setLoading(false);
          showMessage({
            message: 'As senhas não conferem!',
            type: 'danger',
            color: '#fff',
          });
        }
      } else {
        setLoading(false);
        showMessage({
          message: 'Por favor, informe um e-mail válido!',
          type: 'danger',
          color: '#fff',
        });
      }
    } else {
      setLoading(false);
      console.log(loading);
      showMessage({
        message: 'Preencha todos os campos!',
        type: 'danger',
        color: '#fff',
      });
    }
  }
  //console.log(cidades)
  return (
    <>
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.container}>

     
        <Spinner
          visible={loading}
          textContent={'Carregando '+progress+'% Por favor aguarde...'}
          textStyle={styles.spinnerTextStyle}
          overlayColor="rgba(0, 0, 0, 0.75)"
        />
        <Image source={logo} style={styles.logo} />
        <Text style={styles.title}>Cadastre-se</Text>
        <View style={styles.form}>
          <Text style={styles.label}>NOME COMPLETO *</Text>
          <TextInput
            style={styles.input}
            placeholder="Seu nome completo"
            placeholderTextColor="#666"
            autoCorrect={false}
            value={name}
            onChangeText={setName}
          />
          <Text style={styles.label}>CPF *</Text>
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
          <Text style={styles.label}>E-MAIL *</Text>
          <TextInput
            style={styles.input}
            placeholder="Seu e-mail"
            placeholderTextColor="#666"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            value={email}
            onChangeText={setEmail}
          />
          <Text style={styles.label}>CELULAR *</Text>
          <TextInputMask
            type={'cel-phone'}
            options={{
              maskType: 'BRL',
              withDDD: true,
              dddMask: '(99) ',
            }}
            style={styles.input}
            placeholder="Seu Celular"
            placeholderTextColor="#666"
            keyboardType="numeric"
            autoCapitalize="none"
            autoCorrect={false}
            value={celular}
            onChangeText={(text) => {
              setCelular(text);
            }}
          />
          <Text style={styles.label}>DATA NASCIMENTO *</Text>
          <TextInputMask
            type={'datetime'}
            options={{
              format: 'DD/MM/YYYY',
            }}
            style={styles.input}
            placeholder="Sua data de nascimento"
            placeholderTextColor="#666"
            keyboardType="numeric"
            autoCapitalize="none"
            autoCorrect={false}
            value={dataNascimento}
            onChangeText={(text) => {
              setDataNascimento(text);
            }}
          />
          <Text style={styles.label}>ESTADO *</Text>
          {
            /* <Picker
            selectedValue={estado}
            mode="dropdown"
            placeholder="Selecione o estado"
            iosHeader="Selecione o estado"
            itemStyle={styles.picker}
            style={styles.picker}
            onValueChange={(itemValue) => onchangeEstado(itemValue)}>
            {estados.map((estadosMap, index) => {
              return (
                <Picker.Item
                  key={index}
                  color="#000"
                  label={estadosMap.nm_estado}
                  value={estadosMap.cd_estado}
                />
              );
            })}
          </Picker> */
            <RNPicker
              dataSource={estados}
              dummyDataSource={estados}
              defaultValue={false}
              pickerTitle={'Escolha do estado'}
              showSearchBar={true}
              disablePicker={false}
              changeAnimation={'none'}
              searchBarPlaceHolder={'Procurar.....'}
              showPickerTitle={true}
              /* searchBarContainerStyle={this.props.searchBarContainerStyle} */
              pickerStyle={styles.pickerStyle}
              itemSeparatorStyle={styles.itemSeparatorStyle}
              pickerItemTextStyle={styles.listTextViewStyle}
              selectedLabel={estado}
              placeHolderLabel={'Estado'}
              selectLabelTextStyle={styles.selectLabelTextStyle}
              placeHolderTextStyle={styles.placeHolderTextStyle}
              dropDownImageStyle={styles.dropDownImageStyle}
              /* dropDownImage={require("./res/ic_drop_down.png")} */
              selectedValue={(index, item) => onchangeEstado(index, item)}
            />
          }

          <Text style={styles.label}>CIDADE *</Text>
          {/*  <Picker
            selectedValue={cidade}
            mode="dropdown"
            placeholder="Selecione a cidade"
            iosHeader="Selecione a cidade"
            itemStyle={styles.picker}
            style={styles.picker}
            onValueChange={(itemValue) => setCidade(itemValue)}>
            {cidades.map((item, index) => {
              return (
                <Picker.Item
                  key={index}
                  color="#000"
                  label={item.nm_cidade}
                  value={item.cd_cidade}
                />
              );
            })}
          </Picker> */}
          <RNPicker
            dataSource={cidades}
            dummyDataSource={cidades}
            defaultValue={false}
            pickerTitle={'Escolha do cidade'}
            showSearchBar={true}
            disablePicker={false}
            changeAnimation={'none'}
            searchBarPlaceHolder={'Procurar.....'}
            showPickerTitle={true}
            /* searchBarContainerStyle={this.props.searchBarContainerStyle} */
            pickerStyle={styles.pickerStyle}
            itemSeparatorStyle={styles.itemSeparatorStyle}
            pickerItemTextStyle={styles.listTextViewStyle}
            selectedLabel={cidadeSelecionada}
            placeHolderLabel={'Cidade'}
            selectLabelTextStyle={styles.selectLabelTextStyle}
            placeHolderTextStyle={styles.placeHolderTextStyle}
            dropDownImageStyle={styles.dropDownImageStyle}
            /* dropDownImage={require("./res/ic_drop_down.png")} */
            selectedValue={(index, item) => onchangeCidade(index, item)}
          />
          <Text style={styles.label}>FOTO DA CNH </Text>
          <Image
            source={{
              uri: fotoCnh.uri
                ? fotoCnh.uri
                : 'https://www.ifs.edu.br/images/M_images/default.png',
            }}
            style={fotoCnh.uri !== '' ? styles.uploadImage : styles.hidden}
          />
          <TouchableOpacity onPress={uploadCNH} style={styles.buttonUpload}>
            <Text style={styles.buttonTextUpload}>
              {' '}
              {fotoCnh.uri === ''
                ? 'Adicionar Foto da CNH'
                : 'Alterar Foto da CNH'}
            </Text>
          </TouchableOpacity>
          <Text style={styles.label}>FOTO COMPROVANTE DE RESIDÊNCIA </Text>
          <Image
            source={{
              uri: fotoComprovante.uri
                ? fotoComprovante.uri
                : 'https://www.ifs.edu.br/images/M_images/default.png',
            }}
            style={
              fotoComprovante.uri !== '' ? styles.uploadImage : styles.hidden
            }
          />
          <TouchableOpacity
            onPress={uploadComprovante}
            style={styles.buttonUpload}>
            <Text style={styles.buttonTextUpload}>
              {' '}
              {fotoComprovante.uri === ''
                ? 'Adicionar Comprovante de Residência'
                : 'Alterar Comprovante de Residência'}
            </Text>
          </TouchableOpacity>
          <Text style={styles.label}>FOTO DE PERFIL </Text>
          <Image
            source={{
              uri: fotoRosto.uri
                ? fotoRosto.uri
                : 'https://www.ifs.edu.br/images/M_images/default.png',
            }}
            style={fotoRosto.uri !== '' ? styles.uploadImage : styles.hidden}
          />
          <TouchableOpacity
            onPress={uploadFotoPerfil}
            style={styles.buttonUpload}>
            <Text style={styles.buttonTextUpload}>
              {' '}
              {fotoRosto.uri === ''
                ? 'Adicionar Foto de Perfil'
                : 'Alterar Foto de Perfil'}
            </Text>
          </TouchableOpacity>
          <Text style={styles.label}>SENHA *</Text>
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
          <Text style={styles.label}>CONFIRMAR SENHA *</Text>
          <TextInput
            style={styles.input}
            placeholder="Confirme sua Senha"
            placeholderTextColor="#666"
            autoCapitalize="none"
            secureTextEntry={true}
            autoCorrect={false}
            value={passConfirm}
            onChangeText={setPassConfirm}
          />
          <TouchableOpacity onPress={handleSubmit} style={styles.button}>
            <Text style={styles.buttonText}> Criar Conta </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.register}>
          <Text style={styles.labelRegister}>Já possui uma conta? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.btnRegister}>Fazer Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
     <Modal
     //Modal termos
     animationType="slide"
     transparent={true}
     visible={isModalVisible}
    >
     <View style={styles.bodyModal}> 
       <Text style={styles.titleModal}>Erro ao enviar foto</Text>
       <View style={styles.divider}></View>
       {/* <Text style={styles.subTitleModal}>Aceite os termos para continuar!</Text> */}
       <View style={styles.viewWebView}> 
          <Text style={styles.textModal}>{retornoErrorImagens}
            </Text>
       </View>
       <View style={styles.divider}></View>
       <TouchableOpacity onPress={() => toggleModal()} style={styles.btnModal}>
         <Text style={styles.buttonTextModal}>Confirmar</Text>
       </TouchableOpacity>
     </View>
   </Modal>
   </>
  );
}

// Cria os Styles. Os styles não são herdados da classe pai e são em formato de json.
const styles = StyleSheet.create({
  spinnerTextStyle: {
    color: '#FFF',
  },
  container: {
    flex: 1,
    //justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
  },

  logo: {
    width: 160,
    height: 100,
    resizeMode: 'contain',
    marginVertical: 15,
  },

  title: {
    fontWeight: 'bold',
    color: '#fff',
    //marginTop: 10,
    fontSize: 22,
  },

  form: {
    alignSelf: 'stretch',
    paddingHorizontal: 15,
    marginTop: 50,
    width: Layout.window.width,
    maxWidth: 550,
  },

  label: {
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },

  input: {
    borderBottomWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 10,
    fontSize: 16,
    color: '#fff',
    height: 44,
    marginBottom: 20,
    borderRadius: 3,
  },

  picker: {
    height: 40,
    width: '100%',
    //backgroundColor: "#fff",
    color: '#fff',
    marginBottom: 15,
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

  buttonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
 /*  divider: {
    marginTop: 40,
    marginBottom: 10,
    marginHorizontal: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#CFCFCF',
  }, */
  register: {
    marginTop: 50,
    flexDirection: 'row',
  },
  btnRegister: {
    fontWeight: 'bold',
    color: '#fff',
    textDecorationLine: 'underline',
    paddingBottom: 15,
  },
  labelRegister: {
    color: '#fff',
  },

  // MODAL
  modal: {
    //margin: 15
  },
  divider:{
    width:"100%",
    height:1,
    backgroundColor:"black",
    margin: 10
  },
  bodyModal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#CD5C5C",
    paddingHorizontal: 15,
    margin: 22,
    borderRadius: 20,
    //paddingTop: 30,
  },
  btnCloseModal: {
    textAlign: 'right',
    paddingTop: 7,
    paddingRight: 7,
    backgroundColor: Colors.backgroundDefault,
  },
  iconPremium: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
    marginTop: -40,
    marginBottom: 20,
  },
  titleModal: {
    fontWeight: 'bold',
    color: '#000',
    marginTop: 15,
    fontSize: 20,
    paddingHorizontal: 20,
    textAlign: 'center',
    marginBottom: 20
    
  },
  subTitleModal: {
    color: '#000',
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
  },
  textModal:{
    color: "#000"
  },
  btnModal: {
    height: 42,
    backgroundColor: Colors.tintColor,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 55,
    marginHorizontal: 15,
  },
  buttonTextModal: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
    paddingHorizontal: 20,
  },
  buttonUpload: {
    height: 30,
    backgroundColor: Colors.tintColor,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 10,
    //marginHorizontal:15,
    marginBottom: 20,
    paddingHorizontal: 5,
  },
  buttonTextUpload: {
    color: Colors.backgroundDefault,
    fontWeight: 'bold',
    fontSize: 12,
  },
  uploadImage: {
    width: Layout.window.width * 0.9,
    maxWidth: 400,
    paddingHorizontal: 20,
    height: 180,
    resizeMode: 'cover',
    borderRadius: 5,
    //borderColor: 'gray',
    //borderWidth: 2,
  },
  itemSeparatorStyle: {
    height: 1,
    width: '90%',
    alignSelf: 'center',
    backgroundColor: '#D3D3D3',
  },
  searchBarContainerStyle: {
    marginBottom: 10,
    flexDirection: 'row',
    height: 40,
    shadowOpacity: 1.0,
    shadowRadius: 5,
    shadowOffset: {
      width: 1,
      height: 1,
    },
    backgroundColor: 'rgba(255,255,255,1)',
    shadowColor: '#d3d3d3',
    borderRadius: 10,
    elevation: 3,
    marginLeft: 10,
    marginRight: 10,
    color: '#000',
  },

  selectLabelTextStyle: {
    color: '#000',
    textAlign: 'left',
    width: '99%',
    padding: 10,
    flexDirection: 'row',
  },
  placeHolderTextStyle: {
    /* color: "#D3D3D3", */
    color: '#000',
    padding: 10,
    textAlign: 'left',
    width: '99%',
    flexDirection: 'row',
  },
  dropDownImageStyle: {
    marginLeft: 10,
    width: 10,
    height: 10,
    alignSelf: 'center',
  },
  listTextViewStyle: {
    color: '#000',
    marginVertical: 10,
    flex: 0.9,
    marginLeft: 20,
    marginHorizontal: 10,
    textAlign: 'left',
  },
  pickerStyle: {
    color: '#000',
    marginLeft: 18,
    elevation: 3,
    paddingRight: 25,
    marginRight: 10,
    marginBottom: 2,
    shadowOpacity: 1.0,
    shadowOffset: {
      width: 1,
      height: 1,
    },
    borderWidth: 1,
    shadowRadius: 10,
    backgroundColor: 'rgba(255,255,255,1)',
    shadowColor: '#d3d3d3',
    borderRadius: 5,
    flexDirection: 'row',
  },
});
