import React, { useState } from 'react';
import { Text, View, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const RedefinirSenha = () => {
  const [email, setEmail] = useState('');
  const [mensagemErro, setMensagemErro] = useState(''); // Estado para armazenar a mensagem de erro
  const [mensagemSucesso, setMensagemSucesso] = useState(''); // Estado para armazenar a mensagem de sucesso
  const navigation = useNavigation();

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

  return (
    <View style={styles.div_container}>
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
  );
};

const styles = {
  div_container: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    backgroundColor: '#F6F5F5'
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

  text_email: {
    marginTop: 25,
    marginBottom: 10,
    fontSize: 16,
    color: '#9796A1',
    textAlign: 'start'
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

  button_senha: {
    width: 240,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2D0C57',
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

export default RedefinirSenha;