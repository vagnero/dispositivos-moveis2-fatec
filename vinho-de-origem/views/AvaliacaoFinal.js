import { useState } from 'react';
import { Text, View, TouchableOpacity, TextInput, Modal } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const AvaliacaoFinal = () => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();

  const handleRating = (newRating) => {
    setRating(newRating);
  };

  const handleSubmit = () => {
    setModalVisible(true);
    setTimeout(() => {
      setModalVisible(false);
      navigation.navigate('Home');
    }, 2000);
  };

  return (
    <View style={styles.div_container}>
      <Text style={styles.text_title}>Avaliação</Text>
      <Text style={styles.text_subtitle}>Avalie a sua experiência na plataforma e com a compra.</Text>

      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity key={star} onPress={() => handleRating(star)}>
            <FontAwesome
              name={star <= rating ? 'star' : 'star-o'}
              size={40}
              color={star <= rating ? '#FFD700' : '#CCCCCC'}
              style={styles.star}
            />
          </TouchableOpacity>
        ))}
      </View>

      <TextInput
        style={styles.textInput}
        multiline
        numberOfLines={4}
        placeholder="Deixe seu comentário aqui..."
        value={comment}
        onChangeText={setComment}
      />

      <TouchableOpacity style={styles.button_enviar} onPress={handleSubmit}>
        <Text style={styles.text_enviar}>ENVIAR</Text>
      </TouchableOpacity>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Sucesso</Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = {
  div_container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F6F5F5',
    padding: 20
  },
  text_title: {
    marginTop: 50,
    fontSize: 35,
    fontWeight: 'bold',
    color: '#2D0C57',
  },
  text_subtitle: {
    width: '80%',
    marginTop: 25,
    fontSize: 14,
    color: '#6C7584',
    textAlign: 'center'
  },
  starsContainer: {
    flexDirection: 'row',
    marginTop: 25,
    justifyContent: 'center'
  },
  star: {
    marginHorizontal: 10
  },
  textInput: {
    width: '80%',
    height: 100,
    borderColor: '#CCCCCC',
    borderWidth: 1,
    borderRadius: 10,
    marginTop: 20,
    padding: 10,
    textAlignVertical: 'top',
    backgroundColor: '#FFFFFF'
  },
  button_enviar: {
    width: 240,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2D0C57',
    borderRadius: 30,
    marginTop: 50
  },
  text_enviar: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold'
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  modalContent: {
    width: 200,
    height: 100,
    backgroundColor: 'white',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2D0C57'
  }
};

export default AvaliacaoFinal;
