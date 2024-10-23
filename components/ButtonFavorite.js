import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import Items from '../components/Items';

const ButtonFavorite = ({ itemName }) => {
  const [isHeartFilled, setIsHeartFilled] = useState(false);
  const [favoriteItems, setFavoriteItems] = useState([]);

  const toggleHeart = async (itemName) => {
    // Obtenha os detalhes completos do item
    const item = getItemDetails(itemName);

    if (isItemFavorite(item.itemName)) {
      // Remove o item dos favoritos
      const updatedFavorites = favoriteItems.filter(favItem => favItem.itemName !== item.itemName);
      setFavoriteItems(updatedFavorites);
      await saveFavoriteItems(updatedFavorites);
    } else {
      // Adiciona o item aos favoritos com os campos essenciais
      const updatedFavorites = [...favoriteItems, {
        itemName: item.itemName,
        itemSold: item.itemSold,
        itemSigns: item.itemSigns,
      }];
      setFavoriteItems(updatedFavorites);
      await saveFavoriteItems(updatedFavorites);
    }

    setIsHeartFilled(!isHeartFilled);
  };

  const isItemFavorite = (itemName) => {
    return favoriteItems.some(favItem => favItem.itemName === itemName);
  };

  const saveFavoriteItems = async (items) => {
    try {
      const jsonValue = JSON.stringify(items);
      await SecureStore.setItemAsync('favorite_items', jsonValue);
    } catch (e) {
      console.error('Error saving favorite items:', e);
    }
  };

  const loadFavoriteItems = async () => {
    try {
      const jsonValue = await SecureStore.getItemAsync('favorite_items');
      return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (e) {
      console.error('Error loading favorite items:', e);
      return [];
    }
  };

  useEffect(() => {
    const fetchFavorites = async () => {
      const storedFavorites = await loadFavoriteItems();
      setFavoriteItems(storedFavorites);
      setIsHeartFilled(storedFavorites.some(favItem => favItem.itemName === itemName));
    };

    fetchFavorites();
  }, []);

  const getItemDetails = (itemName) => {
    const staticItem = Items.find(item => item.itemName === itemName);
    const dynamicItem = favoriteItems.find(favItem => favItem.itemName === itemName);

    if (staticItem && dynamicItem) {
      return { ...staticItem, ...dynamicItem }; // Combina dados estáticos e dinâmicos
    }

    return staticItem || dynamicItem;
  };

  return (
    <View style={{ marginRight: 0, marginTop: 0, marginLeft: 0 }}>
      <FontAwesome
        name={isHeartFilled ? 'heart' : 'heart-o'}
        size={32}
        color='red'
        onPress={() => toggleHeart(itemName)} // Usa o itemName passado como prop
      />
    </View>
  );
};

export default ButtonFavorite;
