import { db } from '../config/firebaseConfig'; // Importe a configuração do Firebase
import { doc, setDoc } from 'firebase/firestore'; // Importa métodos do Firestore
import React, { useState, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { RadioButton } from 'react-native-paper';
import Content from '../components/Content';
import { ThemeContext } from '../context/ThemeContext';
import { useUser } from '../context/UserContext';
import { useNavigation } from '@react-navigation/native';
import CardModal from '../components/CardModal';
import AlertModal from '../components/AlertModal';

const Payment = () => {
  const [selectedPayment, setSelectedPayment] = useState(null); // Estado para forma de pagamento
  const [modalVisible, setModalVisible] = useState(null); // Estado para forma de pagamento
  const { colors } = useContext(ThemeContext);
  const { currentUser } = useUser(); // Obtém o usuário atual do contexto
  const navigation = useNavigation();
  const [modalVisible2, setModalVisible2] = useState(false);
  const [mensagem, setMensagem] = useState('');


  // Função para salvar ou atualizar a forma de pagamento no Firestore
  const savePayment = async () => {
    if (!selectedPayment) {
      setMensagem('Selecione uma forma de pagamento.');
      setModalVisible2(true);
      return;
    }

    try {
      const userDocRef = doc(db, 'paymentMethods', currentUser.nome); // Referência ao documento do usuário

      // Atualiza o documento com a nova forma de pagamento (substituindo a anterior)
      await setDoc(
        userDocRef,
        { paymentMethod: selectedPayment }, // Campo a ser atualizado
        { merge: true } // Garante que outros dados do usuário não sejam sobrescritos
      );

      setMensagem(`Forma de pagamento atualizada para ${selectedPayment}!`); // Mensagem de sucesso
      setModalVisible2(true);
    } catch (error) {
      console.error('Erro ao atualizar forma de pagamento:', error);
      setMensagem('Não foi possível atualizar a forma de pagamento.');
      setModalVisible2(true);
    }
  };

  const openModal = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setMensagem('');
    setModalVisible2(false);
  };

  const styles = StyleSheet.create({
    container: {
      width: '90%',
      height: 10,
      borderRadius: 10,
      marginBottom: '45%',
      marginTop: 100,
      margin: 'auto',
      flex: 1,
      padding: 20,
      backgroundColor: colors.card,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginTop: 100,
      textAlign: 'center',
      color: colors.textColor,
    },
    radioContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 10,
    },
    paymentOption: {
      fontSize: 18,
      color: colors.secondary,
    },
    radioButtonContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 10,
    },
    textCadastroCard: {
      width: 150,
      margin: 'auto',
      borderRadius: 10,
      padding: 10,
      fontSize: 15,
      color: colors.textColor,
      backgroundColor: colors.text,
      textAlign: 'center',
    },
    saveButton: {
      width: '100%',
      margin: 'auto',
      marginTop: 20,
      position: 'bottom',
      backgroundColor: colors.primary,
      padding: 10,
      borderRadius: 5,
    },
    saveButtonText: {
      textAlign: 'center',
      color: '#fff',
      fontWeight: 'bold',
    },
  });

  return (
    <Content>
      <Text style={styles.title}>Escolha a forma de pagamento</Text>
      <View style={styles.container}>
        {/* Opção: Cartão */}
        <View style={styles.radioButtonContainer}>
          <TouchableOpacity
            style={styles.radioContainer}
            onPress={() => setSelectedPayment('Cartão')}
          >
            <RadioButton
              value="Cartão"
              status={selectedPayment === 'Cartão' ? 'checked' : 'unchecked'}
              onPress={() => setSelectedPayment('Cartão')}
            />
            <Text style={styles.paymentOption}>Cartão de Crédito</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={() => openModal()}
          disabled={!selectedPayment}
        >
          <Text style={styles.textCadastroCard}>Cadastrar Cartão</Text>
        </TouchableOpacity>

        {/* Opção: Pix */}
        <View style={styles.radioButtonContainer}>
          <TouchableOpacity
            style={styles.radioContainer}
            onPress={() => setSelectedPayment('Pix')}
          >
            <RadioButton
              value="Pix"
              status={selectedPayment === 'Pix' ? 'checked' : 'unchecked'}
              onPress={() => setSelectedPayment('Pix')}
            />
            <Text style={styles.paymentOption}>Pix</Text>
          </TouchableOpacity>
        </View>

        {/* Opção: Boleto */}
        <View style={styles.radioButtonContainer}>
          <TouchableOpacity
            style={styles.radioContainer}
            onPress={() => setSelectedPayment('Boleto')}
          >
            <RadioButton
              value="Boleto"
              status={selectedPayment === 'Boleto' ? 'checked' : 'unchecked'}
              onPress={() => setSelectedPayment('Boleto')}
            />
            <Text style={styles.paymentOption}>Boleto</Text>
          </TouchableOpacity>
        </View>

        {/* Botão de Salvar */}
        <TouchableOpacity style={styles.saveButton} onPress={savePayment}>
          <Text style={styles.saveButtonText}>Salvar Forma de Pagamento</Text>
        </TouchableOpacity>

        {/* Modal para Cadastro de Cartão */}
        <CardModal
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
        />
        <AlertModal
          visible={modalVisible2}
          message={mensagem}
          onClose={handleCloseModal}
        />
      </View>
    </Content>
  );
};

export default Payment;
