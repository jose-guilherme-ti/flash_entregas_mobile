import React, {useState, useEffect, useRef} from 'react';
// withNavigation: Adicia a nevegação a qualquer componente. (Necessário para o componente DeliveryInfo que não é um componente padrão);
import {withNavigation} from 'react-navigation';
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  SectionList,
  Image,
  TouchableOpacity,
  TouchableHighlight,
  Platform,
  ScrollView,
  RefreshControl,
  Alert,
  BackHandler,
  Linking,
  AppState,
} from 'react-native';
import {showMessage, hideMessage} from 'react-native-flash-message';
/* import { Audio } from 'expo-av'; */
import Audio from 'react-native-sound';
import Api from '../services/api';
import Functions from '../services/Functions';
import Colors from '../constants/Colors';
import Layout from '../constants/Layout';
import Loading from '../screens/Loading';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/FontAwesome';
import iconeDelivery from '../../assets/images/icon-delivery.png';
//import { Linking } from 'expo';
/* import * as Linking from 'expo-linking' */
import Header from './Header';
/* import { Constants } from 'react-native-unimodules'; */
import AsyncStorage from '@react-native-community/async-storage';
import {fcmService} from '../FCMService';
import {localNotificationService} from '../LocalNotificationService';
import BackgroundTimer from 'react-native-background-timer';
import messaging from '@react-native-firebase/messaging';
import Geolocation from 'react-native-geolocation-service';

function DeliveryInfo({
  navigation,
  bo_online,
  onTpStatusChange,
  onFinilizeDelivery,
}) {
  const [active, setActive] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [user, setUser] = useState([]);
  const [soundObject, setSoundObject] = useState([]);
  const [newDelivery, setNewDelivery] = useState([]);
  const [delivery, setDelivery] = useState([]);
  const [statusDelivery, setStatusDelivery] = useState('');
  const [statusCadastro, setStatusCadastro] = useState('');
  const [notificacaoRejeitada, setNotificacaoRejeitada] = useState('');
  const [backgroundNoticaticionBack, setBackgroundNoticaticionBack] = useState(
    '',
  );
  const [timerBack, setTimerBack] = useState(1);
  const [
    backgroundNoticaticionFrontOn,
    setBackgroundNoticaticionFrontOn,
  ] = useState('');
  const [timerFrontOn, setTimerFrontOn] = useState(1);
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);
  const [dataNotificacao, setDataNotificacao] = useState();

  const _handleAppStateChange = (nextAppState) => {
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      console.log('App has come to the foreground!');
      loadUser();
    }

    appState.current = nextAppState;
    setAppStateVisible(appState.current);
    console.log('AppState', appState.current);
  };

  // Executa assim q a página é aberta;
  useEffect(() => {
    console.log('DeliveryInfo');
    AppState.addEventListener('change', _handleAppStateChange);

    //Teste Guilherme
    //Rejeitar notificação após 1 minuto

    messaging().setBackgroundMessageHandler(async ({data}) => {
      BackgroundTimer.stopBackgroundTimer(backgroundNoticaticionBack);
      AsyncStorage.setItem('notificacaoRejeitada', 'nao-rejeitado');
      loadUser();
      setDataNotificacao(data);
      backgroundMessagemRecusapassiva();
      /*  */
    });

    //FIM Teste Guilherme

    initilizeSoundNotification();
    loadUser();
    //var interval;
    //if(statusCadastro === "A") {
    const onRegister = async (token) => {};

    const onNotification = async ({data}) => {
      console.log('[App] onNotification', data);
      /* BackgroundTimer.stopBackgroundTimer(backgroundNoticaticionFrontOn); */
      loadUser();
      //playSoundNotification();
      //checkNewDelivery();
      setDataNotificacao(data);
      backgroundMessagemRecusapassivaFront();
    };
    
    const onOpenNotification = async (notify) => {
      console.log('notify', notify);
    };

    fcmService.register(onRegister, onNotification, onOpenNotification);

    //}
    /* return () => clearInterval(interval); */
    //Teste - Guilherme

    return () => {
      AppState.removeEventListener('change', _handleAppStateChange);
    };
  }, []);

  function backgroundMessagemRecusapassiva() {
    // this function run in backgroud
    function timer() {
      contador -= timerBack;
      setTimerBack(contador);
    }
    let contador = 60;
    console.log('Estou nos teste recusa passiva background');
    // call timer ever 1000 milliseconds
    setBackgroundNoticaticionBack(
      BackgroundTimer.runBackgroundTimer(timer, 1000),
    );
  }
  function backgroundMessagemRecusapassivaFront() {
    // this function run in backgroud
    function timer() {
      contador -= timerFrontOn;
      setTimerFrontOn(contador);
    }
    let contador = 60;
    console.log('Estou nos teste recusa passiva foreground');
    // call timer ever 1000 milliseconds
    setBackgroundNoticaticionFrontOn(
      BackgroundTimer.runBackgroundTimer(timer, 1000),
    );
  }

  // execute in render os screen
  /*   useEffect(()=>{
    increment()
  },[])
   */
  // here is the conditional to stop the function
  useEffect(() => {
    if (timerBack === 0) {
      RecusaPassiva();
      BackgroundTimer.stopBackgroundTimer(backgroundNoticaticionBack);
      return;
    }
    if (timerFrontOn === 0) {
      RecusaPassiva();
      BackgroundTimer.stopBackgroundTimer(backgroundNoticaticionFrontOn);
      return;
    }
  }, [timerBack, timerFrontOn]);

  async function RecusaPassiva() {
    const data = dataNotificacao;
    try {
      //const cd_entregador = await AsyncStorage.getItem('cd_entregador');
      const response = await Api.api.put(
        '/entregador/recusarEntregaPassiva',
        {
          cd_entregador: data.cd_entregador,
          cd_entrega: data.cd_entrega,
          tp_recusa: 'P',
        },
        {
          auth: {
            username: Api.Auth_User,
            password: Api.Auth_Pass,
          },
        },
      );
      if (response.data === 'Sucesso') {
        console.log('Recusa Passiva foi execudada!!');
        loadUser();
        setTimerBack(1);
        setTimerFrontOn(1);
        BackgroundTimer.stopBackgroundTimer(backgroundNoticaticionFrontOn);
        BackgroundTimer.stopBackgroundTimer(backgroundNoticaticionBack);
      }
    } catch (erro) {
      console.loh(erro);
    }
  }

  async function loadUser() {
    const cd_entregador = await AsyncStorage.getItem('cd_entregador');
    var response = await Functions.loadUser(cd_entregador);
    if (response) {
      setStatusCadastro(response.tp_status);
      onTpStatusChange(response.tp_status);
      setUser(response);
      //console.log(response);
      //bo_online = response.bo_online;
      setActive(response.bo_online);
      setLoading(false);
      //FC - Falta finalizar o cadastro
      if (response.tp_status === 'FC') {
        //Alert.alert('Aviso', 'Complete seu cadastro para seguir!');
        //AT - aguardando treinamento
      } else if (response.tp_status === 'AT') {
        //SN - suspenso por negar corrida
      } else if (response.tp_status === 'SN') {
        //SF - suspenso por questões financeiras
      } else if (response.tp_status === 'SF') {
        //A - liberado para trabalhar
      } else if (response.tp_status === 'A') {
        checkNewDelivery(response.bo_online);
        //await AsyncStorage.setItem('bo_online', response.bo_online);
      }
    }
  }

  function initilizeSoundNotification() {
    // Enable playback in silence mode
    Audio.setCategory('Playback');
    var whoosh = new Audio(
      'notification_sound.mp3',
      Audio.MAIN_BUNDLE,
      (error) => {
        if (error) {
          console.log('failed to load the sound', error);
          return;
        }
        // loaded successfully
        /*  console.log('duration in seconds: ' + whoosh.getDuration() + 'number of channels: ' + whoosh.getNumberOfChannels());
         */

        console.log('Inicializando audio....');
        setSoundObject(whoosh);
        /*   console.log(whoosh); */
      },
    );
  }

  async function playSoundNotification() {
    try {
      soundObject.play();
      //console.log("Notification sound is playing!");
    } catch (error) {
      console.log('An error occurred on sound notification!');
    }
  }

  async function pauseSoundNotification() {
    try {
      soundObject.stop();
      //console.log("Notification paused");
    } catch (error) {
      console.log('An error occurred on paused sound notification!');
    }
  }

  async function checkNewDelivery(bo_online) {
    if (parseInt(bo_online) === 1) {
      try {
        const cd_entregador = await AsyncStorage.getItem('cd_entregador');
        const response = await Api.api.get(
          '/entregador/novaEntrega?cd_entregador=' + cd_entregador,
          {
            auth: {
              username: Api.Auth_User,
              password: Api.Auth_Pass,
            },
          },
        );
        //console.log(response.data);
        if (response.status === 200) {
          var arrDelivery = [];
          var arrNewDelivery = [];
          response.data.map((itemDelivery, index) => {
            if (itemDelivery.ts_aceite_entrega) {
              arrDelivery.push(itemDelivery);
            } else {
              arrNewDelivery.push(itemDelivery);
            }
          });
          setDelivery(arrDelivery);
          setNewDelivery(arrNewDelivery);
        }
      } catch (error) {
        setNewDelivery([]);
        setDelivery([]);
        //console.log(newDelivery);
        //setStatusDelivery("");
      }
    } else {
      setNewDelivery([]);
      console.log(newDelivery);
    }
  }

  //Recusar Delivery
  async function recuseDelivery(cd_entrega) {
    //Teste Guilherme
    /*  setNotificacaoRejeitada(false);
    await AsyncStorage.setItem('notificacaoRejeitada', 'nao-rejeitada'); */
    //FIM Teste Guilherme
    setTimerBack(1);
    setTimerFrontOn(1);
    BackgroundTimer.stopBackgroundTimer(backgroundNoticaticionFrontOn);
    BackgroundTimer.stopBackgroundTimer(backgroundNoticaticionBack);
    pauseSoundNotification();
    try {
      const cd_entregador = await AsyncStorage.getItem('cd_entregador');
      const response = await Api.api.put(
        '/entregador/recusarEntrega',
        {
          cd_entregador: cd_entregador,
          cd_entrega: cd_entrega,
        },
        {
          auth: {
            username: Api.Auth_User,
            password: Api.Auth_Pass,
          },
        },
      );
      console.log(response.data);
      if (response.status === 200) {
        var arrNewDelivery = newDelivery;
        var deliveryFilter = arrNewDelivery.filter(function (el) {
          return el.cd_entrega !== cd_entrega;
        });
        setNewDelivery(deliveryFilter);
      }
    } catch (error) {
      console.log(error);
    }
  }

  //Aceitar Delivery
  async function acceptDelivery(cd_entrega, index) {
    pauseSoundNotification();
    setTimerBack(1);
    setTimerFrontOn(1);
    BackgroundTimer.stopBackgroundTimer(backgroundNoticaticionFrontOn);
    BackgroundTimer.stopBackgroundTimer(backgroundNoticaticionBack);
    try {
      const cd_entregador = await AsyncStorage.getItem('cd_entregador');
      const response = await Api.api.put(
        '/entregador/aceitaEntrega',
        {
          cd_entrega: cd_entrega,
          cd_entregador: cd_entregador,
          bo_aceita_entrega: '1',
        },
        {
          auth: {
            username: Api.Auth_User,
            password: Api.Auth_Pass,
          },
        },
      );
      if (response.status === 200) {
        loadUser();
        var arrDelivery = delivery;
        var deliveryFilter = arrDelivery.filter(function (el) {
          return el.cd_entrega !== newDelivery[index].cd_entrega;
        });
        deliveryFilter.push(newDelivery[index]);
        setDelivery(deliveryFilter);
        //setDelivery([newDelivery[index]]);
        setStatusDelivery('acceptDelivery');
        var arrNewDelivery = delivery;
        var deliveryFilter = arrNewDelivery.filter(function (el) {
          return el.cd_entrega !== cd_entrega;
        });
        setNewDelivery(deliveryFilter);
        console.log(newDelivery[index]);
      }
    } catch (error) {
      console.log(error);
    }
  }

  //Chegou na origem e efetua a coleta
  async function effectCollected(cd_entrega) {
    try {
      const cd_entregador = await AsyncStorage.getItem('cd_entregador');
      const response = await Api.api.put(
        '/entregador/origem',
        {
          cd_entrega: cd_entrega,
          cd_entregador: cd_entregador,
        },
        {
          auth: {
            username: Api.Auth_User,
            password: Api.Auth_Pass,
          },
        },
      );
      //console.log(response);
      if (response.status === 200) {
        //setStatusDelivery("effectCollected");
        checkNewDelivery(user.bo_online);
      }
    } catch (error) {
      console.log(error);
    }
  }

  //Saiu do destino
  async function goOutToDestination(cd_entrega) {
    const cd_entregador = await AsyncStorage.getItem('cd_entregador');
    try {
      const response = await Api.api.put(
        '/entregador/saidadestino',
        {
          cd_entrega: cd_entrega,
          cd_entregador: cd_entregador,
        },
        {
          auth: {
            username: Api.Auth_User,
            password: Api.Auth_Pass,
          },
        },
      );
      if (response.status === 200) {
        //console.log(response.data);
        //setStatusDelivery("goOutToDestination");
        checkNewDelivery(user.bo_online);
      }
    } catch (error) {
      console.log(error);
    }
  }

  //Chegou no destino
  async function arriveDestination(cd_entrega) {
    const cd_entregador = await AsyncStorage.getItem('cd_entregador');
    try {
      const response = await Api.api.put(
        '/entregador/destino',
        {
          cd_entrega: cd_entrega,
          cd_entregador: cd_entregador,
        },
        {
          auth: {
            username: Api.Auth_User,
            password: Api.Auth_Pass,
          },
        },
      );
      if (response.status === 200) {
        console.log(response.data);
        /*if(delivery.sn_retorno === "S") {
          setStatusDelivery("backToCompany");
        } else {
          setStatusDelivery("arriveDestination");
        }*/
        checkNewDelivery(user.bo_online);
      }
    } catch (error) {
      console.log(error);
    }
  }

  // Finalizar a entrega;
  async function finilizeDelivery(cd_entrega) {
    const cd_entregador = await AsyncStorage.getItem('cd_entregador');
    setLoading(true);
    try {
      const response = await Api.api.put(
        '/entregador/fimentrega',
        {
          cd_entrega: cd_entrega,
          cd_entregador: cd_entregador,
        },
        {
          auth: {
            username: Api.Auth_User,
            password: Api.Auth_Pass,
          },
        },
      );
      if (response.status === 200) {
        console.log(response.data);
        //setStatusDelivery("");
        //setDelivery([]);
        checkNewDelivery(active);
        pauseSoundNotification();
        //Alert.alert("Aviso!", "Entrega finalizada com sucesso!");
        showMessage({
          message: 'Entrega finalizada com sucesso!',
          backgroundColor: Colors.tintColor,
          color: '#000',
        });
        onFinilizeDelivery(
          'Entrega ' + cd_entrega + ' finalizada com sucesso!',
        );
        setLoading(false);
      }
    } catch (error) {
      showMessage({
        message: 'Falha ao finalizar a entrega!',
        type: 'danger',
        color: '#fff',
      });
      console.log(error);
      setLoading(false);
    }
  }

  function openMaps(lat, long, empresa) {
    //const scheme = Platform.select({ios: 'maps:0,0?q=', android: 'geo:0,0?q='});
    const scheme = 'https://www.google.com/maps/search/?api=1&query=';
    const latLng = lat + `,` + long;
    const label = empresa;
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`,
    });
    return Linking.openURL(url);
  }

  function maskPhone(phone) {
    var regex = /^(.{1,2})(.{4,5})(.{4})/g;
    var subst = `($1) $2-$3 `;
    var str = phone + '';
    return str.replace(regex, subst);
  }

  //A - liberado para trabalhar
  if (statusCadastro === 'A') {
    if (Object.keys(newDelivery).length > 0) {
      playSoundNotification();
    } else {
      pauseSoundNotification();
    }

    //FIM Teste - Guilherme
    return (
      <>
        <Header
          navigation={navigation}
          statusBO={active}
          tpStatus={statusCadastro}
          switchVisible={true}
          onValueChange={(val) => {
            setActive(val);
          }}
        />
        <Loading visible={loading} />
        <ScrollView
          style={
            Object.keys(delivery).length > 0 ||
            Object.keys(newDelivery).length > 0
              ? styles.container
              : styles.hidden
          }
          showsVerticalScrollIndicator={false}>
          <View
            style={
              Object.keys(delivery).length === 0
                ? styles.hidden
                : styles.listDelivery
            }>
            <FlatList
              //contentContainerStyle={styles.list}
              data={delivery}
              keyExtractor={(key) => key.cd_entrega}
              //showsVerticalScrollIndicator={false}
              //showsHorizontalScrollIndicator={false}
              horizontal
              renderItem={({item}) => {
                return (
                  <View key={item.cd_entrega} style={styles.listItem}>
                    <Text style={styles.titleItem}>Coleta</Text>
                    <View style={styles.row}>
                      <Ionicons
                        name="exclamation"
                        size={22}
                        style={styles.iconDesc}
                      />
                      <Text style={styles.desc}> Buscar na empresa: </Text>
                      <Text style={styles.desc}>{item.empresa}</Text>
                    </View>
                    <View
                      style={
                        item.hasOwnProperty('endereco_completo') &&
                        item.endereco_completo !== null
                          ? styles.row
                          : styles.hidden
                      }>
                      <Ionicons
                        name="map-marker"
                        size={24}
                        style={styles.iconDesc}
                      />
                      <Text style={styles.desc}>{item.endereco_completo}</Text>
                    </View>
                    <View
                      style={
                        item.hasOwnProperty('nr_telefone_empresa') &&
                        item.nr_telefone_empresa !== null
                          ? styles.row
                          : styles.hidden
                      }>
                      <Ionicons
                        name="phone"
                        size={22}
                        style={styles.iconDesc}
                      />
                      <Text style={styles.desc}>
                        {' '}
                        {maskPhone(item.nr_telefone_empresa)}
                      </Text>
                    </View>

                    <View style={styles.hr}></View>

                    <Text style={styles.titleItem}>Entrega</Text>
                    <View style={styles.row}>
                      <Ionicons
                        name="map-marker"
                        size={24}
                        style={styles.iconDesc}
                      />
                      <Text style={styles.desc}>
                        {' '}
                        Bairro: {item.bairro_destino}
                      </Text>
                    </View>
                    <View style={styles.row}>
                      <Ionicons
                        name="exchange"
                        size={22}
                        style={styles.iconDesc}
                      />
                      <Text style={styles.desc}>
                        {item.sn_retorno === 'N' ? 'Não volta' : 'Com volta'}
                      </Text>
                    </View>
                    <View style={styles.row}>
                      <Ionicons
                        name="money"
                        size={24}
                        style={styles.iconDesc}
                      />
                      <Text style={styles.desc}>
                        {' '}
                        R${' '}
                        {item.valor_entregador < 10
                          ? '0' +
                            item.valor_entregador.substr(0, 4).replace('.', ',')
                          : item.valor_entregador
                              .substr(0, 5)
                              .replace('.', ',')}{' '}
                      </Text>
                    </View>
                    <View style={styles.hidden}>
                      <Ionicons
                        name="user-circle"
                        size={22}
                        style={styles.iconDesc}
                      />
                      <Text style={styles.desc}>
                        {' '}
                        Responsável: Nome do Cliente
                      </Text>
                    </View>

                    {item.ds_observacao !== '' ? (
                      <>
                        <View style={styles.hr}></View>
                        <Text style={styles.titleItem}>Observações</Text>
                        <View style={styles.row}>
                          <View style={styles.viewObs}>
                            <Text style={styles.textObs}>
                              {item.ds_observacao}
                            </Text>
                          </View>
                        </View>
                      </>
                    ) : (
                      <></>
                    )}

                    <View
                      style={
                        item.ts_aceite_entrega &&
                        !item.ts_chegada_origem &&
                        !item.ts_saida_destino &&
                        !item.ts_chegada_destino &&
                        !item.ts_entrega_finalizada
                          ? {}
                          : styles.hidden
                      }>
                      <TouchableOpacity
                        onPress={() =>
                          openMaps(
                            item.nr_latitude_origem,
                            item.nr_longitude_origem,
                            item.empresa,
                          )
                        }
                        style={[styles.button, styles.button2]}>
                        <Text style={styles.buttonText}> Abrir Maps </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => effectCollected(item.cd_entrega)}
                        style={styles.button}>
                        <Text style={styles.buttonText}> Fiz a Coleta </Text>
                      </TouchableOpacity>
                    </View>
                    <View
                      style={
                        item.ts_chegada_origem &&
                        !item.ts_saida_destino &&
                        !item.ts_chegada_destino &&
                        !item.ts_entrega_finalizada
                          ? {}
                          : styles.hidden
                      }>
                      <TouchableOpacity
                        onPress={() => goOutToDestination(item.cd_entrega)}
                        style={styles.button}>
                        <Text style={styles.buttonText}>
                          {' '}
                          Sair para o Destino{' '}
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <View
                      style={
                        item.ts_saida_destino &&
                        !item.ts_chegada_destino &&
                        !item.ts_entrega_finalizada
                          ? {}
                          : styles.hidden
                      }>
                      <TouchableOpacity
                        onPress={() => arriveDestination(item.cd_entrega)}
                        style={styles.button}>
                        <Text style={styles.buttonText}>
                          {' '}
                          Cheguei ao Destino{' '}
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <View
                      style={
                        item.ts_chegada_destino &&
                        !item.ts_entrega_finalizada &&
                        item.sn_retorno === 'N'
                          ? {}
                          : styles.hidden
                      }>
                      <TouchableOpacity
                        onPress={() => finilizeDelivery(item.cd_entrega)}
                        style={styles.button}>
                        <Text style={styles.buttonText}>
                          {' '}
                          Finalizar Entrega{' '}
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <View
                      style={
                        item.ts_chegada_destino &&
                        !item.ts_entrega_finalizada &&
                        item.sn_retorno === 'S'
                          ? {}
                          : styles.hidden
                      }>
                      <Text style={styles.avisoNoData}>
                        {' '}
                        Retorne ao estabelecimento para finalizar a entrega!{' '}
                      </Text>
                    </View>
                  </View>
                );
              }}
            />
          </View>

          {/*<View style={Object.keys(newDelivery).length === 0 || Object.keys(delivery).length !== 0 ? styles.hidden : styles.container}>*/}
          <View
            style={
              Object.keys(newDelivery).length === 0
                ? styles.hidden
                : styles.listDeliverys
            }>
            <View style={styles.list}>
              {newDelivery.map((item, index) => {
                return (
                  <View
                    key={item.cd_entrega}
                    style={[styles.listItemMiniCard, styles.rowMiniCard]}>
                    <Text style={styles.titleItemMiniCard}>
                      Nova Entrega: {item.empresa}
                    </Text>
                    <View style={styles.rowMiniCard}>
                      <Ionicons
                        name="map-marker"
                        size={18}
                        style={styles.iconDesc}
                      />
                      <Text style={styles.desc}>
                        {' '}
                        Bairro: {item.bairro_destino}
                      </Text>
                      <Ionicons
                        name="exchange"
                        size={18}
                        style={styles.iconDesc}
                      />
                      <Text style={styles.desc}>
                        {item.sn_retorno === 'N' ? 'Não volta' : 'Com volta'}
                      </Text>
                      <Ionicons
                        name="money"
                        size={18}
                        style={styles.iconDesc}
                      />
                      <Text style={styles.desc}>
                        {' '}
                        R${' '}
                        {item.valor_entregador < 10
                          ? '0' +
                            item.valor_entregador.substr(0, 4).replace('.', ',')
                          : item.valor_entregador
                              .substr(0, 5)
                              .replace('.', ',')}
                      </Text>
                    </View>
                    <View style={styles.rowMiniCard}>
                      <TouchableOpacity
                        onPress={() => recuseDelivery(item.cd_entrega)}
                        style={[styles.buttonMiniCard, styles.button2]}>
                        <Text style={styles.buttonText}> Recusar </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => acceptDelivery(item.cd_entrega, index)}
                        style={styles.buttonMiniCard}>
                        <Text style={styles.buttonText}>
                          {' '}
                          Aceitar {timerBack === 1 ? '' : timerBack + 's'}
                          {timerFrontOn === 1 ? '' : timerFrontOn + 's'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        </ScrollView>

        <View
          style={
            Object.keys(delivery).length === 0 &&
            Object.keys(newDelivery).length === 0
              ? styles.noData
              : styles.hidden
          }>
          {/*<Ionicons name="ios-document" size={120} color="#666" style={styles.icon}/>*/}
          <Image
            source={iconeDelivery}
            style={
              parseInt(active) === 1
                ? styles.iconeDelivery
                : styles.iconeDeliveryOpacity
            }
          />
          {parseInt(active) === 1 ? (
            <Text style={styles.avisoNoData}>
              {' '}
              Ativo, aguardando ofertas...
            </Text>
          ) : (
            <Text style={styles.avisoNoDataOpacity}>
              {' '}
              Ative seu status para receber ofertas!
            </Text>
          )}
        </View>
      </>
    );
    //FC - Falta finalizar o cadastro
  } else if (statusCadastro === 'FC') {
    return (
      <>
        <Header
          navigation={navigation}
          statusBO={active}
          tpStatus={statusCadastro}
          switchVisible={true}
          onValueChange={(val) => {
            setActive(val);
          }}
        />
        <Loading visible={loading} />
        <View style={styles.noData}>
          <MaterialCommunityIcons name="script-text" size={100} color="#333" />
          <Text style={styles.avisoNoData}>
            {' '}
            Para continuar finalize seu cadastro!
          </Text>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('PageUserDetail', {
                page: 'page-user-data',
                title: 'Dados Cadastrais',
              })
            }
            style={styles.button}>
            <Text style={styles.buttonText}> Completar Cadastro </Text>
          </TouchableOpacity>
        </View>
      </>
    );
    //FC - Falta finalizar o cadastro
  } else if (statusCadastro === 'AT') {
    return (
      <>
        <Header
          navigation={navigation}
          statusBO={active}
          tpStatus={statusCadastro}
          switchVisible={true}
          onValueChange={(val) => {
            setActive(val);
          }}
        />
        <Loading visible={loading} />
        <View style={styles.noData}>
          <Image source={iconeDelivery} style={styles.iconeDeliveryOpacity} />
          <Text style={styles.avisoNoDataOpacity}>
            {' '}
            Aguardando a conclusão do treinamento...
          </Text>
        </View>
      </>
    );
    //SN - conta suspensa por negar corrida. SF - suspenso por questões financeiras
  } else if (statusCadastro === 'SN' || statusCadastro === 'SF') {
    return (
      <>
        <Header
          navigation={navigation}
          statusBO={active}
          tpStatus={statusCadastro}
          switchVisible={true}
          onValueChange={(val) => {
            setActive(val);
          }}
        />
        <Loading visible={loading} />
        <View style={styles.noData}>
          <Image source={iconeDelivery} style={styles.iconeDeliveryOpacity} />
          <Text style={styles.avisoNoDataOpacity}>
            {' '}
            Sua conta está suspensa...
          </Text>
        </View>
      </>
    );
  } else {
    return (
      <>
        <Header
          navigation={navigation}
          statusBO={active}
          tpStatus={statusCadastro}
          switchVisible={true}
          onValueChange={(val) => {
            setActive(val);
          }}
        />
        <Loading visible={true} />
      </>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    //paddingTop: 10,
    //alignItems: 'center',
  },

  bold: {
    fontWeight: 'bold',
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
    marginBottom: 10,
  },
  avisoNoDataOpacity: {
    marginTop: 10,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    opacity: 0.4,
  },
  listDelivery: {
    //flex: 1,
    //height: Layout.window.height/2,
    maxHeight: 550,
    alignItems: 'center',
    //backgroundColor: "#ddd"
  },
  listDeliverys: {
    //flex: 1,
    height: '100%',
    alignItems: 'center',
    //marginTop: 10,
    marginBottom: 10,
    //backgroundColor: "#ccc"
    //paddingHorizontal: 25,
  },
  listItem: {
    marginVertical: 8,
    marginHorizontal: 8,
    backgroundColor: '#f8f8f8',
    padding: 10,
    borderRadius: 8,
    borderTopWidth: 12,
    borderTopColor: Colors.tintColor,
    //width: Layout.window.width/1.5,
    //minWidth: 330,
    width: Layout.window.width - Layout.window.width * 0.05,
    maxWidth: 550,
    ...Platform.select({
      ios: {
        shadowColor: '#A3A3A3',
        shadowOffset: {
          width: 0,
          height: 0,
        },
        shadowOpacity: 0.61,
        shadowRadius: 6.11,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  listItemMiniCard: {
    marginVertical: 5,
    marginHorizontal: 8,
    backgroundColor: '#f8f8f8',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderTopWidth: 8,
    borderTopColor: Colors.tintColor,
    //width: Layout.window.width/1.5,
    //minWidth: 330,
    width: Layout.window.width - Layout.window.width * 0.05,
    maxWidth: 550,
    ...Platform.select({
      ios: {
        shadowColor: '#A3A3A3',
        shadowOffset: {
          width: 0,
          height: 0,
        },
        shadowOpacity: 0.61,
        shadowRadius: 6.11,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  rowMiniCard: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hidden: {
    display: 'none',
  },
  hr: {
    borderBottomWidth: 1,
    borderBottomColor: '#D5D4D4',
    marginTop: 14,
    marginBottom: 16,
    marginHorizontal: 10,
  },
  titleItem: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 0,
    marginBottom: 8,
    //textTransform: 'capitalize',
    //margin: 12,
  },
  titleItemMiniCard: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 0,
    marginBottom: 10,
  },

  desc: {
    marginBottom: 8,
  },
  iconDesc: {
    color: '#909090',
    marginTop: -3,
    paddingHorizontal: 3,
    marginLeft: 5,
  },
  button: {
    height: 42,
    backgroundColor: Colors.tintColor,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 12,
    marginHorizontal: 15,
    paddingHorizontal: 15,
  },
  buttonMiniCard: {
    height: 35,
    width: 120,
    backgroundColor: Colors.tintColor,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 15,
    marginHorizontal: 15,
    paddingHorizontal: 15,
  },
  button2: {
    backgroundColor: Colors.secondColor,
  },
  buttonText: {
    color: '#000000',
    fontWeight: 'bold',
    fontSize: 15,
  },
  iconeDelivery: {
    width: 110,
    height: 100,
    resizeMode: 'contain',
  },
  iconeDeliveryOpacity: {
    width: 110,
    height: 100,
    resizeMode: 'contain',
    opacity: 0.2,
  },
  viewObs: {
    width: '96.5%',
    maxWidth: 525,
    marginLeft: 5,
    backgroundColor: '#e2e2e2',
    borderWidth: 1,
    borderColor: '#999',
    borderStyle: 'dashed',
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 8,
    marginRight: 20,
  },
});

//Necessário para funcionar a navegação/redirecionamento para outra página;
export default DeliveryInfo;
