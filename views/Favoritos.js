import React, { useEffect, useState, useContext } from 'react';
import { ScrollView, View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';
import Content from '../components/Content';
import WineItem from '../components/WineItem';
import { ThemeContext } from '../context/ThemeContext';
import { useUser, addToCart } from '../context/UserContext';
import { handleAddToCart } from '../utils/cartUtils';

const Favoritos = () => {
  const [favoriteWines, setFavoriteWines] = useState([]);
  const { currentUser, cartItems, updateCartItems, setCartItems, setCartSuccessMessage, cartSuccessMessage } = useUser();
  const { colors } = useContext(ThemeContext);

  // Função para carregar os favoritos salvos do SecureStorage
  const loadFavoriteWines = async () => {
    try {
      const wineCollection = collection(db, 'favoriteWines');
      const querySnapshot = await getDocs(wineCollection);

      const loadedWines = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Verifica se loadedWines é um array e então atualiza o estado
      if (Array.isArray(loadedWines)) {
        console.log('Sucesso ao carregar os Favoritos');
        setFavoriteWines(loadedWines);
      } else {
        setFavoriteWines([]); // Se não for um array, define como vazio
      }
    } catch (error) {
      console.error('Erro ao carregar vinhos do Firestore:', error);
      setFavoriteWines([]); // Define como vazio em caso de erro
    }
  };

  // UseEffect para carregar os favoritos quando a tela for montada
  useEffect(() => {
    loadFavoriteWines();
  }, []);    

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
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}
        style={{ flex: 1, marginBottom: 50 }}>
        <View style={styles.content}>
          <Text style={styles.title}>Seus Vinhos Favoritos</Text>
          {cartSuccessMessage && (
            <Text style={styles.successMessage}>{cartSuccessMessage}</Text>
          )}
          {!Array.isArray(favoriteWines) || favoriteWines.length === 0 ? (
            <Text style={styles.msg}>Você não tem vinhos favoritos ainda.</Text>
          ) : (
            favoriteWines.map((wine, index) => (
              <View style={styles.cards}>
                <WineItem
                  key={index}
                  wine={wine} // Passando o objeto wine diretamente
                  imageSource={wine.imageSource}
                  wineName={wine.wineName}
                  price={wine.winePrice}
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
