import React, { useState, useEffect } from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableHighlight,
  View,
  ImageBackground,
  
} from 'react-native';
import Functions from '../services/Functions';
import { MonoText } from '../components/StyledText';
import DeliveryInfo from '../components/DeliveryInfo';
import Footer from '../components/Footer';
import fundoImg from '../../assets/images/fundo.jpg';
import AsyncStorage from '@react-native-community/async-storage'
import LinearGradient from 'react-native-linear-gradient';

export default function HomeScreen({navigation}) {
  const [active, setActive] = useState(0);
  const [tpStatus, setTpStatus] = useState("");
  const [finilizeDelivery, setFinilizeDelivery] = useState("");
  const [user, setUser] = useState([]);

  useEffect(() => {
    Functions.registerForPushNotificationsAsync();
  }, []); 
  

  return (
    <ImageBackground source={fundoImg} style={{width: '100%', height: '100%', resizeMode: 'cover',}}>
      <LinearGradient style={styles.container} colors={['#FBFBFB', '#FBFBFB', '#FBFBFB']}>
        <DeliveryInfo bo_online={active} onTpStatusChange={(val) => {setTpStatus(val)}} onFinilizeDelivery={(val) => {setFinilizeDelivery(val)}} />
        <Footer finilizeDelivery={finilizeDelivery}/>
      </LinearGradient>
    </ImageBackground>
  );
}

HomeScreen.navigationOptions = {
  header: null,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
