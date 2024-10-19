import React, { useState, useEffect, useContext, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Modal, FlatList } from 'react-native';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native'; // Importando useRoute
import { db } from '../config/firebaseConfig';
import { useUser } from '../context/UserContext';
import { ThemeContext } from '../context/ThemeContext';
import Content from '../components/Content';

const ConfirmPayment = ({ route }) => {
  const [addresses, setAddresses] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const navigation = useNavigation();
  const { currentUser } = useUser();
  const [loading, setLoading] = useState(true);
  const { colors } = useContext(ThemeContext);
  const [selectedAddress, setSelectedAddress] = useState(null);

  // Recuperando o parâmetro 'total' da rota
  const { onPaymentSuccess, total } = route.params;

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
    }, [fetchPaymentMethod])
  );

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
  });

  const renderAddressItem = ({ item }) => (
    <View key={item.id}>
      <TouchableOpacity
        onPress={() => {
          setSelectedAddress(item.recipientName);
          setModalVisible(false); // Fecha o modal após a seleção do endereço
        }}
        style={styles.buttonAddress}
      >
        <Text style={styles.textButtonAddress}>Endereço: {item.recipientName}</Text>
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
            <Text style={styles.title}>{paymentMethod}</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Payment')}>
              <Text>Alterar</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.contentEndereco}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text style={styles.title}>Endereço</Text>
              <TouchableOpacity onPress={() => navigation.navigate('ManagerAddress')} style={styles.buttonEditar}>
                {addresses.length > 0 ?
                  <Text style={styles.textButtonEditar}>Editar</Text> : <Text style={styles.textButtonEditar}>Cadastrar</Text>}
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.buttonAddress} >
              <Text style={styles.textButtonAddress}>Selecione o endereço de Entrega</Text>
              <Text style={styles.textButtonAddress} >{selectedAddress}</Text>
            </TouchableOpacity>
            <Modal
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => setModalVisible(false)}
            >
              <View style={styles.modalContent}>
                <View style={styles.modalInnerContent}>
                  {addresses.length === 0 ? (
                    <Text style={styles.noAddressesText}>Não há endereços cadastrados.</Text>
                  ) : (
                    <FlatList
                      data={addresses}
                      keyExtractor={(item) => item.id}
                      renderItem={renderAddressItem}
                    />
                  )}
                  <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
                    <Text style={styles.closeButtonText}>Fechar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </View>

          <View style={styles.content}>
            <Text style={styles.title}>Total a pagar:</Text>
            <Text style={styles.title}>R$ {total},00</Text>
          </View>

          <View style={styles.content}>
            <TouchableOpacity style={styles.saveButton} onPress={onPaymentSuccess}>
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
    </Content>
  );
};

export default ConfirmPayment;
