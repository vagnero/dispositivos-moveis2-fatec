import React, { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { View, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Menu = () => {
  const navigation = useNavigation();
  const { colors } = useContext(ThemeContext);

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
        <Image source={require('../assets/home/grid.png')} tintColor={ colors.icon }/>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Carrinho')}>
        <Image source={require('../assets/home/shopping-cart.png')} tintColor={ colors.iconColor }/>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('User')}>
        <Image source={require('../assets/home/user.png')} tintColor={ colors.iconColor }/>
      </TouchableOpacity>
    </View>
  );
};

export default Menu;