import { Text, View, Image } from 'react-native';
import Menu from '../components/Menu';
import PrefItem from '../components/PrefItem';
import Greeting from '../components/Greeting';
import { useUser } from './UserContext';

const User = () => {
  const { currentUser } = useUser(); 

  return (
    <View style={styles.container}>

      <View style={styles.div_perfil}>
        <Image style={styles.image_perfil} source={require('../assets/user/woman.png')}/>
       <View style={styles.div_saudacao_pesquisar}>
        {currentUser && <Greeting name={currentUser.nome} />}
        
      </View>
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
          view="Home"
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
        <PrefItem
          iconSource={require('../assets/user/Logout.png')}
          text="Sair"
          view="Login"
        />
      </View>

      <Menu/>
    </View>
  );
};

const styles = {
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: '#F6F5F5'
  },

  div_perfil: {
    width: '100%',
    height: '25%',
    backgroundColor: '#F6F5F5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly'
  },

  image_perfil: {
    width: 100,
    height: 100
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
    backgroundColor: '#FFFFFF',
    borderRadius: 25
  }
};

export default User;