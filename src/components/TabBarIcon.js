import React from 'react';
/* import { Ionicons } from 'react-native-ionicons'; */
import Icon from 'react-native-vector-icons/FontAwesome'
import Colors from '../constants/Colors';

export default function TabBarIcon(props) {
  return (
    <Icon
      name={props.name}
      size={26}
      style={{ marginBottom: -3 }}
      color={Colors.tabIconSelected}
    />
  );
}
