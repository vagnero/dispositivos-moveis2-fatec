import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Faq = () => {
  const navigation = useNavigation();
  const [assunto, setAssunto] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState(''); // 'error' ou 'success'

  const handleSendMessage = () => {
    if (!assunto.trim() || !mensagem.trim()) {
      setModalMessage('Por favor, preencha todos os campos.');
      setModalType('error');
      setModalVisible(true);
      return;
    }

    setModalMessage('Mensagem enviada com sucesso!');
    setModalType('success');
    setModalVisible(true);

    setTimeout(() => {
      setModalVisible(false);
      navigation.navigate('Home');
    }, 2000);
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/Faq.png')}
        style={styles.icon}
      />

      <TextInput
        style={styles.input}
        placeholder="Assunto"
        placeholderTextColor="#aaa"
        value={assunto}
        onChangeText={setAssunto}
      />
      <TextInput
        style={[styles.input, styles.messageInput]}
        placeholder="Escreva a mensagem aqui"
        placeholderTextColor="#aaa"
        multiline
        value={mensagem}
        onChangeText={setMensagem}
      />
      <TouchableOpacity style={styles.button} onPress={handleSendMessage}>
        <Text style={styles.buttonText}>Enviar Mensagem</Text>
      </TouchableOpacity>

      {/* Modal para exibir mensagens */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, modalType === 'error' ? styles.errorModal : styles.successModal]}>
            <Text style={styles.modalText}>{modalMessage}</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A102B',
    padding: 20,
    justifyContent: 'center',
  },
  icon: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#2B213A',
    borderRadius: 10,
    padding: 15,
    color: '#fff',
    marginBottom: 15,
  },
  messageInput: {
    height: 120,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#7D5CF8',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: 300,
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  successModal: {
    backgroundColor: '#DFF2BF',
  },
  errorModal: {
    backgroundColor: '#FFBABA',
  },
  modalText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 15,
    color: '#000',
  },
  modalButton: {
    backgroundColor: '#7D5CF8',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default Faq;