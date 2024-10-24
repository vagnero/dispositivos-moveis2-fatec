import React, { useContext, useState, useEffect } from 'react';
import { Text, View, Image, TouchableOpacity } from 'react-native';
import { ThemeContext } from '../context/ThemeContext';
export const cartState = { totalQuantity: 0 }; // Objeto externo para armazenar totalQuantity

const ItemCarrinho = ({ itemName, price, imageSource, quantity, removeFromCart, setCartItems, cartItems, calculateTotal }) => {
  const { colors } = useContext(ThemeContext);
  const [totalQuantity, setTotalQuantity] = useState(0);

  // Função para calcular a quantidade total de itens no carrinho
  const calculateItens = () => {
    const total = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    setTotalQuantity(total);
    cartState.totalQuantity = total; // ZEZIN PARA MANDAR QUALQUER COISA PARA OUTRA PAGINA, CRIE UM OBJETO AAAAA
  };

  useEffect(() => {
    calculateItens(); // Atualiza a quantidade total ao carregar ou modificar o carrinho
  }, [cartItems]);


  const handleAddQuantity = () => {
    setCartItems(cartItems.map((item) => {
      if (item.itemName === itemName) {
        return { ...item, quantity: item.quantity + 1 };
      }
      return item;
    }));
    calculateTotal(); // Recalcula o total
  };

  const handleRemoveQuantity = () => {
    if (quantity > 1) {
      setCartItems(cartItems.map((item) => {
        if (item.itemName === itemName) {
          return { ...item, quantity: item.quantity - 1 };
        }
        return item;
      }));
      calculateTotal(); // Recalcula o total
    }
  };

  const handleRemoveFromCart = () => {
    removeFromCart(itemName);
    calculateTotal(); // Recalcula o total
  };
  
  const styles = {
    div_item: {
      flexDirection: 'row',
      backgroundColor: colors.itemCardBackground,
      borderRadius: 10,
      width: '100%',
      paddingLeft: 20,
      paddingRight: 20,
      marginBottom: 10
    },
    image: {
      width: 70,
      height: 70,
      marginRight: 10,
      borderRadius: 10
    },
    infoContainer: {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'space-between'
    },
    div_itemname_x: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    text_itemname: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#000'
    },
    icon: {
      width: 20,
      height: 21
    },
    div_price_buttons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 10
    },
    text_price: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#311753'
    },
    div_buttons: {
      flexDirection: 'row',
      alignItems: 'center'
    },
    quantity: {
      marginHorizontal: 10,
      fontSize: 16,
      fontWeight: 'bold',
      color: '#000'
    }
  };

  return (
    <View style={styles.div_item}>
      <Image source={imageSource} style={styles.image} />
      <View style={styles.infoContainer}>
        <View style={styles.div_itemname_x}>
          <Text style={styles.text_itemname}>{itemName}</Text>
          <TouchableOpacity onPress={handleRemoveFromCart}>
            <Image source={require('../assets/carrinho/x.png')} style={styles.icon} />
          </TouchableOpacity>
        </View>
        <View style={styles.div_price_buttons}>
          <Text style={styles.text_price}>{price}</Text>
          <View style={styles.div_buttons}>
            <TouchableOpacity onPress={handleRemoveQuantity}>
              <Image source={require('../assets/carrinho/menos.png')} style={styles.icon} />
            </TouchableOpacity>
            <Text style={styles.quantity}>{quantity}</Text>
            <TouchableOpacity onPress={handleAddQuantity}>
              <Image source={require('../assets/carrinho/plus.png')} style={styles.icon} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default ItemCarrinho;
