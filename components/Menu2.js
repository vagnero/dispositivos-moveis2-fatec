import React, { useEffect, useState, useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { View, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { FontAwesome } from 'react-native-vector-icons';

const Menu2 = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { colors } = useContext(ThemeContext);

  const getIconColor = (routeName) => {
    return route.name === routeName ? 'blue' : colors.iconColor; // Troque 'blue' pela cor desejada para a rota ativa
  };

  const styles = {
    div_menu: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: 60,
      alignItems: 'center',
      justifyContent: 'space-around',
      flexDirection: 'row',
      backgroundColor: colors.background,
    }
  }

  return (
    <View style={styles.div_menu}>
      <TouchableOpacity onPress={() => navigation.navigate('Home')}>
        <FontAwesome name="th-large" size={24} color={getIconColor('Home')} />
      </TouchableOpacity>
    </View>
  );
};

export default Menu2;