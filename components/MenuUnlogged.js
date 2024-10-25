import React, { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { View, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { FontAwesome } from 'react-native-vector-icons';
import { useUser } from '../context/UserContext';

const MenuUnlogged = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { colors } = useContext(ThemeContext);
  const { setCurrentUser } = useUser();

  const getIconColor = (routeName) => {
    return route.name === routeName ? 'blue' : colors.iconColor; // Troque 'blue' pela cor desejada para a rota ativa
  };

  const handleHome = () => {
    setCurrentUser(null); // Limpa o usuário atual
    navigation.navigate('Home')
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
      <TouchableOpacity onPress={handleHome}>
        <FontAwesome name="th-large" size={24} color={getIconColor('Home')} />
      </TouchableOpacity>
    </View>
  );
};

export default MenuUnlogged;