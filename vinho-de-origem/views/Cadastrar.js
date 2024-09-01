import React, { useState } from 'react';
import { Text, View, SafeAreaView, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useUser } from './UserContext';

const Cadastrar = () => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mensagemErro, setMensagemErro] = useState(''); // Estado para armazenar a mensagem de erro
  const [mensagemSucesso, setMensagemSucesso] = useState(''); // Estado para armazenar a mensagem de sucesso
  const navigation = useNavigation();
  const { registerUser } = useUser();

  const handleRegister = () => {
    if (nome === '' || email === '' || senha === '') { // Verifica se algum campo está vazio
      setMensagemErro('Por favor, preencha todos os campos.'); // Define a mensagem de erro
      setMensagemSucesso(''); // Limpa a mensagem de sucesso
    } else {
      registerUser({ nome, email, senha });
      setMensagemSucesso('Cadastro realizado com sucesso!'); // Define a mensagem de sucesso
      setMensagemErro(''); // Limpa a mensagem de erro
      setTimeout(() => {
        navigation.navigate('Login');
      }, 2000); // Redireciona para a página de login após 2 segundos
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerText}>Cadastrar</Text>
      <View style={{ justifyContent: 'center', alignItems: 'center' }}>
        {mensagemErro !== '' && ( // Renderiza a mensagem de erro apenas se houver uma mensagem
          <Text style={styles.mensagemErro}>{mensagemErro}</Text>
        )}
        {mensagemSucesso !== '' && ( // Renderiza a mensagem de sucesso apenas se houver uma mensagem
          <Text style={styles.mensagemSucesso}>{mensagemSucesso}</Text>
        )}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Nome Completo</Text>
          <TextInput
            style={styles.textInput}
            onChangeText={text => setNome(text)}
            value={nome}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>E-mail</Text>
          <TextInput
            style={styles.textInput}
            onChangeText={text => setEmail(text)}
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
        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Cadastrar</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.buttonLogin}>
          <Text style={styles.textLogin1}>Já tem uma conta?</Text>
          <Text style={styles.textLogin2}>Login</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = {
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: '#F6F5F5'
  },

  headerText: { 
    fontSize: 35, 
    fontWeight: 'bold',
    marginTop: 30,
    marginLeft: 33,
    marginBottom: 40,
    color: '#2D0C57'
  },

  inputContainer: {
    width: "80%",
    marginBottom: 30
  },

  label: {
    marginBottom: 5,
    fontSize: 14,
    color: '#9796A1'
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

  button: {
    width: 240,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2D0C57',
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

  textLogin1: {
    fontSize: 14, 
    fontWeight: 'bold', 
    color: '#5B5B5E', 
    marginRight: 5
  },

  textLogin2: {
    fontSize: 14, 
    fontWeight: 'bold', 
    color: '#2D0C57'
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

export default Cadastrar;
