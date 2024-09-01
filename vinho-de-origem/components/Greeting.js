import React from 'react';
import { Text } from 'react-native';

const Greeting = ({ name }) => {
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

  return (
    <Text style={styles.text_saudacao}>
        Olá {name || 'Carla'},
        <Text style={styles.text_get_greeting}> {getGreeting()}! </Text>
    </Text>
  );
};

const styles = {
  text_saudacao: {
    fontSize: 16, 
    marginBottom: 10
  },

  text_get_greeting: {
    color: '#2D0C57', 
    fontWeight: 'bold'
  }
};

export default Greeting;
