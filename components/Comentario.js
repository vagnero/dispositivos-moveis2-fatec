import React, { useContext } from 'react';
import { Text, View } from 'react-native';
import { ThemeContext } from '../context/ThemeContext';
import { FontAwesome } from '@expo/vector-icons';

const Comentario = ({ nome, rate, data, texto }) => {
  const { colors } = useContext(ThemeContext);

  const styles = {
    div_comentario: {
      marginBottom: '1%',
      marginTop: 20,
      backgroundColor: colors.card,
      padding: 10,
      borderRadius: 10,
    },
    div_text_comentario: {
      flexDirection: 'row',
      justifyContent: 'space-between'
    },
    text_nome: {
      width: '63%',
      fontSize: 15,
      color: colors.text,
      fontWeight: 'bold',
    },
    text_rate: {
      fontSize: 15,
      color: colors.text,
      marginLeft: 10,
      marginBottom: '2%',
    },
    text_data: {
      fontSize: 13,
      color: colors.text,
    },
    star: {
      marginLeft: 5,
      marginRight: 15,
      marginTop: 2,
    },
    text_coment: {
      fontSize: 13,
      color: colors.text,
      textAlign: 'justify'
    }
  };

  return (
    <View style={styles.div_comentario}>
      <View style={styles.div_text_comentario}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={styles.text_nome}>
            {nome.length > 30 ? `${nome.substring(0, 28)}...` : nome}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
            <Text style={styles.text_rate}>{rate}</Text>
            <FontAwesome
              name={'star'}
              size={15}
              color={'#FFD700'}
              style={styles.star}
            />
            <Text style={styles.text_data}>{data}</Text>
          </View>
        </View>
      </View>
      <Text style={styles.text_coment}>{texto}</Text>
    </View>
  );
};

export default Comentario;