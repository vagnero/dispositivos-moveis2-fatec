import React, { useContext, useState, useEffect } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { View, Text, Image, TouchableOpacity, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import Wines from './Wines';
import { useUser } from '../context/UserContext';
import { collection, setDoc, doc, getDocs, deleteDoc } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

const WineItem = ({ wine, imageSource, wineName, price, ml, handleAddToCart }) => {
  const { colors } = useContext(ThemeContext);
  const [favoriteWines, setFavoriteWines] = useState([]);
  const { currentUser } = useUser();

  const toggleHeart = async (wine) => {
    if (!currentUser || !currentUser.nome) {
      Alert.alert('Para Favoritar é necessário estar logado');
      return; // Sai da função se o usuário não estiver definido
    }

    let updatedFavorites;

    if (isWineFavorite(wine)) {
      // Remove dos favoritos
      updatedFavorites = favoriteWines.filter((favWine) => favWine.wineName !== wine.wineName);

      // Remove do Firestore
      await removeFavoriteWine(wine.wineName);
    } else {
      // Adiciona aos favoritos
      updatedFavorites = [...favoriteWines, wine];

      // Salva no Firestore
      await saveFavoriteWines(updatedFavorites);
    }

    setFavoriteWines(updatedFavorites); // Atualiza o estado
  };

  const removeFavoriteWine = async (wineName) => {
    try {
      const wineDoc = doc(db, 'favoriteWines', `${wineName}_${currentUser.nome}`);
      await deleteDoc(wineDoc);
      console.log(`Vinho ${wineName} removido dos favoritos no Firestore.`);
    } catch (error) {
      console.error('Erro ao remover vinho do Firestore:', error);
    }
  };

  const isWineFavorite = (wine) => {
    return favoriteWines.some((favWine) => favWine.wineName === wine.wineName);
  };

  const saveFavoriteWines = async (wines) => {
    // Verifica se currentUser e currentUser.nome estão definidos
    if (!currentUser || !currentUser.nome) {
      console.error('Usuário atual não está definido ou não possui um nome.');
      return; // Sai da função se o usuário não estiver definido
    }

    try {
      const wineCollection = collection(db, 'favoriteWines');

      // Salva cada vinho como um documento individual
      for (const wine of wines) {
        const wineData = {
          wineName: wine.wineName || '',
          price: wine.winePrice || wine.price,
          ml: wine.ml || '',
          imageSource: wine.imageSource || '',
        };

        // Usando o wineName e o userName como chave para evitar duplicatas
        await setDoc(doc(wineCollection, `${wine.wineName}_${currentUser.nome}`), wineData);
      }
      console.log('Vinhos favoritos salvos no Firestore.');
    } catch (error) {
      console.error('Erro ao salvar vinhos no Firestore:', error);
    }
  };

  // Função para carregar os vinhos favoritos do usuário atual
  const loadWines = async () => {
    if (!currentUser || !currentUser.nome) {
      console.log('Usuário atual não está definido ou não possui um nome.');
      return; // Sai da função se o usuário não estiver definido
    }

    try {
      const wineCollection = collection(db, 'favoriteWines');
      const querySnapshot = await getDocs(wineCollection);

      // Verifica se existem documentos na coleção
      if (querySnapshot.empty) {
        console.log('Nenhum vinho favorito encontrado no Firestore.');
        setFavoriteWines([]); // Define a lista de vinhos favoritos como vazia
        return; // Sai da função se não houver vinhos
      }

      // Mapeia os documentos carregados para um array de dados
      const loadedWines = querySnapshot.docs
        .map((doc) => ({
          id: doc.id, // Inclui o ID do documento se necessário
          ...doc.data(),
        }))
        .filter((wine) => wine.id.endsWith(`_${currentUser.nome}`)); // Filtra pelos vinhos do usuário

      // Atualiza o estado com os vinhos carregados
      setFavoriteWines(loadedWines);
    } catch (error) {
      console.error('Erro ao carregar vinhos do Firestore:', error);
    }
  };

  // Chama a função ao montar o componente
  useEffect(() => {
    loadWines();
  }, []);

  const styles = {
    div_vinho: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '5%'
    },

    image_vinho: {
      width: '30%',
      height: '100%',
      borderRadius: 10
    },

    div_infos: {
      width: '100%',
      marginLeft: '5%'
    },

    text_vinho: {
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
    <View style={styles.div_vinho}>
      <Image source={imageSource} style={styles.image_vinho} />
      <View style={styles.div_infos}>
        <Text style={styles.text_vinho}>{wineName}</Text>
        <View style={styles.div_preco_tamanho}>
          <Text style={styles.text_preco}>{price}</Text>
          <Text style={styles.text_tamanho}>{ml}</Text>
        </View>
        <View style={styles.div_buttons}>
          <TouchableOpacity
            style={styles.button_favorite}
            onPress={() => toggleHeart({ wineName, price, ml, imageSource })}
          >
            <FontAwesome
              name={isWineFavorite({ wineName, price, ml, imageSource }) ? 'heart' : 'heart-o'}
              size={32}
              color='red'
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button_carrinho} onPress={handleAddToCart}>
            <Image source={require('../assets/bordeaux/shopping-cart.png')} />
          </TouchableOpacity>
        </View>
      </View>
    </View >
  );
};

export default WineItem;