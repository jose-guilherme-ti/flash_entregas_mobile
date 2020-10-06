import React, { useState, useEffect } from 'react';
// withNavigation: Adicia a nevegação a qualquer componente. (Necessário para o componente TabInvoices que não é um componente padrão);

import { View, StyleSheet, Text, FlatList, Image, TouchableOpacity, TouchableHighlight, Platform, ScrollView, RefreshControl, Modal } from 'react-native';
import Api from '../services/api';
import Colors from '../constants/Colors';
import Layout from '../constants/Layout';
import Loading from '../screens/Loading';
import MaterialCommunityIcons  from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-community/async-storage'

function TabInvoices({navigation}) {
  const [loading, setLoading] = useState(true);
  const [invoices, setInvoices] = useState([]);
  const [invoiceSelect, setInvoiceSelect] = useState(0);
  const [invoiceDetails, setInvoiceDetails] = useState([]);
  const [modalDetails, setModalDetails] = useState(false);


  useEffect(() => {
    getInvoices();
  }, []);

  async function getInvoices(){
    try {
      const cd_entregador = await AsyncStorage.getItem('cd_entregador');
      const response = await Api.api.get('/entregador/faturasSintetico?cd_entregador=' + cd_entregador, {
        auth: { 
          username: Api.Auth_User, 
          password: Api.Auth_Pass 
        }
      });
      if(response.status === 200){
        console.log(response.data);
        setInvoices(response.data);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function getInvoicesDetails(codFatura){
    try {
      const response = await Api.api.get('/entregador/faturasAnalitico?cd_fatura=' +codFatura, {
        auth: { 
          username: Api.Auth_User, 
          password: Api.Auth_Pass 
        }
      });
      if(response.status === 200){
        console.log(response.data);
        setInvoiceDetails(response.data);
        setInvoiceSelect(codFatura);
        setModalDetails(true);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
        <View style={styles.container}>
          <Loading visible={loading}/>
          <FlatList
            contentContainerStyle={styles.list}
            data={invoices}
            keyExtractor={(dl, index) => index+""}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={{flex: 1}}>
                <View style={styles.noData}>
                  <Text style={styles.avisoNoData}>Não há faturas a serem exibidas!</Text>
                </View>
              </View>
            }
            renderItem={({ item }) => {
              return (
                <View key={item.cd_fatura}>
                  <TouchableOpacity onPress={() => getInvoicesDetails(item.cd_fatura)} underlayColor="'rgba(255, 255, 255, 0.0)'" style={styles.listItem}> 
                    <View style={styles.row}>            
                      <View style={styles.col12}>            
                        <Text style={styles.title}>Fatura #{item.cd_fatura}</Text>
                      </View> 
                    </View> 
                    <View style={styles.bodyItem}>   
                      <View style={styles.col6}>
                        <View style={styles.row}>
                          <Text style={styles.descItem}>Entregas: <Text style={styles.descItemValue}>{item.total_entrega}</Text></Text>
                        </View>
                        <View style={styles.row}>
                          <Text style={styles.descItem}>Valor total: <Text style={styles.descItemValue}>R${item.vl_total}</Text></Text>
                        </View>
                      </View>
                      <View style={styles.col6}>
                        <View style={styles.row}>
                          <Text style={styles.descItem}>Status: <Text style={styles.descItemValue}>{item.status_fatura}</Text></Text>
                        </View>
                      </View>
                    </View>         
                    <View style={styles.textCenter}>
                      {item.ts_inicio_semana ?
                      <Text style={styles.descItemFooter}>Semana vigente: {item.ts_inicio_semana.substr(0,10).split("-").reverse().join("/") + ' à ' + item.ts_fim_semana.substr(0,10).split("-").reverse().join("/")}</Text>
                      : <Text style={styles.hidden}></Text> }
                    </View>
                  </TouchableOpacity>  
                </View>
              )}
            }
          />   
          <Modal
            //Modal termos
            animationType="slide"
            transparent={true}
            visible={modalDetails}
            style={styles.modal}>
            <View style={styles.bodyModal}> 
              <TouchableOpacity onPress={() => setModalDetails(false)} style={styles.btnCloseModal}>
                <MaterialCommunityIcons name={'close'} size={26} color='#333' style={styles.iconClose}/>
              </TouchableOpacity>
              <View style={styles.ViewTitleModal}> 
                <Text style={styles.titleModal}>Fatura # {invoiceSelect}</Text>
              </View> 
              <FlatList
                contentContainerStyle={styles.listModal}
                data={invoiceDetails}
                keyExtractor={(dl, index) => index+""}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => {
                  return (
                    <View key={item.cd_fatura} style={styles.listItemModal}>
                        <View style={styles.row}>            
                          <View style={styles.col12}>            
                            <Text style={styles.subTitle}>Entrega #{item.cd_entrega}</Text>
                          </View> 
                        </View> 
                        <View style={styles.bodyItem}>   
                          <View style={styles.row}>
                            <Text style={styles.descItem}>Empresa: <Text style={styles.descItemValue}>{item.empresa}</Text></Text>
                          </View>
                          <View style={styles.row}>
                            <Text style={styles.descItem}>Contato Empresa: <Text style={styles.descItemValue}>{item.nm_contato_empresa + " "}{item.nr_telefone_empresa !== null ? item.nr_telefone_empresa : ""}</Text></Text>
                          </View>
                          <View style={styles.row}>
                            <Text style={styles.descItem}>Destino: <Text style={styles.descItemValue}>{item.endereco_completo + " - " + item.bairro_destino} </Text></Text>
                          </View>
                          <View style={styles.col6}>
                            <View style={styles.row}>
                              <Text style={styles.descItem}>Origem: <Text style={styles.descItemValue}>{item.bairro_origem}</Text></Text>
                            </View>
                          </View>
                          <View style={styles.col6}>
                            <View style={styles.row}>
                              <Text style={styles.descItem}>Retorno: <Text style={styles.descItemValue}>{item.sn_retorno ? "Sim" : "Não"}</Text></Text>
                            </View>
                          </View>
                          <View style={item.ts_aceite_entrega !== null ? styles.row : styles.hidden}>
                            <View style={styles.row}>
                              <Text style={styles.descItem}>Entrega Aceita: <Text style={styles.descItemValueTime}>{item.ts_aceite_entrega !== null ? item.ts_aceite_entrega.substr(0,10).split("-").reverse().join("/") + ' às '+ item.ts_aceite_entrega.substr(11) : " - "}</Text></Text>
                            </View>
                            <View style={styles.row}>
                              <Text style={styles.descItem}>Chegada Origem: <Text style={styles.descItemValueTime}>{item.ts_chegada_origem !== null ? item.ts_chegada_origem.substr(0,10).split("-").reverse().join("/") + ' às '+ item.ts_chegada_origem.substr(11) : " - "}</Text></Text>
                              </View>
                            <View style={styles.row}>
                              <Text style={styles.descItem}>Saída Destino: <Text style={styles.descItemValueTime}>{item.ts_saida_destino !== null ? item.ts_saida_destino.substr(0,10).split("-").reverse().join("/") + ' às '+ item.ts_saida_destino.substr(11) : " - "}</Text></Text>
                            </View>
                            <View style={styles.row}>
                              <Text style={styles.descItem}>Chegada Destino: <Text style={styles.descItemValueTime}>{item.ts_chegada_destino !== null ? item.ts_chegada_destino.substr(0,10).split("-").reverse().join("/") + ' às '+ item.ts_chegada_destino.substr(11) : " - "}</Text></Text>
                            </View>
                            <View style={styles.row}>
                              <Text style={styles.descItem}>Finalizada: <Text style={styles.descItemValueTime}>{item.ts_entrega_finalizada !== null ? item.ts_entrega_finalizada.substr(0,10).split("-").reverse().join("/") + ' às '+ item.ts_entrega_finalizada.substr(11) : " - "}</Text></Text>
                            </View>
                          </View>
                          <View style={item.ts_entrega_cancelada !== null ? styles.row : styles.hidden}>
                            <Text style={styles.descItem}>Entrega Cancelada: <Text style={styles.descItemValueTime}>{item.ts_entrega_cancelada !== null ? item.ts_entrega_cancelada.substr(0,10).split("-").reverse().join("/") + ' às '+ item.ts_entrega_cancelada.substr(11) : " - "}</Text></Text>
                          </View>
                          <View style={styles.row}>
                            <Text style={styles.descItem}>Valor Entrega: <Text style={styles.descItemValue}>R${item.valor_entrega}</Text></Text>
                          </View>
                        </View>         
                        <View style={styles.textCenter}>
                          {item.ts_inicio_semana ?
                          <Text style={styles.descItemFooter}>Semana vigente: {item.ts_inicio_semana.substr(0,10).split("-").reverse().join("/") + ' à ' + item.ts_fim_semana.substr(0,10).split("-").reverse().join("/")}</Text>
                          : <Text style={styles.hidden}></Text> }
                        </View>
                    </View>
                  )}
                }
              />
            </View>
          </Modal>     
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
    width:"100%",
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
    height: Layout.window.height/1.2,
    //flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    //backgroundColor: "#999",
    //margin: 20,
  },
  avisoNoData: {
    //marginTop: -30,
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
    fontSize: 14,
    fontWeight: 'bold',
    color: "#ccc",
    //paddingVertical: 5,
    textAlign: 'left',
  },
  descItem: {
    fontSize: 12,
    marginBottom: 0
  },
  descItemValue: {
    fontSize: 14,
    marginBottom: 0,
    fontWeight: "bold"
  },
  descItemValueTime: {
    fontSize: 12,
    marginBottom: 0,
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
    marginHorizontal: 0,
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

  // MODAL
  modal: {
    //margin: 15
  },
  bodyModal: {
    flex: 1,
    //justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    paddingHorizontal: 12,
    //marginTop: 30,
  },
  btnCloseModal: {
    position: "absolute",
    right: 0,
    top: 0,
    marginTop: 10,
    marginRight: 7,
    //backgroundColor: '#f8f8f8',
    zIndex: 99,
  },
  ViewTitleModal:{
    width: "100%",
    borderBottomColor: "#ddd",
    borderBottomWidth: 1,
  },
  titleModal: {
    fontWeight: 'bold',
    color: "#333",
    marginTop: 10,
    paddingBottom: 5,
    fontSize: 20,
    paddingHorizontal: 20,
    textAlign: "center",
  },
  subTitleModal: {
    color: "#333",
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
    display: 'none'
  },
  listModal: {
    width:'100%',
    paddingTop: 10,
  },
  listItemModal: {
    paddingBottom: 10,
    marginBottom: 0,
    borderBottomColor: "#ddd",
    borderBottomWidth: 1,
  },

});

//Necessário para funcionar a navegação/redirecionamento para outra página;
export default TabInvoices;