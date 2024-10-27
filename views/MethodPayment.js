import React, { useState, useContext, useEffect } from 'react';
import dbContext from '../context/dbContext';
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
        // Obtém todos os métodos de pagamento
        const allPaymentMethods = dbContext.getAll('paymentMethods');

        // Busca o método de pagamento do usuário atual
        const userPaymentMethod = allPaymentMethods.find(method => method.id === currentUser.nome);

        if (userPaymentMethod) {
          setSelectedPayment(userPaymentMethod.paymentMethod); // Atualiza o estado com o método de pagamento
        } else {
          console.log('Nenhum método de pagamento encontrado para o usuário.');
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
        // Obtém todos os cartões da coleção
        const allCards = dbContext.getAll('paymentCards');

        // Filtra os cartões que pertencem ao usuário atual
        const userCards = allCards.filter(card => card.id.startsWith(`${currentUser.nome}_`));

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
      const existingPaymentMethod = dbContext.getById('paymentMethods', currentUser.nome);

      if (existingPaymentMethod) {
        // Se o método de pagamento já existir, atualiza mantendo outros dados
        const updatedPaymentMethod = {
          ...existingPaymentMethod,
          paymentMethod: selectedPayment,
        };

        // Atualiza no dbContext
        dbContext.updateItem('paymentMethods', currentUser.nome, updatedPaymentMethod, { merge: true });

        setMensagem(`Forma de pagamento atualizada para ${selectedPayment}!`); // Mensagem de sucesso
      } else {
        // Se não existir, cria um novo método de pagamento
        const newPaymentMethod = {
          paymentMethod: selectedPayment,
        };

        // Adiciona o novo método de pagamento no dbContext
        dbContext.addItem('paymentMethods', { id: currentUser.nome, ...newPaymentMethod });

        setMensagem(`Forma de pagamento adicionada: ${selectedPayment}!`); // Mensagem de sucesso
      }

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
