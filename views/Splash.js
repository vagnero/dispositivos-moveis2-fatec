import React, { useState, useEffect, useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { View, Text, ActivityIndicator, Image, StyleSheet } from 'react-native';
import { useUser } from '../context/UserContext';
import LoadingBar from '../components/LoadingBar';

const Splash = () => {
  const { colors } = useContext(ThemeContext);
  const { registerUser, setCurrentUser } = useUser();
  const [nome] = useState('Dev');
  const [email] = useState('dev');
  const [senha] = useState('');

  useEffect(() => {
    if (registerUser) {
      registerUser({ nome, email, senha });
    }
    setCurrentUser(null)
  }, []);


  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.background,
    },
    text: {
      fontSize: 24,
      marginBottom: 20,
      color: colors.primary,
    },
    logo: {
      width: 200,
      height: 250,
      marginBottom: 50,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Os Melhores Vinhos!</Text>
      <Image
        source={require('../assets/splash/IlustracaoSplash.png')} // Coloque a imagem de splash aqui
        style={styles.logo}
      />
      <LoadingBar />
    </View>
  );
};

export default Splash;
