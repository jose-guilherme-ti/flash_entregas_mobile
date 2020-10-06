import React, { useState, useEffect } from 'react';
// withNavigation: Adicia a nevegação a qualquer componente. (Necessário para o componente NotificationsList que não é um componente padrão);
import { withNavigation } from 'react-navigation';
// FlatList: para a criação de listas;
import { View, StyleSheet, Text, FlatList, Image, TouchableHighlight, Platform, ScrollView, SafeAreaView, RefreshControl,  Alert } from 'react-native';
import Api from '../services/api';
import Colors from '../constants/Colors';
import Layout from '../constants/Layout';
import Loading from '../screens/Loading';
import { Ionicons } from 'react-native-ionicons';
import AsyncStorage from '@react-native-community/async-storage'


function NotificationsList({ navigation }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    loadNotifications();
    setTimeout(() => {
      setRefreshing(false)
    }, 1500);
  }, [refreshing]);

  async function loadNotifications() {
    var arrNotifications = JSON.parse(await AsyncStorage.getItem('notifications')) || [];
    setNotifications(arrNotifications);
    //console.log(response);
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }
  
  // Executa assim q a página é aberta;
  useEffect(() => {
    loadNotifications();
  }, []);

  function handleNavigate(index) {
    //Redireciona para a rota Magazine passando como parametro o id do item;
    var item = notifications[index];
    Alert.alert(item.title, item.body);
  }

  if(notifications.length > 0){
    return (
    <>
      <Loading visible={loading}/>
      <View style={loading ? styles.hidden : styles.container} >
        <FlatList
          contentContainerStyle={styles.list}
          data={notifications}
          keyExtractor={(not, index) => index+""}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />} 
          renderItem={({ item, index }) => (
            <View style={styles.listItem}>
              <TouchableHighlight onPress={() => handleNavigate(index)} underlayColor="'rgba(255, 255, 255, 0.0)'">
                <View style={styles.viewListItem}> 
                  <View style={styles.viewIcon}>
                    <Ionicons name="ios-notifications" size={32} color="#666" style={styles.icon}/>
                  </View>
                  <View style={styles.notification}>            
                    <Text style={styles.title}>{item.title}</Text>
                    <Text style={styles.description}>{item.body}</Text>
                  </View>                        
                </View>         
              </TouchableHighlight>
            </View>                        
          )}
        />  
      </View>
    </>
    )
  } else {
    return (
      <>
        <Loading visible={loading}/>
        <ScrollView contentContainerStyle={loading ? styles.hidden : styles.noData} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
          <Ionicons name="ios-notifications" size={80} color="#999" style={styles.iconNoData}/>
          <Text style={styles.avisoNoData}>Você ainda não possui avisos!</Text>
        </ScrollView>
      </>      
    )
  }
}

const styles = StyleSheet.create({
  container: {
    //paddingTop: 0,
    //flex: 1,
    //alignItems: 'center',
  },
  hidden: {
    display:"none",
  },
  noData: {
    //height: Layout.window.height,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  avisoNoData: {
    marginTop: 10,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    color:'#999',
    marginBottom: 10,
  },
  iconNoData: {
    
  },
  list: {
    width:'100%',
    alignItems: 'center',
    //paddingTop: 15,
    paddingBottom: 50,
    //paddingHorizontal: 25,
  },
  listItem: {
    //marginBottom: 25,
    //backgroundColor: Colors.backgroundDefault,
    borderRadius: 10,
    padding: 8,
    //width: Layout.window.width/1.5,
    //minWidth: 330,
    width: Layout.window.width,
    //maxWidth: 550,
    borderBottomWidth: 1,
    borderBottomColor: '#C7C7C7',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
    textAlign: 'center',
  },
  description: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 0,
    paddingHorizontal: 15,
  },
  viewListItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  viewIcon:{
    padding: 10,
    position:"absolute",
    left: 0,
    //width: '13%',
  },
  notification: {
    width: '100%',
    marginLeft: 10,
    paddingHorizontal: 25,
    //paddingRight: 10,
  } 
});

//Necessário para funcionar a navegação/redirecionamento para outra página;
export default withNavigation(NotificationsList);
