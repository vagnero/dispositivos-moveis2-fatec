import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AvaliacaoFinal from './views/AvaliacaoFinal';
import Avaliacoes from './views/Avaliacoes';
import Bordeaux from './views/Bordeaux';
import Borgonha from './views/Borgonha';
import Cadastrar from './views/Cadastrar';
import Carrinho from './views/Carrinho';
import Categorias from './views/Categorias';
import Home from './views/Home';
import Login from './views/Login';
import Pasta from './views/Pasta';
import RedefinirSenha from './views/RedefinirSenha';
import Splash from './views/Splash';
import Sobre from './views/Sobre';
import Tinto from './views/Tinto';
import User from './views/User';
import { UserProvider } from './views/UserContext';

const Stack = createNativeStackNavigator();

function App() {
  const [isSplashReady, setSplashReady] = useState(false);

  useEffect(() => {
    // Simula um delay para exibir a tela de splash
    const timer = setTimeout(() => {
      setSplashReady(true);
    }, 1000); // Tempo de splash 

    return () => clearTimeout(timer);
  }, []);

  return (
    <UserProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          {isSplashReady ? (
            <>
              <Stack.Screen name="Login" component={Login} />
              <Stack.Screen name="Home" component={Home} />
              <Stack.Screen name="AvaliacaoFinal" component={AvaliacaoFinal} />
              <Stack.Screen name="Avaliacoes" component={Avaliacoes} />
              <Stack.Screen name="Bordeaux" component={Bordeaux} />
              <Stack.Screen name="Borgonha" component={Borgonha} />
              <Stack.Screen name="Cadastrar" component={Cadastrar} />
              <Stack.Screen name="Carrinho" component={Carrinho} />
              <Stack.Screen name="Categorias" component={Categorias} />
              <Stack.Screen name="Pasta" component={Pasta} />
              <Stack.Screen name="RedefinirSenha" component={RedefinirSenha} />
              <Stack.Screen name="Tinto" component={Tinto} />
              <Stack.Screen name="Sobre" component={Sobre} />
              <Stack.Screen name="User" component={User} />
            </>
          ) : (
            <Stack.Screen name="Splash" component={Splash} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </UserProvider>
  );
}

export default App;
