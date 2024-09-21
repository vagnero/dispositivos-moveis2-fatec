import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, Image, StyleSheet } from 'react-native';
import { useUser } from './UserContext';


const Splash = () => {
  const [nome, setNome] = useState('Dev');
  const [email, setEmail] = useState('dev');
  const [senha, setSenha] = useState('');
  const { registerUser } = useUser();

  useEffect(() => {
    if (registerUser) {
      registerUser({ nome, email, senha }); // Registro do usuário ao carregar o componente
    }
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Os Melhores Vinhos!</Text>
      <Image
        source={require('../assets/splash.png')} // Coloque a imagem de splash aqui
        style={styles.logo}
      />
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    marginBottom: 20,
  },
  logo: {
    marginTop: 100,
    width: 200,
    height: 250,
    marginBottom: 100,
  },
});

export default Splash;
