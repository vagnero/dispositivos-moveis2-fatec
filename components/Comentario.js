import React, { useContext } from 'react';
import { Text, View } from 'react-native';
import { ThemeContext } from '../context/ThemeContext';

const Comentario = ({ nome, data, texto }) => {
  const { colors } = useContext(ThemeContext);

  const styles = {
    div_comentario: {
      marginBottom: '1%',
      marginTop: 20,
    },
  
    div_text_comentario: {
      flexDirection: 'row',
      justifyContent: 'space-between'
    },
  
    text_nome: {
      fontSize: 15,
      color: 'black',
      fontWeight: 'bold',
      marginBottom: '2%',
      
    },
  
    text_data: {
      fontSize: 13,
      color: colors.textColor,
      
    },
  
    text_coment: {
      fontSize: 13,
      textAlign: 'justify'
    }
  };

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

export default Comentario;