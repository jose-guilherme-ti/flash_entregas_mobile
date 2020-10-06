import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
/* import { createStackNavigator } from 'react-navigation-stack'; */
import {NavigationContainer, getFocusedRouteNameFromRoute} from "@react-navigation/native"
import {createStackNavigator} from "@react-navigation/stack"


import Login from '../screens/Login';
import RegisterScreen from '../screens/RegisterScreen';
import PageUserDetail from '../screens/PageUserDetail';

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import TabBarIcon from '../components/TabBarIcon';
import Colors from '../constants/Colors';
import HomeScreen from '../screens/HomeScreen';
import UserScreen from '../screens/UserScreen';

import NotificationsScreen from '../screens/NotificationsScreen';
const Tab = createBottomTabNavigator();
/* export default createAppContainer(
  createSwitchNavigator({
    // You could add another route here for authentication.
    // Read more at https://reactnavigation.org/docs/en/auth-flow.html
    Login: Login,
    RegisterScreen: RegisterScreen,
    Main: MainTabNavigator,
  }),
); */

const Stack = createStackNavigator();

function MainTabs(){
  return(
  <Tab.Navigator
  tabBarOptions={{
    activeTintColor: '#eaac1b',
    style:{
      backgroundColor:'#000000'
    } 
  }}
  >
   
    {/* <Tab.Screen name="Perfil" component={PageUserDetail} />   */}
    <Tab.Screen 
      name="Home" 
      component={HomeScreen}
      options={{
        tabBarLabel: 'Home',
        tabBarIcon: ({ color, size }) => (
          <TabBarIcon name="home" color={color} size={size} />
        ),
      }}
      />
    <Tab.Screen 
      name="Perfil"
      component={UserScreen}
      options={{
        tabBarLabel: 'Perfil',
        tabBarIcon: ({ color, size }) => (
          <TabBarIcon name="user" color={color} size={size} />
        ),
      }}
      /> 
    <Tab.Screen 
      name="Status"
      component={NotificationsScreen}
      options={{
        tabBarLabel: 'Status',
        tabBarIcon: ({ color, size }) => (
          <TabBarIcon name="motorcycle" color={color} size={size} />
        ),
      }}
      /> 
      
  </Tab.Navigator>
  )


  
}




export default function AppNavigator(){
  return (
    <NavigationContainer>
      <Stack.Navigator 
       screenOptions={{
        headerShown: false
      }}
      >
        <Stack.Screen name ="Login" component={Login}/>
        <Stack.Screen name ="RegisterScreen" component={RegisterScreen}/>
        <Stack.Screen name ="Main" component={MainTabs} />
        <Stack.Screen name ="Perfil" component={UserScreen}/>
        <Stack.Screen 
                    name ="PageUserDetail" 
                    component={PageUserDetail}
                    options={{
                      headerShown: true,
                      title: "Perfil"}} />
      </Stack.Navigator>
    </NavigationContainer>
  )

}
