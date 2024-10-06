import React, { useState, useEffect, useContext } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ItemCarrinho from '../components/ItemCarrinho';
import { useUser } from '../context/UserContext';
import { ThemeContext } from '../context/ThemeContext';
import Content from '../components/Content';

const Carrinho = () => {
  const navigation = useNavigation();
  const { cartItems, setCartItems, removeFromCart, cartSuccessMessage } = useUser();
  const [total, setTotal] = useState(0.0);
  const { colors } = useContext(ThemeContext);
  const [modalVisible, setModalVisible] = useState(false);
  const { findUser, currentUser, setCurrentUser } = useUser();

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

  const handleFinalizeOrder = () => {
    if (cartItems.length === 0 || total === 0) {
      Alert.alert("Carrinho Vazio", "Seu carrinho está vazio. Adicione itens antes de prosseguir.");
    } else if (currentUser) {
      setCartItems([]);
      navigation.navigate('AvaliacaoFinal'); // Usuário logado
    } else {
      setModalVisible(true); // Usuário não logado, abre o modal
    }
  };

  const handleLogin = () => {
    // Lógica para redirecionar para a tela de login
    navigation.navigate('Login');
    setModalVisible(false); // Fecha o modal
  };

  const handleCancel = () => {
    setModalVisible(false); // Fecha o modal
  };

  const styles = {
    container: {
      backgroundColor: '#F6F5F5',
      alignItems: 'center'
    },
    text_title: {
      fontSize: 30,
      fontWeight: 'bold',
      color: colors.textColor,
      textAlign: 'center',
      marginTop: 10,
      marginBottom: 10
    },
    scrollViewContent: {
      flexDirection: 'column',
      padding: 10,
      width: '100%'
    },
    div_conteudo_price: {
      width: '90%',
      height: '15%',
      margin: 'auto',
      marginBottom: 60,
      marginTop: 10,
      backgroundColor: colors.wineCardBackground,
      borderRadius: 25,
      padding: 30,
      justifyContent: 'center',
      alignItems: 'center'
    },

    div_text_price_total: {
      flexDirection: 'row',
      alignItems: 'center', // Garantir que o texto e o valor estejam alinhados verticalmente
      justifyContent: 'center', // Adiciona alinhamento horizontal para o centro
      marginBottom: 10,
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
      backgroundColor: colors.button,
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
    },

    modalOverlay: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fundo do modal
    },    modalContent: {
      width: 300,
      padding: 20,
      backgroundColor: 'white',
      borderRadius: 10,
      alignItems: 'center',
    },    modalText: {
      marginBottom: 20,
      textAlign: 'center',
    },    modalButtons: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      width: '100%',
    },    modalButton: {
      padding: 10,
      backgroundColor: '#2196F3',
      borderRadius: 5,
    },    modalButtonText: {
      color: 'white',
    },
  };

  return (
    <Content>
      <Text style={styles.text_title}>Carrinho</Text>
      {cartSuccessMessage && (
        <Text style={styles.successMessage}>{cartSuccessMessage}</Text>
      )}
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {cartItems.filter((item, index, self) =>
          index === self.findIndex((i) => i.wineName === item.wineName))
          .map((item, index) => (
            <ItemCarrinho
              key={index}
              wineName={item.wineName}
              price={item.winePrice}
              imageSource={item.imageSource}
              quantity={item.quantity}
              removeFromCart={removeFromCart}
              cartItems={cartItems}
              setCartItems={setCartItems}
              calculateTotal={calculateTotal}
            />
          ))}
      </ScrollView>
      <View style={styles.div_conteudo_price}>
        <View style={styles.div_text_price_total}>
          <Text style={styles.text_total}>Total: </Text>
          <Text style={styles.text_price}>R$ {total.toFixed(2)}</Text>
        </View>
        <TouchableOpacity style={styles.button_finalizar_pedido} onPress={handleFinalizeOrder}>
          <Text style={styles.text_pedido}>FINALIZAR PEDIDO</Text>
        </TouchableOpacity>
        <Modal
          transparent={true}
          animationType="slide"
          visible={modalVisible}
          onRequestClose={handleCancel}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>Você precisa estar logado para finalizar o pedido.</Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity style={styles.modalButton} onPress={handleLogin}>
                  <Text style={styles.modalButtonText}>Fazer Login</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalButton} onPress={handleCancel}>
                  <Text style={styles.modalButtonText}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </Content>
  );
};

export default Carrinho;
