import React, { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { View, Text, Image, TouchableOpacity, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const WineCard = ({ wine, onPressAddToCart, updateCartItems }) => {
  // console.log('WineCard rendered with wine:', wine);
  const navigation = useNavigation();
  const { colors } = useContext(ThemeContext);

  const styles = {
    div_vinho: {
      width: 150,
      height: 210,
      backgroundColor: colors.wineCardBackground,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 10,
      marginLeft: 15,
      marginRight: 5,
      marginTop: 5,
      marginBottom: 10,
      ...Platform.select({
        ios: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.3,
          shadowRadius: 4,
        },
        android: {
          elevation: 4,
        },
      }),
    },
    div_image_text_vinho: {
      alignItems: 'center',
    },
    div_image_vinho: {
      width: 50,
      height: 120,
    },
    div_text_vinho: {
      width: 120,
      fontSize: 15,
      color: '#2D0C57',
      fontWeight: 'bold',
      marginTop: 10,
      marginHorizontal: 1,
    },
    div_text_button_vinho: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 10,
    },
    div_text_preco: {
      fontSize: 16,
      color: '#32343E',
      fontWeight: 'bold',
    },
    addButton: {
      marginLeft: 10, // Adicionando margem para separar o botão do preço
    },
  };

  return (
    <View style={styles.div_vinho}>
      <View style={styles.div_image_text_vinho}>
        <Text style={styles.div_text_vinho}>{wine.wineName}</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Sobre', wine)}>
          <Image source={wine.imageSource} style={styles.div_image_vinho} />
        </TouchableOpacity>
      </View>
      <View style={styles.div_text_button_vinho}>
        <Text style={styles.div_text_preco}>{wine.winePrice}</Text>
        <TouchableOpacity onPress={() => onPressAddToCart({...wine, imageSource: wine.imageSource, quantity: 1 }, updateCartItems)} style={styles.addButton}>
          <Image source={require('../assets/home/plus.png')} style={{ marginBottom: 10 }} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default WineCard;
