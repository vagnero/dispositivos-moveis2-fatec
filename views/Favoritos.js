import React, { useEffect, useState, useContext } from 'react';
import { ScrollView, View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Content from '../components/Content';
import WineCard from '../components/WineCard';
import { ThemeContext } from '../context/ThemeContext';
import { useUser, addToCart } from '../context/UserContext';

const Favoritos = () => {
  const [favoriteWines, setFavoriteWines] = useState([]);
  const { currentUser, cartItems, updateCartItems, setCartItems, setCartSuccessMessage, cartSuccessMessage } = useUser();
  const { colors } = useContext(ThemeContext);

  // Função para carregar os favoritos salvos do AsyncStorage
  const loadFavoriteWines = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('@favorite_wines');
      return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (e) {
      console.error('Erro ao carregar favoritos:', e);
      return [];
    }
  };

  // UseEffect para carregar os favoritos quando a tela for montada
  useEffect(() => {
    const fetchFavorites = async () => {
      const storedFavorites = await loadFavoriteWines();
      setFavoriteWines(storedFavorites);
    };

    fetchFavorites();
  }, []);

  // Função para remover um vinho dos favoritos
  const removeFavoriteWine = async (wineToRemove) => {
    const updatedFavorites = favoriteWines.filter(wine => wine.wineName !== wineToRemove.wineName);
    setFavoriteWines(updatedFavorites);
    await AsyncStorage.setItem('@favorite_wines', JSON.stringify(updatedFavorites));
  };

  const handleAddToCart = (item) => {
    const existingItem = cartItems.find((i) => i.wineName === item.wineName);
    if (existingItem) {
      // Se o vinho já existe, atualiza a quantidade
      const updatedItems = cartItems.map((i) =>
        i.wineName === item.wineName
          ? { ...i, quantity: i.quantity + 1 } // Incrementa a quantidade
          : i
      );
      setCartItems(updatedItems);
      setCartSuccessMessage('Quantidade do produto atualizada no carrinho!');
      setTimeout(() => {
        setCartSuccessMessage('');
      }, 2000);
    } else {
      // Se o vinho não existe, adiciona ao carrinho
      setCartItems([...cartItems, { ...item, quantity: 1 }]);
      setCartSuccessMessage('Produto adicionado ao carrinho com sucesso!');
      setTimeout(() => {
        setCartSuccessMessage('');
      }, 2000);
    }
  };

  const styles = StyleSheet.create({
    content: {
      alignItems: 'center',
      textAlign: 'center',
      margin: 'auto',
      justifyContent: 'center',
      flex: 1,
      padding: 10
    },

    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 10,
      color: colors.textColor,
      textAlign: 'center',
    },

    successMessage: {
      fontSize: 14,
      color: 'green',
      fontWeight: 'bold'
    },

    card: {
      width: '60%',
      marginBottom: 20,
      backgroundColor: colors.wineCardBackground,
      flexDirection: 'row',
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
    },

    msg: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 10,
      color: colors.textColor,
      textAlign: 'center',
    },
  })

  return (
    <Content>
      <ScrollView>
        <View style={styles.content}>
          <Text style={styles.title}>Seus Vinhos Favoritos</Text>
          {cartSuccessMessage && (
            <Text style={styles.successMessage}>{cartSuccessMessage}</Text>
          )}
          {favoriteWines.length === 0 ? (
            <Text style={styles.msg}>Você não tem vinhos favoritos ainda.</Text>
          ) : (
            favoriteWines.map((wine, index) => (
              <View key={index} style={styles.card}>
                <WineCard key={index} wine={wine} onPressAddToCart={handleAddToCart} />

                {/* Ícone do coração para desmarcar o vinho como favorito */}
                <FontAwesome
                  name="heart"
                  size={32}
                  color="red"
                  onPress={() => removeFavoriteWine(wine)}
                />
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </Content>
  );
};

export default Favoritos;
