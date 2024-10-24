import React, { useState, useContext, useEffect } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { Text, View, ScrollView } from 'react-native';
import Content from '../components/Content';
import Product from '../components/Product';
import Items from '../components/Items';
import { handleAddToCart } from '../utils/cartUtils';
import { useUser } from '../context/UserContext';

const Espumante = () => {
  const { colors } = useContext(ThemeContext);
  const { cartItems, setCartItems, cartSuccessMessage, setCartSuccessMessage } = useUser();

  const [filteredItems, setFilteredItems] = useState(
    Items.filter((item) => item.itemCategory === 'Espumante')
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
    div_categoria: {
      marginBottom: 15,
    },
    text_categoria: {
      fontSize: 34,
      fontWeight: 'bold',
      textAlign: 'center',
      color: colors.primary,
    },
    container_items: {
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
        <View style={styles.div_categoria}>
          <Text style={styles.text_categoria}>Espumante</Text>
        </View>
        
        <ScrollView vertical showsVerticalScrollIndicator={false}>
          <View style={styles.container_items}>
            {filteredItems.length === 0 ? (
              <Text style={styles.noResultsText}>Nenhum resultado encontrado</Text>
            ) : (
              filteredItems.map((item, index) => (
                <Product
                  key={index}
                  item={item} // Passando o objeto item diretamente
                  imageSource={item.imageSource}
                  itemName={item.itemName}
                  price={item.itemPrice}
                  ml={item.ml}
                  handleAddToCart={() =>
                    handleAddToCart(item, cartItems, setCartItems, setCartSuccessMessage)
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
