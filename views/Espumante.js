import React, { useState, useContext, useEffect } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { Text, View, ScrollView } from 'react-native';
import Content from '../components/Content';
import WineItem from '../components/WineItem';
import Wines from '../components/Wines';
import { handleAddToCart } from '../utils/cartUtils';
import { useUser } from '../context/UserContext';

const Espumante = () => {
  const { colors } = useContext(ThemeContext);
  const { cartItems, setCartItems, cartSuccessMessage, setCartSuccessMessage } = useUser();

  const [filteredWines, setFilteredWines] = useState(
    Wines.filter((wine) => wine.wineCategory === 'Espumante')
  );

  const styles = {
    container: {
      flex: 1,
      position: 'relative',
      padding: 20,
      backgroundColor: colors.background,
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
      width: '90%',
      fontSize: 15,
      color: 'white',
      padding: 10,
      borderRadius: 10,
      backgroundColor: 'rgba(0, 128, 0, 0.4)',
      fontWeight: 'bold',
      textAlign: 'center',
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
        {cartSuccessMessage && (
          <View style={styles.successMessageContainer}>
            <Text style={styles.successMessage}>{cartSuccessMessage}</Text>
          </View>
        )}        
        <View style={styles.div_bordeaux}>
          <Text style={styles.text_bordeaux}>Espumante</Text>
        </View>


        {/* Vinhos */}
        <ScrollView vertical showsVerticalScrollIndicator={false}>
          <View style={styles.container_vinhos}>
            {filteredWines.length === 0 ? (
              <Text style={styles.noResultsText}>Nenhum resultado encontrado</Text>
            ) : (
              filteredWines.map((wine, index) => (
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
              ))
            )}
          </View>
        </ScrollView>
      </View>
    </Content>
  );
};

export default Espumante;
