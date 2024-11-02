import React, { useContext, useState, useEffect } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { View, Text, Image, TouchableOpacity, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useUser } from '../context/UserContext';
import dbContext from '../context/dbContext';
import Items from '../components/Items';

const Product = ({ item, imageSource, itemName, price, ml, handleAddToCart }) => {
  const { colors } = useContext(ThemeContext);
  const [favoriteItems, setFavoriteItems] = useState([]);
  const { currentUser } = useUser();

  const toggleHeart = async (item) => {
    if (!currentUser || !currentUser.nome) {
      Alert.alert('Para Favoritar é necessário estar logado');
      return; // Sai da função se o usuário não estiver definido
    }

    let updatedFavorites;

    if (isItemFavorite(item)) {
      // Remove dos favoritos
      updatedFavorites = favoriteItems.filter((favItem) => favItem.itemName !== item.itemName);

      // Remove do Firestore
      removeFavoriteItem(item.itemName);
    } else {
      // Adiciona aos favoritos
      updatedFavorites = [...favoriteItems, item];

      // Salva no Firestore
      saveFavoriteItems(updatedFavorites);
    }

    setFavoriteItems(updatedFavorites); // Atualiza o estado
  };

  const removeFavoriteItem = (itemName) => {
    try {
      // Define o ID único do item
      const itemId = `${itemName}_${currentUser.nome}`;
  
      // Remove o item do dbContext
      dbContext.removeItem('favoriteItems', itemId);
  
      // Atualiza o estado
      setFavoriteItems((prevFavorites) => 
        prevFavorites.filter((favItem) => favItem.itemName !== itemName)
      );
  
      console.log(`Item ${itemName} removido dos favoritos.`);
    } catch (error) {
      console.error('Erro ao remover item dos favoritos:', error);
    }
  };
  
  const isItemFavorite = (item) => {
    return favoriteItems.some((favItem) => favItem.itemName === item.itemName);
  };

  const saveFavoriteItems = (items) => {
    if (!currentUser || !currentUser.nome) {
      return; // Sai da função se o usuário não estiver definido
    }
  
    try {
      items.forEach((item) => {
        const favoriteItem = {
          itemName: item.itemName, // Apenas o itemName é salvo
          id: `${item.itemName}_${currentUser.nome}`, // Usando itemName e nome do usuário como chave
        };
  
        // Adiciona o item ao dbContext
        dbContext.addItem('favoriteItems', favoriteItem);
      });
  
      // Atualiza o estado com todos os itens favoritos (apenas com itemName)
      setFavoriteItems((prevFavorites) => [
        ...prevFavorites,
        ...items.map((item) => ({
          itemName: item.itemName,
          id: `${item.itemName}_${currentUser.nome}`,
        })),
      ]);
  
      console.log('Itens favoritos salvos.');
    } catch (error) {
      console.error('Erro ao salvar itens favoritos:', error);
    }
  };
  
  // Função para carregar os items favoritos do usuário atual
  const loadItems = () => {
    if (!currentUser || !currentUser.nome) {
      return; // Sai da função se o usuário não estiver definido
    }
  
    try {
      const allFavoriteItems = dbContext.getAll('favoriteItems'); // Acesse todos os itens favoritos do dbContext
  
      // Filtra pelos itens do usuário
      const loadedItems = allFavoriteItems.filter((item) => 
        item.id.endsWith(`_${currentUser.nome}`)
      );
  
      // Mapeia os itens carregados para incluir todos os atributos
      const detailedItems = loadedItems.map((favItem) => {
        const originalItem = Items.find((item) => item.itemName === favItem.itemName);
        return {
          ...favItem,
          ...originalItem, // Adiciona os atributos do item original
        };
      });
  
      // Atualiza o estado com os itens carregados
      setFavoriteItems(detailedItems);
    } catch (error) {
      console.error('Erro ao carregar itens favoritos:', error);
    }
  };
  
  // Chama a função ao montar o componente
  useEffect(() => {
    loadItems();
  }, []);

  const styles = {
    div_item: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '5%'
    },
    image_item: {
      width: '30%',
      height: '100%',
      borderRadius: 10
    },

    div_infos: {
      width: '100%',
      marginLeft: '5%'
    },
    text_item: {
      fontSize: 17,
      color: colors.primary,
      fontWeight: 'bold',
      width: '40%'
    },
    div_preco_tamanho: {
      flex: 1,
      flexDirection: 'row',
      marginTop: '2%'
    },
    text_preco: {
      fontSize: 20,
      color: colors.primary,
    },
    text_tamanho: {
      fontSize: 14,
      color: colors.textColor,
      marginLeft: '5%'
    },
    div_buttons: {
      flexDirection: 'row',
    },
    button_favorite: {
      width: 60,
      height: 30,
      backgroundColor: '#6C30EB',
      borderRadius: 10,
      borderWidth: 1,
      borderColor: '#D9D0E3',
      justifyContent: 'center',
      alignItems: 'center'
    },
    button_carrinho: {
      width: 60,
      height: 30,
      backgroundColor: '#6C30EB',
      marginLeft: '2%',
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center'
    }
  };

  return (
    <View style={styles.div_item}>
      <Image source={imageSource} style={styles.image_item} />
      <View style={styles.div_infos}>
        <Text style={styles.text_item}>{itemName}</Text>
        <View style={styles.div_preco_tamanho}>
          <Text style={styles.text_preco}>{price}</Text>
          <Text style={styles.text_tamanho}>{ml}</Text>
        </View>
        <View style={styles.div_buttons}>
          <TouchableOpacity
            style={styles.button_favorite}
            onPress={() => toggleHeart({ itemName, price, ml, imageSource })}
          >
            <FontAwesome
              name={isItemFavorite({ itemName, price, ml, imageSource }) ? 'heart' : 'heart-o'}
              size={20}
              color='red'
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button_carrinho} onPress={handleAddToCart}>
            <Image source={require('../assets/info/shopping-cart.png')} />
          </TouchableOpacity>
        </View>
      </View>
    </View >
  );
};

export default Product;