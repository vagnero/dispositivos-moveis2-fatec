import React, { useContext } from 'react';
import { Image, View, StyleSheet, TouchableOpacity } from 'react-native';
import Greeting from '../components/Greeting';
import { LinearGradient } from 'expo-linear-gradient';
import { useUser } from '../context/UserContext';
import { FontAwesome } from '@expo/vector-icons';
import { ThemeContext } from '../context/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import NotificationsIconWithBadge from './NotificationsIconWithBadge';
import { useNotifications } from '../context/NotificationContext';

const Header = () => {
    const { theme, toggleTheme, colors } = useContext(ThemeContext);
    const { currentUser } = useUser();
    const navigation = useNavigation();
    const { countUnreadNotifications } = useNotifications();
    const unreadCount = countUnreadNotifications();

    const styles = StyleSheet.create({
        content: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1,
        },
        header: {
            width: '100%',
            backgroundColor: colors.background,
            minHeight: 100,
            justifyContent: 'center', // Centraliza verticalmente
            alignItems: 'center', // Centraliza horizontalmente
            
        },
        div_saudacao_pesquisar: {
            flexDirection: 'row', // Coloca Greeting e ícones na mesma linha
            alignItems: 'center', // Centraliza verticalmente os itens
            width: '90%', // Pode ajustar a largura como preferir
            justifyContent: 'space-between', // Espaça os elementos igualmente
            marginTop: 60, // Aumente este valor para mais espaço
        },
        icon: {
            color: colors.iconColor,
            fontSize: 24, // Tamanho do ícone
            marginLeft: 10, // Diminuí o espaço entre o nome e os ícones
        },
        greeting: {
            marginRight: 10, // Ajuste este valor conforme necessário
        },
    });

    return (
        <View style={styles.content}>
            <LinearGradient
                colors={[colors.bottomHeaderGradient, colors.topHeaderGradient]}
                style={styles.header}
                start={{ x: 0, y: 0 }} // Início do degradê (cima)
                end={{ x: 0, y: 1 }} // Fim do degradê (baixo)
            >
                <View style={styles.div_saudacao_pesquisar}>
                    <View style={{ flex: 1, alignItems: 'flex-start' }}>
                        <Greeting name={currentUser ? (currentUser.nick || currentUser.nome) : ""} />
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <TouchableOpacity onPress={() => navigation.navigate('Favoritos')}>
                            <Image
                                source={require('../assets/info/heart.png')}
                                style={{ tintColor: colors.iconColor }}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate('Notificacoes')}>
                            <NotificationsIconWithBadge unreadCount={unreadCount} />
                        </TouchableOpacity>
                    </View>
                </View>
            </LinearGradient>
        </View>
    );
};


export default Header;


