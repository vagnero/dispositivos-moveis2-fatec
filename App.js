import React, { useState, useEffect, useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ThemeProvider } from './context/ThemeContext';

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
    <UserProvider >
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
  const { colors } = useContext(ThemeContext); // Aqui você pode usar o useContext

  return (
    <Stack.Navigator initialRouteName="Home"
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.primary, // Cor de fundo da barra
        },
        headerTintColor: 'white', // Cor do texto (e ícones) na barra
        headerTitleStyle: {
          fontWeight: 'bold', // Estilos adicionais para o título
        },
        headerShown: false,
      }}>

      {isSplashReady ? (
        <>
          <Stack.Screen name="AddressRegistrationScreen" component={AddressRegistrationScreen} />
          <Stack.Screen name="AvaliacaoFinal" component={AvaliacaoFinal} />
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
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="ManagerAddress" component={ManagerAddress} />
          <Stack.Screen name="Notificacoes" component={Notificacoes} />
          <Stack.Screen name="MethodPayment" component={MethodPayment} />
          <Stack.Screen name="PixPayment" component={PixPayment} />
          <Stack.Screen name="RedefinirSenha" component={RedefinirSenha} />
          <Stack.Screen name="Tinto" component={Tinto} />
          <Stack.Screen name="Sobre" component={Sobre} />
          <Stack.Screen name="User" component={User} />
        </>
      ) : (
        <Stack.Screen name="Splash" component={Splash} />
      )}
    </Stack.Navigator>
  );
};

export default App;
