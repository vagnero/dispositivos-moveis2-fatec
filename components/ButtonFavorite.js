import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import Wines from '../components/Wines';

const ButtonFavorite = ({ wineName }) => {
  const [isHeartFilled, setIsHeartFilled] = useState(false);
  const [favoriteWines, setFavoriteWines] = useState([]);

  const toggleHeart = async (wineName) => {
    // Obtenha os detalhes completos do vinho
    const wine = getWineDetails(wineName);

    if (isWineFavorite(wine.wineName)) {
      // Remove o vinho dos favoritos
      const updatedFavorites = favoriteWines.filter(favWine => favWine.wineName !== wine.wineName);
      setFavoriteWines(updatedFavorites);
      await saveFavoriteWines(updatedFavorites);
    } else {
      // Adiciona o vinho aos favoritos com os campos essenciais
      const updatedFavorites = [...favoriteWines, {
        wineName: wine.wineName,
        wineSold: wine.wineSold,
        wineSigns: wine.wineSigns,
      }];
      setFavoriteWines(updatedFavorites);
      await saveFavoriteWines(updatedFavorites);
    }

    setIsHeartFilled(!isHeartFilled);
  };

  const isWineFavorite = (wineName) => {
    return favoriteWines.some(favWine => favWine.wineName === wineName);
  };

  const saveFavoriteWines = async (wines) => {
    try {
      const jsonValue = JSON.stringify(wines);
      await SecureStore.setItemAsync('favorite_wines', jsonValue);
    } catch (e) {
      console.error('Error saving favorite wines:', e);
    }
  };

  const loadFavoriteWines = async () => {
    try {
      const jsonValue = await SecureStore.getItemAsync('favorite_wines');
      return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (e) {
      console.error('Error loading favorite wines:', e);
      return [];
    }
  };

  useEffect(() => {
    const fetchFavorites = async () => {
      const storedFavorites = await loadFavoriteWines();
      setFavoriteWines(storedFavorites);
      setIsHeartFilled(storedFavorites.some(favWine => favWine.wineName === wineName));
    };

    fetchFavorites();
  }, []);

  const getWineDetails = (wineName) => {
    const staticWine = Wines.find(wine => wine.wineName === wineName);
    const dynamicWine = favoriteWines.find(favWine => favWine.wineName === wineName);

    if (staticWine && dynamicWine) {
      return { ...staticWine, ...dynamicWine }; // Combina dados estáticos e dinâmicos
    }

    return staticWine || dynamicWine;
  };

  return (
    <View style={{ marginRight: 0, marginTop: 0, marginLeft: 0 }}>
      <FontAwesome
        name={isHeartFilled ? 'heart' : 'heart-o'}
        size={32}
        color='red'
        onPress={() => toggleHeart(wineName)} // Usa o wineName passado como prop
      />
    </View>
  );
};

export default ButtonFavorite;
