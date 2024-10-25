import React, { useState, useContext } from 'react';
import { Text, View, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import HeaderUnlogged from '../components/HeaderUnlogged';
import MenuUnlogged from '../components/MenuUnlogged';
import { ThemeContext } from '../context/ThemeContext';

const RedefinirSenha = () => {
  const [email, setEmail] = useState('');
  const [mensagemErro, setMensagemErro] = useState(''); // Estado para armazenar a mensagem de erro
  const [mensagemSucesso, setMensagemSucesso] = useState(''); // Estado para armazenar a mensagem de sucesso
  const navigation = useNavigation();
  const { colors } = useContext(ThemeContext);

  const handleMessage = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Expressão regular para validar email

    if (!emailRegex.test(email)) {
      setMensagemErro('Por favor, insira um email válido.');
      setTimeout(() => {setMensagemErro('')}, 3000);
      return;
    }
    setMensagemErro('')
    setMensagemSucesso('Instruções foram enviadas para o seu email!')
    setTimeout(() => {
      navigation.navigate('Login');
      setMensagemSucesso('');
    }, 3000);
  }

  const styles = {
    div_container: {
      width: '100%',
      height: '100%',
      margin: 'auto',
      backgroundColor: colors.background,
    },
    content: {
      alignItems: 'center',
      position: 'relative',
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
      color: colors.textColor,
      textAlign: 'center'
    },
    text_email: {
      marginTop: 25,
      marginBottom: 10,
      fontSize: 16,
      color: colors.textColor,
      textAlign: 'start'
    },
    textInput: {
      width: 300,
      height: 50,
      backgroundColor: "white",
      borderRadius: 10,
      borderColor: "#D9D0E3",
      borderWidth: 1,
      paddingLeft: 10
    },
    button_senha: {
      width: 240,
      height: 60,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.button,
      borderRadius: 30,
      marginTop: 50
    },
    text_senha: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold'
    },
    buttonVoltar: {
      flexDirection: 'row',
      padding: 20,
      marginTop: 30,
    },
    textVoltar: {
      fontSize: 15,
      fontWeight: 'bold',
      color: colors.textColor,
    },
    mensagemErro: {
      position: 'absolute',
      top: 250,
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
      top: 250,
      left: 0,
      right: 0,
      fontSize: 16,
      color: 'green',
      textAlign: 'center',
      fontWeight: 'bold',
      padding: 20,
      zIndex: 999
    },
  };

  return (
    <View style={styles.div_container}>
      <HeaderUnlogged />
      <View style={styles.content}>
        <Text style={styles.text_title}>Redefinir Senha</Text>
        {mensagemErro !== '' && ( // Renderiza a mensagem de erro apenas se houver uma mensagem
          <Text style={styles.mensagemErro}>{mensagemErro}</Text>
        )}
        {mensagemSucesso !== '' && ( // Renderiza a mensagem de sucesso apenas se houver uma mensagem
          <Text style={styles.mensagemSucesso}>{mensagemSucesso}</Text>
        )}
        <Text style={styles.text_subtitle}>Digite seu e-mail para receber instruções
          sobre como redefini-lo</Text>

        <Text style={styles.text_email}>E-mail</Text>
        <TextInput
          style={styles.textInput}
          onChangeText={text => setEmail(text.toLowerCase())}
          value={email}
        />

        <TouchableOpacity style={styles.button_senha} onPress={handleMessage}>
          <Text style={styles.text_senha}>ENVIAR NOVA SENHA</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.buttonVoltar}>
          <Text style={styles.textVoltar}>Voltar</Text>
        </TouchableOpacity>
      </View>
      <MenuUnlogged />
    </View>
  );
};

export default RedefinirSenha;