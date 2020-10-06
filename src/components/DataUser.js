import React, {useState, useEffect} from 'react';
// withNavigation: Adicia a nevegação a qualquer componente. (Necessário para o componente DataUser que não é um componente padrão);
import {withNavigation} from 'react-navigation';
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  Image,
  KeyboardAvoidingView,
  TextInput,
  SafeAreaView,
  TouchableOpacity,
  TouchableHighlight,
  Platform,
  ScrollView,
  RefreshControl,
  
} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import {Picker} from '@react-native-community/picker'
import {showMessage, hideMessage} from 'react-native-flash-message';
import {TextInputMask} from 'react-native-masked-text';
import Functions from '../services/Functions';
import Api from '../services/api';
import Colors from '../constants/Colors';
import Layout from '../constants/Layout';
import Loading from '../screens/Loading';
import AsyncStorage from '@react-native-community/async-storage';
import { useNavigation } from '@react-navigation/native'


function DataUser({action}) {
  const navigation = useNavigation()
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState([]);
  const [urlAction, setUrlAction] = useState('');
  // USER DATA
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [cnh, setCnh] = useState('');
  const [fotoCnh, setFotoCnh] = useState({uri: ''});
  const [fotoComprovante, setFotoComprovante] = useState({uri: ''});
  const [fotoRosto, setFotoRosto] = useState({uri: ''});
  const [celular, setCelular] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [nomeMae, setNomeMae] = useState('');
  const [estados, setEstados] = useState([]);
  const [estado, setEstado] = useState('-');
  const [cidades, setCidades] = useState([]);
  const [cidade, setCidade] = useState('-');

  useEffect(() => {
    console.log(action);
    if (action === 'update') {
      setUrlAction('/entregador/atualizaEntregador');
      loadUser();
    } else if (action === 'create') {
      setUrlAction('/entregador/entregador');
    }
    if(fotoCnh) console.log("Foto =", fotoCnh)
  }, []);

  async function loadUser() {
    const cd_entregador = await AsyncStorage.getItem('cd_entregador');
    var response = await Functions.loadUser(cd_entregador);
 /*    console.log(response); */
    setUser(response);
    setName(response.nm_entregador);
    setEmail(response.ds_email);
    setCpf(response.nr_cpf);
    if (response.ds_dir_ft_cnh !== null) {
      console.log("loadUser =",response.ds_dir_ft_cnh )
      setFotoCnh({uri: response.ds_dir_ft_cnh});
    }
    if (response.ds_dir_ft_comp_res !== null) {
      setFotoComprovante({uri: response.ds_dir_ft_comp_res});
    }
    if (response.ds_dir_ft_rosto !== null) {
      setFotoRosto({uri: response.ds_dir_ft_rosto});
    }
    setCnh(response.nr_cnh);
    setCelular(response.nr_celular);
    setWhatsapp(response.nr_whatsapp);
    setDataNascimento(response.dt_nascimento.split('-').reverse().join('/'));
    setNomeMae(response.nm_mae);
    getEstados();
    onchangeEstado(response.cd_estado);
    setEstado(response.cd_estado);
    setCidade(response.cd_cidade);
    setLoading(!loading);
  }
  // UPLOAD CNH
  function uploadCNH() {
    try {
      ImagePicker.launchImageLibrary(
        {
          title: 'Select Avatar',
          storageOptions: {
            skipBackup: true,
            path: 'images',
          },
          noData: true
        },
        (result) => {
          if (!result.didCancel) {
           /*  result.type =
              result.type + '/' + result.uri.split('.').reverse()[0];
            result.name = result.uri.split('/').reverse()[0];
            console.table(result) */
            const uri = result.uri;
            const type = result.type;
            const name = result.fileName;
            const data = result.data
            const source = {
              uri,
              type,
              name,
              data
            }
            setFotoCnh(source);
          }
        },
      );
    } catch (E) {
      console.log(E);
    }
  }
  // UPLOAD COMPROVANTE DE RESIDÊNCIA
  function uploadComprovante() {
    try {
      ImagePicker.launchImageLibrary(
        {
          title: 'Select Avatar',
          storageOptions: {
            skipBackup: true,
            path: 'images',
          },
          noData: true
        },
        (result) => {
          if (!result.didCancel) {
           /*  result.type =
              result.type + '/' + result.uri.split('.').reverse()[0];
            result.name = result.uri.split('/').reverse()[0]; */
            const uri = result.uri;
            const type = result.type;
            const name = result.fileName;
            const data = result.data
            const source = {
              uri,
              type,
              name,
              data
            }
            setFotoComprovante(source);
          }
        },
      );
    } catch (E) {
      console.log(E);
    }
  }
  // UPLOAD IMAGEM PERFIL
  function uploadFotoPerfil() {
    try {
      ImagePicker.launchImageLibrary(
        {
          title: 'Select Avatar',
          storageOptions: {
            skipBackup: true,
            path: 'images',
          },
          noData: true
        },
        (result) => {
          if (!result.didCancel) {
           /*  result.type =
              result.type + '/' + result.uri.split('.').reverse()[0];
            result.name = result.uri.split('/').reverse()[0]; */
            const uri = result.uri;
            const type = result.type;
            const name = result.fileName;
            const data = result.data
            const source = {
              uri,
              type,
              name,
              data
            }
            setFotoRosto(source);
          }
        },
      );
    } catch (E) {
      console.log(E);
    }
  }
  //UPDATE USER
  async function submitUpdateUser() {
    
    if (
      name &&
      email &&
      cpf &&
      cnh &&
      celular &&
      dataNascimento &&
      nomeMae &&
      cidade &&
      fotoRosto.uri !== '' &&
      fotoCnh.uri !== '' &&
      fotoComprovante.uri !== ''
    ) {
      if (validateEmail(email)) {
        setLoading(true);
        const cd_entregador = await AsyncStorage.getItem('cd_entregador');
        var formData = new FormData();
        formData.append('cd_entregador', cd_entregador);
        formData.append('nm_entregador', name);
        formData.append('ds_email', email);
        formData.append('nr_cpf', cpf.split('.').join('').replace('-', ''));
        formData.append('nr_cnh', cnh);
        formData.append(
          'nr_celular',
          celular
            .replace('(', '')
            .replace(')', '')
            .replace(' ', '')
            .replace('-', ''),
        );
        formData.append(
          'nr_whatsapp',
          whatsapp !== null
            ? whatsapp
                .replace('(', '')
                .replace(')', '')
                .replace(' ', '')
                .replace('-', '')
            : '',
        );
        formData.append(
          'dt_nascimento',
          dataNascimento.split('/').reverse().join('-'),
        );
        formData.append('nm_mae', nomeMae);
        formData.append('cd_cidade', cidade);
        formData.append('tp_opcao_princ_entrega', 'M');
        formData.append('tp_compartimento_entrega', 'B');
        formData.append('tp_status', user.tp_status);
        if (fotoRosto.hasOwnProperty('type')) {
          formData.append('ds_dir_ft_rosto', fotoRosto);
        }
        if (fotoCnh.hasOwnProperty('type')) {
          formData.append('ds_dir_ft_cnh', fotoCnh);
        }
        if (fotoComprovante.hasOwnProperty('type')) {
          formData.append('ds_dir_ft_comp_res', fotoComprovante);
        }
        console.table(formData)
        //formData.append('ds_dir_ft_cnh', {uri: fotoCnh.uri, type: fotoCnh.type, name: fotoCnh.name});
        Api.api({
          method: 'post',
          url: Api.baseURL + urlAction,
          data: formData,
          headers: {
            Accept: 'application/json',
           'Content-Type': 'multipart/form-data'
         },
          auth: {
            username: Api.Auth_User,
            password: Api.Auth_Pass,
          },
          onUploadProgress: function (progressEvent) {
            console.log(progressEvent);
          },
        })
          .then(function (response) {
            console.log(response)
            if (response.status === 200) {
              //await AsyncStorage.setItem('user', response.data._id);
              showMessage({
                message: 'Seus dados foram atualizados com sucesso!',
                backgroundColor: Colors.tintColor,
                color: '#000',
              });
              //Redireciona o usuário;
              setLoading(false);
              AsyncStorage.setItem('retorno_cadastro', 'realizado');
              navigation.navigate('Perfil');
              //setModalVisible(true);
            } else {
              showMessage({
                message: response.data,
                type: 'danger',
                color: '#fff',
              });
              setLoading(false);
            }
          })
          .catch(function (response) {
            console.log("Error ao enviar informação para o servidor:", response);
            setLoading(false);
            showMessage({
              message: 'Falha ao atualizar seus dados!',
              type: 'danger',
              color: '#fff',
            });
          });

        /*const response = await Api.api.post('/entregador/atualizaEntregador', {
            "cd_entregador": cd_entregador,
            "nm_entregador": name,
            "ds_email": email,
            "nr_cpf": cpf.split(".").join("").replace("-", ""),
            "nr_cnh": cnh,
            "nr_celular": celular.replace("(", "").replace(")", "").replace(" ", "").replace("-", ""),
            "nr_whatsapp": whatsapp.replace("(", "").replace(")", "").replace(" ", "").replace("-", ""),
            "dt_nascimento": dataNascimento.split("/").reverse().join("-"),
            "nm_mae": nomeMae,
            "cd_cidade": cidade,
            "ds_dir_ft_rosto": fotoCnh,
            "ds_dir_ft_cnh": fotoCnh,
            "ds_dir_ft_comp_res": fotoCnh,
            "tp_opcao_princ_entrega": "M",
            "tp_compartimento_entrega": "B",
            "tp_status": user.tp_status
          },{
            auth: { 
              username: Api.Auth_User, 
              password: Api.Auth_Pass 
            }
          });
          if(response.status === 200){
            //await AsyncStorage.setItem('user', response.data._id);
            showMessage({
              message: "Seus dados foram atualizados com sucesso!",
              backgroundColor: Colors.tintColor,
              color: "#000",
            });
            //Redireciona o usuário;
            navigation.navigate('UserScreen');
            //setModalVisible(true);
          } else {
            showMessage({
              message: response.data,
              type: "danger",
              color: "#fff",
            });
          }*/
      } else {
        showMessage({
          message: 'Por favor, informe um e-mail válido!',
          type: 'danger',
          color: '#fff',
        });
      }
    } else {
      showMessage({
        message: 'Por Favor, preencha todos os campos obrigatórios(*)!',
        type: 'danger',
        color: '#fff',
      });
    }
  }

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
        response.data.unshift({cd_estado: '', nm_estado: '-'});
        setEstados(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  }
  async function onchangeEstado(valor) {
    setEstado(valor);
    try {
      const response = await Api.api.get('/entregador/cidades', {
        auth: {
          username: Api.Auth_User,
          password: Api.Auth_Pass,
        },
      });
      var arrCidades = await response.data.filter(function (item) {
        return item.cd_estado === valor;
      });
      if (response.status === 200) {
        //arrCidades.unshift({"cd_cidade": "", "nm_cidade": "-"});
        setCidades(arrCidades);
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <Loading visible={loading} />
      <View
        enabled={true}
        behavior="padding"
        style={loading ? styles.hidden : styles.container}>
        <View style={styles.form}>
          <Text style={styles.label}>NOME COMPLETO *</Text>
          <TextInput
            editable={user.nm_entregador === '' ? true : false}
            style={styles.input}
            placeholder="Seu nome completo"
            placeholderTextColor="#666"
            autoCorrect={false}
            value={name}
            onChangeText={setName}
          />
          <Text style={styles.label}>E-MAIL *</Text>
          <TextInput
            editable={user.ds_email === '' ? true : false}
            style={styles.input}
            placeholder="Seu e-mail"
            placeholderTextColor="#666"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            value={email}
            onChangeText={setEmail}
          />
          <Text style={styles.label}>CPF *</Text>
          <TextInputMask
            editable={user.nr_cpf === '' ? true : false}
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
          <Text style={styles.label}>CNH *</Text>
          <TextInput
            editable={user.nr_cnh === '' ? true : false}
            style={styles.input}
            placeholder="Informe o numero da sua CNH"
            placeholderTextColor="#666"
            autoCorrect={false}
            keyboardType="numeric"
            autoCapitalize="none"
            value={cnh}
            onChangeText={setCnh}
          />
          <Text style={styles.label}>FOTO DA CNH * </Text>
          <Image
            source={{
              uri: fotoCnh.uri
                ? fotoCnh.uri
                : 'https://www.ifs.edu.br/images/M_images/default.png',
            }}
            style={fotoCnh.uri !== '' ? styles.uploadImage : styles.hidden}
          />
          <TouchableOpacity onPress={uploadCNH} style={fotoCnh.uri === "" ? styles.buttonUpload : styles.hidden}>
            <Text style={styles.buttonTextUpload}> {fotoCnh.uri === "" ? 'Adicionar Foto da CNH' : 'Alterar Foto da CNH'}</Text>
          </TouchableOpacity>
          <Text style={styles.label}>FOTO COMPROVANTE DE RESIDÊNCIA * </Text>
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
            style={
              fotoComprovante.uri === '' ? styles.buttonUpload : styles.hidden
            }>
            <Text style={styles.buttonTextUpload}>
              {' '}
              {fotoComprovante.uri === ''
                ? 'Adicionar Comprovante de Residência'
                : 'Alterar Comprovante de Residência'}
            </Text>
          </TouchableOpacity>
          <Text style={styles.label}>FOTO DE PERFIL * </Text>
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
            style={fotoRosto.uri === '' ? styles.buttonUpload : styles.hidden}>
            <Text style={styles.buttonTextUpload}>
              {' '}
              {fotoRosto.uri === ''
                ? 'Adicionar Foto de Perfil'
                : 'Alterar Foto de Perfil'}
            </Text>
          </TouchableOpacity>
          <Text style={styles.label}>CELULAR *</Text>
          <TextInputMask
            editable={user.nr_celular === '' ? true : false}
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
          <Text style={styles.label}>WHATSAPP</Text>
          <TextInputMask
            editable={user.nr_whatsapp === '' ? true : false}
            type={'cel-phone'}
            options={{
              maskType: 'BRL',
              withDDD: true,
              dddMask: '(99) ',
            }}
            style={styles.input}
            placeholder="Seu WhatsApp"
            placeholderTextColor="#666"
            keyboardType="numeric"
            autoCapitalize="none"
            autoCorrect={false}
            value={whatsapp}
            onChangeText={(text) => {
              setWhatsapp(text);
            }}
          />
          <Text style={styles.label}>DATA NASCIMENTO *</Text>
          <TextInputMask
            editable={user.dt_nascimento === '' ? true : false}
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
          <Text style={styles.label}>NOME DA MÃE *</Text>
          <TextInput
            editable={user.nm_mae === '' ? true : false}
            style={styles.input}
            placeholder="Nome da sua mãe"
            placeholderTextColor="#666"
            autoCorrect={false}
            value={nomeMae}
            onChangeText={setNomeMae}
          />
          <Text style={styles.label}>ESTADO *</Text>
          <Picker
            //mode="dropdown"
            enabled={false}
            selectedValue={estado}
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
          </Picker>
          <Text style={styles.label}>CIDADE *</Text>
          <Picker
            //mode="dropdown"
            selectedValue={cidade}
            enabled={false}
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
          </Picker>
          <TouchableOpacity onPress={submitUpdateUser} style={styles.button}>
            <Text style={styles.buttonText}> Atualizar Dados </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  viewPager: {
    flex: 1,
  },
  hidden: {
    display: 'none',
  },
  row: {
    //width:Layout.window.width,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  col3: {
    width: '25%',
    alignItems: 'flex-end',
  },
  col6: {
    width: '50%',
  },
  col4: {
    width: '33.3333333333%',
  },
  col8: {
    width: '66.6666666666%',
  },
  col9: {
    width: '75%',
  },
  col12: {
    width: '100%',
  },
  textCenter: {
    alignItems: 'center',
  },
  noData: {
    //height: Layout.window.height,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 20,
  },
  avisoNoData: {
    marginTop: 10,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },

  // FORMS e INPUT
  form: {
    alignSelf: 'stretch',
    paddingHorizontal: 20,
    marginVertical: 20,
  },
  label: {
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 10,
    fontSize: 16,
    color: '#555',
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
    marginBottom: 15,
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
    //marginTop: 10,
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
    marginBottom: 20,
    height: 180,
    resizeMode: 'cover',
    borderRadius: 5,
    //borderColor: 'gray',
    //borderWidth: 2,
  },
  uploadImageUser: {
    width: 150,
    height: 150,
    resizeMode: 'cover',
    borderRadius: 500,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
});

//Necessário para funcionar a navegação/redirecionamento para outra página;
export default DataUser;
