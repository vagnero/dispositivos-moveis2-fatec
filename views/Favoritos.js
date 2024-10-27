import React, { useEffect, useState, useContext } from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import dbContext from '../context/dbContext';
import Items from '../components/Items';
import Content from '../components/Content';
import Product from '../components/Product';
import { ThemeContext } from '../context/ThemeContext';
import { useUser } from '../context/UserContext';
import { handleAddToCart } from '../utils/cartUtils';

const Favoritos = () => {
  const [favoriteItems, setFavoriteItems] = useState([]);
  const { cartItems, setCartItems, setCartSuccessMessage, cartSuccessMessage, currentUser } = useUser();
  const { colors } = useContext(ThemeContext);

  // Função para carregar os favoritos salvos do SecureStorage
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
  
  // UseEffect para carregar os favoritos quando a tela for montada
  useEffect(() => {
    loadItems();
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
    cards: {
      width: '60%',
      borderRadius: 10,
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 10,
      backgroundColor: colors.itemCardBackground,
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
          <Text style={styles.title}>Seus Produtos Favoritos</Text>
          {!Array.isArray(favoriteItems) || favoriteItems.length === 0 ? (
            <Text style={styles.msg}>Você não tem items favoritos ainda.</Text>
          ) : (
            favoriteItems.map((item, index) => (
              <View key={item.id} style={styles.cards}>
                <Product
                  item={item} // Passando o objeto item diretamente
                  imageSource={item.imageSource}
                  itemName={item.itemName}
                  price={item.itemPrice}
                  ml={item.ml}
                  handleAddToCart={() =>
                    handleAddToCart(item, cartItems, setCartItems, setCartSuccessMessage)
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
