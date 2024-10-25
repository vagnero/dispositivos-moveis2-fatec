import React, { useState, useContext, useEffect } from 'react';
import { db } from '../config/firebaseConfig'; // Importe a configuração do Firebase
import { doc, setDoc, getDoc, collection, getDocs } from 'firebase/firestore'; // Importa métodos do Firestore
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { RadioButton } from 'react-native-paper';
import Content from '../components/Content';
import { ThemeContext } from '../context/ThemeContext';
import { useUser } from '../context/UserContext';
import CardModal from '../components/CardModal';
import AlertModal from '../components/AlertModal';

const MethodPayment = () => {
  const [selectedPayment, setSelectedPayment] = useState(null); // Estado para forma de pagamento
  const [modalVisible, setModalVisible] = useState(null); // Estado para forma de pagamento
  const { colors } = useContext(ThemeContext);
  const { currentUser } = useUser(); // Obtém o usuário atual do contexto
  const [modalVisible2, setModalVisible2] = useState(false);
  const [mensagem, setMensagem] = useState('');

  useEffect(() => {
    const fetchPaymentMethod = async () => {
      try {
        const userDocRef = doc(db, 'paymentMethods', currentUser.nome);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setSelectedPayment(userDoc.data().paymentMethod);
        }
      } catch (error) {
        console.error("Erro ao carregar a forma de pagamento: ", error);
      }
    };
    fetchPaymentMethod();
  }, []);

  // Função para salvar ou atualizar a forma de pagamento no Firestore
  const savePayment = async () => {
    if (!selectedPayment) {
      setMensagem('Selecione uma forma de pagamento.');
      setModalVisible2(true);
      return;
    }

    if (selectedPayment === 'Cartão') {
      // Verifica se há um cartão registrado
      try {
        const userCardsCollection = collection(db, 'paymentCard'); // Coleção de cartões
        const userCardDocs = await getDocs(userCardsCollection);
        const userCards = [];

        userCardDocs.forEach(doc => {
          if (doc.id.startsWith(`${currentUser.nome}_`)) {
            userCards.push({ id: doc.id, ...doc.data() }); // Adiciona cartões ao array
          }
        });
        if (userCards.length === 0) {
          setMensagem('Nenhum cartão cadastrado. Por favor, cadastre um cartão antes de salvar.');
          setModalVisible2(true);
          return;
        }
      } catch (error) {
        console.error('Erro ao verificar cartão cadastrado:', error);
        setMensagem('Erro ao verificar cartão cadastrado.');
        setModalVisible2(true);
        return;
      }
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

  const handleAddCard = () => {
  };

  const styles = StyleSheet.create({
    container: {
      width: '90%',
      height: '50%',
      borderRadius: 10,
      marginBottom: '45%',
      marginTop: 50,
      margin: 'auto',
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
    buttonCadastroCard: {
      marginBottom: 10,
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
      backgroundColor: colors.primary,
      padding: 10,
      borderBottomLeftRadius: 10,
      borderBottomRightRadius: 10,
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 1,
    },
    saveButtonText: {
      textAlign: 'center',
      fontSize: 20,
      color: '#fff',
      fontWeight: 'bold',
    },
  });

  return (
    <Content>
      <Text style={styles.title}>Escolha a forma de pagamento</Text>
      <View style={styles.container}>
        <View style={{
          padding: 10, position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1,
        }}>
          {/* Opção: Pix */}
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

          {/* Opção: Boleto */}

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
          {/* Opção: Cartão */}
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

          <TouchableOpacity onPress={() => openModal()} style={styles.buttonCadastroCard} >
            <Text style={styles.textCadastroCard}>Cadastrar Cartão</Text>
          </TouchableOpacity>
        </View>
        {/* Botão de Salvar */}
        <TouchableOpacity style={styles.saveButton} onPress={savePayment}>
          <Text style={styles.saveButtonText}>Salvar Forma de Pagamento</Text>
        </TouchableOpacity>
      </View>
      {/* Modal para Cadastro de Cartão */}
      <CardModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        onAddCard={handleAddCard}
      />
      <AlertModal
        visible={modalVisible2}
        message={mensagem}
        onClose={handleCloseModal}
      />
    </Content>
  );
};

export default MethodPayment;
