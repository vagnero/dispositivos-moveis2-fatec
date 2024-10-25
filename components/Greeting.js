import React, { useContext } from 'react';
import { Text } from 'react-native';
import { ThemeContext } from '../context/ThemeContext';

const Greeting = ({ name }) => {
  const { colors } = useContext(ThemeContext);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      return 'Bom dia';
    } else if (hour >= 12 && hour < 18) {
      return 'Boa tarde';
    } else {
      return 'Boa noite';
    }
  };

  const styles = {
    text_saudacao: {
      fontSize: 16,
      flexWrap: 'nowrap',
      marginBottom: 10,
      color: colors.textColor,
    },  
    text_get_greeting: {
      color: colors.textColor,
      fontWeight: 'bold'
    }
  };

  return (
    <Text style={styles.text_saudacao} numberOfLines={1}>
        <Text style={styles.text_get_greeting}> {getGreeting()}! </Text>
        {name || ''}
    </Text>
  );
};

export default Greeting;
