import React, { useState, useEffect } from 'react';
// withNavigation: Adicia a nevegação a qualquer componente. (Necessário para o componente TabDeliversReports que não é um componente padrão);
import { withNavigation } from 'react-navigation';
import { View, StyleSheet, Text, FlatList, Image, TouchableOpacity, TouchableHighlight, Platform, ScrollView, RefreshControl } from 'react-native';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Api from '../services/api';
import Colors from '../constants/Colors';
import Layout from '../constants/Layout';
import Loading from '../screens/Loading';
import AsyncStorage from '@react-native-community/async-storage'

function TabDeliversReports({navigation}) {
  const [loading, setLoading] = useState(true);
  const [deliverysReports, setDeliverysReports] = useState([]);
  const [deliverysReportsFull, setDeliverysReportsFull] = useState([]);
  const [dataInicial, setDataInicial] = useState(new Date());
  const [modalDataInicial, setModalDataInicial] = useState(false);
  const [dataFinal, setDataFinal] = useState(new Date());
  const [modalDataFinal, setModalDataFinal] = useState(false);

  useEffect(() => {
    const dt_inicial = new Date().toISOString().substr(0,10);
    const dt_final = new Date().toISOString().substr(0,10);
    console.log(dt_inicial);
    getDeliverysReports(dt_inicial, dt_final);
    getDeliverysReportsFulll(dt_inicial, dt_final);
  }, []);

  function onConfirmDataInicial(selectedDate){
    /*const dtInicial = moment(selectedDate);
    const dtFinal = moment(dataFinal);
    const duration = moment.duration(dtFinal.diff(dtInicial));
    var days = parseInt(duration.asDays());
    if(days >= 0){
      if(days === 0){ days = 1}
      setModalDataInicial(false);
      setDataInicial(selectedDate);
      getDeliverysReports(days);
    }*/
    setModalDataInicial(false);
    setDataInicial(selectedDate);
    getDeliverysReports(selectedDate.toISOString().substr(0,10), dataFinal.toISOString().substr(0,10));
    getDeliverysReportsFulll(selectedDate.toISOString().substr(0,10), dataFinal.toISOString().substr(0,10));
  };

  function onConfirmDataFinal(selectedDate){
    /*const dtInicial = moment(dataInicial);
    const dtFinal = moment(selectedDate);
    const duration = moment.duration(dtFinal.diff(dtInicial));
    var days = parseInt(duration.asDays());
    if(days >= 0){
      if(days === 0){ 
        days = 1;
      } else {
        days = days+1;
      }
      setModalDataFinal(false);
      setDataFinal(selectedDate);
      getDeliverysReports(days);
    }*/
    setModalDataFinal(false);
    setDataFinal(selectedDate);
    getDeliverysReports(dataInicial.toISOString().substr(0,10), selectedDate.toISOString().substr(0,10));
    getDeliverysReportsFulll(dataInicial.toISOString().substr(0,10), selectedDate.toISOString().substr(0,10));
  };

  async function getDeliverysReports(dt_inicial, dt_final){
    try {
      const cd_entregador = await AsyncStorage.getItem('cd_entregador');
      const response = await Api.api.get('/entregador/resumoEntregas?cd_entregador='+cd_entregador+'&dt_inicial='+dt_inicial+'&dt_final='+dt_final, {
        auth: { 
          username: Api.Auth_User, 
          password: Api.Auth_Pass 
        }
      });
      if(response.status === 200){
        setDeliverysReports(response.data);
        setLoading(false);
        console.log(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function getDeliverysReportsFulll(dt_inicial, dt_final){
    try {
      const cd_entregador = await AsyncStorage.getItem('cd_entregador');
      //const response = await Api.api.get('/entregador/detalhamentoEntregas?cd_entregador=1080&dt_inicial='+dt_inicial+'&dt_final='+dt_final, {
      const response = await Api.api.get('/entregador/detalhamentoEntregas?cd_entregador='+cd_entregador+'&dt_inicial='+dt_inicial+'&dt_final='+dt_final, {
        auth: { 
          username: Api.Auth_User, 
          password: Api.Auth_Pass 
        }
      });
      if(response.status === 200){
        setDeliverysReportsFull(response.data);
        setLoading(false);
        console.log(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <View style={[styles.row, styles.headBar]}> 
        <View style={styles.row}>
          <View style={styles.col6}>
            <Text style={styles.label}>Data Inicial:</Text>
            <TouchableOpacity onPress={() => setModalDataInicial(true)} style={styles.selectInput}>
              <Text>{dataInicial ? dataInicial.toISOString().substr(0,10).split('-').reverse().join('/') : ' - '}</Text>
            </TouchableOpacity>
            <DateTimePickerModal
              isVisible={modalDataInicial}
              mode="date"
              value={dataInicial}
              is24Hour={true}
              locale = "pt-BR"
              maximumDate={new Date()}
              onConfirm={onConfirmDataInicial}
              onCancel={() => setModalDataInicial(false)}
            />
          </View>
          <View style={styles.col6}>
            <Text style={styles.label}>Data Final:</Text>
            <TouchableOpacity onPress={() => setModalDataFinal(true)} style={styles.selectInput}>
              <Text>{dataFinal ? dataFinal.toISOString().substr(0,10).split('-').reverse().join('/') : ' - '}</Text>
            </TouchableOpacity>
            <DateTimePickerModal
              isVisible={modalDataFinal}
              mode="date"
              value={dataFinal}
              is24Hour={true}
              locale = "pt-BR"
              onConfirm={onConfirmDataFinal}
              onCancel={() => setModalDataFinal(false)}
            />
          </View>
        </View>
      </View>
        <View style={styles.container}>
          <Loading visible={loading}/>

          <FlatList
            contentContainerStyle={styles.list}
            data={deliverysReportsFull}
            keyExtractor={(dl, index) => index+""}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => {
              if(item.hasOwnProperty("cd_entrega")){
                return (
                  <View style={styles.listItem}> 
                    <View style={styles.row}>            
                      <View style={styles.col12}>            
                        <Text style={styles.title}>Entrega #{item.cd_entrega}</Text>
                      </View> 
                    </View> 
                    <View style={styles.bodyItem}>   
                      <View style={styles.col6}>
                        <View style={styles.row}>
                          <Text style={styles.descItem}>Empresa: <Text style={styles.descItemValue}>{item.nm_empresa}</Text></Text>
                        </View>
                        <View style={item.status_entrega !== "Cancelada" && item.status_entrega !== "Recusada" ? styles.row : styles.hidden}>
                          <Text style={styles.descItem}>Valor Recebido: <Text style={styles.descItemValue}>R$ {item.nr_valor_recebido}</Text></Text>
                        </View>
                        {/*<View style={styles.row}>
                          <Text style={styles.descItem}>Valor Entrega: <Text style={styles.descItemValue}>R${item.nr_valor_entrega}</Text></Text>
                        </View>
                        <View style={item.status_entrega !== "Cancelada" && item.status_entrega !== "Recusada" ? styles.row : styles.hidden}>
                          <Text style={styles.descItem}>Pagamento: <Text style={styles.descItemValue}>{item.sn_pagamento_dinheiro === "S" ? "Dinheiro" : "Cartão"}</Text></Text>
                        </View>*/}
                      </View>
                      <View style={styles.col6}>
                        <View style={styles.row}>
                          <Text style={styles.descItem}>Bairro: <Text style={styles.descItemValue}>{item.nm_bairro}</Text></Text>
                        </View>
                        <View style={styles.row}>
                          <Text style={styles.descItem}>Status: <Text style={styles.descItemValue}>{item.status_entrega}</Text></Text>
                        </View>
                      </View>
                    </View>         
                      <View style={styles.textCenter}>
                        {item.ts_entrega_finalizada ?
                        <Text style={styles.descItemFooter}>Entrega finalizada em {item.ts_entrega_finalizada.substr(0,10).split("-").reverse().join("/")} às {item.ts_entrega_finalizada.substr(11,5)}h</Text>
                        : <Text style={styles.hidden}></Text> }
                      </View>
                  </View>         
                )}}
              }
          />        
          <View style={styles.footer}>
            <View style={styles.rowTotais}>
              <View style={styles.row}>
                <Text style={styles.titleItem}>Recusadas: </Text>
                <Text style={[styles.labelValor, styles.labelEntregasRecusadas]}>{(Object.keys(deliverysReports).length > 0 && deliverysReports[2].qt_entregas !== null) ? deliverysReports[2].qt_entregas : '0'}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.titleItem}>Canceladas: </Text>
                <Text style={[styles.labelValor, styles.labelEntregasCanceladas]}>{(Object.keys(deliverysReports).length > 0 && deliverysReports[1].qt_entregas !== null) ? deliverysReports[1].qt_entregas : '0'}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.titleItem}>Finalizadas: </Text>
                <Text style={[styles.labelValor, styles.labelEntregasFinalizadas]}>{(Object.keys(deliverysReports).length > 0 && deliverysReports[0].qt_entregas !== null) ? deliverysReports[0].qt_entregas : '0'}</Text>
              </View>
            </View>
            <View style={styles.rowSaldo}>
              <Text style={styles.labelFooter}>Saldo no Período:</Text>
              <Text style={styles.valueFooter}>R$ {(Object.keys(deliverysReports).length > 0 && deliverysReports[3].nr_saldo !== null) ? deliverysReports[3].nr_saldo.replace(".", ",") : '0,00'}</Text>
            </View>
          </View>
        </View>
    </>
  );

}

const styles = StyleSheet.create({
  container: {
    //flex: 1,
    height: "100%",
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
    paddingBottom: 80,
    //paddingHorizontal: 25,
  },
  listItem: {
    marginBottom: 10,
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
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.colorText,
    textAlign: 'center',
    marginBottom: 5,
  },
  titleItem: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.tintColor,
    //textAlign: 'center',
  },
  labelValor: {
    fontSize: 14,
    marginTop: -2,
    fontWeight: 'bold',
    //textAlign: "right",
  },
  labelEntregasFinalizadas: {
    color: 'green',
  },
  labelEntregasCanceladas: {
    color: 'yellow',
  },
  labelEntregasRecusadas: {
    color: 'red',
  },
  subTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: "#444",
    paddingVertical: 5,
    //textAlign: 'center',
  },
  descItem: {
    fontSize: 12,
    marginBottom: 2
  },
  descItemValue: {
    fontSize: 14,
    marginBottom: 2,
    fontWeight: "bold"
  },
  descItemFooter: {
    fontSize: 12,
    fontStyle: "italic",
    textAlign: 'center',
    marginTop: 5,
    marginBottom: 0
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
  label: {
    fontSize: 12,
    marginTop: 10,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 5,
    marginLeft: 15,
  },
  selectInput: {
    maxWidth: 550,
    backgroundColor: "#f2f2f2",
    paddingHorizontal: 10,
    marginHorizontal: 15,
    paddingTop: 14,
    fontSize: 16,
    color: '#555',
    height: 44,
    marginBottom: 10,
    borderRadius: 5,
    alignItems: "center"
  },
  footer: {
    top: 'auto',
    //position: "absolute",
    bottom: 75,
    padding: 10,
    marginTop: 'auto',
    backgroundColor: "#151515",
    marginVertical:15,
    marginHorizontal:10,
    borderRadius: 5,
    borderColor: Colors.tintColor,
    borderWidth:2,
  },
  rowTotais: {
    flexDirection: "row",
    flexWrap: "nowrap",
    justifyContent: "space-around",
  },
  rowSaldo: {
    marginTop:8,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  labelFooter: {
    color: Colors.tintColor, //'#8A8A8A',
    fontWeight: 'bold',
    fontStyle: 'italic',
    fontSize: 16,
  },
  valueFooter: {
    color: Colors.tintColor, //'#8A8A8A',
    fontWeight: 'bold',
    fontStyle: 'italic',
    fontSize: 16,
  },

});

//Necessário para funcionar a navegação/redirecionamento para outra página;
export default TabDeliversReports;