import React, { useEffect, useState, useContext } from 'react';
import { ScrollView, View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';
import Content from '../components/Content';
import WineItem from '../components/WineItem';
import { ThemeContext } from '../context/ThemeContext';
import { useUser } from '../context/UserContext';
import { handleAddToCart } from '../utils/cartUtils';

const Favoritos = () => {
  const [favoriteWines, setFavoriteWines] = useState([]);
  const { cartItems, setCartItems, setCartSuccessMessage, cartSuccessMessage, currentUser } = useUser();
  const { colors } = useContext(ThemeContext);

  // Função para carregar os favoritos salvos do SecureStorage
  const loadWines = async () => {
    if (!currentUser || !currentUser.nome) {
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

  // UseEffect para carregar os favoritos quando a tela for montada
  useEffect(() => {
    loadWines();
  }, []);

  const styles = StyleSheet.create({
    content: {
      alignItems: 'center',
      position: 'relative',
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

    successMessageContainer: {
      position: 'absolute',
      top: '10%',
      left: 0,
      right: 0,
      transform: [{ translateY: -20 }], // Ajusta a posição vertical
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 999,
    },
    successMessage: {
      width: '85%',
      fontSize: 15,
      color: 'white',
      padding: 5,
      borderRadius: 10,
      backgroundColor: 'rgba(0, 128, 0, 0.8)',
      fontWeight: 'bold',
      textAlign: 'center',
    },
    card: {
      width: '60%',
      height: 10,
      marginBottom: 200,
      backgroundColor: colors.wineCardBackground,
      flexDirection: 'row',
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 10,
    },

    cards: {
      width: '60%',
      borderRadius: 10,
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 10,
      backgroundColor: colors.wineCardBackground,
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
      {cartSuccessMessage && (
        <View style={styles.successMessageContainer}>
          <Text style={styles.successMessage}>{cartSuccessMessage}</Text>
        </View>
      )}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}
        style={{ flex: 1 }}>
        <View style={styles.content}>
          <Text style={styles.title}>Seus Vinhos Favoritos</Text>
          {!Array.isArray(favoriteWines) || favoriteWines.length === 0 ? (
            <Text style={styles.msg}>Você não tem vinhos favoritos ainda.</Text>
          ) : (
            favoriteWines.map((wine, index) => (
              <View key={wine.id} style={styles.cards}>
                <WineItem
                  wine={wine} // Passando o objeto wine diretamente
                  imageSource={wine.imageSource}
                  wineName={wine.wineName}
                  price={wine.price}
                  ml={wine.ml}
                  handleAddToCart={() =>
                    handleAddToCart(wine, cartItems, setCartItems, setCartSuccessMessage)
                  }
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
