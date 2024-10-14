import React, { useEffect, useState, useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { View, TouchableOpacity, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useUser } from '../context/UserContext';
import { FontAwesome } from 'react-native-vector-icons';
import { cartState } from './ItemCarrinho';
import eventEmitter from './eventEmitter';

const Menu = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { colors } = useContext(ThemeContext);
  const { currentUser } = useUser();
  const [totalQuantity, setTotalQuantity] = useState(cartState.totalQuantity);

  useEffect(() => {
    // Ouça o evento
    const updateTotal = (total) => {
      setTotalQuantity(total);
    };

    eventEmitter.on('cartUpdated', updateTotal);

    // Cleanup
    return () => {
      eventEmitter.off('cartUpdated', updateTotal);
    };
  }, []);

  console.log("Total de itens no carrinho:" + cartState.totalQuantity);

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

      <TouchableOpacity onPress={() => navigation.navigate('Carrinho')}>
        <FontAwesome name="shopping-cart" size={24} color={getIconColor('Carrinho')} />
      </TouchableOpacity>

      {currentUser ? (
        <TouchableOpacity onPress={() => navigation.navigate('User')}>
          <FontAwesome name="user" size={24} color={getIconColor('User')} />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <FontAwesome name="sign-in" size={24} color={getIconColor('Login')} />
        </TouchableOpacity>
      )
      }
    </View>
  );
};

export default Menu;