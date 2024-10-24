import React, { useState, useEffect, useContext } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ItemCarrinho from '../components/ItemCarrinho';
import { useUser } from '../context/UserContext';
import { ThemeContext } from '../context/ThemeContext';
import Content from '../components/Content';
import AlertModal from '../components/AlertModal';

const Carrinho = () => {
  const navigation = useNavigation();
  const { cartItems, setCartItems, removeFromCart, cartSuccessMessage, setCartSuccessMessage, currentUser } = useUser();
  const [total, setTotal] = useState(0.0);
  const { colors } = useContext(ThemeContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalAlertVisible, setModalAlertVisible] = useState(false);
  const [mensagem, setMensagem] = useState('');

  // Calcula o Total
  const calculateTotal = () => {
    let total = 0;
    cartItems.forEach((item) => {
      // Remover caracteres não numéricos, exceto o ponto decimal
      const priceString = item.itemPrice.replace(/[^\d.,-]/g, '').replace(',', '.');
      const price = parseFloat(priceString);
      const quantity = item.quantity;

      if (isNaN(price) || isNaN(quantity)) {
        return;
      }

      total += price * quantity;
    });
    setTotal(total);
  };

  // Atualiza o Total
  useEffect(() => {
    calculateTotal();
  }, [cartItems]);

  // Controla mensagem da tela
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
      setMensagem('Seu Carrinho está vazio!')
      setModalAlertVisible(true);
    } else if (currentUser) {
      navigation.navigate('ConfirmPayment', { total })
    } else {
      setModalVisible(true); // Usuário não logado, abre o modal
    }
  }  

  // Se não estiver logado
  const handleLogin = () => {
    // Lógica para redirecionar para a tela de login
    navigation.navigate('Login');
    setModalVisible(false); // Fecha o modal
  };

  const styles = {
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
      height: '16%',
      margin: 'auto',
      marginBottom: 20,
      marginTop: 10,
      backgroundColor: colors.itemCardBackground,
      borderRadius: 25,
      padding: 30,
      justifyContent: 'center',
      alignItems: 'center'
    },
    div_text_price_total: {
      flexDirection: 'row',
      alignItems: 'center', // Garantir que o texto e o valor estejam alinhados verticalmente
      justifyContent: 'center', // Adiciona alinhamento horizontal para o centro
      marginBottom: 1,
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
      height: 50,
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
    successMessageContainer: {
      position: 'absolute',
      top: '74%',
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
    modalOverlay: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fundo do modal
    }, 
    modalContent: {
      width: 300,
      padding: 20,
      backgroundColor: 'white',
      borderRadius: 10,
      alignItems: 'center',
    }, 
    modalText: {
      marginBottom: 20,
      textAlign: 'center',
    }, 
    modalButtons: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      width: '100%',
    }, 
    modalButton: {
      padding: 10,
      backgroundColor: '#2196F3',
      borderRadius: 5,
    }, modalButtonText: {
      color: 'white',
    },
  };

  return (
    <Content>
      <Text style={styles.text_title}>Carrinho</Text>
      {cartSuccessMessage && (
        <View style={styles.successMessageContainer}>
          <Text style={styles.successMessage}>{cartSuccessMessage}</Text>
        </View>
      )}
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {cartItems.filter((item, index, self) =>
          index === self.findIndex((i) => i.itemName === item.itemName))
          .map((item, index) => (
            <ItemCarrinho
              key={index}
              itemName={item.itemName}
              price={item.itemPrice}
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
          onRequestClose={ () => {setModalVisible(false)}}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>Você precisa estar logado para finalizar o pedido.</Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity style={styles.modalButton} onPress={handleLogin}>
                  <Text style={styles.modalButtonText}>Fazer Login</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalButton} onPress={ () => {setModalVisible(false)}}>
                  <Text style={styles.modalButtonText}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        <AlertModal
        visible={modalAlertVisible}
        message={mensagem}
        onClose={() => {setModalAlertVisible(false)}}
      />
      </View>
    </Content>
  );
};

export default Carrinho;
