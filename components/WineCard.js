import React, { useContext, useState, useEffect } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { View, Text, Image, TouchableOpacity, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import winesData from '../components/Wines';

const WineCard = ({ wine, onPressAddToCart, updateCartItems }) => {
  const navigation = useNavigation();
  const { colors } = useContext(ThemeContext);
  const [soldCount, setSoldCount] = useState();

  useEffect(() => {
    const fetchWines = async () => {
      try {
        const winesString = await SecureStore.getItemAsync('wines');
        const winesArray = winesString ? JSON.parse(winesString) : [];
        const storedWine = winesArray.find(item => item.wineName === wine.wineName);
  
        // Se encontrar o vinho no SecureStore, utilize os dados armazenados
        if (storedWine) {
          setSoldCount(storedWine.wineSold);
          // Pega os dados restantes do winesData
          const matchingWine = winesData.find(item => item.wineName === wine.wineName);
          if (matchingWine) {
            wine.imageSource = matchingWine.imageSource;
            wine.winePrice = matchingWine.winePrice;          
          }
        } else {
          // Se não houver dados no SecureStore, pega diretamente do winesData
          const matchingWine = winesData.find(item => item.wineName === wine.wineName);
          if (matchingWine) {
            setSoldCount(matchingWine.wineSold || 0); // Use 0 se não houver 'wineSold'
            wine.imageSource = matchingWine.imageSource; // Pega a imagem do vinho
            wine.winePrice = matchingWine.winePrice; // Pega o preço do vinho
          }
        }
      } catch (error) {
        console.error('Erro ao carregar vinhos:', error);
      }
    };
    fetchWines();
  }, [wine.wineName, wine.wineSold]);

  useEffect(() => {
    const checkAndSaveWines = async () => {
      try {
        const winesString = await SecureStore.getItemAsync('wines');
        
        // Verifica se já existem dados salvos
        if (!winesString) {
          // Se não houver dados, salve os dados iniciais
          await saveWines(winesData);
        }
      } catch (error) {
        console.error('Erro ao verificar os vinhos no SecureStore:', error);
      }
    };
  
    checkAndSaveWines();
  }, []);

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



// Função para salvar os vinhos
const saveWines = async (winesData) => {
  try {
    // Filtra os dados para salvar apenas wineName e wineSold
    const filteredData = winesData.map(({ wineName, wineSigns, wineSold }) => ({ wineName, wineSigns, wineSold }));

    // Converte o array filtrado para uma string JSON e salva no SecureStore
    await SecureStore.setItemAsync('wines', JSON.stringify(filteredData));
  } catch (error) {
    console.error('Erro ao salvar os vinhos:', error);
  }
};



export default WineCard;
