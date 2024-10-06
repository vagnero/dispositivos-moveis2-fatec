import React, { useState, useContext } from 'react';
import { Text, View, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Header2 from '../components/Header2';
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

    mensagemErro: {
      marginTop: 10,
      marginBottom: 25,
      color: 'red',
      fontWeight: 'bold'
    },

    mensagemSucesso: {
      marginTop: 20,
      fontSize: 16,
      color: 'green',
      fontWeight: 'bold',
      marginTop: '100',
      marginBottom: '20'
    }
  };

  return (
      <View style={styles.div_container}>
        <Header2 />
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
        </View>
      </View>
  );
};

export default RedefinirSenha;