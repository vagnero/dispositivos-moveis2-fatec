import React, { useContext, useState, useEffect } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { View, Text, Image, TouchableOpacity, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const WineCard = ({ wine, onPressAddToCart, updateCartItems }) => {
  const navigation = useNavigation();
  const { colors } = useContext(ThemeContext);
  const [soldCount, setSoldCount] = useState(wine.wineSold);

  useEffect(() => {
    const fetchWines = async () => {
      try {
        const winesString = await AsyncStorage.getItem('wines');
        const winesArray = winesString ? JSON.parse(winesString) : [];
        const updatedWine = winesArray.find(item => item.wineName === wine.wineName);
        if (updatedWine) {
          setSoldCount(updatedWine.wineSold);
        }
      } catch (error) {
        console.error('Erro ao carregar os vinhos:', error);
      }
    };

    fetchWines();
  }, [wine.wineName]);

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
      flexDirection: 'row',
    },
    div_image_vinho: {
      width: 50,
      height: 120,
    },
    div_text_vinho: {
      width: '90%',
      textAlign: 'center',
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
      <Text style={styles.div_text_vinho} onPress={() => navigation.navigate('Sobre', wine)}>{wine.wineName}</Text>
      <TouchableOpacity onPress={() => navigation.navigate('Sobre', wine)}>
        <View style={styles.div_image_text_vinho}>
          <Image source={wine.imageSource} style={styles.div_image_vinho} />
          <View>
            <Text>Vendidos: {soldCount}</Text>
            <Text>Rate: {wine.wineSigns}
              <Image source={require('../assets/info/signs.png')} style={styles.image_signs} />
            </Text>
          </View>
        </View>
      </TouchableOpacity>
      <View style={styles.div_text_button_vinho}>
        <Text style={styles.div_text_preco}>{wine.winePrice}</Text>
        <TouchableOpacity onPress={() => onPressAddToCart({ ...wine, imageSource: wine.imageSource, quantity: 1 }, updateCartItems)} style={styles.addButton}>
          <Image source={require('../assets/home/plus.png')} style={{ marginBottom: 10 }} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default WineCard;
