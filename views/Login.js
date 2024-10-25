import React, { useState, useContext, useCallback } from 'react';
import { Text, View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Checkbox } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { BackHandler, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useUser } from '../context/UserContext';
import HeaderUnlogged from '../components/HeaderUnlogged';
import MenuUnlogged from '../components/MenuUnlogged';
import { ThemeContext } from '../context/ThemeContext';
import * as SecureStore from 'expo-secure-store';

const Login = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loginSucesso, setLoginSucesso] = useState(false);
  const [mensagemErro, setMensagemErro] = useState(''); // Estado para armazenar a mensagem de erro
  const [salvarEmail, setSalvarEmail] = useState(false); // Estado para a checkbox
  const navigation = useNavigation();
  const { findUser, setCurrentUser } = useUser(); // Remova registerUser do destructuring
  const { colors } = useContext(ThemeContext);

  useFocusEffect(
    React.useCallback(() => {
      // Cria uma função assíncrona dentro do efeito
      async function fetchEmail() {
        try {
          const emailSalvo = await SecureStore.getItemAsync('userEmail');
          if (emailSalvo) {
            setEmail(emailSalvo); // Seta o email salvo
          } else {
            setEmail('')
          }
        } catch (error) {
          console.log('Erro ao buscar email salvo:', error);
        }
      }
      // Chama a função assíncrona
      fetchEmail();
    }, [])
  );

  const handleLogin = async () => {
    if (!email) {
      setMensagemErro('Por favor, preencha todos os campos.');
      setTimeout(() => {setMensagemErro('')}, 2000);
      return;
    }

    const user = await findUser(email, senha); // Aguarde a busca do usuário
    if (user) {
      setLoginSucesso(true);
      setCurrentUser(user);
      setMensagemErro('');
      if (salvarEmail) {
        await SecureStore.setItemAsync('userEmail', email);
        await SecureStore.setItemAsync('userPassword', senha);
      } else {
        await SecureStore.deleteItemAsync('userEmail');
      }
      setTimeout(() => {
        navigation.navigate('Home');
        setSenha('');
        setLoginSucesso(false);
      }, 2000);
    } else {
      setMensagemErro('Credenciais Inválidas');
      setTimeout(() => {setMensagemErro('')}, 2000);
    }
  };

  // Impede o usuário de sair do aplicativo sem intenção
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        Alert.alert(
          'Atenção',
          'Você quer sair do aplicativo?',
          [
            { text: 'Cancelar', onPress: () => null, style: 'cancel' },
            { text: 'Sim', onPress: () => BackHandler.exitApp() }, // Sai do app
          ],
          { cancelable: false }
        );
        return true; // Bloqueia o botão de voltar
      };

      // Adiciona o listener para o botão de voltar
      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      // Remove o listener quando a tela perder o foco ou desmontar
      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [])
  );

  const styles = StyleSheet.create({
    container: {
      width: '100%',
      height: '100%',
      backgroundColor: colors.background,
    },
    headerText: {
      fontSize: 35,
      fontWeight: 'bold',
      marginTop: 30,
      textAlign: 'center',
      marginBottom: 40,
      color: colors.textColor,
    },
    inputContainer: {
      width: "80%",
      podition: 'absolute',
      marginBottom: 30
    },
    label: {
      marginBottom: 5,
      fontSize: 14,
      color: colors.textColor,
    },
    textInput: {
      width: "100%",
      height: 50,
      backgroundColor: "white",
      borderRadius: 10,
      borderColor: "#D9D0E3",
      borderWidth: 1,
      paddingLeft: 10
    },
    checkboxContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20
    },
    textEsqueceuSenha: {
      marginBottom: 15,
      fontSize: 14,
      fontWeight: 'bold',
      color: colors.textColor,
    },
    button: {
      width: 240,
      height: 60,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.button,
      borderRadius: 30,
      marginTop: 10
    },
    buttonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold'
    },
    buttonLogin: {
      flexDirection: 'row',
      marginTop: 30
    },
    text: {
      fontSize: 14,
      fontWeight: 'bold',
      color: '#5B5B5E',
      marginRight: 5
    },
    textCadastrar: {
      fontSize: 14,
      fontWeight: 'bold',
      color: colors.textColor,
    },
    mensagemErro: {
      position: 'absolute',
      top: 160,
      left: 0,
      right: 0,
      fontSize: 16,
      color: 'red',
      textAlign: 'center',
      fontWeight: 'bold',
      padding: 20,
      zIndex: 999
    },
    mensagemSucesso: {
      position: 'absolute',
      top: 170,
      left: 0,
      right: 0,
      fontSize: 16,
      color: 'green',
      textAlign: 'center',
      fontWeight: 'bold',
      padding: 20,
      zIndex: 999
    },
  });

  return (
    <View style={styles.container}>
      <HeaderUnlogged />
      <Text style={styles.headerText}>Login</Text>
      <View style={{ justifyContent: 'center', alignItems: 'center' }}>
        <View style={styles.inputContainer}>
          {mensagemErro !== '' && ( // Renderiza a mensagem de erro apenas se houver uma mensagem
            <Text style={styles.mensagemErro}>{mensagemErro}</Text>
          )}

          <Text style={styles.label}>E-mail</Text>
          <TextInput
            style={styles.textInput}
            onChangeText={text => setEmail(text.toLowerCase())}
            value={email}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Senha</Text>
          <TextInput
            style={styles.textInput}
            onChangeText={text => setSenha(text)}
            value={senha}
            secureTextEntry={true}
          />
        </View>

        <View style={styles.checkboxContainer}>
          <TouchableOpacity
            style={{ flexDirection: 'row', alignItems: 'center' }}
            onPress={() => setSalvarEmail(!salvarEmail)} // Clique no texto também altera o checkbox
          >
            <View style={{ marginBottom: 10 }}>
              <Checkbox
                status={salvarEmail ? 'checked' : 'unchecked'}
                onPress={() => setSalvarEmail(!salvarEmail)}
              />
            </View>
            <Text style={styles.label}>Salvar Login</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => navigation.navigate('RedefinirSenha')}>
          <Text style={styles.textEsqueceuSenha}>Esqueceu sua senha?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        {loginSucesso && (
          <Text style={styles.mensagemSucesso}>Login realizado com sucesso!</Text>
        )}

        <TouchableOpacity onPress={() => navigation.navigate('Cadastrar')} style={styles.buttonLogin}>
          <Text style={styles.text}>Não tem uma conta?</Text>
          <Text style={styles.textCadastrar}>Cadastrar</Text>
        </TouchableOpacity>
      </View>
      <MenuUnlogged />
    </View >
  );
}

export default Login;
