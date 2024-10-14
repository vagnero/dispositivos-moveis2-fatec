import React, { useState, useEffect, useContext } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ItemCarrinho from '../components/ItemCarrinho';
import { useUser } from '../context/UserContext';
import { ThemeContext } from '../context/ThemeContext';
import Content from '../components/Content';
import AlertModal from '../components/AlertModal';
import * as SecureStore from 'expo-secure-store';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

const Carrinho = () => {
  const navigation = useNavigation();
  const { cartItems, setCartItems, removeFromCart, cartSuccessMessage } = useUser();
  const [total, setTotal] = useState(0.0);
  const { colors } = useContext(ThemeContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);
  const { currentUser } = useUser();

  const calculateTotal = () => {
    let total = 0;
    cartItems.forEach((item) => {
      // Remover caracteres não numéricos, exceto o ponto decimal
      const priceString = item.winePrice.replace(/[^\d.,-]/g, '').replace(',', '.');
      const price = parseFloat(priceString);
      const quantity = item.quantity;

      if (isNaN(price) || isNaN(quantity)) {
        return;
      }

      total += price * quantity;
    }); 
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

  const handleFinalizeOrder = async () => {
    if (cartItems.length === 0 || total === 0) {
      // Alert.alert("Carrinho Vazio", "Seu carrinho está vazio. Adicione itens antes de prosseguir.");
      handleOpenModal()
    } else if (currentUser) {
      // Atualizar o wineSold no SecureStore
      try {
        const winesString = await SecureStore.getItemAsync('wines');
        const winesArray = winesString ? JSON.parse(winesString) : [];

        // Atualiza o wineSold para cada item no carrinho
        cartItems.forEach(item => {
          const storedWine = winesArray.find(wine => wine.wineName === item.wineName);
          if (storedWine) {
            // Incrementa a quantidade vendida
            storedWine.wineSold = (storedWine.wineSold || 0) + item.quantity;
          }
        });

        // Salva os vinhos atualizados de volta ao SecureStore
        await SecureStore.setItemAsync('wines', JSON.stringify(winesArray));

        await savePurchaseHistory(currentUser, cartItems, total);

        // Limpa o carrinho
        setCartItems([]);
        navigation.navigate('AvaliacaoFinal'); // Usuário logado
      } catch (error) {
        console.error('Erro ao atualizar o carrinho:', error);
        Alert.alert("Erro", "Ocorreu um erro ao finalizar seu pedido. Tente novamente.");
      }
    } else {
      setModalVisible(true); // Usuário não logado, abre o modal
    }
  };

  const savePurchaseHistory = async (currentUser, cartItems, total) => {
    try {
      const purchaseData = {
        userId: currentUser.nome, // Identificador do usuário
        items: cartItems, // Itens comprados
        totalAmount: total, // Valor total da compra
        timestamp: new Date(), // Data da compra
      };
  
      const purchaseCollection = collection(db, 'purchaseHistory');
      await addDoc(purchaseCollection, purchaseData);
      console.log('Compra registrada com sucesso.');
    } catch (error) {
      console.error('Erro ao salvar a compra no Firestore:', error);
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

  const handleOpenModal = () => {
    setModalVisible2(true);
  };

  const handleCloseModal = () => {
    setModalVisible2(false);
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
    }, modalContent: {
      width: 300,
      padding: 20,
      backgroundColor: 'white',
      borderRadius: 10,
      alignItems: 'center',
    }, modalText: {
      marginBottom: 20,
      textAlign: 'center',
    }, modalButtons: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      width: '100%',
    }, modalButton: {
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
        <AlertModal
        visible={modalVisible2}
        message="Seu carrinho está vazio. Adicione itens antes de prosseguir."
        onClose={handleCloseModal}
      />

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
