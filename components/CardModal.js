import React, { useState, useEffect } from 'react';
import { View, Text, Modal, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import AlertModal from '../components/AlertModal';
import { useUser } from '../context/UserContext';
import { db } from '../config/firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';

const CardModal = ({ modalVisible, setModalVisible }) => {
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [modalAlertVisible, setModalAlertVisible] = useState(false);
  const [mensagem, setMensagem] = useState('');
  const { currentUser } = useUser(); 

  useEffect(() => {
    if (modalVisible) {
      // Limpa os campos do formulário quando o modal é montado
      setCardNumber('');
      setCardHolder('');
      setExpiryDate('');
      setCvv('');
    }
  }, [modalVisible]);

  const handleSave = async () => {
    if (!cardNumber || !cardHolder || !expiryDate || !cvv) {
      setMensagem('Preencha todos os campos do cartão.');
      setModalAlertVisible(true);
      return;
    }

    try {
      const cardData = { cardNumber, cardHolder, expiryDate, cvv };
      const userDocRef = doc(db, 'paymentCard', `${currentUser.nome}_card`);
      await setDoc(userDocRef, cardData);
      setMensagem('Cartão Salvo!'); // Mensagem de sucesso
      setModalAlertVisible(true);
      setModalVisible(false);
    } catch (error) {
      setMensagem('Erro ao salvar o cartão.');
      setModalAlertVisible(true);
      console.error('Erro ao salvar o cartão:', error);
    }
  };

  const validateNumber = (text) => {
    setCardNumber(text.replace(/[^0-9]/g, ''));
  };

  const validateHolderName = (text) => {
    setCardHolder(text.replace(/[^a-zA-Z\s]/g, ''));
  };

  const validateExpiryDate = (text) => {
    setExpiryDate(text.replace(/[^0-9/]/g, ''));
  };

  const validateCVV = (text) => {
    setCvv(text.replace(/[^0-9]/g, ''));
  };

  const handleCloseModal = () => {
    setMensagem('');
    setModalAlertVisible(false);
  };

  const styles = StyleSheet.create({
    modalView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
      width: '90%',
      padding: 20,
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
      color: '#333',
    },
    input: {
      height: 48,
      borderColor: '#ddd',
      borderWidth: 1,
      marginBottom: 15,
      borderRadius: 5,
      paddingHorizontal: 10,
      backgroundColor: '#f9f9f9',
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
  });

  return (
    <View>
      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalView}>
          <View style={styles.modalContent}>
            <Text style={styles.title}>Cadastro de Cartão</Text>
            <TextInput
              style={styles.input}
              placeholder="Número do Cartão"
              value={cardNumber}
              onChangeText={validateNumber}
              keyboardType="numeric"
              maxLength={16}
            />
            <TextInput
              style={styles.input}
              placeholder="Nome do Titular"
              value={cardHolder}
              onChangeText={validateHolderName}
              maxLength={30}
            />
            <TextInput
              style={styles.input}
              placeholder="Data de Validade (MM/YY)"
              value={expiryDate}
              onChangeText={validateExpiryDate}
              keyboardType="numeric"
              maxLength={5}
            />
            <TextInput
              style={styles.input}
              placeholder="CVV"
              value={cvv}
              onChangeText={validateCVV}
              keyboardType="numeric"
              maxLength={3}
              secureTextEntry
            />
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSave}
            >
              <Text style={styles.saveButtonText}>Salvar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <AlertModal
        visible={modalAlertVisible}
        message={mensagem}
        onClose={handleCloseModal}
      />
    </View>
  );
};

export default CardModal;
