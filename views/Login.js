// Login.js

import React, { useState } from 'react';
import { Text, View, SafeAreaView, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useUser } from './UserContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loginSucesso, setLoginSucesso] = useState(false);
  const navigation = useNavigation();
  const { findUser, setCurrentUser } = useUser(); // Remova registerUser do destructuring

   const handleLogin = () => {
    const user = findUser(email, senha);
    if (user) {
      setLoginSucesso(true);
      setCurrentUser(user);
      setTimeout(() => {
        navigation.navigate('Home');
      }, 2000);
    } else {
      alert('Usuário não encontrado. Por favor, verifique suas credenciais ou faça o cadastro.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerText}>Login</Text>
      <View style={{ justifyContent: 'center', alignItems: 'center' }}>
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
          <Text style={styles.textLogin1}>Não tem uma conta?</Text>
          <Text style={styles.textLogin2}>Cadastrar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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

  textEsqueceuSenha: {
    marginBottom: 15,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2D0C57'
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

  mensagemSucesso: {
    marginTop: 20,
    fontSize: 16,
    color: 'green',
    fontWeight: 'bold'
  }
});

export default Login;
