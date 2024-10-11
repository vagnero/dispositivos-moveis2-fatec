import React, { useState, useEffect, useContext } from 'react';
import { Text, View, Image, TouchableOpacity } from 'react-native';
import Menu from '../components/Menu';
import PrefItem from '../components/PrefItem';
import { useUser } from '../context/UserContext';
import { ThemeContext } from '../context/ThemeContext';
import Content from '../components/Content';

const User = () => {
  const { colors } = useContext(ThemeContext);
  const { currentUser, setCurrentUser } = useUser();

  const handleLogout = () => {
    setCurrentUser(null); // Limpa o usuário atual
    setMensagemErro(''); // Opcional: limpa a mensagem de erro se for necessário
  
    // Redireciona para a tela de login
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };
  

  const styles = {
    container: {
      flex: 1,
    },

    div_perfil: {
      width: '100%',
      height: '25%',
      // backgroundColor: '#F6F5F5',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-evenly'
    },

    image_perfil: {
      width: 100,
      height: 100
    },

    text_perfil: {
      color: colors.textColor,
      textAlign: 'left',
      fontSize: 25,
      width: 250,
    },

    text_nome: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#2D0C57'
    },

    text_desc: {
      marginTop: 10,
      fontSize: 14,
      color: '#A0A5BA'
    },

    div_conteudo_pref: {
      width: '100%',
      height: '100%',
      backgroundColor: colors.wineCardBackground,
      borderRadius: 25
    }
  };

  return (
    <Content>
      <View style={styles.container}>

        <View style={styles.div_perfil}>
          <Image style={styles.image_perfil} source={require('../assets/user/woman.png')} />
          {currentUser &&
            <Text style={styles.text_perfil}>{currentUser.nome}</Text>}
        </View>

        <View style={styles.div_conteudo_pref}>
          <PrefItem
            iconSource={require('../assets/user/perfil.png')}
            text="Informações pessoais"
            view="Home"
          />
          <PrefItem
            iconSource={require('../assets/user/map.png')}
            text="Endereços"
            view="Home"
          />
          <PrefItem
            iconSource={require('../assets/user/cartao.png')}
            text="Forma de pagamento"
            view="Home"
          />
          <PrefItem
            iconSource={require('../assets/user/sino.png')}
            text="Notificações"
            view="Notificacoes"
          />
          <PrefItem
            iconSource={require('../assets/user/grid.png')}
            text="Ver avaliações"
            view="Avaliacoes"
          />
          <PrefItem
            iconSource={require('../assets/user/faqs.png')}
            text="FAQs"
            view="Home"
          />
          <PrefItem
            iconSource={require('../assets/user/config.png')}
            text="Configurações"
            view="Home"
          />
          <TouchableOpacity onPress={handleLogout}
          style={{ marginTop: 20 }}>
            <PrefItem
              iconSource={require('../assets/user/Logout.png')}
              text="Sair"
              view="Login"
            />
          </TouchableOpacity>
        </View>
        <Menu />
      </View>
    </Content>
  );
};

export default User;