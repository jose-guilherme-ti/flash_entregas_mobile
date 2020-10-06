import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableHighlight } from 'react-native';
import Api from '../services/api';
import Colors from '../constants/Colors';
import Layout from '../constants/Layout';
import AsyncStorage from '@react-native-community/async-storage'

export default function Footer({finilizeDelivery}) {
  const [financialsWeek, setFinancialWeek] = useState([]);
  const [financialsDay, setFinancialDay] = useState([]);

  useEffect(() => {
    getFinancials();
  }, [finilizeDelivery]);

  async function getFinancials(){
    try {
      const cd_entregador = await AsyncStorage.getItem('cd_entregador');
      const response = await Api.api.get('/entregador/resumoFinPosEntrega?cd_entregador='+cd_entregador, {
        auth: { 
          username: Api.Auth_User, 
          password: Api.Auth_Pass 
        }
      });
      if(response.status === 200){
        if(response.data.length > 1){
          setFinancialWeek(response.data[0]);
          setFinancialDay(response.data[1]);   
        }
        console.log(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <TouchableHighlight onPress={() => getFinancials()} underlayColor="'rgba(255, 255, 255, 0.0)'" style={{backgroundColor: Colors.transparent}}>
      <View style={styles.footer}>
        <View style={styles.row}>
          <Text style={styles.label}>Ganhos Hoje:</Text>
          <Text style={styles.value}>R$ {(Object.keys(financialsDay).length > 0 && financialsDay.hasOwnProperty('nr_valor_receber') && financialsDay.nr_valor_receber !== null) ? financialsDay.nr_valor_receber.replace(".", ",") : '0,00'}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Ganhos na Semana:</Text>
          <Text style={styles.value}>R$ {(Object.keys(financialsWeek).length > 0 && financialsWeek.hasOwnProperty('nr_valor_receber') && financialsWeek.nr_valor_receber !== null) ? financialsWeek.nr_valor_receber.replace(".", ",") : '0,00'}</Text>
        </View>
      </View>
    </TouchableHighlight>
  );
}

const styles = StyleSheet.create({
  footer: {
    //alignItems:'center',
    //justifyContent: 'center',
    top: 'auto',
    padding: 10,
    marginTop: 'auto',
    backgroundColor: "#151515",
    //backgroundColor: "#f2f2f2f2",
    marginVertical:10,
    marginHorizontal:12,
    borderRadius: 5,
    borderColor: Colors.tintColor,
    borderWidth:2,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  label: {
    color: Colors.tintColor, //'#8A8A8A',
    fontWeight: 'bold',
    fontStyle: 'italic',
    fontSize: 12,
  },
  value: {
    color: Colors.tintColor, //'#8A8A8A',
    fontWeight: 'bold',
    fontStyle: 'italic',
    fontSize: 12,
  },
});

//export default withNavigation(Footer);