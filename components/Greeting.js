import React, { useContext } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { ThemeContext } from '../context/ThemeContext';
import { FontAwesome } from '@expo/vector-icons';
import NotificationsIconWithBadge from './NotificationsIconWithBadge';
import { useNotifications } from '../context/NotificationContext';
import { useNavigation } from '@react-navigation/native';

const Greeting = ({ name }) => {
  const { colors } = useContext(ThemeContext);
  const { countUnreadNotifications } = useNotifications();
  const unreadCount = countUnreadNotifications();
  const navigation = useNavigation();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      return 'Bem vindo(a)';
    } else if (hour >= 12 && hour < 18) {
      return 'Bem vindo(a)';
    } else {
      return 'Bem vindo(a)';
    }
  };

  const styles = {
    greetingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between', // Alinha os ícones à direita
      flex: 0.95, // Permite que o container ocupe todo o espaço
    },
    text_saudacao: {
      fontSize: 16,
      paddingBottom: 4,
      color: colors.textColor,
    },
    text_get_greeting: {
      color: colors.textColor,
      fontWeight: 'bold',
    },
    iconContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    icon: {
      marginHorizontal: 5,
      color: colors.iconColor,
    },
  };

  return (
    <View style={styles.greetingContainer}>
      <Text style={styles.text_saudacao} numberOfLines={1}>
        <Text style={styles.text_get_greeting}> {getGreeting()}, </Text>
        {name || ''}
      </Text>
      <View style={styles.iconContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('Favoritos')}>
          <FontAwesome name="heart" size={20} style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Notificacoes')}>
          <NotificationsIconWithBadge unreadCount={unreadCount} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Greeting;
