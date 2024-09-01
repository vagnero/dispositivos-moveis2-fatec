import { Text, View } from 'react-native';

const Comentario = ({ nome, data, texto }) => {

  return (
    <View style={styles.div_comentario}>
      <View style={styles.div_text_comentario}>
        <Text style={styles.text_nome}>{nome}</Text>
        <Text style={styles.text_data}>{data}</Text>
      </View>
      <Text style={styles.text_coment}>{texto}</Text>
    </View>
  );
};

const styles = {
  div_comentario: {
    width: 330,
    height: 100,
    marginBottom: '1%'
  },

  div_text_comentario: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },

  text_nome: {
    fontSize: 15,
    color: 'black',
    fontWeight: 'bold',
    marginLeft: '5%',
    marginBottom: '2%'
  },

  text_data: {
    fontSize: 13,
    color: '#B3B3B3',
    marginRight: '10%'
  },

  text_coment: {
    width: 300,
    marginLeft: '5%',
    fontSize: 13,
    textAlign: 'justify'
  }
};

export default Comentario;