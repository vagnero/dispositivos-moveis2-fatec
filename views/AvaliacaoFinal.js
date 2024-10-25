import { useState, useContext, useEffect, useRef } from 'react';
import { Text, View, TouchableOpacity, TextInput, Modal, Animated, KeyboardAvoidingView, Platform, BackHandler } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Content from '../components/Content';
import { ThemeContext } from '../context/ThemeContext';
import { db } from '../config/firebaseConfig';
import { Timestamp, collection, addDoc, getDocs } from 'firebase/firestore';
import { useUser } from '../context/UserContext';
import AlertModal from '../components/AlertModal';

const AvaliacaoFinal = () => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();
  const { colors } = useContext(ThemeContext);
  const [comments, setComments] = useState([]);
  const { currentUser } = useUser();
  const [name, setName] = useState(currentUser.nome);
  const [modalAlertVisible, setModalAlertVisible] = useState(false);
  const [mensagem, setMensagem] = useState('');
  const scaleValue = useRef(new Animated.Value(0)).current;

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
      setMensagem('É necessário estar logado para comentar!');
      setModalAlertVisible(true);
      return;
    }
    if (comment.trim() === '') {
      setMensagem('O comentário não pode estar vazio!');
      setModalAlertVisible(true);
      return;
    }
    if (rating < 1) {
      setMensagem('Avalie com estrelas sua experiência no aplicativo!');
      setModalAlertVisible(true);
      return;
    }
    addComment()
    setTimeout(() => {
      setModalVisible(false);
      navigation.navigate('Home');
    }, 4000);
  };

  const handleCloseModal = () => {
    setMensagem('');
    setModalAlertVisible(false);
  };

  // Impede de voltar a tela anterior
  useEffect(() => {
    const backAction = () => {
      navigation.navigate('Home'); // Altere para o nome da sua tela Home
      return true; // Impede o comportamento padrão
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    // Limpa o listener quando o componente é desmontado
    return () => backHandler.remove();
  }, [navigation]);

  useEffect(() => {
    if (modalVisible) {
      // Animação para aumentar a escala (abrir modal)
      Animated.spring(scaleValue, {
        toValue: 1,
        useNativeDriver: true,
        friction: 4,
        tension: 10,
      }).start();
    }
  }, [modalVisible]);

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
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.5)', // Fundo transparente com opacidade
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
            transparent={true}
            visible={modalVisible}
            animationType="none" // Desabilita animações padrão para usar a animação personalizada
            onRequestClose={() => {
              setModalVisible(!modalVisible);
            }}
          >
            <View style={styles.modalContainer}>
              <Animated.View style={[styles.alertBox, { transform: [{ scale: scaleValue }] }]}>
                <Text style={styles.alertMessage}>
                Obrigado por sua Avaliação, sua opnião é muito importante para nós!
                </Text>
              </Animated.View>
            </View>
          </Modal>
          <AlertModal
            visible={modalAlertVisible}
            message={mensagem}
            onClose={handleCloseModal}
          />
        </View>
      </KeyboardAvoidingView>
    </Content>
  );
};

export default AvaliacaoFinal;
