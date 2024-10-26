import React, { useContext, useState, useEffect } from 'react';
import { Text, View, Image, TouchableOpacity, Alert, Modal, TextInput, Button } from 'react-native';
import PrefItem from '../components/PrefItem';
import PrefItem2 from '../components/PrefItem';
import { useUser } from '../context/UserContext';
import { ThemeContext } from '../context/ThemeContext';
import Content from '../components/Content';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as SQLite from 'expo-sqlite/legacy';
import * as ImagePicker from 'expo-image-picker';
import * as SecureStore from 'expo-secure-store';

const db = SQLite.openDatabase('app.db'); // Inicializa o banco de dados SQLite

const User = () => {
  const { colors } = useContext(ThemeContext);
  const { currentUser, setCurrentUser, cartItems, setCartItems } = useUser();
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalProfileVisible, setModalProfileVisible] = useState(false);
  const [nickname, setNickname] = useState('');
  const [profileImage, setProfileImage] = useState("");

  // Função para criar a tabela de usuários se não existir
  const createUserTable = () => {
    db.transaction(tx => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS users (
          email TEXT PRIMARY KEY NOT NULL,
          nome TEXT,
          nick TEXT,
          profileImage TEXT
        );`
      );
    });
  };

  // Chama a função para criar a tabela na inicialização
  useEffect(() => {
    createUserTable();
    loadProfileImage(); // Carrega a imagem ao iniciar o componente
  }, []);

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
    }
  };

  const loadProfileImage = async () => {
    try {
      db.transaction(tx => {
        tx.executeSql(
          'SELECT profileImage FROM users WHERE email = ?',
          [currentUser.email],
          (_, { rows }) => {
            if (rows.length > 0) {
              setProfileImage(rows.item(0).profileImage);
            }
          },
          (t, error) => {
            console.error('Erro ao carregar a imagem:', error);
            Alert.alert('Erro', 'Não foi possível carregar a imagem do perfil.');
          }
        );
      });
    } catch (error) {
      console.error('Erro ao carregar a imagem:', error);
    }
  };

  const handleImagePicker = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert('Erro', 'Permissão para acessar a galeria é necessária!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync();

    if (result.canceled) {
      return;
    }

    if (result.assets && result.assets.length > 0) {
      const selectedAsset = result.assets[0];
      setProfileImage(selectedAsset.uri);

      // Salva a URL no SQLite
      db.transaction(tx => {
        tx.executeSql(
          'UPDATE users SET profileImage = ? WHERE email = ?',
          [selectedAsset.uri, currentUser.email],
          (_, result) => {
            console.log('Imagem de perfil atualizada no SQLite.');
          },
          (t, error) => {
            console.error('Erro ao atualizar imagem no SQLite:', error);
          }
        );
      });
    }
  };

  const handleSaveNickname = async () => {
    if (nickname.trim() === '') {
      Alert.alert('Erro', 'O apelido não pode estar vazio.');
      return;
    }

    try {
      // Atualiza o apelido no SQLite
      db.transaction(tx => {
        tx.executeSql(
          'UPDATE users SET nick = ? WHERE email = ?',
          [nickname, currentUser.email],
          (_, result) => {
            setCurrentUser({ ...currentUser, nick: nickname });
            setModalVisible(false); // Fecha o modal
            setNickname(''); // Limpa o input
          },
          (t, error) => {
            console.error('Erro ao salvar o apelido no SQLite:', error);
            Alert.alert('Erro', 'Ocorreu um erro ao salvar o apelido.');
          }
        );
      });
    } catch (error) {
      console.error(error);
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
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
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
          <PrefItem icon='bi-chat-left' text='Minhas Conversas' />
          <PrefItem2 icon='bi-person-circle' text='Perfil' onPress={() => { setModalProfileVisible(true) }} />
          <PrefItem2 icon='bi-chat-left-text' text='Chats' />
          <PrefItem2 icon='bi-box-arrow-right' text='Sair' onPress={handleLogout} />
        </View>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => { setModalVisible(!modalVisible) }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Altere seu apelido</Text>
            <TextInput
              style={styles.input}
              value={nickname}
              onChangeText={setNickname}
              placeholder="Digite seu apelido"
            />
            <Button title="Salvar" onPress={handleSaveNickname} />
            <Button title="Cancelar" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>

      {/* Modal de perfil pode ser implementado aqui */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalProfileVisible}
        onRequestClose={() => { setModalProfileVisible(!modalProfileVisible) }}
      >
        {/* Conteúdo do Modal */}
      </Modal>
    </Content>
  );
};

export default User;