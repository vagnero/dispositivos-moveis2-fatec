import React, { useState, useEffect, useContext, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Modal, FlatList, Alert } from 'react-native';
import { collection, getDocs, doc, getDoc, addDoc, deleteDoc } from 'firebase/firestore';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native'; // Importando useRoute
import { db } from '../config/firebaseConfig';
import { useUser } from '../context/UserContext';
import { ThemeContext } from '../context/ThemeContext';
import Content from '../components/Content';
import * as SecureStore from 'expo-secure-store';
import AlertModal from '../components/AlertModal';
import CardModal from '../components/CardModal';

const ConfirmPayment = ({ route }) => {
  const { cartItems, setCartItems, currentUser } = useUser();
  const [addresses, setAddresses] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const { colors } = useContext(ThemeContext);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [mensagem, setMensagem] = useState('');
  const [modalAlertVisible, setModalAlertVisible] = useState(false);
  const [modalVisibleAddress, setModalVisibleAddress] = useState(false);
  const [cards, setCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [modalCardVisible, setModalCardVisible] = useState(null);
  const [status, setStatus] = useState('');

  // Recuperando o parâmetro 'total' da rota
  const { total } = route.params;

  const fetchPaymentMethod = useCallback(async () => {
    try {
      // Buscar endereços do usuário atual
      const addressCollection = collection(db, 'addresses');
      const addressSnapshot = await getDocs(addressCollection);

      const addressList = addressSnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(address => address.id.startsWith(currentUser.nome));

      setAddresses(addressList); // Atualizar estado com endereços

      // Buscar método de pagamento do usuário atual
      const userDocRef = doc(db, 'paymentMethods', currentUser.nome);
      const paymentSnapshot = await getDoc(userDocRef);

      if (paymentSnapshot.exists()) {
        const method = paymentSnapshot.data().paymentMethod;
        setPaymentMethod(method); // Atualizar estado com método de pagamento
      } else {
        console.log('Nenhum método de pagamento encontrado.');
      }

      setLoading(false); // Finaliza o carregamento
    } catch (error) {
      console.error('Erro ao buscar dados:', error); // Captura erros
    }
  }, [currentUser]);

  useFocusEffect(
    useCallback(() => {
      fetchPaymentMethod();
      fetchLoadCards();
    }, [fetchPaymentMethod, fetchLoadCards])
  );

  const pagamentoAprovado = async () => {
    if (paymentMethod === 'Cartão' && !selectedCard) {
      setMensagem('Selecione um Cartão')
      setModalAlertVisible(true);
      return
    }

    if (!selectedAddress) {
      setMensagem('Selecione um Endereço para a Entrega')
      setModalAlertVisible(true);
      return
    }

    let newStatus;

    if (paymentMethod === 'Boleto') {
      newStatus = "Aguardando Pagamento";
      setStatus(newStatus)
      navigation.navigate('Boleto', { total })
    }

    if (paymentMethod === 'Pix') {
      newStatus = "Aguardando Pagamento";
      setStatus(newStatus)
      navigation.navigate('PixPayment', { total });
    }

    if (paymentMethod === 'Cartão') {
      newStatus = "Preparando para Envio";
      setStatus(newStatus)
      setMensagem('Compra Efetuada!')
      setModalAlertVisible(true);
      navigation.navigate('AvaliacaoFinal'); // Usuário logado
    }
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

      await savePurchaseHistory(currentUser, cartItems, total, newStatus);

      // Limpa o carrinho
      setCartItems([]);
    } catch (error) {
      console.error('Erro ao atualizar o carrinho:', error);
      Alert.alert("Erro", "Ocorreu um erro ao finalizar seu pedido. Tente novamente.");
    }

  };

  const savePurchaseHistory = async (currentUser, cartItems, total, status) => {
    try {
      const purchaseData = {
        userId: currentUser.nome, // Identificador do usuário
        items: cartItems, // Itens comprados
        totalAmount: total, // Valor total da compra
        timestamp: new Date(), // Data da compra
        status: status,
        paymentMethod: paymentMethod,
        address: selectedAddress,
      };

      const purchaseCollection = collection(db, 'purchaseHistory');
      await addDoc(purchaseCollection, purchaseData);
      console.log('Compra registrada com sucesso.');
    } catch (error) {
      console.error('Erro ao salvar a compra no Firestore:', error);
    }
  };

  // Função para buscar cartões salvos
  const fetchLoadCards = async () => {
    try {
      const userCardsCollection = collection(db, 'paymentCard'); // Coleção de cartões
      const userCardDocs = await getDocs(userCardsCollection);
      const userCards = [];

      userCardDocs.forEach(doc => {
        if (doc.id.startsWith(`${currentUser.nome}_`)) {
          userCards.push({ id: doc.id, ...doc.data() }); // Adiciona cartões ao array
        }
      });

      if (userCards.length > 0) {
        setCards(userCards); // Atualiza o estado com todos os cartões
      } else {
        console.log('Nenhum cartão encontrado.');
      }
    } catch (error) {
      console.error('Erro ao buscar cartões:', error);
    }
  };

  const handleCloseModalAlert = () => {
    setModalAlertVisible(false);
  };

  const handleDeleteCard = async (id) => {
    try {
      await deleteDoc(doc(db, 'paymentCard', id)); // Deleta o endereço com o id correto
      setMensagem('Cartão excluído com sucesso!'); // Mensagem de sucesso
      setModalAlertVisible(true); // Mostra modal de sucesso
      fetchLoadCards(); // Atualiza a lista de endereços
    } catch (error) {
      console.error('Erro ao excluir cartão')
      setMensagem('Não foi possível excluir o Cartão.'); // Mensagem de sucesso
      setModalAlertVisible(true); // Mostra modal de sucesso
    }
  };

  const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      marginTop: 20,
      justifyContent: 'center',
    },
    content: {
      width: 350,
      maxHeight: 150,
      padding: 20,
      marginTop: 5,
      backgroundColor: '#fff',
      borderRadius: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 2,
      elevation: 5,
    },
    contentEndereco: {
      width: 350,
      maxHeight: 150,
      padding: 20,
      marginTop: 5,
      backgroundColor: '#fff',
      borderRadius: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 2,
      elevation: 5,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
      color: 'black',
    },
    address: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 10,
      padding: 2,
      paddingLeft: 20,
      borderRadius: 15,
      color: 'white',
      backgroundColor: '#2196F3',
    },
    saveButton: {
      alignItems: 'center',
      justifyContent: 'center',
      height: 48,
      borderRadius: 5,
      backgroundColor: '#2ecc71',
      marginTop: 10,
    },
    saveButtonText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 16,
    },
    closeButton: {
      alignItems: 'center',
      justifyContent: 'center',
      height: 48,
      borderRadius: 5,
      backgroundColor: '#e74c3c',
      marginTop: 10,
    },
    confirmCard: {
      alignItems: 'center',
      justifyContent: 'center',
      height: 48,
      borderRadius: 5,
      backgroundColor: '#2196F3',
      marginTop: 10,
    },
    closeButtonText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 16,
    },
    loading: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    buttonAddress: {
      marginBottom: 20,
    },
    textButtonAddress: {
      fontSize: 20,
      textAlign: 'center',
    },
    buttonEditar: {
      marginBottom: 10,
    },
    textButtonEditar: {
      textAlign: 'center',
      fontSize: 20,
    },
    modalContainer: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      textAlign: 'center',
      backgroundColor: 'white',
      width: 350,
      borderRadius: 10,
      padding: 20,
      margin: 'auto',
      marginTop: 250,
    },
    deleteButton: {
      width: 100,
      backgroundColor: 'red',
      marginBottom: 20,
      padding: 10,
      borderRadius: 5,
    },
    deleteText: {
      color: 'white',
      textAlign: 'center',
    },
  });

  const renderCardItem = ({ item }) => (
    <View key={item.id} style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
      <TouchableOpacity
        onPress={() => {
          setSelectedCard(item.cardNumber); // Armazena os últimos dígitos
          setModalVisible(false); // Fecha o modal após a seleção do cartão
        }}
        style={styles.buttonAddress}
      >
        <Text style={styles.textButtonAddress}>
          **** **** **** {item.cardNumber.slice(-4)} {/* Exibe apenas os últimos 4 dígitos */}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleDeleteCard(item.id)} style={styles.deleteButton}>
        <Text style={styles.deleteText}>Deletar</Text>
      </TouchableOpacity>
    </View>
  );

  const renderAddressItem = ({ item }) => (
    <View key={item.id}>
      <TouchableOpacity
        onPress={() => {
          setSelectedAddress(item.recipientName);
          setModalVisibleAddress(false); // Fecha o modal após a seleção do endereço
        }}
        style={styles.buttonAddress}
      >
        <Text style={styles.textButtonAddress}>{item.recipientName}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <Content>
      {loading ? ( // Exibe indicador de carregamento inicial
        <ActivityIndicator size="large" color="#0000ff" style={styles.loading} />
      ) : (
        <View style={styles.container}>
          <View style={styles.content}>
            <Text style={styles.title}>Forma de pagamento</Text>
            <TouchableOpacity onPress={() => { navigation.navigate('Payment') }}>
              <Text style={styles.title}>{paymentMethod}</Text>
            </TouchableOpacity>
            <View>
              {paymentMethod === 'Cartão' && (
                <View style={{ direction: 'row' }}>
                  <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.buttonAddress}>
                    {!selectedCard ? <Text style={{ fontSize: 20 }}>Escolher Cartão</Text> :
                      <Text style={{ fontSize: 20 }}>**** **** **** {selectedCard.slice(-4)}</Text>}
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => navigation.navigate('Payment')}>
                    <Text>Alterar</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
          <View style={styles.contentEndereco}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text style={styles.title}>Endereço</Text>
              <TouchableOpacity onPress={() => navigation.navigate('ManagerAddress')} style={styles.buttonEditar}>
                {addresses.length > 0 ?
                  <Text style={styles.textButtonEditar}>Editar</Text> : <Text style={styles.textButtonEditar}>Cadastrar</Text>}
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={() => setModalVisibleAddress(true)} style={styles.buttonAddress} >
              {!selectedAddress ? <Text style={styles.textButtonAddress}>Selecione o endereço de Entrega</Text> :
                <Text style={styles.textButtonAddress} >{selectedAddress}</Text>}
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <Text style={styles.title}>Total a pagar:</Text>
            <Text style={styles.title}>R$ {total},00</Text>
          </View>

          <View style={styles.content}>
            <TouchableOpacity style={styles.saveButton} onPress={() => (pagamentoAprovado())}>
              <Text style={styles.saveButtonText}>Confirmar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => navigation.navigate('Carrinho')}
            >
              <Text style={styles.closeButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      <AlertModal
        visible={modalAlertVisible}
        message={mensagem}
        onClose={handleCloseModalAlert}
      />
      <CardModal
        modalVisible={modalCardVisible}
        setModalVisible={setModalCardVisible}
      />
      <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {cards.length === 0 ? (
              <Text style={styles.noCardsText}>Não há cartões cadastrados.</Text>
            ) : (
              <FlatList
                data={cards}
                keyExtractor={(item) => item.id}
                renderItem={renderCardItem}
              />
            )}
            <TouchableOpacity onPress={() => { setModalCardVisible(true) }} style={styles.confirmCard}>
              <Text style={styles.closeButtonText}>Adicionar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal
        transparent={true}
        visible={modalVisibleAddress}
        onRequestClose={() => setModalVisibleAddress(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {addresses.length === 0 ? (
              <Text style={styles.noAddressesText}>Não há endereços cadastrados.</Text>
            ) : (
              <FlatList
                data={addresses}
                keyExtractor={(item) => item.id}
                renderItem={renderAddressItem}
              />
            )}
            <TouchableOpacity onPress={() => setModalVisibleAddress(false)} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </Content>
  );
};

export default ConfirmPayment;
