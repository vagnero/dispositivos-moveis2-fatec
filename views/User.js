import React, { useContext, useState, useEffect } from 'react';
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
  Button,
  ScrollView,
} from 'react-native';
import PrefItem from '../components/PrefItem';
import PrefItem2 from '../components/PrefItem';
import { useUser } from '../context/UserContext';
import { ThemeContext } from '../context/ThemeContext';
import Content from '../components/Content';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import dbContext from '../context/dbContext';
import * as ImagePicker from 'expo-image-picker';
import * as SecureStore from 'expo-secure-store';

const User = () => {
  const { theme, toggleTheme, colors } = useContext(ThemeContext);
  const { currentUser, setCurrentUser, cartItems, setCartItems } = useUser();
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalProfileVisible, setModalProfileVisible] = useState(false);
  const [nickname, setNickname] = useState('');
  const [profileImage, setProfileImage] = useState('');

  // Defina o ícone condicionalmente antes de usá-lo no JSX
  const themeIcon =
    theme === 'light' ? (
      <FontAwesome name="moon-o" size={20} color="white" />
    ) : (
      <FontAwesome name="sun-o" size={20} color="white" />
    );

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

  // Função qeu altera iamgem de usuário
  const handleImagePicker = async () => {
    // Solicita permissão para acessar a galeria
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert('Erro', 'Permisso para acessar a galeria é necessária!');
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

      // Lê a imagem como base64
      const response = await fetch(selectedAsset.uri);
      const blob = await response.blob();
      const reader = new FileReader();

      reader.onloadend = async () => {
        const base64data = reader.result; // Converte a imagem para base64

        // Salva a imagem no dbContext
        const updatedUser = { profileImage: base64data };

        dbContext.updateItem('users', currentUser.email, updatedUser, {
          merge: true,
        });

        // Atualiza o estado do currentUser, se necessário
        setCurrentUser((prev) => ({ ...prev, profileImage: base64data }));
      };

      reader.readAsDataURL(blob); // Converte o blob para base64
    }
  };

  const handleSaveNickname = async () => {
    try {
      // Verifica se o nickname não está vazio
      if (!nickname) {
        Alert.alert('Erro', 'O apelido não pode ser vazio.');
        return;
      }

      // Atualiza o apelido no dbContext
      dbContext.updateItem(
        'users',
        currentUser.email,
        { nick: nickname },
        { merge: true }
      );

      // Atualiza o contexto com o novo nick
      setCurrentUser((prev) => ({ ...prev, nick: nickname }));

      setModalVisible(false); // Fecha o modal
      setNickname(''); // Limpa o input
    } catch (error) {
      console.error('Erro ao salvar o apelido:', error); // Log do erro para depuração
      Alert.alert('Erro', 'Ocorreu um erro ao salvar o apelido.');
    }
  };

  const styles = {
    container: {
      flex: 1,
      marginTop: 50,
    },
    div_perfil: {
      width: '100%',
      height: '25%',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-evenly',
      marginBottom: 0,
      flexWrap: 'wrap', // Adicione esta linha
    },
    image_perfil: {
      width: 100,
      height: 100,
      borderRadius: 50,
    },
    text_nome: {
      fontSize: 20,
      fontWeight: 'bold',
      marginLeft: 10,
      color: colors.textColor,
      flexShrink: 1, // Permite que o texto encolha para evitar o corte
    },

    image: {
      width: 20,
      height: 20,
      color: 'white',
    },
    div_conteudo_pref: {
      width: '100%',
      height: '100%', // Altere para 'auto' para permitir que ele se expanda conforme necessário
      backgroundColor: '#1E1E1E',
      borderRadius: 25,
      marginBottom: 35,
      paddingBottom: 120, // Adicione um padding inferior se necessário
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
      width: '100%',
      height: 50,
      fontSize: 20,
      textAlign: 'center',
      backgroundColor: 'white',
      marginBottom: 20,
      borderRadius: 10,
      borderColor: '#D9D0E3',
      borderWidth: 1,
      paddingLeft: 10,
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
      color: 'white',
      marginLeft: 20,
      textAlign: 'left', // Ou 'center', dependendo de como você deseja o alinhamento
      flexShrink: 1, // Permite que o texto encolha
    },
    icon: {
      color: colors.iconColor,
      fontSize: 24, // Tamanho do ícone
      marginLeft: 30,
    },
  };

  return (
<Content>
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.div_perfil}>
            <View style={{ flexDirection: 'row', width: '80%', height: '25%', alignItems: 'center' }}>
              <TouchableOpacity onPress={handleImagePicker}>
                {profileImage !== '' ? (
                  <Image style={styles.image_perfil} source={{ uri: profileImage }} />
                ) : (
                  <Image
                    style={styles.image_perfil}
                    source={require('../assets/user/woman.png')}
                  />
                )}
              </TouchableOpacity>
              <Text style={styles.text_nome}>{currentUser?.nick || currentUser?.nome}</Text>
            </View>
            <TouchableOpacity onPress={() => setModalVisible(true)} style={{ marginRight: 20 }}>
              <FontAwesome name="pencil" size={20} color="white" />
            </TouchableOpacity>
          </View>

          <View style={styles.div_conteudo_pref}>
            {/* Navegar para InfPessoais */}
            <TouchableOpacity
              onPress={() => navigation.navigate('InfPessoais')}
            >
              <View
                style={{
                  width: '87%',
                  flexDirection: 'row',
                  marginLeft: 20,
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: 20,
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <FontAwesome name="user" size={20} color="white" />
                  <Text style={styles.text_pref}>Informações pessoais</Text>
                </View>
                <Image source={require('../assets/user/SETA.png')} />
              </View>
            </TouchableOpacity>

            <PrefItem
              iconSource={<FontAwesome name="map" size={20} color="white" />}
              text="Endereços"
              view="ManagerAddress"
            />
            <PrefItem
              iconSource={
                <FontAwesome name="credit-card" size={20} color="white" />
              }
              text="Forma de pagamento"
              view="MethodPayment"
            />
            <PrefItem
              iconSource={<FontAwesome name="bell" size={20} color="white" />}
              text="Notificações"
              view="Notificacoes"
            />
            <PrefItem2
              iconSource={<FontAwesome name="star" size={20} color="white" />}
              text="Ver avaliações"
              view="Avaliacoes"
            />
            <PrefItem2
              iconSource={
                <FontAwesome name="history" size={20} color="white" />
              }
              text="Histórico de Compras"
              view="HistoricoCompra"
            />
            {/* <PrefItem
            iconSource={<Image source={require('../assets/user/config.png')} style={styles.image} />}
            text="Configurações"
            view="Home"
          /> */}
            <PrefItem
              iconSource={themeIcon}
              text="Tema"
              onPressThemeToggle={toggleTheme}
              theme={theme}
            />

            {/* FAQ */}
            <PrefItem
              iconSource={<FontAwesome name="question-circle" size={20} color="white"/>}
              text="FAQ"
              view="Faq"
            />

            <TouchableOpacity onPress={handleLogout}>
              <View
                style={{
                  width: '87%',
                  flexDirection: 'row',
                  marginLeft: 20,
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: 20,
                }}>
                <View style={{ flexDirection: 'row' }}>
                  <Image
                    source={require('../assets/user/Logout.png')}
                    style={styles.image}
                  />
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
          onRequestClose={() => setModalVisible(false)}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <TextInput
                style={styles.input}
                placeholder="Digite o NickName"
                value={nickname}
                onChangeText={setNickname}
              />
              <TouchableOpacity
                onPress={handleSaveNickname}
                style={styles.buttomChangeName}>
                <Text style={styles.textButtom}>Alterar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.buttomCancel}>
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
          onRequestClose={() => {
            setModalProfileVisible(false);
          }}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Informações Pessoais</Text>
              {currentUser ? (
                <View>
                  <Text style={{ marginVertical: 10, fontSize: 17 }}>
                    Nome: {currentUser.nome}
                  </Text>
                  <Text style={{ marginVertical: 10, fontSize: 17 }}>
                    Email: {currentUser.email}
                  </Text>
                  <Text style={{ marginVertical: 10, fontSize: 17 }}>
                    Apelido: {currentUser.nick || 'Não definido'}
                  </Text>
                </View>
              ) : (
                <Text style={{ marginVertical: 10, fontSize: 17 }}>
                  Usuário não encontrado.
                </Text>
              )}
              <Button
                title="Fechar"
                onPress={() => {
                  setModalProfileVisible(false);
                }}
              />
            </View>
          </View>
        </Modal>
      </ScrollView>
    </Content>
  );
};

export default User;
