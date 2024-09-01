import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './views/Home';
import Categorias from './views/Categorias';
import Bordeaux from './views/Bordeaux';
import Borgonha from './views/Borgonha';
import Tinto from './views/Tinto';
import Pasta from './views/Pasta';
import Sobre from './views/Sobre';
import Cadastrar from './views/Cadastrar';
import Login from './views/Login';
import RedefinirSenha from './views/RedefinirSenha';
import User from './views/User';
import Avaliacoes from './views/Avaliacoes';
import Carrinho from './views/Carrinho';
import AvaliacaoFinal from './views/AvaliacaoFinal';
import { UserProvider } from './views/UserContext'; // Importar o UserProvider

const Stack = createNativeStackNavigator();

function App() {
  return (
    <UserProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Cadastrar">
          <Stack.Screen name="Cadastrar" component={Cadastrar} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="RedefinirSenha" component={RedefinirSenha} />
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Carrinho" component={Carrinho} />
          <Stack.Screen name="User" component={User} />
          <Stack.Screen name="Categorias" component={Categorias} />
          <Stack.Screen name="Bordeaux" component={Bordeaux} />
          <Stack.Screen name="Borgonha" component={Borgonha} />
          <Stack.Screen name="Tinto" component={Tinto} />
          <Stack.Screen name="Pasta" component={Pasta} />
          <Stack.Screen name="Sobre" component={Sobre} />
          <Stack.Screen name="Avaliacoes" component={Avaliacoes} />
          <Stack.Screen name="AvaliacaoFinal" component={AvaliacaoFinal} />
        </Stack.Navigator>
      </NavigationContainer>
    </UserProvider>
  );
}

export default App;
