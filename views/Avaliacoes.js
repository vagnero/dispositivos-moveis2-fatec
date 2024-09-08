import { Text, View, ScrollView } from 'react-native';
import Comentario from '../components/Comentario';
import Menu from '../components/Menu';

const Avaliacoes = () => {

  return (
    <View style={styles.container}>

      <Text style={styles.text_title}> Avaliações </Text>

      <View style={{ flexDirection: 'column', flexWrap: 'wrap', alignItems: 'center', marginBottom: '45%' }}>
        <ScrollView showsVerticalScrollIndicator={false}>
        
          <Comentario
            nome='Audrey'
            data='25/08/2024'
            texto='Um vinho robusto com notas de frutas vermelhas e um toque de especiarias. Excelente para acompanhar carnes vermelhas e queijos maturados. Um verdadeiro achado!'
          />
          <Comentario
            nome='José Leandro'
            data='22/08/2024'
            texto='Fresco e vibrante, com aromas de maçã verde e limão. Perfeito para uma tarde de verão ou para acompanhar pratos leves como saladas e frutos do mar.'
          />
          <Comentario
            nome='Vagner'
            data='01/08/2024'
            texto='Um rosé elegante, com sabor suave de morango e um final refrescante. Ideal para um brunch ou para uma tarde relaxante com amigos.'
          />
          <Comentario
            nome='Wesley Paulo'
            data='20/06/2024'
            texto='Bolhas finas e persistentes com um sabor refrescante de pêssego e maçã. Uma escolha excelente para celebrações e ocasiões especiais.'
          />
          <Comentario
            nome='Aldo Rosa'
            data='20/05/2024'
            texto='Encorpado e complexo, com notas de cereja preta e baunilha. Um vinho sofisticado que envelhece bem e é perfeito para jantares formais.'
          />
          <Comentario
            nome='João'
            data='05/05/2024'
            texto='Leve e agradável, com toques de pêra e mel. Bom para aperitivos e pratos de peixe, mas pode faltar um pouco de corpo para quem prefere vinhos mais robustos.'
          />
          <Comentario
            nome='Maria'
            data='10/02/2024'
            texto='Aromas intensos de ameixa e tabaco, com um paladar rico e bem equilibrado. Excelente para acompanhar pratos de carne e massas com molhos robustos.'
          />
          <Comentario
            nome='Luis'
            data='12/04/2024'
            texto='Um vinho leve e refrescante com notas de framboesa e melancia. Perfeito para um dia quente, mas pode ser um pouco simples para paladares mais exigentes.'
          />

        </ScrollView>
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

  headerText: { 
    fontSize: 35, 
    fontWeight: 'bold',
    marginTop: 30,
    marginLeft: 33,
    marginBottom: 40,
    color: '#2D0C57'
  },

  inputContainer: {
    width: "80%",
    marginBottom: 30
  },

  label: {
    marginBottom: 5,
    fontSize: 14,
    color: '#9796A1'
  },

  textInput: {
    width: "100%",
    height: 50,
    backgroundColor: "white",
    borderRadius: 10,
    borderColor: "#D9D0E3",
    borderWidth: 1, 
    paddingLeft: 10
  },

  textEsqueceuSenha: {
    marginBottom: 15,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2D0C57'
  },

  button: {
    width: 240,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2D0C57',
    borderRadius: 30,
    marginTop: 10
  },

  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold'
  },

  buttonLogin: {
    flexDirection: 'row', 
    marginTop: 30
  },

  textLogin1: {
    fontSize: 14, 
    fontWeight: 'bold', 
    color: '#5B5B5E', 
    marginRight: 5
  },

  textLogin2: {
    fontSize: 14, 
    fontWeight: 'bold', 
    color: '#2D0C57'
  }
};


export default Avaliacoes;