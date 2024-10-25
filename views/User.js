import React, { useContext, useState, useEffect } from 'react';
import { Text, View, Image, TouchableOpacity, Alert, Modal, TextInput, Button } from 'react-native';
import PrefItem from '../components/PrefItem';
import PrefItem2 from '../components/PrefItem';
import { useUser } from '../context/UserContext';
import { ThemeContext } from '../context/ThemeContext';
import Content from '../components/Content';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { db, storage } from '../config/firebaseConfig';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';
import * as SecureStore from 'expo-secure-store';

const User = () => {
  const { colors } = useContext(ThemeContext);
  const { currentUser, setCurrentUser, cartItems, setCartItems } = useUser();
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalProfileVisible, setModalProfileVisible] = useState(false);
  const [nickname, setNickname] = useState('');
  const [profileImage, setProfileImage] = useState("");

  const handleLogout = async () => {
    try {
      setCurrentUser(null); // Limpa o usuário atual
      setCartItems([]); // Remove os itens do carrinho

      // Limpa informações armazenadas no SecureStore
      await SecureStore.deleteItemAsync('userEmail');
      await SecureStore.deleteItemAsync('userPassword');

      // Redireciona para a tela de login
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      // Você pode mostrar um alerta ou notificação ao usuário, se desejado
    }
  };

  const loadProfileImage = async () => {
    try {
      const userDoc = await getDoc(doc(db, 'users', currentUser.email));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData.profileImage) {
          setProfileImage(userData.profileImage);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar a imagem:', error);
      Alert.alert('Erro', 'Não foi possível carregar a imagem do perfil.');
    }
  };

  useEffect(() => {
    loadProfileImage(); // Carrega a imagem ao iniciar o componente
  }, []);

// Função qeu altera iamgem de usuário
  const handleImagePicker = async () => {
    // Solicita permissão para acessar a galeria
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert('Erro', 'Permissão para acessar a galeria é necessária!');
      return;
    }

    // Abre o seletor de imagens
    const result = await ImagePicker.launchImageLibraryAsync();

    if (result.canceled) {
      return; // O usuário cancelou a seleção
    }

    if (result.assets && result.assets.length > 0) {
      const selectedAsset = result.assets[0]; // Acessa o primeiro asset
      setProfileImage(selectedAsset.uri); // Atualiza o estado com o URI da imagem
      // Upload da imagem para o Firebase Storage
      const response = await fetch(selectedAsset.uri);
      const blob = await response.blob();
      const storageRef = ref(storage, `profileImages/${currentUser.email}.jpg`);

      await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);

      // Salva a URL no Firestore
      await setDoc(doc(db, 'users', currentUser.email), { profileImage: downloadURL }, { merge: true });
    }
  };

  const handleSaveNickname = async () => {
    if (nickname.trim() === '') {
      Alert.alert('Erro', 'O apelido não pode estar vazio.');
      return;
    }

    try {
      // Atualiza o apelido no Firestore, substituindo apenas o campo 'nick'
      await setDoc(doc(db, 'users', currentUser.email), { nick: nickname }, { merge: true });

      // Atualiza o contexto com o novo nick
      setCurrentUser({ ...currentUser, nick: nickname });

      setModalVisible(false); // Fecha o modal
      setNickname(''); // Limpa o input
    } catch (error) {
      console.error(error); // Log do erro para depuração
      Alert.alert('Erro', 'Ocorreu um erro ao salvar o apelido.');
    }
  };

  const styles = {
    container: {
      flex: 1,
    },
    div_perfil: {
      width: '100%',
      height: '25%',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-evenly'
    },
    image_perfil: {
      width: 100,
      height: 100,
      borderRadius: 50,
    },
    text_nome: {
      fontSize: 20,
      maxWidth: 200,
      fontWeight: 'bold',
      marginLeft: 10,
      color: colors.textColor
    },
    image: {
      width: 20,
      height: 20,
    },
    div_conteudo_pref: {
      width: '100%',
      height: '60%',
      backgroundColor: colors.itemCardBackground,
      borderRadius: 25,
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 1,
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.8)', // Background semi-transparente
    },
    modalContent: {
      width: '80%',
      padding: 20,
      backgroundColor: 'white',
      borderRadius: 10,
    },
    input: {
      width: "100%",
      height: 50,
      fontSize: 20,
      textAlign: 'center',
      backgroundColor: "white",
      marginBottom: 20,
      borderRadius: 10,
      borderColor: "#D9D0E3",
      borderWidth: 1,
      paddingLeft: 10
    },
    buttomChangeName: {
      width: '50%',
      margin: 'auto',
      backgroundColor: '#BA22FB',
      marginBottom: 10,
      borderRadius: 10,
      padding: 5,
    },
    buttomCancel: {
      width: '50%',
      margin: 'auto',
      backgroundColor: 'red',
      borderRadius: 10,
      padding: 5,
    },
    textButtom: {
      color: 'white',
      textAlign: 'center',
      fontSize: 20,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    text_pref: {
      fontSize: 16,
      color: '#2D0C57',
      marginLeft: 20,
    },
  };

  return (
    <Content>
      <View style={styles.container}>

        <View style={styles.div_perfil}>
          <View style={{ flexDirection: 'row', width: '80%', height: '25%', alignItems: 'center', }}>
            <TouchableOpacity onPress={handleImagePicker}>
              {profileImage !== "" ? (
                <Image
                  style={styles.image_perfil}
                  source={{ uri: profileImage }}
                />
              ) : (
                <Image
                  style={styles.image_perfil}
                  source={require('../assets/user/woman.png')}
                />
              )}
            </TouchableOpacity>
            <Text style={styles.text_nome}>{currentUser?.nick || currentUser?.nome}</Text>
          </View>
          <TouchableOpacity onPress={() => { setModalVisible(true) }} style={{ marginRight: 20 }}>
            <FontAwesome name="pencil" size={20} color={colors.textColor} />
          </TouchableOpacity>
        </View>

        <View style={styles.div_conteudo_pref}>

          <TouchableOpacity onPress={() => { setModalProfileVisible(true) }}>
            <View style={{
              width: '87%', flexDirection: 'row', marginLeft: 20, alignItems: 'center',
              justifyContent: 'space-between', marginTop: 20,
            }}>
              <View style={{ flexDirection: 'row', }}>
                <Image source={require('../assets/user/perfil.png')} style={styles.image} />
                <Text style={styles.text_pref}>Informações pessoais</Text>
              </View>
              <Image source={require('../assets/user/SETA.png')} />
            </View>
          </TouchableOpacity>
          <PrefItem
            iconSource={<Image source={require('../assets/user/map.png')} style={styles.image} />}
            text="Endereços"
            view="ManagerAddress"
          />
          <PrefItem
            iconSource={<Image source={require('../assets/user/cartao.png')} style={styles.image} />}
            text="Forma de pagamento"
            view="MethodPayment"
          />
          <PrefItem
            iconSource={<Image source={require('../assets/user/sino.png')} style={styles.image} />}
            text="Notificações"
            view="Notificacoes"
          />
          <PrefItem2
            iconSource={<Image source={require('../assets/user/grid.png')} style={styles.image} />}
            text="Ver avaliações"
            view="Avaliacoes"
          />
          <PrefItem2
            iconSource={<FontAwesome name="history" size={20} color="green" />}
            text="Histórico de Compras"
            view="HistoricoCompra"
          />
          {/* <PrefItem
            iconSource={<Image source={require('../assets/user/config.png')} style={styles.image} />}
            text="Configurações"
            view="Home"
          /> */}
          <TouchableOpacity onPress={handleLogout}>
            <View style={{
              width: '87%', flexDirection: 'row', marginLeft: 20, alignItems: 'center',
              justifyContent: 'space-between', marginTop: 20,
            }}>
              <View style={{ flexDirection: 'row', }}>
                <Image source={require('../assets/user/Logout.png')} style={styles.image} />
                <Text style={styles.text_pref}>Sair</Text>
              </View>
              <Image source={require('../assets/user/SETA.png')} />
            </View>
          </TouchableOpacity>
        </View>
      </View>
      {/* Modal para alterao nome de visualização */}
      <Modal
        transparent={true}
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TextInput
              style={styles.input}
              placeholder="Digite o NickName"
              value={nickname}
              onChangeText={setNickname}
            />
            <TouchableOpacity onPress={handleSaveNickname} style={styles.buttomChangeName}>
              <Text style={styles.textButtom}>Alterar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.buttomCancel}>
              <Text style={styles.textButtom}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/* Modal que mostra as informações de usuário */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalProfileVisible}
        onRequestClose={() => { setModalProfileVisible(false) }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Informações Pessoais</Text>
            {currentUser ? (
                <View>
                  <Text style={{ marginVertical: 10, fontSize: 17 }}>Nome: {currentUser.nome}</Text>
                  <Text style={{ marginVertical: 10, fontSize: 17 }}>Email: {currentUser.email}</Text>
                  <Text style={{ marginVertical: 10, fontSize: 17 }}>Apelido: {currentUser.nick || 'Não definido'}</Text>
                </View>
              ) : (
                <Text style={{ marginVertical: 10, fontSize: 17 }}>Usuário não encontrado.</Text>
              )}
            <Button title="Fechar" onPress={() => { setModalProfileVisible(false) }} />
          </View>
        </View>
      </Modal>
    </Content>
  );
};

export default User;