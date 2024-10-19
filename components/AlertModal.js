import React, { useEffect, useRef } from 'react';
import { Modal, Text, View, StyleSheet, TouchableOpacity, Animated } from 'react-native';

const AlertModal = ({ visible, message, onClose }) => {
  const scaleValue = useRef(new Animated.Value(0)).current; // Valor inicial para escala

  useEffect(() => {
    if (visible) {
      // Animação para aumentar a escala (abrir modal)
      Animated.spring(scaleValue, {
        toValue: 1,
        useNativeDriver: true,
        friction: 4,
        tension: 10,
      }).start();
    }
  }, [visible]);

  const handleClose = () => {
    // Animação para diminuir a escala (fechar modal)
    Animated.timing(scaleValue, {
      toValue: 0, // Volta ao tamanho pequeno
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      // Depois da animação, chama a função de fechamento do modal
      onClose();
    });
  };

  return (
    <View>
      <Modal
        transparent={true}
        visible={visible}
        animationType="none" // Desabilita animações padrão para usar a animação personalizada
        onRequestClose={handleClose}
      >
        <View style={styles.modalContainer}>
          <Animated.View style={[styles.alertBox, { transform: [{ scale: scaleValue }] }]}>
            <Text style={styles.alertMessage}>{message}</Text>

            <TouchableOpacity style={styles.okButton} onPress={handleClose}>
              <Text style={styles.buttonText}>OK</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)', // Fundo transparente com opacidade
  },
  alertBox: {
    width: 250,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
  alertMessage: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  okButton: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default AlertModal;
