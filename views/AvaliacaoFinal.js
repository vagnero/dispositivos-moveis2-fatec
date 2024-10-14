import { useState, useContext, useEffect } from 'react';
import { Text, View, TouchableOpacity, TextInput, Modal, FlatList, KeyboardAvoidingView, Platform, Alert  } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Content from '../components/Content';
import { ThemeContext } from '../context/ThemeContext';
import { db } from '../config/firebaseConfig';
import { Timestamp, collection, addDoc, getDocs } from 'firebase/firestore';
import { useUser } from '../context/UserContext';

const AvaliacaoFinal = () => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();
  const { colors } = useContext(ThemeContext);
  const [comments, setComments] = useState([]);
  const { currentUser } = useUser();
  const [name, setName] = useState(currentUser.nome);

  const addComment = async () => {
    try {
      // Adiciona o comentário ao Firestore
      const docRef = await addDoc(collection(db, 'comments'), {
        name: name,
        comment: comment,
        date: Timestamp.now(), // Usa Timestamp corretamente
        rating: rating,
      });
  
      // Cria um novo comentário localmente, com o mesmo timestamp
      const newComment = {
        id: docRef.id,
        name: name,
        comment: comment,
        date: Timestamp.now().toDate(), // Converte para Date para uso no frontend
        rating: rating,
      };
  
      // Atualiza os comentários no estado
      setComments((prevComments) => [newComment, ...prevComments]);
  
      // Limpa os campos
      setName('');
      setComment('');
      setRating(0);
      setModalVisible(true); // Exibe o modal após adicionar o comentário
    } catch (error) {
      console.error('Erro ao adicionar comentário:', error);
    }
  };

  // Função para buscar comentários
  const fetchComments = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'comments'));
      const fetchedComments = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return { id: doc.id, ...data, date: data.date ? data.date : { seconds: Date.now() / 1000 } }; // Verifique se 'date' existe
      });
      
      // Exibe apenas o último comentário
      if (fetchedComments.length > 0) {
        setComments([fetchedComments[fetchedComments.length - 1]]);
      } else {
        setComments([]); // Se não houver comentários, definir como vazio
      }
    } catch (error) {
      console.error("Erro ao buscar comentários:", error);
    }
  };
  
  // Carregar comentários ao montar o componente
  useEffect(() => {
    fetchComments();
  }, []);  

  const handleRating = (newRating) => {
    setRating(newRating);
  };

  const handleSubmit = () => {
    if (name === '') {
      Alert.alert('Erro', 'É necessário estar logado para comentar!');
      return;
    }
    if (comment.trim() === '') {
      Alert.alert('Erro', 'O comentário não pode estar vazio!');
      return;
    }
    if (rating < 1) {
      Alert.alert('Erro', 'Avalie com estrelas sua experiência no aplicativo!');
      return;
    }
    addComment()
    setModalVisible(true);
    setTimeout(() => {
      setModalVisible(false);
      navigation.navigate('Home');
    }, 4000);
  };

  const styles = {
    div_container: {
      flex: 1,
      alignItems: 'center',
      padding: 20
    },
    text_title: {
      marginTop: 50,
      fontSize: 35,
      fontWeight: 'bold',
      color: colors.textColor,
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
      backgroundColor: colors.button,
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
      width: '80%',
      padding: 10,
      backgroundColor: 'white',
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center'
    },
    modalText: {
      fontSize: 20,
      padding: 10,
      textAlign: 'center',
      fontWeight: 'bold',
      color: '#2D0C57'
    }
  };

  return (
    <Content>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"} >
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
                <Text style={styles.modalText}>Obrigado por sua Avaliação, sua opnião é muito importante para nós!</Text>
              </View>
            </View>
          </Modal>          
        </View>
      </KeyboardAvoidingView>
    </Content>
  );
};

export default AvaliacaoFinal;
