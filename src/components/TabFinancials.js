import React, { useState, useEffect } from 'react';
// withNavigation: Adicia a nevegação a qualquer componente. (Necessário para o componente TabFinancials que não é um componente padrão);
import { withNavigation } from 'react-navigation';
import { View, StyleSheet, Text, FlatList, Image, TouchableOpacity, TouchableHighlight, Platform, ScrollView, RefreshControl } from 'react-native';
import ViewPager from '@react-native-community/viewpager';
import Api from '../services/api';
import Colors from '../constants/Colors';
import Layout from '../constants/Layout';
import Loading from '../screens/Loading';
import AsyncStorage from '@react-native-community/async-storage'

function TabFinancials({navigation}) {
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);
  const [viewpager, setViewPager] = useState(0);
  const [financialsWeek, setFinancialWeek] = useState([]);
  const [financialsDay, setFinancialDay] = useState([]);

  useEffect(() => {
    //getAgendamentosPorArea();
    getFinancials();
  }, []);

  function changeTab(index, setPage){
    if(setPage){
      viewpager.setPage(index);
    }
    setIndex(index);
    //Get POR ÁREA
    /*if(index === 0){
      getAgendamentosPorArea();
    } else if (index === 1){
      getAgendamentosPorSessao();
    }*/
  }

  async function getFinancials(){
    try {
      const cd_entregador = await AsyncStorage.getItem('cd_entregador');
      const response = await Api.api.get('/entregador/resumoFinanceiro?cd_entregador='+cd_entregador, {
        auth: { 
          username: Api.Auth_User, 
          password: Api.Auth_Pass 
        }
      });
      if(response.status === 200){
        setFinancialWeek(response.data[0]);
        setFinancialDay(response.data[1]);
        setLoading(false);
        console.log(response.data[0]);
        console.log(response.data[1]);
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <View style={[styles.row, styles.headBar]}> 
        <TouchableHighlight onPress={() => changeTab(0, true)} underlayColor="'rgba(255, 255, 255, 0.0)'" style={[styles.col6, index === 0 ? styles.buttonTabActive : styles.buttonTab]}>
          <Text style={index === 0 ? styles.labelTabActive : styles.labelTab}>DIA</Text>
        </TouchableHighlight>
        <TouchableHighlight onPress={() => changeTab(1, true)} underlayColor="'rgba(255, 255, 255, 0.0)'" style={[styles.col6, index === 1 ? styles.buttonTabActive : styles.buttonTab]}>
          <Text style={index === 1 ? styles.labelTabActive : styles.labelTab}>SEMANA</Text>
        </TouchableHighlight>
        {/* 
        <TouchableHighlight onPress={() => changeTab(2, true)} underlayColor="'rgba(255, 255, 255, 0.0)'" style={[styles.col4, index === 2 ? styles.buttonTabActive : styles.buttonTab]}>
          <Text style={index === 2 ? styles.labelTabActive : styles.labelTab}>POR ITEM</Text>
        </TouchableHighlight>
        */}
      </View>
      <ViewPager 
        style={styles.viewPager} 
        initialPage={index}
        ref={(viewpager) => {setViewPager(viewpager)}}
        onPageSelected={(page) => changeTab(page.nativeEvent.position, false)}
      >
        <View key="1">
          <Loading visible={loading}/> 
          <View style={styles.list}>
            <View style={styles.listItem}>
              <Text style={styles.titleItem}>Valor a Pagar:</Text>
              <Text style={[styles.labelValor, styles.labelValorPagar]}>R$ {(financialsDay.hasOwnProperty('vl_pagar') && financialsDay.vl_pagar !== null) ? financialsDay.vl_pagar.replace(".", ",") : '0,00'}</Text>
            </View>
            <View style={styles.listItem}>
              <Text style={styles.titleItem}>Valor a Receber:</Text>
              <Text style={[styles.labelValor, styles.labelValorReceber]}>R$ {(financialsDay.hasOwnProperty('vl_receber') && financialsDay.vl_receber !== null) ? financialsDay.vl_receber.replace(".", ",") : '0,00'}</Text>
            </View>
            <View style={styles.listItem}>
              <Text style={styles.titleItem}>Saldo:</Text>
              <Text style={[styles.labelValor, styles.labelValorSaldo]}>R$ {(financialsDay.hasOwnProperty('vl_saldo') && financialsDay.vl_saldo !== null) ? financialsDay.vl_saldo.replace(".", ",") : '0,00'}</Text>
            </View>
          </View>          
        </View>

        <View key="2">
        <Loading visible={loading}/> 
          <View style={styles.list}>
            <View style={styles.listItem}>
              <Text style={styles.titleItem}>Valor a Pagar:</Text>
              <Text style={[styles.labelValor, styles.labelValorPagar]}>R$ {(financialsWeek.hasOwnProperty('vl_pagar') && financialsWeek.vl_pagar !== null) ? financialsWeek.vl_pagar.replace(".", ",") : '0,00'}</Text>
            </View>
            <View style={styles.listItem}>
              <Text style={styles.titleItem}>Valor a Receber:</Text>
              <Text style={[styles.labelValor, styles.labelValorReceber]}>R$ {(financialsWeek.hasOwnProperty('vl_receber') && financialsWeek.vl_receber !== null) ? financialsWeek.vl_receber.replace(".", ",") : '0,00'}</Text>
            </View>
            <View style={styles.listItem}>
              <Text style={styles.titleItem}>Saldo:</Text>
              <Text style={[styles.labelValor, styles.labelValorSaldo]}>R$ {(financialsWeek.hasOwnProperty('vl_saldo') && financialsWeek.vl_saldo !== null) ? financialsWeek.vl_saldo.replace(".", ",") : '0,00'}</Text>
            </View>
          </View>     
        </View>
      </ViewPager>
    </>
  );

}

const styles = StyleSheet.create({
  container: {
  },
  viewPager: {
    flex: 1,
  },
  hidden: {
    display: "none"
  },
  row:{
    //width:Layout.window.width,
    flexDirection: 'row',
    flexWrap: "wrap",
  },
  col3: {
    width: "25%",
    alignItems: "flex-end"
  },
  col6: {
    width: "50%"
  },
  col4: {
    width: "33.3333333333%"
  },
  col8: {
    width: "66.6666666666%"
  },
  col9: {
    width: "75%"
  },
  col12: {
    width: "100%"
  },
  textCenter:{
    alignItems: "center",
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
    color:'#333',
  },
  headBar: {
    width: Layout.window.width,
    //paddingVertical: 5,
    alignItems: 'center',
    backgroundColor: Colors.backgroundDefault,
    ...Platform.select({
      ios: {
        shadowColor: "#C1C1C1",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.61,
        shadowRadius: 2.11,
      },
      android: {
          elevation: 4,
      },
    }),
  },
  buttonTab: {
    height:40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.backgroundDefault,
    //borderWidth: 1,
    //borderColor: '#f2f2f2'
  },
  labelTab: {
    color: "#333",
    color: "#fff",
    //fontWeight: 'bold'
  },
  labelTabActive: {
    color: "#fff",
    fontWeight: 'bold'
  },
  buttonTabActive: {
    height:40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.tintColor,
  },
  list: {
    width:'100%',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 50,
    //paddingHorizontal: 25,
  },
  listItem: {
    marginBottom: 15,
    backgroundColor: '#f8f8f8',
    padding: 10,
    borderRadius: 8,
    borderTopWidth: 5,
    borderTopColor: "#BFBFBF",
    //width: Layout.window.width/1.5,
    //minWidth: 330,
    width: Layout.window.width-(Layout.window.width*0.05),
    maxWidth: 550,
    ...Platform.select({
      ios: {
        shadowColor: "#A3A3A3",
        shadowOffset: {
          width: 0,
          height: 0,
        },
        shadowOpacity: 0.61,
        shadowRadius: 4.11,
      },
      android: {
          elevation: 2,
      },
    }),
  },
  titleItem: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.colorText,
    //textAlign: 'center',
  },
  labelValor: {
    fontSize: 35,
    fontWeight: 'bold',
    textAlign: "right",
  },
  labelValorPagar: {
    color: 'red',
  },
  labelValorReceber: {
    color: Colors.tintColor,
  },
  labelValorSaldo: {
    color: 'green',
  },
  subTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: "#444",
    paddingVertical: 5,
    //textAlign: 'center',
  },
  descItem: {
    fontSize: 14,
    marginBottom: 5
  },
  bodyItem:{
    marginHorizontal: 5,
    flexDirection: 'row',
    flexWrap: "wrap",
  },
  iconItem:{
    marginTop: -2
  },
  iconStatus:{
    marginTop: 11
  },
  labelStatus: {
    fontSize: 12,
    textTransform: "uppercase",
    marginTop: 10
  },
  legenda:{
    flexDirection: 'row',
    flexWrap: "wrap",
    marginHorizontal: 12,
    paddingVertical: 5,
    alignItems: "flex-end",
    marginLeft: "auto",
  },

});

//Necessário para funcionar a navegação/redirecionamento para outra página;
export default withNavigation(TabFinancials);