import React, { useState, useEffect, useContext, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Modal, FlatList, Alert } from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native'; // Importando useRoute
import { collection, getDocs, doc, getDoc, addDoc, setDoc, query, where } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';
import { useUser } from '../context/UserContext';
import { ThemeContext } from '../context/ThemeContext';
import Content from '../components/Content';
import AlertModal from '../components/AlertModal';
import CardModal from '../components/CardModal';
import ModalManagerCard from '../components/ModalManagerCard';

const ConfirmPayment = ({ route }) => {
  const { cartItems, setCartItems, currentUser } = useUser();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const { colors } = useContext(ThemeContext);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [cards, setCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [status, setStatus] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [modalAlertVisible, setModalAlertVisible] = useState(false);
  const [modalCardVisible, setModalCardVisible] = useState(null);
  const [modalManagerCardVisible, setModalManagerCardVisible] = useState(null);
  const [modalVisibleAddress, setModalVisibleAddress] = useState(false);

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
        if (paymentMethod === "Cartão") {
          fetchLoadCards();
        }
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
      setTimeout(() => { navigation.navigate('AvaliacaoFinal') }, 2000);
    }
    try {
      const itemsCollection = collection(db, 'items');

      // Atualiza o itemSold para cada item no carrinho
      for (const cartItem of cartItems) {
        const itemDocRef = doc(itemsCollection, cartItem.itemName);
        const itemSnapshot = await getDoc(itemDocRef);

        if (itemSnapshot.exists()) {
          const storedItem = itemSnapshot.data();
          const newSoldCount = (storedItem.itemSold || 0) + cartItem.quantity;

          // Atualiza o item no Firestore
          await setDoc(itemDocRef, {
            itemName: storedItem.itemName,
            itemSold: newSoldCount,
          });
        } else {
          // Se o item não existir, crie um novo
          await setDoc(itemDocRef, {
            itemName: cartItem.itemName,
            itemSold: cartItem.quantity,
          });
        }
      }

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
        card: selectedCard,
      };

      const purchaseCollection = collection(db, 'purchaseHistory');
      await addDoc(purchaseCollection, purchaseData);
      console.log('Compra registrada com sucesso.');
    } catch (error) {
      console.error('Erro ao salvar a compra no Firestore:', error);
    }
  };

  const fetchPurchaseHistory = async () => {
    try {
      if (!currentUser?.nome) {
        throw new Error("Usuário não encontrado");
      }

      const q = query(
        collection(db, 'purchaseHistory'),
        where('userId', '==', currentUser.nome) // Filtra pelo usuário atual
      );

      const querySnapshot = await getDocs(q);
      const purchases = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const sortedPurchases = purchases.sort((a, b) => b.timestamp - a.timestamp);

      // Se houver compras, seta os valores do cartão e endereço da compra mais recente
      if (sortedPurchases.length > 0) {
        const lastPurchase = sortedPurchases[0]; // A compra mais recente
        setPaymentMethod(lastPurchase.paymentMethod);
        if (lastPurchase.card && cards.includes(selectedCard)) {
          setSelectedCard(lastPurchase.card);
        }
        setSelectedAddress(lastPurchase.address);
      }
    } catch (error) {
      console.error('Erro ao buscar histórico de compras:', error);
      Alert.alert('Erro', 'Não foi possível carregar o histórico de compras.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchaseHistory();
    fetchLoadCards();
  }, [fetchLoadCards]);

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
        setCards([]);
        console.log('Nenhum cartão encontrado.');
      }
    } catch (error) {
      console.error('Erro ao buscar cartões:', error);
    }
  };

  const handleCloseModalAlert = () => {
    setModalAlertVisible(false);
  };

  const handleAddCard = () => {
    fetchLoadCards();
  };

  const styles = StyleSheet.create({
    loading: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    container: {
      alignItems: 'center',
      marginTop: 20,
      justifyContent: 'center',
    },
    container_paymentMethod: {
      width: 350,
      height: 150,
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
    contentTotal: {
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
    contentButtons: {
      width: 350,
      height: '25%',
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
    titlePaymentMethod: {
      fontSize: 24,
      textAlign: 'center',
      fontWeight: 'bold',
      marginTop: 20,
      color: colors.secondary,
    },
    title: {
      fontSize: 24,
      textAlign: 'center',
      fontWeight: 'bold',
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
    buttomConfirm: {
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 5,
      padding: 10,
      backgroundColor: '#2ecc71',
    },
    textConfirm: {
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
    closeButtonText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 16,
    },
    buttonAddress: {
      marginBottom: 20,
    },
    buttonCards: {
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
  });

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
          <View style={styles.container_paymentMethod}>
            <Text style={styles.title}>Forma de pagamento</Text>
            <TouchableOpacity onPress={() => { navigation.navigate('MethodPayment') }}>
              {paymentMethod ? <Text style={styles.titlePaymentMethod}>{paymentMethod}</Text> :
                <Text style={{ fontSize: 20, color: 'blue', marginTop: 20, textAlign: 'center' }}>Selecionar</Text>}
            </TouchableOpacity>
            <View>
              {paymentMethod === 'Cartão' && (
                <View style={{ direction: 'row' }}>
                  <TouchableOpacity onPress={() => setModalManagerCardVisible(true)} style={styles.buttonCards}>
                    {!selectedCard || cards.length === 0 ? <Text style={{ fontSize: 20, textAlign: 'center', }}>Escolher Cartão</Text> :
                      <Text style={{ fontSize: 20, textAlign: 'center' }}>**** **** **** {selectedCard.slice(-4)}</Text>}
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

          <View style={styles.contentTotal}>
            <Text style={styles.title}>Total a pagar</Text>
            <Text style={styles.title}>R$ {total},00</Text>
          </View>

          <View style={styles.contentButtons}>
            <TouchableOpacity style={styles.buttomConfirm} onPress={() => (pagamentoAprovado())}>
              <Text style={styles.textConfirm}>Confirmar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => navigation.navigate('Carrinho')}
            >
              <Text style={styles.closeButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
          <AlertModal
            visible={modalAlertVisible}
            message={mensagem}
            onClose={handleCloseModalAlert}
          />
          {/* Modal para cadastro de cartão */}
          <CardModal
            modalVisible={modalCardVisible}
            setModalVisible={setModalCardVisible}
          />
          {/* Modal que gerencia cartões */}
          <ModalManagerCard
            modalVisible={modalManagerCardVisible}
            setModalVisible={setModalManagerCardVisible}
            selectedCard={selectedCard}
            setSelectedCard={setSelectedCard}
            onAddCard={handleAddCard}
          />
          {/* Modal de endereços salvos */}
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
        </View>
      )}
    </Content>
  );
};

export default ConfirmPayment;
