import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ItemCarrinho from '../components/ItemCarrinho';
import { useUser } from './UserContext';

const Carrinho = () => {
  const navigation = useNavigation();
  const { cartItems, removeFromCart, cartSuccessMessage } = useUser();
  const { updateCartItems } = useUser();
  const [total, setTotal] = useState(0.0);

  const calculateTotal = () => {
    console.log('Total Calculado...');
    let total = 0;
    cartItems.forEach((item) => {
      // Remover caracteres não numéricos, exceto o ponto decimal
      const priceString = item.winePrice.replace(/[^\d.,-]/g, '').replace(',', '.');
      const price = parseFloat(priceString);
      const quantity = item.quantity;
      console.log(`Item: ${item.wineName}, Preço: ${price}, Quantidade: ${quantity}`);

      if (isNaN(price) || isNaN(quantity)) {
        console.error(`Valor inválido detectado - Preço: ${price}, Quantidade: ${quantity}`);
        return;
      }

      total += price * quantity;
    });
    console.log('Total calculado:', total);
    setTotal(total);
  };

  useEffect(() => {
    calculateTotal();
  }, [cartItems]);

  useEffect(() => {
    if (cartSuccessMessage) {
      const timer = setTimeout(() => {
        // Clean up the success message after 2 seconds
        setCartSuccessMessage('');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [cartSuccessMessage]);

  return (
    <View style={styles.container}>
      <Text style={styles.text_title}>Carrinho</Text>
      {cartSuccessMessage && (
        <Text style={styles.successMessage}>{cartSuccessMessage}</Text>
      )}
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {cartItems.map((item, index) => (
          <ItemCarrinho
            key={index}
            wineName={item.wineName}
            price={item.winePrice}
            imageSource={item.imageSource}
            quantity={item.quantity}
            removeFromCart={removeFromCart}
            updateCartItems={updateCartItems}
            cartItems={cartItems}
            calculateTotal={calculateTotal}
          />
        ))}
      </ScrollView>
      <View style={styles.div_conteudo_price}>
        <View style={styles.div_text_price_total}>
          <Text style={styles.text_total}>Total: </Text>
          <Text style={styles.text_price}>R$ {total.toFixed(2)}</Text>
        </View>
        <TouchableOpacity style={styles.button_finalizar_pedido} onPress={() => navigation.navigate('AvaliacaoFinal')}>
          <Text style={styles.text_pedido}>FINALIZAR PEDIDO</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#F6F5F5',
    alignItems: 'center'
  },
  text_title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2D0C57',
    marginTop: '5%',
    marginBottom: '5%'
  },
  scrollViewContent: {
    flexDirection: 'column',
    width: '100%'
  },
  div_conteudo_price: {
    width: '100%',
    height: '30%',
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center'
  },
  div_text_price_total: {
    flexDirection: 'row',
    alignItems: 'center', // Garantir que o texto e o valor estejam alinhados verticalmente
    justifyContent: 'center', // Adiciona alinhamento horizontal para o centro
    marginBottom: '10%'
  },
  text_total: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginRight: 5 // Reduzir a margem entre o texto e o valor
  },
  text_price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000'
  },
  button_finalizar_pedido: {
    width: 180,
    height: 56,
    backgroundColor: '#6C30EB',
    borderWidth: 1,
    borderColor: '#D9D0E3',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  text_pedido: {
    fontSize: 15,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginLeft: 5
  },
  successMessage: {
    fontSize: 16,
    color: 'green',
    marginBottom: 10,
    textAlign: 'center'
  }
};

export default Carrinho;
