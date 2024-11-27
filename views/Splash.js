import React, { useEffect, useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useUser } from '../context/UserContext';
import LoadingBar from '../components/LoadingBar';
import * as SecureStore from 'expo-secure-store';
import dbContext from '../context/dbContext';

const Splash = () => {
  const { colors } = useContext(ThemeContext);
  const { findUser, setCurrentUser } = useUser();

  useEffect(() => {
    const initializeUser = async () => {
      const devUser = {
        nome: 'Dev',
        email: 'dev',
        senha: '',
        nick: '',
      };

      const existingUser = await findUser(devUser.email, devUser.senha);
      if (!existingUser) {
        dbContext.addItem('users', devUser);
        console.log('Usuário registrado:', devUser);
      } else {
        console.log('Usuário já existe:', existingUser);
      }
    };
    initializeUser();
  }, [findUser]);

  const checkUserLogin = async () => {
    try {
      const storedEmail = await SecureStore.getItemAsync('userEmail');
      const storedSenha = await SecureStore.getItemAsync('userPassword');
      
      if (storedEmail && storedSenha) {
        const user = await findUser(storedEmail, storedSenha);
        if (user) {
          setCurrentUser(user);
        } else {
          setCurrentUser(null);
        }
      } else {
        setCurrentUser(null);
      }
    } catch (error) {
      console.error('Erro ao verificar login do usuário:', error);
      setCurrentUser(null);
    }
  };

  useEffect(() => {
    checkUserLogin();
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
      marginBottom: 10,
      color: colors.primary,
      textAlign: 'center',
    },
    logo: {
      width: 200,
      height: 250,
      marginBottom: 20,
    },
    subText: {
      fontSize: 20,  // Tamanho maior
      color: '#fff',  // Cor branca
      textAlign: 'center',
      fontWeight: 'bold',  // Negrito
      paddingHorizontal: 20,  // Adicionando espaçamento horizontal
      marginTop: 10,  // Ajustando o espaçamento entre o texto e a logo
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Os Melhores Vinhos!</Text>
      <Image
        source={require('../assets/splash/IlustracaoSplash.png')}
        style={styles.logo}
      />
      <Text style={styles.subText}>Os melhores momentos se tornam inesquecíveis quando acompanhados por um bom vinho.</Text>
      <LoadingBar />
    </View>
  );
};

export default Splash;
