import React, { useEffect, useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useUser } from '../context/UserContext';
import LoadingBar from '../components/LoadingBar';
import * as SecureStore from 'expo-secure-store';
import dbContext from '../context/dbContext';

const Splash = () => {
  const { colors } = useContext(ThemeContext);
  const { findUser, setCurrentUser } = useUser(); // Remova registerUser do destructuring

  useEffect(() => {
    const initializeUser = async () => {
      const devUser = {
        nome: 'Dev',
        email: 'dev', // E-mail deve ser válido
        senha: '', // A senha deve ser definida
        nick: '', // Nickname ou outro campo que você queira
      };

      // Verifica se o usuário já está registrado
      const existingUser = await findUser(devUser.email, devUser.senha);
      if (!existingUser) {
        // Se o usuário não existir, adiciona ao contexto
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
        const user = await findUser(storedEmail, storedSenha); // Supondo que você tenha uma função para buscar o usuário pelo email
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
