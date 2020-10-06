import React, { useState, useEffect } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import LottieView from "lottie-react-native";
import Colors from '../constants/Colors';
import Layout from '../constants/Layout';

export default function Loading(props){
  useEffect(() => {
    //this.animation.play(0, 50);
    this.animation.play();
  }, []);
  const { visible } = props;
  if (visible === false) {
    return null;
  } else {
    return (
      <View style={[styles.container, styles.horizontal]}>
        <LottieView
          ref={animation => {
            this.animation = animation;
          }}
          style={styles.loader}
          speed={2}
          source={require('../../assets/images/loading.json')}
          // OR find more Lottie files @ https://lottiefiles.com/featured
          // Just click the one you like, place that file in the 'assets' folder to the left, and replace the above 'require' statement
        />
        {/*<ActivityIndicator size="large" color={Colors.tintColor} style={styles.loader}/>*/}
        
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    //flex: 1,
    height: Layout.window.height/1.1,
    //height: '100%',
    marginTop: -35,
    justifyContent: 'center',
    alignItems: 'center',
    //backgroundColor: 'rgba(251, 251, 251, 0.95)'
  },
  loader:{
    width: 100,
    height: 120,
    //marginTop: 0,
    //resizeMode: "contain"
  }
  /*
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10
  }*/
})