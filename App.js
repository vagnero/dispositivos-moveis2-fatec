import React, { useState, useEffect, useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ThemeProvider } from './context/ThemeContext';
import { useUser } from './context/UserContext';
import { LinearGradient } from 'expo-linear-gradient'; // Importe o LinearGradient

import AddressRegistrationScreen from './views/AddressRegistrationScreen';
import AvaliacaoFinal from './views/AvaliacaoFinal';
import Avaliacoes from './views/Avaliacoes';
import Boleto from './views/Boleto';
import Branco from './views/Branco';
import Rose from './views/Rose';
import Cadastrar from './views/Cadastrar';
import Carrinho from './views/Carrinho';
import Categorias from './views/Categorias';
import ConfirmPayment from './views/ConfirmPayment';
import Espumante from './views/Espumante';
import Favoritos from './views/Favoritos';
import HistoricoCompra from './views/HistoricoCompra';
import Home from './views/Home';
import Login from './views/Login';
import ManagerAddress from './views/ManagerAddress';
import Notificacoes from './views/Notificacoes';
import MethodPayment from './views/MethodPayment';
import PixPayment from './views/PixPayment';
import RedefinirSenha from './views/RedefinirSenha';
import Splash from './views/Splash';
import Sobre from './views/Sobre';
import Tinto from './views/Tinto';
import User from './views/User';
import { UserProvider } from './context/UserContext';
import { ThemeContext } from './context/ThemeContext';
import { NotificationProvider } from './context/NotificationContext';
import Greeting from './components/Greeting';

const Stack = createNativeStackNavigator();

function App() {
  const [isSplashReady, setSplashReady] = useState(false);

  useEffect(() => {
    // Simula um delay para exibir a tela de splash
    const timer = setTimeout(() => {
      setSplashReady(true);
    }, 2000); // Tempo de splash 

    return () => clearTimeout(timer);
  }, []);

  return (
    <UserProvider>
      <ThemeProvider>
        <NotificationProvider>
          <NavigationContainer>
            <MainNavigator isSplashReady={isSplashReady} />
          </NavigationContainer>
        </NotificationProvider>
      </ThemeProvider>
    </UserProvider>
  );
}

const MainNavigator = ({ isSplashReady }) => {
  const { colors } = useContext(ThemeContext);
  const { currentUser } = useUser();

 const titles = {
  Home: 'Página Inicial',
  AddressRegistrationScreen: 'Cadastro de Endereços',
  AvaliacaoFinal: 'Avaliação Final',
  Login: 'Entrar', // Renomeado para "Entrar"
  User: 'Perfil do Usuário',
  ManagerAddress: 'Endereços',
  // Adicione outros títulos conforme necessário
};

return (
  <Stack.Navigator
    initialRouteName="Home"
    screenOptions={{
      headerStyle: {
        backgroundColor: colors.primary,
        height: 5,
      },
      headerTintColor: 'white',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
      headerShown: true,
    }}
  >
    {isSplashReady ? (
      <>
        <Stack.Screen
          name="Home"
          component={Home}
          options={{
            headerTitle: () => (
              <Greeting name={currentUser ? (currentUser.nick || currentUser.nome) : ""} />
            )
          }}
        />
        <Stack.Screen 
          name="AddressRegistrationScreen" 
          component={AddressRegistrationScreen} 
          options={{ title: titles.AddressRegistrationScreen }} 
        />
        <Stack.Screen 
          name="AvaliacaoFinal" 
          component={AvaliacaoFinal} 
          options={{ title: titles.AvaliacaoFinal }} 
        />
        <Stack.Screen name="Avaliacoes" component={Avaliacoes} />
        <Stack.Screen name="Boleto" component={Boleto} />
        <Stack.Screen name="Branco" component={Branco} />
        <Stack.Screen name="Rose" component={Rose} />
        <Stack.Screen name="Cadastrar" component={Cadastrar} />
        <Stack.Screen name="Carrinho" component={Carrinho} />
        <Stack.Screen name="Categorias" component={Categorias} />
        <Stack.Screen name="ConfirmPayment" component={ConfirmPayment} />
        <Stack.Screen name="Espumante" component={Espumante} />
        <Stack.Screen name="Favoritos" component={Favoritos} />
        <Stack.Screen name="HistoricoCompra" component={HistoricoCompra} />
        <Stack.Screen 
          name="Login" 
          component={Login} 
          options={{ title: titles.Login }} // Utiliza o título do objeto
        />
        <Stack.Screen name="ManagerAddress" component={ManagerAddress} options={{ title: titles.ManagerAddress }} />
        <Stack.Screen name="Notificacoes" component={Notificacoes} />
        <Stack.Screen name="MethodPayment" component={MethodPayment} />
        <Stack.Screen name="PixPayment" component={PixPayment} />
        <Stack.Screen name="RedefinirSenha" component={RedefinirSenha} />
        <Stack.Screen name="Tinto" component={Tinto} />
        <Stack.Screen name="Sobre" component={Sobre} />
        <Stack.Screen 
          name="User" 
          component={User} 
          options={{ title: titles.User }} 
        />
      </>
    ) : (
      <Stack.Screen name="Splash" component={Splash} />
    )}
  </Stack.Navigator>
);
};

export default App;
