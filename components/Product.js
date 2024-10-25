import React, { useContext, useState, useEffect } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { View, Text, Image, TouchableOpacity, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import Items from './Items';
import { useUser } from '../context/UserContext';
import { collection, setDoc, doc, getDocs, deleteDoc } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

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
      await removeFavoriteItem(item.itemName);
    } else {
      // Adiciona aos favoritos
      updatedFavorites = [...favoriteItems, item];

      // Salva no Firestore
      await saveFavoriteItems(updatedFavorites);
    }

    setFavoriteItems(updatedFavorites); // Atualiza o estado
  };

  const removeFavoriteItem = async (itemName) => {
    try {
      const itemDoc = doc(db, 'favoriteItems', `${itemName}_${currentUser.nome}`);
      await deleteDoc(itemDoc);
      console.log(`item ${itemName} removido dos favoritos no Firestore.`);
    } catch (error) {
      console.error('Erro ao remover item do Firestore:', error);
    }
  };

  const isItemFavorite = (item) => {
    return favoriteItems.some((favItem) => favItem.itemName === item.itemName);
  };

  const saveFavoriteItems = async (items) => {
    // Verifica se currentUser e currentUser.nome estão definidos
    if (!currentUser || !currentUser.nome) {
      return; // Sai da função se o usuário não estiver definido
    }

    try {
      const itemCollection = collection(db, 'favoriteItems');

      // Salva cada item como um documento individual
      for (const item of Items) {
        const itemData = {
          itemName: item.itemName || '',
          price: item.itemPrice || item.price,
          ml: item.ml || '',
          imageSource: item.imageSource || '',
        };

        // Usando o itemName e o userName como chave para evitar duplicatas
        await setDoc(doc(itemCollection, `${item.itemName}_${currentUser.nome}`), itemData);
      }
      console.log('Items favoritos salvos no Firestore.');
    } catch (error) {
      console.error('Erro ao salvar items no Firestore:', error);
    }
  };

  // Função para carregar os items favoritos do usuário atual
  const loadItems = async () => {
    if (!currentUser || !currentUser.nome) {
      return; // Sai da função se o usuário não estiver definido
    }

    try {
      const itemCollection = collection(db, 'favoriteItems');
      const querySnapshot = await getDocs(itemCollection);

      // Verifica se existem documentos na coleção
      if (querySnapshot.empty) {
        console.log('Nenhum item favorito encontrado no Firestore.');
        setFavoriteItems([]); // Define a lista de items favoritos como vazia
        return; // Sai da função se não houver items
      }

      // Mapeia os documentos carregados para um array de dados
      const loadedItems = querySnapshot.docs
        .map((doc) => ({
          id: doc.id, // Inclui o ID do documento se necessário
          ...doc.data(),
        }))
        .filter((item) => item.id.endsWith(`_${currentUser.nome}`)); // Filtra pelos items do usuário

      // Atualiza o estado com os items carregados
      setFavoriteItems(loadedItems);
    } catch (error) {
      console.error('Erro ao carregar items do Firestore:', error);
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
      width: 70,
      height: 40,
      backgroundColor: '#FFFFFF',
      borderRadius: 10,
      borderWidth: 1,
      borderColor: '#D9D0E3',
      justifyContent: 'center',
      alignItems: 'center'
    },
    button_carrinho: {
      width: 70,
      height: 40,
      backgroundColor: '#6C30EB',
      marginLeft: '1%',
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
              size={32}
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