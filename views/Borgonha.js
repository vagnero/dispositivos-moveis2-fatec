import React, { useState, useContext, useEffect } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { Text, View, ScrollView } from 'react-native';
import Content from '../components/Content';
import WineItem from '../components/WineItem';
import Wines  from '../components/Wines';
import { handleAddToCart } from '../utils/cartUtils';
import { useUser, addToCart } from '../context/UserContext';

const Borgonha = () => {
  const { colors } = useContext(ThemeContext);
  const { cartItems, setCartItems, cartSuccessMessage, setCartSuccessMessage } = useUser();

  const [filteredWines, setFilteredWines] = useState(
    Wines.filter((wine) => wine.wineCategory === 'Borgonha Branco')
  );

  const handleSearch = (searchText) => {
    // Filtrar com base na busca
    const filtered = Wines.filter(
      (wine) =>
        wine.wineCategory === 'Borgonha Branco' &&
        wine.wineName.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredWines(filtered);
  };

  const styles = {
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: colors.background,
    },

    successMessage: {
      // marginTop: 5,
      fontSize: 14,
      color: 'green',
      fontWeight: 'bold'
    },

    div_bordeaux: {
      marginBottom: 15,
    },

    text_bordeaux: {
      fontSize: 34,
      fontWeight: 'bold',
      textAlign: 'center',
      color: colors.primary,
    },

    container_vinhos: {
      marginBottom: 50,
    },

    noResultsText: {
      fontSize: 18,
      color: '#2D0C57',
      textAlign: 'center',
      marginTop: 20,
    },
  };

  return (
    <Content>
    <View style={styles.container}>
      <View style={styles.div_bordeaux}>
        <Text style={styles.text_bordeaux}>Borgonha</Text>
      </View>

      {cartSuccessMessage && (
        <Text style={styles.successMessage}>{cartSuccessMessage}</Text>
      )}

      {/* Vinhos */}
      <ScrollView vertical showsVerticalScrollIndicator={false}>
        <View style={styles.container_vinhos}>
          {filteredWines.length === 0 ? (
            <Text style={styles.noResultsText}>Nenhum resultado encontrado</Text>
          ) : (
            filteredWines.map((wine, index) => (
              <WineItem
                key={index}
                imageSource={wine.imageSource}
                wineName={wine.wineName}
                price={wine.winePrice}
                ml={wine.ml}
                handleAddToCart={() => handleAddToCart(wine, cartItems, setCartItems, setCartSuccessMessage)} // Passando a função corretamente
              />
            ))
          )}
        </View>
      </ScrollView>
    </View>
    </Content>
  );
};

export default Borgonha;
