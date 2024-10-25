import React, { useState, useEffect } from 'react';
import { View, Text, Modal, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import AlertModal from '../components/AlertModal';
import { useUser } from '../context/UserContext';
import { db } from '../config/firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';

const CardModal = ({ modalVisible, setModalVisible, onAddCard }) => {
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [data, setData] = useState('');
  const [cvv, setCvv] = useState('');
  const [modalAlertVisible, setModalAlertVisible] = useState(false);
  const [mensagem, setMensagem] = useState('');
  const { currentUser } = useUser();

  const handleChangeNumberCard = (text) => {
    // Remove caracteres que não sejam dígitos
    const cleanedText = text.replace(/\D/g, '');

    // Adiciona espaços a cada 4 dígitos
    const formattedText = cleanedText
      .replace(/(\d{4})(?=\d)/g, '$1 ')
      .trim();

    setCardNumber(formattedText);
  };

  const handleChangeData = (text) => {
    // Remove caracteres que não sejam dígitos
    const cleanedText = text.replace(/\D/g, '');

    // Formata a string com a barra após o segundo dígito
    let formattedText = cleanedText;
    if (cleanedText.length > 2) {
      formattedText = `${cleanedText.slice(0, 2)}/${cleanedText.slice(2)}`;
    }

    setData(formattedText);
  };

  const formatValue = (value) => {
    return value.toLowerCase()
      .replace(/( de | da | do | das | dos )/g, (match) => match.toLowerCase())
      .replace(/\b(?!de |da |do |das |dos )\w/g, (char) => char.toUpperCase())
      .replace(/(à|á|â|ã|ä|å|æ|ç|è|é|ê|ë|ì|í|î|ï|ñ|ò|ó|ô|õ|ö|ø|ù|ú|û|ü|ý|ÿ)\w/g, (match) => match.toLowerCase());
  };

  const handleChangeCardHolder = (cardHolder) => {
    // Permite letras (incluindo acentuadas), números e espaços
    if (/^[a-zA-ZÀ-ÖØ-öø-ÿ0-9\s]*$/.test(cardHolder)) {
      const formattedNome = formatValue(cardHolder);
      setCardHolder(formattedNome); 
    }
  };

  useEffect(() => {
    if (modalVisible) {
      // Limpa os campos do formulário quando o modal é montado
      setCardNumber('');
      setCardHolder('');
      setData('');
      setCvv('');
    }
  }, [modalVisible]);

  const handleSave = async () => {
    if (!cardNumber || !cardHolder || !data || !cvv) {
      setMensagem('Preencha todos os campos do cartão.');
      setModalAlertVisible(true);
      return;
    }

    try {
      const cardData = { cardNumber, cardHolder, data, cvv };
      const userDocRef = doc(db, 'paymentCard', `${currentUser.nome}_${cardNumber.slice(-4)}`);
      await setDoc(userDocRef, cardData);
      setMensagem('Cartão Salvo!'); // Mensagem de sucesso
      setModalAlertVisible(true);
      setModalVisible(false);
      onAddCard();
    } catch (error) {
      setMensagem('Erro ao salvar o cartão.');
      setModalAlertVisible(true);
      console.error('Erro ao salvar o cartão:', error);
    }
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
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
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
            <Text style={{ fontSize: 15 }}>Número do Cartão</Text>
            <TextInput
              style={styles.input}
              placeholder="XXXX XXXX XXXX XXXX"
              value={cardNumber}
              onChangeText={handleChangeNumberCard}
              keyboardType="numeric"
              maxLength={19}
            />
            <Text style={{ fontSize: 15 }}>Nome do Titular</Text>
            <TextInput
              style={styles.input}
              placeholder="Nome do Titular"
              value={cardHolder}
              onChangeText={handleChangeCardHolder}
              maxLength={30}
            />
            <Text style={{ fontSize: 15 }}>Data de Vencimento</Text>
            <TextInput
              style={styles.input}
              placeholder="MM/YY"
              value={data}
              onChangeText={handleChangeData}
              keyboardType="numeric"
              maxLength={5}
            />
            <Text style={{ fontSize: 15 }}>CVV</Text>
            <TextInput
              style={styles.input}
              placeholder="XXX"
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
